import { Component, Input, OnInit } from '@angular/core';
import { CommonFunctionService } from '@core/web-core';

@Component({
  selector: 'app-grid-column-action-menu',
  templateUrl: './grid-column-action-menu.component.html',
  styleUrls: ['./grid-column-action-menu.component.css']
})
export class GridColumnActionMenuComponent implements OnInit {

  @Input() headElements:any
  @Input() elements:any
  @Input() data:any
  @Input() head:any
  @Input() i:number
  @Input() sortIcon:String
  @Input() onSort:(head)=>void;
 
  constructor(
    private commonFunctionService:CommonFunctionService
  ) { }
 
  ngOnInit(): void {
  }

  copyColumns():void{
    this.commonFunctionService.copyGridColumnText(this.head,this.data,this.elements)
  }
 
  hideColumn() {
    this.headElements[this.i].display = !this.headElements[this.i].display;
  }

}
