import { Component, DestroyRef, ElementRef, Input, OnChanges, SimpleChanges, ViewChild, inject } from '@angular/core';
import { PdfEditorService } from '@web/app/services/pdf-editor.service';
import { PdfEditorNavigatorComponent } from '@web/shared/components/pdf-editor/pdf-editor-navigator/pdf-editor-navigator.component';
import { PdfEditorToolbarComponent } from '@web/shared/components/pdf-editor/pdf-editor-toolbar/pdf-editor-toolbar.component';
import { PDFPageProxy, PageViewport } from 'pdfjs-dist';
import { Observable, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe, NgClass } from '@angular/common';
import { GetViewportParameters, TextItem } from 'pdfjs-dist/types/src/display/api';
import { PdfViewerDirective } from '@web/shared/directives/pdf-viewer.directive';
import { fabric } from 'fabric';


import { EraserOptions, FabriCanvasState, PageState, Pagination, PenOptions, ShapeOptions, TextBoxOptions, TextLayerState, ToolData } from '@web/app/types/pdf-editor.types';
import { CircularArray } from '@web/shared/utils/circular-array.util';
import { PdfTextEditDirective } from '@web/shared/directives/pdf-text-edit.directive';


@Component({
  selector: 'app-pdf-editor',
  standalone: true,
  imports: [NgClass, PdfEditorToolbarComponent, PdfEditorNavigatorComponent, AsyncPipe, PdfViewerDirective, PdfTextEditDirective],
  templateUrl: './pdf-editor.component.html',
  styleUrl: './pdf-editor.component.scss',
})
export class PdfEditorComponent implements OnChanges {
  
  @Input() pdfFile!: File;

  @ViewChild('pdfEditor') pdfEditor!: ElementRef;
  @ViewChild('pdfEditCanvas') pdfEditCanvas!: ElementRef;
  @ViewChild('textLayer') textLayer!: HTMLElement;


  fabriCanvas!: fabric.Canvas;

  destroyRef = inject(DestroyRef);
  pdfEditorService = inject(PdfEditorService);

  currentPage?: PDFPageProxy;  
  viewportParams: GetViewportParameters = { scale: 1 };
  maxScale = 2.6;
  minScale = 0.6;
  
  pagination: Pagination = {page: 1, limit: 5};
  countPages?: number;

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
  pageStateHistory = new Map<number, CircularArray<PageState>>();

  currentTextLayerState: TextLayerState = { deleted: undefined };

  isPanActive = false;
  editMode = false;

  textItems?: TextItem[];
  selectedTextLayer?: HTMLElement;


  constructor() {}

  async ngOnChanges(changes: SimpleChanges) {
    if(changes['pdfFile']) {
      this.pdfEditorService.loadPdfDocument(await this.pdfFile.arrayBuffer())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(pdfDoc => {
          this.countPages = pdfDoc.numPages;
          this.loadedPdfPages$ = this.pdfEditorService.loadPdfPages(pdfDoc, this.pagination.page, this.pagination.limit);
    });
    }
  }

  async onEditMode(editMode: boolean) {
    this.editMode = editMode;
    if(this.editMode) this.prepareTextLayer(this.currentPage!);
  }

  onSelectPage(page: PDFPageProxy) {
    this.currentPage = page;
    this.renderAll();
  }

  onZoomIn() {
    if(this.viewportParams!.scale < this.maxScale) {
      this.viewportParams = { scale: this.viewportParams!.scale += 0.1};
      this.renderAll();
    }
  }

  onZoomOut() {
    if(this.viewportParams!.scale > this.minScale) {
      this.viewportParams = { scale: this.viewportParams!.scale -= 0.1};
      this.renderAll();
    }
  }

  onActivatePan(isPanActive: boolean) {
    this.isPanActive = isPanActive;
  }

  onUndo() {
    const pageStateHistory = this.pageStateHistory.get(this.currentPage!.pageNumber);
    pageStateHistory?.pop();

    this.renderAll();
  }

  onRedo() {
    const pageStateHistory = this.pageStateHistory.get(this.currentPage!.pageNumber);
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

  onDrawImage(imageFile: File) {
    const  url = URL.createObjectURL(imageFile);    

    fabric.Image.fromURL(url, (img) => {

      const scale = 0.5;

      img.set({
        scaleX : scale,
        scaleY : scale,
      });

      this.fabriCanvas.centerObject(img);
      this.fabriCanvas.add(img).renderAll().setActiveObject(img);

      this.pageStateHistory.get(this.currentPage!.pageNumber)?.push({
        fabricCanvasState: this.fabriCanvas.toJSON(),
        textLayerState: this.currentTextLayerState
      });
    });
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
    
    this.pageStateHistory.get(this.currentPage!.pageNumber)?.push({
      fabricCanvasState: this.fabriCanvas.toJSON(),
      textLayerState: this.currentTextLayerState
    });
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
    this.pageStateHistory.get(this.currentPage!.pageNumber)?.push({
      fabricCanvasState: this.fabriCanvas.toJSON(),
      textLayerState: this.currentTextLayerState
    });

    this.fabriCanvas.renderAll();

  }

  onClickRemoveText(item: TextItem, textLayer: HTMLElement, index: number) {
    //textLayer.classList.add('text-layer-deleted');
    this.currentTextLayerState.deleted![index] = true;

    const bottom = parseFloat(textLayer.style.bottom.replace('px', ''));
    const dy = 0;// (3.4 * this.viewportParams.scale);
    const width = parseFloat(textLayer.style.width.replace('px', ''));
    const height = parseFloat(textLayer.style.height.replace('px', '')) + dy;
    const y = this.fabriCanvas.height! - bottom - height + dy;
    const x = parseFloat(textLayer.style.left.replace('px', ''));

    this.drawRectangle(
      this.fabriCanvas,
      {
        color: 'red',
        shape: 'rectangle',
        stroke: 'red',
        strokeWidth: 1
      },
      x,
      y,
      width,
      height,
      this.fabriCanvas.getZoom(),
      false,
      false
    );
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

  private async renderAll() {
    const viewport = this.currentPage!.getViewport(this.viewportParams);
    const pageStateHistory = this.pageStateHistory.get(this.currentPage!.pageNumber);
    const currentState: PageState | undefined = pageStateHistory?.lastItem;

    this.initPdfEditor(this.pdfEditor.nativeElement, this.pdfEditCanvas.nativeElement, viewport);
    this.initFabriCanvas(viewport, currentState?.fabricCanvasState);

    this.updateTextLayerState(currentState?.textLayerState);
  }

  private initPdfEditor(pdfEditor: HTMLCanvasElement, pdfEditCanvas: HTMLCanvasElement, viewport: PageViewport) {
    pdfEditor!.style.width = `${viewport.width}px`;
    pdfEditor!.style.height = `${viewport.height}px`;

    pdfEditCanvas.width = viewport.width;
    pdfEditCanvas.height = viewport.height;
  }

  private initFabriCanvas(viewport: PageViewport, fabricCanvasState?: FabriCanvasState) {
    
    if(this.fabriCanvas) {
      this.fabriCanvas.dispose();
    }

    this.fabriCanvas = new fabric.Canvas('pdf-edit', {selection: false});

    this.fabriCanvas.width = viewport.width;
    this.fabriCanvas.height = viewport.height;

    this.fabriCanvas.setZoom(this.viewportParams.scale);

    this.updateFabriCanvasState(this.fabriCanvas, fabricCanvasState);

    this.fabriCanvas.renderAll();

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
      this.drawTextBox(this.fabriCanvas, this.selectedTextBoxOptions, evt.pointer?.x, evt.pointer?.y, this.fabriCanvas.getZoom());
    }

    if(this.selectedTool?.type == 'rectangle' && !evt.target) {
      this.drawRectangle(this.fabriCanvas, this.selectedShapeOptions, evt.pointer?.x, evt.pointer?.y, undefined, undefined, this.fabriCanvas.getZoom());
    }

    if(this.selectedTool?.type == 'ellipse' && !evt.target) {
      this.drawEllipse(this.fabriCanvas, this.selectedShapeOptions, evt.pointer?.x, evt.pointer?.y, this.fabriCanvas.getZoom());
    }

    if(this.selectedTool?.type == 'line' && !evt.target) {
      this.drawLine(this.fabriCanvas, this.selectedShapeOptions, evt.pointer?.x, evt.pointer?.y, this.fabriCanvas.getZoom());
      this.selectedTool = undefined;
    }

    if(this.selectedTool?.type == 'arrow' && !evt.target) {
      this.drawArrow(this.fabriCanvas, this.selectedShapeOptions, evt.pointer?.x, evt.pointer?.y, this.fabriCanvas.getZoom());
      this.selectedTool = undefined;
    }

  }

  private canvasObjectUpdatedHandler(evt: fabric.IEvent) {
    const index = this.currentPage!.pageNumber;
    const pageStateHistory = this.pageStateHistory.get(index) || new CircularArray<PageState>(this.maxUndoSteps);
    
    pageStateHistory.push({fabricCanvasState: this.fabriCanvas.toJSON(), textLayerState: this.currentTextLayerState});

    this.pageStateHistory.set(index, pageStateHistory);
  }

  private updateFabriCanvasState(fabriCanvas: fabric.Canvas, state?: FabriCanvasState) {
    if(state) {
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
  }

  private updateTextLayerState(textLayerState?: TextLayerState) {
    if(textLayerState) this.currentTextLayerState.deleted = [...textLayerState!.deleted || []];
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

  private drawTextBox(canvas: fabric.Canvas, textBoxOptions: TextBoxOptions, x?: number, y?: number, zoom = 1) {
    const text = new fabric.Textbox('Text', {
      width: 100,
      height: 50,
      fill: textBoxOptions.color,
      fontSize: textBoxOptions.size,
      fontFamily: textBoxOptions.font,
      cursorColor: 'red',
      left: (x ?? 0) / zoom,
      top: (y ?? 0) / zoom
      });
      canvas.add(text);
  }

  private drawRectangle(canvas: fabric.Canvas, shapeOptions: ShapeOptions, x?: number, y?: number, width?: number, height?: number, zoom = 1, selectable = true, evented = true) {
    const rectangle = new fabric.Rect({
      width: (width || 100) / zoom,
      height: (height || 50) / zoom,
      fill: shapeOptions.color,
      stroke : shapeOptions.stroke,
      strokeWidth : shapeOptions.strokeWidth,
      left:( x ?? 0) / zoom,
      top: (y ?? 0) / zoom,
      centeredRotation: true
      }
    );
    rectangle.selectable = selectable;
    rectangle.evented = evented;


    canvas.add(rectangle);
  }

  private drawEllipse(canvas: fabric.Canvas, shapeOptions: ShapeOptions, x?: number, y?: number, zoom = 1) {
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
      left: (x ?? 0) / zoom,
      top: (y ?? 0) / zoom,
      centeredRotation: true
      });
      canvas.add(text);
  }

  private drawLine(canvas: fabric.Canvas, shapeOptions: ShapeOptions, x?: number, y?: number, zoom = 1) {
    const text = new fabric.Line([0, 0, 50, 0], {
      stroke: shapeOptions.stroke,
      strokeWidth: shapeOptions.strokeWidth,
      left: (x ?? 0) / zoom,
      top: (y ?? 0) / zoom,
      centeredRotation: true
      });
      canvas.add(text);
  }

  private drawArrow(canvas: fabric.Canvas, shapeOptions: ShapeOptions, x?: number, y?: number, zoom = 1) {
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
      left: (x ?? 0) / zoom,
      top: (y ?? 0) / zoom,
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

  private async prepareTextLayer(page: PDFPageProxy) {

    const textContent = await page.getTextContent();
    this.textItems = textContent.items as TextItem[];

    const pageStateHistory = this.pageStateHistory.get(this.currentPage!.pageNumber) || new CircularArray<PageState>(this.maxUndoSteps);
    if(!pageStateHistory.lastItem) pageStateHistory.push({fabricCanvasState: this.fabriCanvas.toJSON(), textLayerState: {...this.currentTextLayerState}}); 

    const deleted = pageStateHistory.lastItem.textLayerState.deleted || new Array(this.textItems.length).fill(false);
    pageStateHistory.lastItem.textLayerState.deleted = deleted;

    this.currentTextLayerState.deleted = [...deleted];

    this.pageStateHistory.set(this.currentPage!.pageNumber, pageStateHistory!);
  }
}
