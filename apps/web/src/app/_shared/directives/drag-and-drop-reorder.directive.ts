import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appDragAndDropReorder]',
  standalone: true
})
export class DragAndDropReorderDirective {

  @Input({required: true }) dragItemIndex!: number;
  @Input({required: true}) items!: any[];

  @Output() orderChange = new EventEmitter();

  constructor(private el: ElementRef) { this.el.nativeElement.draggable = true; }

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent) {
    event.dataTransfer!.setData('text/plain', `${this.dragItemIndex}`);
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.el.nativeElement.classList.add('drag-over');
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(): void {
    this.el.nativeElement.classList.remove('drag-over');
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.el.nativeElement.classList.remove('drag-over');
    this.handleDrop(parseInt(event.dataTransfer!.getData('text/plain')), this.dragItemIndex)
  }

  private handleDrop(from: number, to: number) {
    if(from != to) {
      const draggedItem = this.items.splice(from, 1)[0];
      this.items.splice(to, 0, draggedItem); 
      this.orderChange.emit();
    }
  }

}
