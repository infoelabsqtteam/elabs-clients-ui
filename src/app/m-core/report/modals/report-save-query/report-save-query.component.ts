import { Component, OnInit, Input, Output,ViewChild,EventEmitter, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators,FormGroupDirective,FormControlDirective,FormControlName } from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';
import { ModelService } from 'src/app/services/model/model.service';
import { ApiService } from 'src/app/services/api/api.service';
import { CommonFunctionService } from 'src/app/services/common-utils/common-function.service';
import { input } from 'aws-amplify';

@Component({
  selector: 'app-report-save-query',
  templateUrl: './report-save-query.component.html',
  styles: [
  ]
})
export class ReportSaveQueryComponent implements OnInit {

  @Output() saveQueryResponce = new EventEmitter();
  @Input() id: string;
  @ViewChild('saveModal') public saveModal: ModalDirective;
  @Input() saveQurydata;
  @Input() fields;
  @Input() mode;
  saveQueryForm: FormGroup;
  crList:any = [];

  constructor(
    private commonFunctionService:CommonFunctionService,
    private modalService: ModelService,
    private apiService:ApiService,
    private formBuilder: FormBuilder,
    ) {
      
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
      const value = this.commonFunctionService.getValueForGrid(field,formValue);
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
    this.close();
    this.saveQueryResponce.emit(true);
  }









}
