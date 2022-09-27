import { Directive,AfterViewInit, ElementRef, Optional, Input, AfterContentChecked, AfterViewChecked, AfterContentInit, OnInit } from '@angular/core';
import { StickyTableDirective } from '../sticky-table/StickyTable.directive';

@Directive({
  selector: '[sticky]'
})
export class StickyDirective implements AfterViewInit{

  @Input() sticky: boolean;

  constructor(
    private el: ElementRef,
    @Optional() private table: StickyTableDirective
  ) { }
  ngAfterViewInit(): void {
    if(this.sticky){
      setTimeout(()=>{  
        const el = this.el.nativeElement as HTMLElement;
        const { x } = this.el.nativeElement.getBoundingClientRect();
        el.style.position = 'sticky';
        el.style.zIndex = '3';
        el.style.boxShadow='inset -1px 0px 0px #dee2e6';
        const leftValue = Math.floor(x) - Math.floor(this.table.x);      
        el.style.left = this.table ? leftValue+'px' : '0px';                         // <<<---using ()=> syntax
          
     }, 100);
      
    }
  }

  


}
