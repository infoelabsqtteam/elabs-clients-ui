import {Directive, OnInit, Renderer2, Input, ElementRef, ChangeDetectorRef,} from "@angular/core";
import { fromEvent, Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Directive({
  selector: "[resizeColumn]",
})
export class ResizeColumnDirective implements OnInit {
  @Input("resizeColumn") resizable: boolean;

  @Input() index: number;

  @Input() cellClass?: string;

  private startX: number;

  private startWidth: number;

  private column: HTMLElement;

  private table: HTMLElement;

  private pressed: boolean;

  private minimumWidth: number;

  private resizeSubscription: Subscription;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private cdr: ChangeDetectorRef
  ) {
    this.column = this.el.nativeElement;
    this.minimumWidth = 10;
  }

  ngOnInit() {
    if (this.resizable) {
      const row = this.renderer.parentNode(this.column);
      const thead = this.renderer.parentNode(row);
      this.table = this.renderer.parentNode(thead);

      const resizer = this.renderer.createElement("span");
      this.renderer.addClass(resizer, "resize-holder");
      this.renderer.appendChild(this.column, resizer);
      this.renderer.listen(resizer, "mousedown", this.onMouseDown);
      this.renderer.listen(resizer,'dblclick',this.resetWidth)
      this.renderer.listen(this.table, "mousemove", this.onMouseMove);

      // Use RxJS to debounce the mousemove event
      this.resizeSubscription = fromEvent(this.table, "mousemove")
        .pipe(debounceTime(10))
        .subscribe(this.onMouseMove);

      this.renderer.listen("document", "mouseup", this.onMouseUp);
    }
  }

  resetWidth = () => {
    let width = null;
    this.updateElementWidth(this.column, width);
    this.cellClass?this.setElementWidth(this.getCellClassElements(), width):this.setElementWidth(this.getTableCells(), width);
    this.cdr.detectChanges();
    // console.log("reset");
  };

  ngOnDestroy() {
    // Unsubscribe from the resize event to avoid memory leaks
    this.resizeSubscription.unsubscribe();
  }

  onMouseDown = (event: MouseEvent) => {
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = this.column.offsetWidth;
  };

  onMouseMove = (event: MouseEvent) => {
    const offset = 35;
    if (this.pressed && event.buttons) {
      this.renderer.addClass(this.table, "resizing");

      let width = this.calculateNewWidth(event, offset);
      this.updateElementWidth(this.column, width);

      // Set cellClass width
      if (this.cellClass) {
        const cellClassElements = this.getCellClassElements();
        this.setElementWidth(cellClassElements, width);
      }else{
      // Set table cell width
      this.setElementWidth(this.getTableCells(), width);
      }
      this.cdr.detectChanges();
    }
  };

  onMouseUp = (event: MouseEvent) => {
    if (this.pressed) {
      this.pressed = false;
      this.renderer.removeClass(this.table, "resizing");
    }
  };

  calculateNewWidth(event: MouseEvent, offset: number): number {
    let width = this.startWidth + (event.pageX - this.startX - offset);
    return width < this.minimumWidth ? this.minimumWidth : width;
  }

  updateElementWidth(element: HTMLElement, width: number | null) {
    // Check for inline styles
    const inlineStyles = element.getAttribute('style');
    if (inlineStyles && inlineStyles.includes('width')) {
      // Update inline styles directly
      width!=null? element.style.width = `${width}px`:element.style.width = `max-content`;
    } else {
      // Use Renderer2 for styles applied through Angular
      width!=null? element.style.width = `${width}px`:element.style.width = `max-content`;
      // this.renderer.setStyle(element, 'width', `${width}px`);
    }
  }
  

  setElementWidth(elements: HTMLElement[], width: number) {
    elements.forEach((element: any) => {
      if (element !== null) {
        this.updateElementWidth(element, width);
      }
    });
  }

  getTableCells(): HTMLElement[] {
    return Array.from(this.table.querySelectorAll("tr")).map((row: any) =>
      row.querySelectorAll("td").item(this.index)
    );
  }

  getCellClassElements(): HTMLElement[] {
    return Array.from(this.table.querySelectorAll("tr")).map((row: any) =>
      row.querySelectorAll(`.${this.cellClass}`).item(this.index)
    );
  }
}

// [resizeColumn]="true" [index]="i" [cellClass]="'resizeGridColunms'"
// if resizeGridColunms not provided it will change all td width as default.
// This directive needs the classess for resize Handler
// .resize-holder {cursor: col-resize;width: 20px;height: 100%;position: absolute;right: -10px;top: 0;z-index: 1;}
// .resizing {-moz-user-select: none;-ms-user-select: none;user-select: none;cursor: col-resize;}
// When double click on resize handler it will expand the width of the column to max-content.