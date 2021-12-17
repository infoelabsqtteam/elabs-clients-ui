import { Component, OnInit, Input, Output,ViewChild,EventEmitter } from '@angular/core';


import { CommonFunctionService } from '../../../services/common-utils/common-function.service';
import { ModalService } from '../../modals/modal.service';
import { ModalDirective } from 'angular-bootstrap-md';


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
  constructor(private commonFunctionService:CommonFunctionService, private modalService: ModalService) {}

  ngOnInit(): void {
    let modal = this;
    if (!this.id) {
        console.error('modal must have an id');
        return;
    }
    this.modalService.remove(this.id);
    this.modalService.add(this);
    
  }
  showFormModal(object){ 
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
    if(evt.details){
      if(this.formModal != undefined && this.formModal.isShown){
        this.checkModalClass = true;
      }     
      this.formSize = this.commonFunctionService.formSize(evt.details);
    }else{
      this.checkModalClass = false;
    }    
  }
  
}
