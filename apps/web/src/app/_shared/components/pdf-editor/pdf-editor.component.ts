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
import { EraserOptions, FabriCanvasState, Pagination, PenOptions, ShapeOptions, TextBoxOptions, ToolData } from '@web/app/types/pdf-editor.type';
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
  
  @Input() pdfFile: string = '/assets/sample.pdf';

  @ViewChild('pdfEditor') pdfEditor!: ElementRef;
  @ViewChild('pdfEditCanvas') pdfEditCanvas!: ElementRef;

  fabriCanvas!: fabric.Canvas;


  pdfEditorService = inject(PdfEditorService);

  currentPage?: PDFPageProxy;  
  viewportParams?: GetViewportParameters = { scale: 1 };
  maxScale = 2.6;
  minScale = 0.6;
  
  pagination: Pagination = {page: 1, limit: 5};
  countPages?: number;

  loadedPdfDocument$ = this.pdfEditorService.loadPdfDocument(this.pdfFile);
  loadedPdfPages$?: Observable<PDFPageProxy[]>;

  selectedTool?: ToolData;
  selectedShapeOptions: ShapeOptions = {shape: '', color: '', stroke: 'black', strokeWidth: 1};
  selectedPenOptions: PenOptions = {size: 8, color: 'black'};
  selectedEraserOptions: EraserOptions = {size: 8};
  selectedTextBoxOptions: TextBoxOptions = {font: 'Arial', size: 16, color: 'black'};

  showTextBoxOptionsSubj$ = new Subject<TextBoxOptions>();
  showTextBoxOptions$ = this.showTextBoxOptionsSubj$.asObservable().pipe(takeUntilDestroyed());

  showShapeOptionsSubj$ = new Subject<ShapeOptions>();
  showShapeOptions$ = this.showShapeOptionsSubj$.asObservable().pipe(takeUntilDestroyed());

  hideAllOptionsSubj$ = new Subject<void>();
  hideAllOptions$ = this.hideAllOptionsSubj$.asObservable().pipe(takeUntilDestroyed());


  maxUndoSteps = 40;
  fabriCanvasStateHistory = new Map<number, CircularArray<FabriCanvasState>>();

  isPanActive = false;


  constructor() {
    this.loadedPdfDocument$.pipe(takeUntilDestroyed())
      .subscribe(pdfDoc => {
        this.countPages = pdfDoc.numPages;
        this.loadedPdfPages$ = this.pdfEditorService.loadPdfPages(pdfDoc, this.pagination.page, this.pagination.limit);
    });
  }


  onSelectPage(page: PDFPageProxy) {
    this.currentPage = page;
    this.renderAll();
  }

  onZoomIn() {
    if(this.viewportParams!.scale < this.maxScale) {
      this.viewportParams!.scale += 0.1;
      this.renderAll();
    }
  }

  onZoomOut() {
    if(this.viewportParams!.scale > this.minScale) {
      this.viewportParams!.scale -= 0.1;
      this.renderAll();
    }
  }

  onActivatePan(isPanActive: boolean) {
    this.isPanActive = isPanActive;
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

  onSelectTool(toolData?: ToolData) {
    this.fabriCanvas.isDrawingMode = false;
    this.fabriCanvas.discardActiveObject();
    this.fabriCanvas.renderAll();

    if(this.selectedTool?.type == toolData?.type || !toolData) {
      // unselect tool if already selected
      this.selectedTool = undefined;
      this.fabriCanvas.defaultCursor = 'default';

    } else {
      this.selectedTool = toolData;
      this.fabriCanvas.defaultCursor = this.selectedTool?.cursor;  

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
    
    this.fabriCanvasStateHistory.get(this.currentPage!.pageNumber)?.push(this.fabriCanvas.toJSON());
  }

  onChangeEraserOptions(eraserOptions: EraserOptions) {
    this.selectedEraserOptions = eraserOptions;
    this.setupEraserMode(this.fabriCanvas);
  }

  onChangePenOptions(penOptions: PenOptions) {
    this.selectedPenOptions = penOptions;
    this.setupPenMode(this.fabriCanvas);
  }

  onChageShapeOptions(shapeOptions: ShapeOptions) {
    this.selectedShapeOptions = shapeOptions;

    const object: fabric.Object | fabric.Group | null = this.fabriCanvas.getActiveObject();

    if(object && shapeOptions.shape == 'arrow') {
      this.changeArrowGroupOptions(object as fabric.Group, this.selectedShapeOptions)
      
    } else {
      const updatedObjectOption = {
        fill: this.selectedShapeOptions.color,
        stroke: this.selectedShapeOptions.stroke,
        strokeWidth: this.selectedShapeOptions.strokeWidth
      };

      object?.set(updatedObjectOption);
    }
    this.fabriCanvasStateHistory.get(this.currentPage!.pageNumber)?.push(this.fabriCanvas.toJSON());

    this.fabriCanvas.renderAll();

  }

  private changeArrowGroupOptions(group: fabric.Group, shapeOptions: ShapeOptions) {
    group.set({
      stroke: shapeOptions.stroke,
      strokeWidth: shapeOptions.strokeWidth
    });

    group.getObjects()
      .forEach(object => {
        object.set({
          stroke: shapeOptions.stroke,
          strokeWidth: shapeOptions.strokeWidth,
          fill: shapeOptions.stroke
        })
      });
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

    this.fabriCanvas = new fabric.Canvas('pdf-edit', {selection: false});

    this.fabriCanvas.width = viewport.width;
    this.fabriCanvas.height = viewport.height;

    const pageStateHistory = this.fabriCanvasStateHistory.get(this.currentPage!.pageNumber);
    this.updateFabriCanvasState(this.fabriCanvas, pageStateHistory?.lastItem);

    this.fabriCanvas.on('mouse:down', (evt: fabric.IEvent) => this.canvasMouseDownHandler(evt));
    this.fabriCanvas.on('object:added', (evt: fabric.IEvent) => this.canvasObjectUpdatedHandler(evt));
    this.fabriCanvas.on('object:removed', (evt: fabric.IEvent) => this.canvasObjectUpdatedHandler(evt));
    this.fabriCanvas.on('object:modified', (evt: fabric.IEvent) => this.canvasObjectUpdatedHandler(evt));
    this.fabriCanvas.on('before:selection:cleared', () => {
      this.selectedTool = undefined;
      this.hideAllOptionsSubj$.next();
    });
  }

  private canvasMouseDownHandler(evt: fabric.IEvent) {

    if(evt.target instanceof fabric.Textbox) {
      this.selectTextBoxHandler(evt.target);
    } 

    if(evt.target instanceof fabric.Rect) {
      this.selectRectangleHandler(evt.target);
    } 

    if(evt.target instanceof fabric.Ellipse) {
      this.selectedEllipseHandler(evt.target);
    } 

    if(evt.target instanceof fabric.Line) {
      this.selectedLineHandler(evt.target);
    } 

    if(evt.target instanceof fabric.Group) {
      this.selectedArrowHandler(evt.target);
    } 

    if(this.selectedTool?.type == 'text' && !evt.target) {
      this.drawTextBox(this.fabriCanvas, this.selectedTextBoxOptions, evt.pointer?.x, evt.pointer?.y);
    }

    if(this.selectedTool?.type == 'rectangle' && !evt.target) {
      this.drawRectangle(this.fabriCanvas, this.selectedShapeOptions, evt.pointer?.x, evt.pointer?.y);
    }

    if(this.selectedTool?.type == 'ellipse' && !evt.target) {
      this.drawEllipse(this.fabriCanvas, this.selectedShapeOptions, evt.pointer?.x, evt.pointer?.y);
    }

    if(this.selectedTool?.type == 'line' && !evt.target) {
      this.drawLine(this.fabriCanvas, this.selectedShapeOptions, evt.pointer?.x, evt.pointer?.y);
      this.selectedTool = undefined;
    }

    if(this.selectedTool?.type == 'arrow' && !evt.target) {
      this.drawArrow(this.fabriCanvas, this.selectedShapeOptions, evt.pointer?.x, evt.pointer?.y);
      this.selectedTool = undefined;
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
    this.fabriCanvas.defaultCursor = this.selectedTool.cursor;

    this.selectedTextBoxOptions = {
      font: object.fontFamily || '',
      size: object.fontSize || 0,
      color: object.fill?.toString() || ''
    }

    this.showTextBoxOptionsSubj$.next(this.selectedTextBoxOptions);
  }

  private selectRectangleHandler(object: fabric.Rect) {
    this.selectedTool = {type: 'shape', cursor: ''};
    this.fabriCanvas.defaultCursor = this.selectedTool.type;

    this.selectedShapeOptions = {
      shape: 'rectangle',
      color: object.fill as string,
      stroke: object.stroke || '',
      strokeWidth: object.strokeWidth
    }

    this.showShapeOptionsSubj$.next(this.selectedShapeOptions);
  }

  private selectedEllipseHandler(object: fabric.Rect) {
    this.selectedTool = {type: 'shape', cursor: ''};
    this.fabriCanvas.defaultCursor = this.selectedTool.cursor;

    this.selectedShapeOptions = {
      shape: 'ellipse',
      color: object.fill as string,
      stroke: object.stroke || '',
      strokeWidth: object.strokeWidth
    }

    this.showShapeOptionsSubj$.next(this.selectedShapeOptions);
  }

  private selectedLineHandler(object: fabric.Line) {
    this.selectedTool = {type: 'shape', cursor: ''};
    this.fabriCanvas.defaultCursor = this.selectedTool.cursor;

    this.selectedShapeOptions = {
      shape: 'line',
      color: object.fill as string,
      stroke: object.stroke || '',
      strokeWidth: object.strokeWidth
    }

    this.showShapeOptionsSubj$.next(this.selectedShapeOptions);
  }

  private selectedArrowHandler(object: fabric.Group) {
    this.selectedTool = {type: 'shape', cursor: ''};
    this.fabriCanvas.defaultCursor = this.selectedTool.cursor;

    this.selectedShapeOptions = {
      shape: 'arrow',
      color: object.fill as string,
      stroke: object.stroke || '',
      strokeWidth: object.strokeWidth
    }

    this.showShapeOptionsSubj$.next(this.selectedShapeOptions);
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

  private drawRectangle(canvas: fabric.Canvas, shapeOptions: ShapeOptions, x?: number, y?: number) {
    const text = new fabric.Rect({
      width: 100,
      height: 50,
      fill: shapeOptions.color,
      stroke : shapeOptions.stroke,
      strokeWidth : shapeOptions.strokeWidth,
      left: x ?? 0,
      top: y ?? 0,
      centeredRotation: true
      });
      canvas.add(text);
  }

  private drawEllipse(canvas: fabric.Canvas, shapeOptions: ShapeOptions, x?: number, y?: number) {
    const text = new fabric.Ellipse({
      selectable: true,
      originX: 'center', 
      originY: 'center',
      rx: 50,
      ry: 50,
      fill: shapeOptions.color,
      stroke : shapeOptions.stroke,
      strokeWidth : shapeOptions.strokeWidth,
      angle: 0,
      left: x ?? 0,
      top: y ?? 0,
      centeredRotation: true
      });
      canvas.add(text);
  }

  private drawLine(canvas: fabric.Canvas, shapeOptions: ShapeOptions, x?: number, y?: number) {
    const text = new fabric.Line([0, 0, 50, 0], {
      stroke: shapeOptions.stroke,
      strokeWidth: shapeOptions.strokeWidth,
      left: x ?? 0,
      top: y ?? 0,
      centeredRotation: true
      });
      canvas.add(text);
  }

  private drawArrow(canvas: fabric.Canvas, shapeOptions: ShapeOptions, x?: number, y?: number) {
    const triangle = new fabric.Triangle({
      width: 10, 
      height: 15, 
      fill: shapeOptions.stroke, 
      stroke: shapeOptions.stroke,
      strokeWidth: shapeOptions.strokeWidth,
      left: 235, 
      top: 65,
      angle: 90
    });

    const line = new fabric.Line([50, 100, 200, 100], {
        left: 75,
        top: 70,
        stroke: shapeOptions.stroke,
        strokeWidth: shapeOptions.strokeWidth,
    });
    
    const group = new fabric.Group([line, triangle]);

    group.set({
      left: x ?? 0,
      top: y ?? 0,
      centeredRotation: true,
      stroke: shapeOptions.stroke,
      strokeWidth: shapeOptions.strokeWidth,
    })

    canvas.add(group);
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
