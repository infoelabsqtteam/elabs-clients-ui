import { Component, OnInit, Input, Output,ViewChild,EventEmitter } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { CommonFunctionService, DataShareService, ModelService } from '@core/web-core';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.css']
})
export class FormModalComponent implements OnInit {

  // @Output() addAndUpdateResponce = new EventEmitter();
  
  @Input() id: string;    
  
  tabIndex: number;
  bulkUpdate:boolean;
  bulkDataList:any;
  editedRowIndex: number;
  formName: string;
  selectContact:string;


  checkModalClass:boolean=false;
  formSize:any = 'modal-dialog-full-width';
  formShowHide:boolean=false;
  addUpdateFormResponceSubscription:Subscription;

  
  @ViewChild('formModal') public formModal: ModalDirective;
  constructor(
    private commonFunctionService:CommonFunctionService, 
    private modalService: ModelService,
    private dataShareService:DataShareService
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
  showModal(object){ 
    this.tabIndex = object['tabIndex'] 
    this.bulkUpdate = object['bulkUpdate'] 
    this.bulkDataList = object['bulkDataList'] 
    this.editedRowIndex = object['editedRowIndex'] 
    this.formName = object['formName'] 
    this.selectContact = object['selectContact'] 
    this.formShowHide = true;
    this.formModal.show();
    this.checkModalClass = true;
  }
  
  close(){
    
    this.formModal.hide();
    this.formShowHide = false;
    this.checkModalClass = false;
  }

  formResponce(event){
    if(event == 'close'){
      this.close();
      this.dataShareService.shareAddAndUpdateResponce(event);
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
