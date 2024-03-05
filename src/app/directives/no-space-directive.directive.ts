import { Directive, Self, Output, EventEmitter } from '@angular/core';
import { MatSelect } from '@angular/material/select';

@Directive({
  selector: 'mat-select',
})
export class NoSpaceDirective {
  @Output('spacekeydown') spacekeydown: EventEmitter<any> =
    new EventEmitter<any>();

  constructor(@Self() private select: MatSelect) {
    this.select._handleKeydown = (event: KeyboardEvent) => {
      if (event.code == 'Space') {
        const active = this.select.panelOpen
          ? this.select.options.filter((x) => x.active)[0] || null
          : null;
        this.spacekeydown.emit(active ? active.value : null);
      } else {
        if (!this.select.disabled) {
          this.select.panelOpen
            ? (this.select as any)._handleOpenKeydown(event)
            : (this.select as any)._handleClosedKeydown(event);
        }
      }
    };
  }
}
