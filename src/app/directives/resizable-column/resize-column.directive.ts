import { Directive, OnInit, Renderer2, Input, ElementRef, ChangeDetectorRef,} from "@angular/core";
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
    this.minimumWidth = 100;
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
      this.renderer.listen(this.table, "mousemove", this.onMouseMove);

      // Use RxJS to debounce the mousemove event
      this.resizeSubscription = fromEvent(this.table, "mousemove")
        .pipe(debounceTime(10))
        .subscribe(this.onMouseMove);

      this.renderer.listen("document", "mouseup", this.onMouseUp);
    }
  }

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

      let width = this.startWidth + (event.pageX - this.startX - offset);

      if (width < this.minimumWidth) {
        width = this.minimumWidth;
      }

      // Set table header width
      this.renderer.setStyle(this.column, "width", `${width}px`);

      // Set table cell width
      const td = Array.from(this.table.querySelectorAll("tr")).map((row: any) =>
        row.querySelectorAll("td").item(this.index + 1)
      );

      for (let cell of td) {
        if (cell !== null) {
          this.renderer.setStyle(cell, "width", `${width}px`);
        }
      }


      // Set cellClass width
      if (this.cellClass) {
        const rows = Array.from(this.table.querySelectorAll("tr")).map(
          (row: any) =>
            row.querySelectorAll(`.${this.cellClass}`).item(this.index)
        );

        for (let cell of rows) {
          if (cell !== null) {
            this.renderer.setStyle(cell, "width", `${width+40}px`);
          }
        }
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
}


// [resizeColumn]="true" [index]="i" [cellClass]="'resizeGridColunms'"
// This directive needs the classess for resizer
// .resize-holder {cursor: col-resize;width: 20px;height: 100%;position: absolute;right: -10px;top: 0;z-index: 1;}
// .resizing {-moz-user-select: none;-ms-user-select: none;user-select: none;cursor: col-resize;}