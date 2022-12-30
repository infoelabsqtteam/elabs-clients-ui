import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { CommonFunctionService } from '../../../services/common-utils/common-function.service';
import { DataShareService } from 'src/app/services/data-share/data-share.service';
import { ApiService } from 'src/app/services/api/api.service';
import { ModelService } from 'src/app/services/model/model.service';
import { NotificationService } from 'src/app/services/notify/notification.service';

@Component({
  selector: 'html-view-modal',
  templateUrl: './html-view-modal.component.html',
  styleUrls: ['./html-view-modal.component.css']
})
export class HtmlViewModalComponent implements OnInit {

  previewData: any = "";
  checkPreviewData = true;
  @Input() id: string;
  @ViewChild('htmlViewModal') public htmlViewModal: ModalDirective;
  

  constructor(
    private modalService: ModelService, 
    private el: ElementRef, 
    private commonFunctionService: CommonFunctionService,
    private apiService:ApiService,
    private notificationService:NotificationService
    ) {
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
  }
  ngAfterViewInit() {
    //console.log(this.myDiv.nativeElement.innerHTML);
  }

  showModal(alert) {
    //this.htmlViewModal.show();
    if(alert.data && alert.data.data){
      this.previewData = alert.data.data;
      this.openModalInNewBrowser();
    }else{
      this.notificationService.notify("bg-danger","Data is empty!!!");
    }    
  }
  closeModal() {
    this.htmlViewModal.hide();
    this.previewData = '';
    this.checkPreviewData = true;
  }
  openModalInNewBrowser(){
    let popupWin;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');    
    popupWin.document.write('<div class="noprint" style="text-align:right;"><a onClick="window.print()" style="text-align: right;display: inline-block;cursor: pointer;border: 2px solid #4285f4!important;background-color: transparent!important;color: #4285f4!important;box-shadow: 0 2px 5px 0 rgba(0,0,0,.16), 0 2px 10px 0 rgba(0,0,0,.12);padding: 7px 25px;font-size: .81rem;transition: .2s ease-in-out;margin: .375rem;text-transform: uppercase;">Print</a></div><style>@media print{.noprint{display:none;}}</style>'+this.previewData); 
  }
  print(): void {
    let popupWin;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');    
    popupWin.document.write('<div class="noprint" style="text-align:right;"><a onClick="window.print()" style="text-align: right;display: inline-block;cursor: pointer;border: 2px solid #4285f4!important;background-color: transparent!important;color: #4285f4!important;box-shadow: 0 2px 5px 0 rgba(0,0,0,.16), 0 2px 10px 0 rgba(0,0,0,.12);padding: 7px 25px;font-size: .81rem;transition: .2s ease-in-out;margin: .375rem;text-transform: uppercase;">Print</a></div><style>@media print{.noprint{display:none;}}</style>'+this.previewData);   
    popupWin.document.close();
    popupWin.print()
  }

}
