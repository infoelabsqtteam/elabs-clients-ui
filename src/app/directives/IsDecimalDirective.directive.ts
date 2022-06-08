import { Directive, ElementRef, HostListener, Input, forwardRef, Attribute, AfterContentInit, OnChanges, OnDestroy } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, ValidatorFn, Validator, FormControl, NgModel } from '@angular/forms';

@Directive({
    selector: '[IsDecimal]'
})
export class IsDecimalDirective {

  private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  constructor(
    private el: ElementRef
  ) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {

  // Allow Backspace, tab, end, and home keys
  if (this.specialKeys.indexOf(event.key) !== -1) {
     return;
  }

  let current: string = this.el.nativeElement.value;
  const position = this.el.nativeElement.selectionStart;
  const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');

      if (next && !String(next).match(this.regex)) {
        event.preventDefault();
      }
      }
  }