import { Component, OnInit, Input, Output,ViewChild,EventEmitter } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { CommonFunctionService, ModelService } from '@core/service-lib';



@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.css']
})
export class FormModalComponent implements OnInit {

  @Output() addAndUpdateResponce = new EventEmitter();
  @Input() tabIndex: number;
  @Input() editedRowIndex: number;
  @Input() formName: string;
  @Input() id: string;
  @Input() selectContact:string;
  formSize:any = 'modal-dialog-full-width';
  @Input() bulkUpdate:boolean;
  @Input() bulkDataList:any;
  checkModalClass:boolean=false;

  
  @ViewChild('formModal') public formModal: ModalDirective;
  constructor(
    private commonFunctionService:CommonFunctionService, 
    private modalService: ModelService
    ) {}

  ngOnInit(): void {
    let modal = this;
    if (!this.id) {
        console.error('modal must have an id');
        return;
    }
    this.modalService.remove(this.id);
    this.modalService.add(this);
    
  }
  showModal(object){ 
    this.formModal.show();
    this.checkModalClass = true;
  }
  close(){
    this.formModal.hide();
    this.checkModalClass = false;
  }

  formResponce(event){
    if(event == 'close'){
      this.close();
      this.addAndUpdateResponce.emit(event);
    }    
  }

  formDetail(evt){
    if(evt){
      const formFieldLangth = evt.tableFields.length;
      if(this.formModal != undefined && this.formModal.isShown){
        this.checkModalClass = true;
      }     
      this.formSize = this.commonFunctionService.formSize(evt.details,formFieldLangth);
    }else{
      this.checkModalClass = false;
    }    
  }
  
}
