import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { PdfEditorService } from '@web/app/services/pdf-editor.service';
import { PdfEditorNavigatorComponent } from '@web/shared/components/pdf-editor/pdf-editor-navigator/pdf-editor-navigator.component';
import { PdfEditorToolbarComponent } from '@web/shared/components/pdf-editor/pdf-editor-toolbar/pdf-editor-toolbar.component';
import { PDFPageProxy, PageViewport } from 'pdfjs-dist';
import { Observable, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { GetViewportParameters } from 'pdfjs-dist/types/src/display/api';
import { PdfViewerDirective } from '@web/shared/directives/pdf-viewer.directive';
import { fabric } from 'fabric';


import * as pdfjs from 'pdfjs-dist';
import { EraserOptions, FabriCanvasState, Pagination, PenOptions, TextBoxOptions, ToolData } from '@web/app/types/pdf-editor.type';
import { CircularArray } from '@web/shared/utils/circular-array.util';
pdfjs.GlobalWorkerOptions.workerSrc = "pdf.worker.mjs";


@Component({
  selector: 'app-pdf-editor',
  standalone: true,
  imports: [PdfEditorToolbarComponent, PdfEditorNavigatorComponent, AsyncPipe, PdfViewerDirective],
  templateUrl: './pdf-editor.component.html',
  styleUrl: './pdf-editor.component.scss',
})
export class PdfEditorComponent {
  
  @Input() pdfFile: string = 'http://localhost:4200/assets/sample.pdf';

  @ViewChild('pdfEditor') pdfEditor!: ElementRef;
  @ViewChild('pdfEditCanvas') pdfEditCanvas!: ElementRef;

  fabriCanvas!: fabric.Canvas;


  pdfEditorService = inject(PdfEditorService);

  currentPage?: PDFPageProxy;  
  viewportParams?: GetViewportParameters = { scale: 1 };
  
  pagination: Pagination = {page: 1, limit: 5};

  loadedPdfDocument$ = this.pdfEditorService.loadPdfDocument(this.pdfFile);
  loadedPdfPages$?: Observable<PDFPageProxy[]>;

  selectedTool?: ToolData;
  selectedPenOptions: PenOptions = {size: 8, color: 'black'};
  selectedEraserOptions: EraserOptions = {size: 8};
  selectedTextBoxOptions: TextBoxOptions = {font: 'Arial', size: 16, color: 'black'};

  showTextBoxOptionsSubj$ = new Subject<TextBoxOptions>();
  showTextBoxOptions$ = this.showTextBoxOptionsSubj$.asObservable().pipe(takeUntilDestroyed());


  maxUndoSteps = 5;
  fabriCanvasStateHistory = new Map<number, CircularArray<FabriCanvasState>>();

  


  constructor() {
    this.loadedPdfDocument$.pipe(takeUntilDestroyed())
      .subscribe(pdfDoc => {
        this.loadedPdfPages$ = this.pdfEditorService.loadPdfPages(pdfDoc, this.pagination.page, this.pagination.limit);
    });
  }


  onSelectPage(page: PDFPageProxy) {
    this.currentPage = page;
    this.renderAll();
  }

  onUndo() {
    const pageStateHistory = this.fabriCanvasStateHistory.get(this.currentPage!.pageNumber);
    pageStateHistory?.pop();

    this.renderAll();
  }

  onRedo() {
    const pageStateHistory = this.fabriCanvasStateHistory.get(this.currentPage!.pageNumber);
    pageStateHistory?.restore();

    this.renderAll();
  }

  onSelectTool(toolData: ToolData) {
    if(this.selectedTool?.type == toolData.type) {
      // unselect tool if already selected
      this.selectedTool = undefined;
      this.fabriCanvas.defaultCursor = undefined;
      this.fabriCanvas.isDrawingMode = false;

    } else {
      this.selectedTool = toolData;
      this.fabriCanvas.defaultCursor = this.selectedTool.cursor;  

      if(this.selectedTool.type == 'eraser') {
        this.fabriCanvas.isDrawingMode = true;
        this.setupEraserMode(this.fabriCanvas);

      } else if(this.selectedTool.type == 'pen') {
        this.fabriCanvas.isDrawingMode = true;
        this.setupPenMode(this.fabriCanvas);
      }
    }
  }

  onChangeTextBoxOptions(textBoxOptions: TextBoxOptions) {
    this.selectedTextBoxOptions = textBoxOptions;

    const object = this.fabriCanvas.getActiveObject();

    if(object instanceof fabric.Textbox) {
      object.set({
        fill: textBoxOptions.color,
        fontSize: textBoxOptions.size,
        fontFamily: textBoxOptions.font
      });

      this.fabriCanvas.renderAll();
    }

  }

  onChangeEraserOptions(eraserOptions: EraserOptions) {
    this.selectedEraserOptions = eraserOptions;
    this.setupEraserMode(this.fabriCanvas);
  }

  onChangePenOptions(penOptions: PenOptions) {
    this.selectedPenOptions = penOptions;
    this.setupPenMode(this.fabriCanvas);
  }

  private renderAll() {
    const viewport = this.currentPage!.getViewport(this.viewportParams);

    this.initPdfEditor(this.pdfEditor.nativeElement, this.pdfEditCanvas.nativeElement, viewport);
    this.initFabriCanvas(viewport);

  }

  private initPdfEditor(pdfEditor: HTMLCanvasElement, pdfEditCanvas: HTMLCanvasElement, viewport: PageViewport) {
    pdfEditor!.style.width = `${viewport.width}px`;
    pdfEditor!.style.height = `${viewport.height}px`;

    pdfEditCanvas.width = viewport.width;
    pdfEditCanvas.height = viewport.height;
  }

  private initFabriCanvas(viewport: PageViewport) {
    
    if(this.fabriCanvas) {
      this.fabriCanvas.dispose();
    }

    this.fabriCanvas = new fabric.Canvas('pdf-edit');

    this.fabriCanvas.width = viewport.width;
    this.fabriCanvas.height = viewport.height;

    const pageStateHistory = this.fabriCanvasStateHistory.get(this.currentPage!.pageNumber);
    this.updateFabriCanvasState(this.fabriCanvas, pageStateHistory?.lastItem);

    this.fabriCanvas.on('mouse:down', (evt: fabric.IEvent) => this.canvasMouseDownHandler(evt));
    this.fabriCanvas.on('object:added', (evt: fabric.IEvent) => this.canvasObjectUpdatedHandler(evt));
    this.fabriCanvas.on('object:removed', (evt: fabric.IEvent) => this.canvasObjectUpdatedHandler(evt));
    this.fabriCanvas.on('object:modified', (evt: fabric.IEvent) => this.canvasObjectUpdatedHandler(evt));

  }

  private canvasMouseDownHandler(evt: fabric.IEvent) {

    if(evt.target instanceof fabric.Textbox) {
      this.selectTextBoxHandler(evt.target);
    } 

    if(this.selectedTool?.type == 'text' && !evt.target) {
      this.drawTextBox(this.fabriCanvas, this.selectedTextBoxOptions, evt.pointer?.x, evt.pointer?.y);
    }

  }

  private canvasObjectUpdatedHandler(evt: fabric.IEvent) {
    const index = this.currentPage!.pageNumber;
    const pageStateHistory: CircularArray<FabriCanvasState> = this.fabriCanvasStateHistory.get(index) || new CircularArray<FabriCanvasState>(this.maxUndoSteps);
    
    pageStateHistory.push(this.fabriCanvas.toJSON());

    this.fabriCanvasStateHistory.set(index, pageStateHistory);
  }

  private updateFabriCanvasState(fabriCanvas: fabric.Canvas, state?: FabriCanvasState) {
    fabriCanvas.loadFromJSON(
      state, 
      () => {
        fabriCanvas.renderAll();
        fabriCanvas.calcOffset();
      }, 
      (o: unknown, object: fabric.Object) => {
      fabriCanvas.setActiveObject(object);
    });
  }

  private selectTextBoxHandler(object: fabric.Textbox) {
    this.selectedTool = {type: 'text', cursor: 'text'};
    this.fabriCanvas.defaultCursor = this.selectedTool.type;

    this.selectedTextBoxOptions = {
      font: object.fontFamily || '',
      size: object.fontSize || 0,
      color: object.fill?.toString() || ''
    }

    this.showTextBoxOptionsSubj$.next(this.selectedTextBoxOptions);
  }

  private drawTextBox(canvas: fabric.Canvas, textBoxOptions: TextBoxOptions, x?: number, y?: number) {
    const text = new fabric.Textbox('Text', {
      width: 100,
      height: 50,
      fill: textBoxOptions.color,
      fontSize: textBoxOptions.size,
      fontFamily: textBoxOptions.font,
      cursorColor: 'red',
      left: x ?? 0,
      top: y ?? 0
      });
      canvas.add(text);
  }

  private setupEraserMode(canvas: fabric.Canvas) {
    canvas.freeDrawingBrush.color = '#fff';
    canvas.freeDrawingBrush.width = this.selectedEraserOptions?.size;
  }

  private setupPenMode(canvas: fabric.Canvas) {
    canvas.freeDrawingBrush.color = this.selectedPenOptions?.color;
    canvas.freeDrawingBrush.width = this.selectedPenOptions?.size;
  }

}
