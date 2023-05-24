import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ModalDirective } from 'angular-bootstrap-md';
import { ModelService } from 'src/app/services/model/model.service';
import { CommonFunctionService } from '../../../services/common-utils/common-function.service';
import { ApiService } from '../../../services/api/api.service';

@Component({
  selector: 'app-pdf-viewer-modal',
  templateUrl: './pdf-viewer-modal.component.html',
  styleUrls: ['./pdf-viewer-modal.component.css']
})
export class PdfViewerModalComponent implements OnInit {

  @Input() id: string;
  @Output() pdfViewModalResponce = new EventEmitter();
  @ViewChild('pdfViewModal') public pdfViewModal: ModalDirective;
  pdfUrl: any= "https://e-labs-nonprod-documents.s3.ap-south-1.amazonaws.com/ASC01/documents/User%20Manual.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230524T104510Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=AKIAUIGGVCG3AZ7KUAFS%2F20230524%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Signature=3cb78dd60cacee85b5396aed1849b826b38d76b7b840f160bc70a2bf2cb68d25";

  constructor(
    private modalService: ModelService, 
    private el: ElementRef, 
    private commonFunctionService: CommonFunctionService,
    private apiServices: ApiService
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
  ngAfterViewInit() {
    //console.log(this.myDiv.nativeElement.innerHTML);
  }

  showModal(alert) {
    // if(alert && alert.url)
    //  this.pdfUrl= alert.url;
   
    this.pdfViewModal.show();

  }
  closeModal() {
    this.pdfViewModal.hide();
  }

  getPDFUrl(url) {
   this.pdfUrl = this.apiServices.openPdf(url);
   console.log(this.pdfUrl)
  }


}
