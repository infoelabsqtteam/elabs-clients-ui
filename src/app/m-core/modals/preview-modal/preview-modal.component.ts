import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { CommonFunctionService } from '../../../services/common-utils/common-function.service';
import { DataShareService } from 'src/app/services/data-share/data-share.service';
import { ApiService } from 'src/app/services/api/api.service';
import { ModelService } from 'src/app/services/model/model.service';

@Component({
  selector: 'app-preview-modal',
  templateUrl: './preview-modal.component.html',
  styleUrls: ['./preview-modal.component.css']
})
export class PreviewModalComponent implements OnInit, AfterViewInit {

  previewData: any = "";
  getInnerHtml: any = '';
  checkPreviewData = true;
  editedColumne: any = -1;
  gridData: any = "";
  currentPage: any = '';
  downloadPdfCheck: any = '';
  @Input() id: string;
  @Output() previewModalResponce = new EventEmitter();
  @ViewChild('previewModal') public previewModal: ModalDirective;
  @ViewChild('myDiv') myDiv: ElementRef;
  tempObject: any = {};
  pdfFileSubscription;
  previewHtmlSubscription;



  constructor(
    private modalService: ModelService, 
    private el: ElementRef, 
    private commonFunctionService: CommonFunctionService,
    private dataShareService:DataShareService,
    private apiService:ApiService
    ) {

    this.pdfFileSubscription = this.dataShareService.downloadPdfData.subscribe(data =>{
      this.setDownloadPdfData(data);
    })
    this.previewHtmlSubscription = this.dataShareService.previewHtml.subscribe(data =>{
      this.setPreviewHtml(data);
    })
    this.tempObject['reportName'] = "My Test Report 1";
    this.tempObject['customerName'] = "Customer 1";
    this.tempObject['gridHeading'] = [
      { label: 'Name', name: 'name' },
      { label: 'Email', name: 'email' },
      { label: 'Mobile', name: 'mobile' },
      { label: 'Address', name: 'address' }
    ]

    this.tempObject['gridData'] = [
      { name: 'swatantra', email: 'test@gmail.com', mobile: '9122160962', address: 'Barahsher' },
      { name: 'swatantra', email: 'test@gmail.com', mobile: '9122160962', address: 'Barahsher' },
      { name: 'swatantra', email: 'test@gmail.com', mobile: '9122160962', address: 'Barahsher' },
      { name: 'swatantra', email: 'test@gmail.com', mobile: '9122160962', address: 'Barahsher' }
    ]
  }

  ngOnInit(): void {
    let modal = this;
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }
    this.modalService.remove(this.id);
    this.modalService.add(this);

  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.pdfFileSubscription){
      this.pdfFileSubscription.unsubscribe();
    }
    if(this.previewHtmlSubscription){
      this.previewHtmlSubscription.unsubscribe();
    } 
  }
  ngAfterViewInit() {
    //console.log(this.myDiv.nativeElement.innerHTML);
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
      this.apiService.ResetPdfData();
    }
  }
  setPreviewHtml(previewHtml){
    if (previewHtml != '' && this.checkPreviewData) {
      this.previewData = previewHtml;
      this.checkPreviewData = false;
    }
  }

  showModal(alert) {
    this.previewModal.show();
    this.gridData = alert.gridData;
    this.currentPage = alert.currentPage;

  }
  closeModal() {
    this.previewModal.hide();
    this.clearHtmlData();
    this.previewData = '';
    this.checkPreviewData = true;
  }
  addRates() {
    //console.log(this.tempObject);
    //console.log(this.myDiv.nativeElement.innerHTML);
    this.getInnerHtml = this.myDiv.nativeElement.innerHTML;
  }
  editeColumn(i, data) {
    this.editedColumne = i + data;
  }
  save() {
    this.editedColumne = -1;
    this.clearHtmlData();
  }
  clearHtmlData() {
    this.apiService.resetPreviewHtml();
  }
  downloadPdf() {
    this.downloadPdfCheck = this.commonFunctionService.downloadPdf(this.gridData,this.currentPage)    
  }
  print(): void {
    let popupWin;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');    
    popupWin.document.write('<div class="noprint" style="text-align:right;"><a onClick="window.print()" style="text-align: right;display: inline-block;cursor: pointer;border: 2px solid #4285f4!important;background-color: transparent!important;color: #4285f4!important;box-shadow: 0 2px 5px 0 rgba(0,0,0,.16), 0 2px 10px 0 rgba(0,0,0,.12);padding: 7px 25px;font-size: .81rem;transition: .2s ease-in-out;margin: .375rem;text-transform: uppercase;">Print</a></div><style>@media print{.noprint{display:none;}}</style>'+this.previewData);   
    popupWin.document.close();
    popupWin.print()
  }

}
