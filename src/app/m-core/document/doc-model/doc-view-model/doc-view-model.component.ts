import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { ModelService } from '@core/service-lib';

@Component({
  selector: 'app-doc-view-model',
  templateUrl: './doc-view-model.component.html',
  styleUrls: ['./doc-view-model.component.css']
})
export class DocViewModelComponent implements OnInit {

  public viewFileType:any="";
  public viewLinkOfFile:any="";
  public viewFileName:any="";


  @Input() id: string;
  @Output() docViewModalResponce = new EventEmitter();
  @ViewChild('docFileViewModal') public docFileViewModal: ModalDirective; 

  constructor(
    private modelService:ModelService
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

  showModal(object){
    this.docFileViewModal.show()  
    this.viewFileType = object['fileType'];
    this.viewFileName = object['viewFileName'];
    if(object.viewLinkOfFile){
      this.viewLinkOfFile = object.viewLinkOfFile;
    }
  }
  close(){
    this.docFileViewModal.hide();
  }
  download(){
    const object = {
      "action" : "download"
    }
    this.docViewModalResponce.emit(object);
    this.close();
  }
}
