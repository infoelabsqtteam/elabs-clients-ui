import {Directive, OnInit, Renderer2, Input, ElementRef, ChangeDetectorRef,} from "@angular/core";

@Directive({
  selector: "[resizeColumn]",
})

export class ResizeColumnDirective implements OnInit {
  @Input("resizeColumn") resizable: boolean;

  @Input() index: number;

  private startX: number;

  private startWidth: number;

  private column: HTMLElement;

  private table: HTMLElement;

  private pressed: boolean;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private cdr: ChangeDetectorRef
  ) {
    this.column = this.el.nativeElement;
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
      this.renderer.listen("document", "mouseup", this.onMouseUp);
    }
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

      // Set table header width
      this.renderer.setStyle(this.column, "width", `${width}px`);

      // Set table cells width -- here in tbody>tr>.grid-data have the fixed width
      const tableCells = Array.from(this.table.querySelectorAll("tr")).map(
        (row: any) => row.querySelectorAll(".grid-data").item(this.index)
      );


      for (const cell of tableCells) {
        if (cell != null) {
          this.renderer.setStyle(cell, "width", `${width}px`);
        }
      }

      this.setGridHeadingWidth(width);
      this.cdr.detectChanges();
    }
  };

  onMouseUp = (event: MouseEvent) => {
    if (this.pressed) {
      this.pressed = false;
      this.renderer.removeClass(this.table, "resizing");
    }
  };

  setGridHeadingWidth(width: number) {
    // Get all .grid-heading-nowrap elements in the table header
    const gridHeadings = Array.from(
      this.table.querySelectorAll(".grid-heading-nowrap")
    );

    // Set the width of the corresponding .grid-heading-nowrap elements in the current column
    gridHeadings.forEach((gridHeading: HTMLElement, index: number) => {
      if (index === this.index) {
        this.renderer.setStyle(gridHeading, "width", `${width}px`);
      }
    });
  }
}
