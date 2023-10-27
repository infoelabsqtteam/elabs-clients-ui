import { Component, OnInit,OnDestroy, Input, Output,ViewChild,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl,Validators } from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';
import { Subscription } from 'rxjs';
import { ModelService, ApiService, CommonFunctionService, DataShareService, NotificationService, GridCommonFunctionService } from '@core/web-core';

@Component({
  selector: 'app-report-save-query',
  templateUrl: './report-save-query.component.html',
  styles: [
  ]
})
export class ReportSaveQueryComponent implements OnInit,OnDestroy {

  @Output() saveQueryResponce = new EventEmitter();
  @Input() id: string;
  @ViewChild('saveModal') public saveModal: ModalDirective;
  @Input() saveQurydata;
  @Input() fields;
  @Input() mode;
  saveQueryForm: FormGroup;
  crList:any = [];
  saveResponceSubscription:Subscription;

  constructor(
    private commonFunctionService:CommonFunctionService,
    private modalService: ModelService,
    private apiService:ApiService,
    private formBuilder: FormBuilder,
    private dataShareService:DataShareService,
    private notificationService:NotificationService,
    private gridCommonFunctionservice:GridCommonFunctionService
    ) {
      this.saveResponceSubscription = this.dataShareService.saveResponceData.subscribe(responce =>{
        this.setSaveResponce(responce);
      })
    }


  ngOnInit(): void {
    this.initForm();
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
    this.saveResponceSubscription.unsubscribe();
  }
  showModal(object){ 
    if(this.saveQurydata && this.saveQurydata.data && this.saveQurydata.data.crList){
      this.crList = this.saveQurydata.data.crList;           
    } 
    if(this.mode && this.saveQurydata && this.saveQurydata.name && this.saveQurydata.query && this.saveQurydata.query.crList){
      this.crList = this.saveQurydata.query.crList; 
      this.saveQueryForm.get('name').setValue(this.saveQurydata.name);
    }    
    this.saveModal.show();
  }
  close(){
    this.saveModal.hide();
    this.crList = [];
  }


  initForm(){
    this.saveQueryForm = this.formBuilder.group({
      "name" : new FormControl('',Validators.required),
    })

  }


  getChipsValue(object){
    const index = this.commonFunctionService.getIndexInArrayById(this.fields,object.fName,'field_name');
    const field = this.fields[index];
    if(field && field['field_name']){
    const operatore = this.commonFunctionService.getOperatorSymbol(object.operator);
    const formValue = {}
      const field_name = field['field_name'];
      formValue[field_name] = object.fValue;       
      const value = this.gridCommonFunctionservice.getValueForGrid(field,formValue);
      return field.label +' '+operatore+' '+value;
    }
    else{
      return;
    }
  }
  dropchips(index: any) {  
    this.crList.splice(index, 1);  
  }


  checkquerysaveValidator(){    
    return !this.saveQueryForm.valid;     
  }

  saveQuery(){
    const query = this.saveQurydata;
    const saveFormValue = this.saveQueryForm.getRawValue();
    let data = {};
    if(this.mode){
      query['name'] = saveFormValue.name;
      data = query;
    }else{
      data = {
        'name': saveFormValue.name,
        'query':query.data
      }
    } 
    const saveFromData = {
      curTemp: 'save_query',
      data: data
    }
    this.apiService.SaveFormData(saveFromData)
    
  }
  setSaveResponce(saveFromDataRsponce){
    if (saveFromDataRsponce) {
      if (saveFromDataRsponce.success && saveFromDataRsponce.success != '') {
        if (saveFromDataRsponce.success == 'success' && !this.mode) {
            this.notificationService.notify("bg-success", " Form Data Save successfull !!!");
        } else if (saveFromDataRsponce.success == 'success' && this.mode) {
            this.notificationService.notify("bg-success", " Form Data Update successfull !!!");         
        }  
        this.close();
        this.saveQueryResponce.emit(true);      
      }
      else if (saveFromDataRsponce.error && saveFromDataRsponce.error != '') {
        this.notificationService.notify("bg-danger", saveFromDataRsponce.error);
        this.apiService.ResetSaveResponce()
      }
      else{
        this.notificationService.notify("bg-danger", "No data return");
      }
    }
    
  }









}
