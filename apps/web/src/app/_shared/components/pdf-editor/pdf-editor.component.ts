import { Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { PdfEditorService } from '@web/app/services/pdf-editor.service';
import { PdfEditorNavigatorComponent } from '@web/shared/components/pdf-editor/pdf-editor-navigator/pdf-editor-navigator.component';
import { PdfEditorToolbarComponent } from '@web/shared/components/pdf-editor/pdf-editor-toolbar/pdf-editor-toolbar.component';
import { PDFPageProxy, PageViewport } from 'pdfjs-dist';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { GetViewportParameters } from 'pdfjs-dist/types/src/display/api';
import { PdfViewerDirective } from '@web/shared/directives/pdf-viewer.directive';
import { fabric } from 'fabric';
import { Canvas } from 'fabric/fabric-impl';


import * as pdfjs from 'pdfjs-dist';
pdfjs.GlobalWorkerOptions.workerSrc = "pdf.worker.mjs";


type Pagination = {page: number, limit: number};
type ToolData = {cursor: string, type: string};


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


  constructor() {
    this.loadedPdfDocument$.pipe(takeUntilDestroyed())
      .subscribe(pdfDoc => {
        this.loadedPdfPages$ = this.pdfEditorService.loadPdfPages(pdfDoc, this.pagination.page, this.pagination.limit);
    });
  }


  onSelectPage(page: PDFPageProxy) {
    this.currentPage = page;

    const viewport = this.currentPage.getViewport(this.viewportParams);

    this.initPdfEditor(this.pdfEditor.nativeElement, this.pdfEditCanvas.nativeElement, viewport);
    this.initFabriCanvas(viewport);
  }


  onSelectTool(toolData: ToolData) {
    this.selectedTool = toolData;
    this.fabriCanvas.defaultCursor = this.selectedTool.cursor;
  }


  private initPdfEditor(pdfEditor: HTMLCanvasElement, pdfEditCanvas: HTMLCanvasElement, viewport: PageViewport) {
    pdfEditor!.style.width = `${viewport.width}px`;
    pdfEditor!.style.height = `${viewport.height}px`;

    pdfEditCanvas.width = viewport.width;
    pdfEditCanvas.height = viewport.height;
  }

  private initFabriCanvas(viewport: PageViewport) {
    this.fabriCanvas = new fabric.Canvas('pdf-edit');

    this.fabriCanvas.width = viewport.width;
    this.fabriCanvas.height = viewport.height;

    this.fabriCanvas.on('mouse:down', (evt: fabric.IEvent) => this.canvasMouseDownHandler(evt));
  }

  private canvasMouseDownHandler(evt: fabric.IEvent) {
    if(this.selectedTool) {

      if(this.selectedTool.type == 'text') {
        this.drawTextBox(this.fabriCanvas, evt.pointer?.x, evt.pointer?.y);
      }

      this.selectedTool = undefined;
      this.fabriCanvas.defaultCursor = undefined;
    }
  }


  private drawTextBox(canvas: Canvas, x?: number, y?: number) {
    const text = new fabric.Textbox('Text', {
      width: 100,
      height: 50,
      fontSize: 16,
      cursorColor: 'red',
      left: x ?? 0,
      top: y ?? 0
      });
      canvas.add(text);
  }


}
