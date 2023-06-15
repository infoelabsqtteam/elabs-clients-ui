import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { CommonFunctionService, DataShareService, ApiService, ModelService } from '@core/service-lib';


@Component({
  selector: 'app-file-views-modal',
  templateUrl: './file-views-modal.component.html',
  styleUrls: ['./file-views-modal.component.css']
})
export class FileViewsModalComponent implements OnInit {

  public coloumName:any = '';
  public data=[];  
  gridColumns:any=[];  
  currentPage: any = '';
  field:any={};
  downloadClick:any='';
  fileDownloadUrlSubscription;

  @Input() id: string;
  
  @Output() fileViewResponceData = new EventEmitter();
  @ViewChild('fileViewModal') fileViewModal: ModalDirective;

  constructor(
    private modalService: ModelService, 
    private el: ElementRef,
    private commonFunctionService:CommonFunctionService,
    private dataShareService:DataShareService,
    private apiService:ApiService
    ) {
      this.fileDownloadUrlSubscription = this.dataShareService.fileDownloadUrl.subscribe(data =>{
        this.setFileDownloadUrl(data);
      })
     }

  ngOnInit(): void {
    let modal = this;
    // ensure id attribute exists
    if (!this.id) {
        console.error('modal must have an id');
        return;
    }
    // add self (this modal instance) to the modal service so it's accessible from controllers
    this.modalService.add(this);
  }
  setFileDownloadUrl(fileDownloadUrl){
    if (fileDownloadUrl != '' && fileDownloadUrl != null && this.downloadClick != '') {
      let link = document.createElement('a');
      link.setAttribute('type', 'hidden');
      link.href = fileDownloadUrl;
      link.download = this.downloadClick;
      document.body.appendChild(link);
      link.click();
      link.remove();
      this.downloadClick = '';
      this.apiService.ResetDownloadUrl();
    }
  }
  // remove self from modal service when directive is destroyed
  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    if(this.fileDownloadUrlSubscription){
      this.fileDownloadUrlSubscription.unsubscribe();
    }
  }
  showModal(alert){
    this.field = alert.field;
    this.coloumName = this.field.label;
    this.data = JSON.parse(JSON.stringify(alert.data.data));
    
    if(alert.menu_name && alert.menu_name != null && alert.menu_name != undefined && alert.menu_name != ''){
      this.currentPage = alert.menu_name;
    } 
    if(alert.data.gridColumns){
      this.gridColumns = JSON.parse(JSON.stringify(alert.data.gridColumns));
    }     
    this.fileViewModal.show()    
  }
  closeModal(){
    this.fileViewModal.hide()
    this.data=[];
    this.gridColumns=[];
  }
  getddnDisplayVal(val) {
    return this.commonFunctionService.getddnDisplayVal(val);    
  }
  getValueForGrid(field,object){
    return this.commonFunctionService.getValueForGrid(field,object);
  }
  downloadFile(file){
    this.downloadClick = file.rollName;
    this.commonFunctionService.downloadFile(file);
  }

}
