import { Component, OnInit, Input, Output,ViewChild,EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';
import { ModelService, CommonFunctionService, DataShareService, ApiService, GridCommonFunctionService } from '@core/web-core';

@Component({
  selector: 'app-report-load-query',
  templateUrl: './report-load-query.component.html',
  styles: [
  ]
})
export class ReportLoadQueryComponent implements OnInit {

  @Output() loadQueryResponce = new EventEmitter();
  @Input() id: string;
  @ViewChild('loadModal') public loadModal: ModalDirective;
  @Input() loadQuerydata;
  @Input() fields;
  crList:any = [];

  columns = [
    {"label": "Report Name", "type": "text", "field_name": "name"},
    {"label": "Query", "type": "chips_list", "field_name": "query.crList"}
  ]
  
  loadQueryForm: UntypedFormGroup;
  gridData :any = [];
  gridDataSubscription;

  constructor(
    private modalService: ModelService,
    private commonFunctionService:CommonFunctionService,
    private dataShareServices :DataShareService,
    private formBuilder: UntypedFormBuilder,
    private apiService:ApiService,
    private gridCommonFunctionService:GridCommonFunctionService
  ) {
    this.gridDataSubscription = this.dataShareServices.getReportLoadData.subscribe(data =>{
      if(data.data && data.data.length > 0){
        this.gridData= data.data;
      } else {
        this.gridData = [];
      }
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

  initForm(){
    this.loadQueryForm = this.formBuilder.group({
      "filter" : new UntypedFormControl('',Validators.required),
    })

  }

  showModal(object){ 
    this.loadModal.show();
  }
  close(){
    this.loadModal.hide();
  }


  getValueForGrid(field, object) {    
    return this.gridCommonFunctionService.getValueForGrid(field, object);    
  }
  getValueForGridTooltip(field, object) {
    return this.gridCommonFunctionService.getValueForGridTooltip(field, object);
  }

  getChipsValue(object){
    const index = this.commonFunctionService.getIndexInArrayById(this.fields,object.fName,'field_name');
    const field = this.fields[index];
    if(field && field['field_name']){
    const operatore = this.commonFunctionService.getOperatorSymbol(object.operator);
    const formValue = {}
      const field_name = field['field_name'];
      formValue[field_name] = object.fValue;       
      const value = this.gridCommonFunctionService.getValueForGrid(field,formValue);
      return field.label +' '+operatore+' '+value;
    }
    else{
      return;
    }
  }
  getChipsForGrid(object){
    const operatore = this.commonFunctionService.getOperatorSymbol(object.operator);
    return object.fName +' '+operatore+' '+object.fValue;

  }

  gridAction(action, data) {
    let value = {
      'action': action,
      'data': data
    }
    switch (action) {
      case 'delete':
        data.status = "Inactive";
        const saveFromData = {
          curTemp: 'save_query',
          data: data
        }
        this.apiService.SaveFormData(saveFromData)
        break;
      default:
        this.loadQueryResponce.emit(value);
        break;
    }
      
   this.close();
  }


}
