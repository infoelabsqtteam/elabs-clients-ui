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
  @ViewChild('embedPDF') embedPDF: ElementRef<HTMLEmbedElement>;
  pdfUrl: any="";
 
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
    this.createPdf();
  }

  showModal(alert) {
    if(alert && alert.url) this.pdfUrl= alert.url;
    this.createPdf();
    this.pdfViewModal.show();

  }
  createPdf(){
    this.embedPDF.nativeElement.src= this.pdfUrl;
  }
  closeModal() {
    this.pdfViewModal.hide();
  }

}
