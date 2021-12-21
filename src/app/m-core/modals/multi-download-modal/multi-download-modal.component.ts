import { Component, OnInit,OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { CommonFunctionService } from '../../../services/common-utils/common-function.service'
import { DataShareService } from '../../../services/data-share/data-share.service';
import { ApiService } from 'src/app/services/api/api.service';
import { ModelService } from 'src/app/services/model/model.service';

@Component({
  selector: 'app-multi-download-modal',
  templateUrl: './multi-download-modal.component.html',
  styleUrls: ['./multi-download-modal.component.css']
})
export class MultiDownloadModalComponent implements OnInit,OnDestroy {
  @Input() id: string;
  private element: any;
  public coloumName:any = '';
  public data=[];
  staticData:any={};
  copyStaticData:any={};
  downloadPdfCheck: any = '';
  downloadFileIndex:any=0;
  currentPage: any = '';
  staticDataSubscriber;
  pdfFileSubscription;
  
  @Output() multiDownloadResponce = new EventEmitter();
  @ViewChild('multiDownModal') multiDownModal: ModalDirective;
  
  constructor(
    private modalService: ModelService, 
    private el: ElementRef,
    private formBuilder: FormBuilder,
    private commonFunctionService:CommonFunctionService,
    private dataShareService:DataShareService,
    private apiService:ApiService
  ) { 
    this.staticDataSubscriber = this.dataShareService.staticData.subscribe(data =>{
      this.setStaticData(data);
    })
    this.pdfFileSubscription = this.dataShareService.downloadPdfData.subscribe(data =>{
      this.setDownloadPdfData(data);
    })
    this.element = el.nativeElement;
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

  // remove self from modal service when directive is destroyed
  ngOnDestroy(): void {
      this.modalService.remove(this.id);
      this.element.remove();
      if(this.staticDataSubscriber){
        this.staticDataSubscriber.unsubscribe();
      }
      if(this.pdfFileSubscription){
        this.pdfFileSubscription.unsubscribe();
      }
  }
  setStaticData(staticData){
    if (staticData) {
      this.staticData = staticData; 
      Object.keys(this.staticData).forEach(key => {        
        this.copyStaticData[key] = JSON.parse(JSON.stringify(this.staticData[key]));
      })         
    }
  }
  setDownloadPdfData(downloadPdfData){
    if (downloadPdfData != '' && downloadPdfData != null && this.downloadPdfCheck != '') {
      let link = document.createElement('a');
      link.setAttribute('type', 'hidden');
      const file = new Blob([downloadPdfData.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(file);
      link.href = url;
      link.download = downloadPdfData.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      this.downloadPdfCheck = '';
      let currentindex = JSON.parse(JSON.stringify(this.data[this.downloadFileIndex - 1]));
      currentindex.selected = false;
      this.data[this.downloadFileIndex - 1]=currentindex;
      this.apiService.ResetPdfData();
      this.downloFile(this.downloadFileIndex);
    }
  }

  showModal(alert){
    this.coloumName = alert.field;
    if(alert.menu_name && alert.menu_name != null && alert.menu_name != undefined && alert.menu_name != ''){
      this.currentPage = alert.menu_name;
    } 
    this.data = JSON.parse(JSON.stringify(alert.data)); 
    this.downloadFileIndex = 0;
    this.downloFile(this.downloadFileIndex);    
    this.multiDownModal.show()    
  }
  downloFile(index){
    let object = {}
    if(this.data.length != index){
      object = this.data[index];
    }else{
      this.multiDownloadResponce.emit(this.data);
      this.multiDownModal.hide();
    }
    this.downloadFileIndex = this.downloadFileIndex + 1;
    this.downloadPdfCheck = this.commonFunctionService.downloadPdf(object,this.currentPage);
  }
}
