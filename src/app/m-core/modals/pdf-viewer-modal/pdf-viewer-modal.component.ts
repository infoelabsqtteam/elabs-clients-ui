import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ModalDirective } from 'angular-bootstrap-md';
import { ModelService } from 'src/app/services/model/model.service';
import { CommonFunctionService } from '../../../services/common-utils/common-function.service';

@Component({
  selector: 'app-pdf-viewer-modal',
  templateUrl: './pdf-viewer-modal.component.html',
  styleUrls: ['./pdf-viewer-modal.component.css']
})
export class PdfViewerModalComponent implements OnInit {


  @Input() id: string;
  @Output() pdfViewModalResponce = new EventEmitter();
  @ViewChild('pdfViewModal') public pdfViewModal: ModalDirective;

  constructor(
    private modalService: ModelService, 
    private el: ElementRef, 
    private commonFunctionService: CommonFunctionService) { }

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
    this.pdfViewModal.show();

  }
  closeModal() {
    this.pdfViewModal.hide();
  }

}
