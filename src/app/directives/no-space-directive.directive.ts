import { Directive, Self, Input } from '@angular/core';
import { MatSelect } from '@angular/material/select';

@Directive({
  selector: '[disable-space-select]',
})
export class NoSpaceDirective {

  constructor(@Self() private select: MatSelect) {
    this.select._handleKeydown = (event: KeyboardEvent) => {
      if (event.code == 'Space') {
        return;
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
