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
        const el = this.el.nativeElement as HTMLElement;
        const { x } = this.el.nativeElement.getBoundingClientRect();
        const leftValue = Math.floor(x) - Math.floor(this.table.x);      
        el.style.left = this.table ? leftValue+'px' : '0px';                         // <<<---using ()=> syntax 
    }
  }

  


}
@Directive({
  selector: '[stickyHeader]'
})
export class StickyHeadDirective implements AfterViewInit{

  @Input() stickyHeader: boolean;

  constructor(
    private el: ElementRef,
    @Optional() private table: StickyTableDirective
  ) { }
  ngAfterViewInit(): void {
    if(this.stickyHeader){
      setTimeout(()=>{  
        const el = this.el.nativeElement as HTMLElement;
        const { x } = this.el.nativeElement.getBoundingClientRect();
        const leftValue = Math.floor(x) - Math.floor(this.table.x);      
        el.style.left = this.table ? leftValue+'px' : '0px';  // <<<---using ()=> syntax          
     }, 150);
      
    }
  }

  


}
