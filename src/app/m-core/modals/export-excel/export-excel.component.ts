import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonFunctionService, DownloadService, ModelService } from '@core/web-core';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-export-excel',
  templateUrl: './export-excel.component.html',
  styleUrls: ['./export-excel.component.css']
})
export class ExportExcelComponent implements OnInit {

  @Input() id: string; 
  @ViewChild('exportExcelModal') public exportExcelModal: ModalDirective; 
  data:any={}
  pageNo='1';
  pageSize;
  modelData:any = {};
  
  constructor(
    private modelService:ModelService,
    private downloadService:DownloadService,
    private commonFunctionService:CommonFunctionService
  ) { }

  ngOnInit() {
    let modal = this;
    if (!this.id) {
        console.error('modal must have an id');
        return;
    }
    this.modelService.remove(this.id);
    this.modelService.add(this);
  }

  showModal(alert){
    this.modelData = alert;
    const total = alert.total;
    this.pageSize = alert.totalGridData;
    if(this.pageSize > 0){
      this.data = this.commonFunctionService.getPageCount(total,this.pageSize); 
    }   
    this.exportExcelModal.show()      
  }
  close(){
    this.pageNo = '1';
    this.modelData = {};
    this.pageSize = 0;
    this.data = {};
    this.exportExcelModal.hide();
  }
  download(){
    if(this.pageNo){
      this.downloadService.getExcelData(this.modelData.tab,this.modelData.menuName,this.modelData.gridColumns,this.modelData.gridFilterValue,this.modelData.tempName,Number(this.pageNo),this.pageSize);
    }    
    this.close();
  }
}
