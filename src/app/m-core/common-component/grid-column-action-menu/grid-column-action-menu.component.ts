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
  @Input() index:number
  @Input() sortIcon:String
  @Input() onSort:(col)=>void;
 
  constructor(
    private commonFunctionService:CommonFunctionService
  ) { }
 
  ngOnInit(): void {
  }

  copyColumns():void{
    this.commonFunctionService.copyGridColumnText(this.headElements[this.index],this.data,this.elements)
  }
 
  hideColumn() {
    this.headElements[this.index].display = !this.headElements[this.index].display;
  }

}
