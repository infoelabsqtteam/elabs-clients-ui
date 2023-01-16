import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators,FormGroupDirective,FormControlDirective,FormControlName } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import { CommonFunctionService } from 'src/app/services/common-utils/common-function.service';
import { DataShareService } from 'src/app/services/data-share/data-share.service';
import { PermissionService } from 'src/app/services/permission/permission.service';
import { NotificationService } from 'src/app/services/notify/notification.service';
import { StorageService} from '../../../services/storage/storage.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { ModelService } from "src/app/services/model/model.service";


export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styles: [
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class ReportFormComponent implements OnInit {

  
  reportForm: FormGroup;
  staticDataSubscription:any;
  staticData = [];
  mySaveQueryData:any;
  myLoadQueryData:any;
  crList = [];
  gridData :any = [];
  operator_list:any = {
    "text" : 
      {"eq":"Equal",
      "stwic":"Start With Ignore Case",
      "in":"In"}
    ,
    "checkbox" : {
    "eq":"Equal",
      "in":"In"
  },
    "number" : 
      {"eq":"Equal"}
    ,
    "date" : 
      {"eq":"Equal"}
    ,
    "daterange":
      {"gte":"Grater Then Equal",
      "lte":"Less Then Equal"}
  }
  disableTypeList:any=[
    "autocomplete-dropdown","button","drag_drop","dropdown_on_tree_view_selection","file","grid_selection","grid_selection_vertical","group_of_fields","html","html_editor","html_view","icon","label","label_with_checkbox","label_with_dropdown","label_with_file","label_with_radio","label_with_text","list_of_checkbox","list_of_fields","mini-html","step_progress_bar","tabular_data_selector","list_of_string","password"
  ]
  operaters:any =[]; 
  form:any={};
  grid:any={}; 
  fields:any=[];
  columns:any=[];
  field:any={};
  updatemode = false;
  public downloadClick = '';

  gridDataSubscription;
  exportExcelSubscription;
  
  
  constructor(
    private commonFunctionService:CommonFunctionService,
    private dataShareServices :DataShareService,
    private permissionService: PermissionService,
    private notificationService:NotificationService,
    private storageService: StorageService,
    private apiService:ApiService,
    private modelService: ModelService,
    private formBuilder: FormBuilder,

  ) { 
    this.exportExcelSubscription = this.dataShareServices.exportExcelLink.subscribe(data =>{
      this.setExportExcelLink(data);
    });
    this.gridDataSubscription = this.dataShareServices.gridData.subscribe(data =>{
      if(data.data && data.data.length > 0){
        this.gridData= data.data;
      } else {
        this.gridData = [];
      }
    });

    this.staticDataSubscription = this.dataShareServices.staticData.subscribe( data =>{
      this.staticData = data;
      if(this.staticData && this.staticData['form']){
        this.form = this.staticData['form'];
        if(this.form && this.form.fields && this.form.fields.length > 0){
          const fields = this.filterFields(this.form.fields);
          this.fields = fields;
        }        
      }else{
        this.fields = [];
      }
      if(this.staticData && this.staticData['grid']){
        this.grid = this.staticData['grid'];
        if(this.grid && this.grid.fields && this.grid.fields.length > 0){
          this.columns = this.grid.fields;
        }
      }else{
        this.columns = [];
      }
      //this.setStaticData(data);
    })
    this.getCollectionName();
  }

  private getCollectionName() {
    const params = "pojo_master";
    const callback = "collection_name";
    const criteria = [
      "report_flag;eq;true;STATIC"
    ];
    const payload = this.commonFunctionService.getPaylodWithCriteria(params, callback, criteria, {}, 'GET_FORM_FIELDS_FROM_POJO');
    this.apiService.getStatiData([payload]);
  }

  ngOnInit(): void {
    this.initForm();
  }
  initForm(){
    this.reportForm = this.formBuilder.group({
      "collection_name" : new FormControl('',Validators.required),
      "collectionName" : new FormControl(""),
      "name" : new FormControl('',Validators.required),
      "operator" : new FormControl('',Validators.required),
      "value" : new FormControl('',Validators.required),
    })
  }



  getddnDisplayVal(val) {
    return this.commonFunctionService.getddnDisplayVal(val);    
  }

  setValue(field){
    let reportFormValue = this.reportForm.getRawValue();
    let fieldName = '';
    if(field && field.field_name){
      fieldName = field.field_name
    }
    switch (fieldName) {
      case 'collection_name':
        if(reportFormValue.collection_name != ''){
          const selectedCollection = reportFormValue["collection_name"];
          if(selectedCollection.FORM_GROUP && selectedCollection.FORM_GROUP.collection_name && selectedCollection.FORM_GROUP.collection_name != ""){
            const collectionName = selectedCollection.FORM_GROUP.collection_name;
            this.reportForm.get('collectionName').setValue(collectionName);
          }
          this.reportForm.get('name').setValue('');
          this.reportForm.get('operator').setValue('');
          this.reportForm.get('value').setValue('');
          this.getFielsAndColumn(reportFormValue);
        }
        break;
      case 'name':
        this.operaters=[];
        this.reportForm.get('operator').setValue('');
        this.reportForm.get('value').setValue('');
        const fieldData = reportFormValue[fieldName];
        this.field = fieldData;
        let type = this.field['type'];
        let criteria = "name;eq;"+type+";STATIC";
        let payload = this.commonFunctionService.getPaylodWithCriteria('adm:REPORT_FIELD_OPERATOR','operator_list',[criteria],{});
        this.apiService.getStatiData([payload]);
        if(type == 'dropdown'  && fieldData.ddn_field) {
          const payload = this.commonFunctionService.getPaylodWithCriteria(fieldData.api_params,fieldData.call_back_field,[],{});        
          this.apiService.getStatiData([payload]);
        };
        switch (type) {
          case 'checkbox':
            this.operaters = this.operator_list[type];
            this.reportForm.get('value').setValue(false);
            break;  
          case 'date':
            this.operaters = this.operator_list[type];
            break;       
          default:
            this.operaters = this.operator_list['text'];
            break;
        }        
        break;
            
      default:
        break;
    }
  }



  private getFielsAndColumn(reportFormValue: any) {
    const payload = this.commonFunctionService.getPaylodWithCriteria("CORE-QTMP:GET_FIELD_AND_GRID_COLUMN_BY_COLLECTION", '', [], {});
    const data = reportFormValue;
    payload['data'] = data;
    this.apiService.getStatiData([payload]);
  }

  dropchips(index: any) {  
    this.crList.splice(index, 1);  
  }
 
  addCrlist(){
    const value = this.reportForm.getRawValue();
    const criteria = this.createCrList(value);
    if(this.commonFunctionService.checkDataAlreadyAddedInListOrNot('fName',criteria.fName,this.crList)){
      const index = this.commonFunctionService.getIndexInArrayById(this.crList,criteria.fName,'fName');
      this.crList[index] = criteria;
    }else{
      this.crList.push(criteria);
    }
    let currentData = this.getQuery();
    if(this.updatemode){
      this.mySaveQueryData['query']['crList'] = currentData.data.crList; 
    }else{
      this.mySaveQueryData = currentData;
    }    
  }
  createCrList(object){
    const name = object.name.field_name;
    const operator = object.operator;
    const value = object.value;
    const list = {
      "fName": name,
      "fValue": value,
      "operator": operator
    }
    return list;
  }
  clearValidator() {
    
  }
  checkValidator(){    
    return !this.reportForm.valid;     
  }
  submitValidator(){
    const value = this.reportForm.getRawValue();
    const collectionValue = value['collection_name'];
    if(collectionValue != "") {
      return false;
    }else {
      return true
    }
  }
  
  getChipsValue(object){
    const index = this.commonFunctionService.getIndexInArrayById(this.fields,object.fName,'field_name');
    const field = this.fields[index];
    const operatore = this.commonFunctionService.getOperatorSymbol(object.operator);    
    let fName = '';
    let fValue = object.fValue;    
    if(field && field.label){
      fName = field.label;
    }else{
      fName = object.fName;
    } 
    
    return fName +' '+operatore+' '+fValue;
  }


  clear(){
    const value = this.reportForm.getRawValue();
    const collectionValue = value['collection_name'];
    this.resetForm();
    this.reportForm.get('collection_name').setValue(collectionValue);
  }

  alertResponce(responce) {
    if (responce) {
      this.reset(); 
    } else {     
     this.savemodal();   
    }
  }
 
  reset() {
    this.resetForm();
    this.resetVariables();
    this.getCollectionName();
    this.initForm();
  }
  private resetVariables() {
    this.crList = [];
    this.apiService.resetStaticAllData();
    this.staticData = [];
    this.gridData = [];
    this.operaters = [];
    this.fields = [];
    this.columns = [];
    this.field = {};
    this.updatemode = false;
  }

  private resetForm() {
    this.reportForm.reset();
  }

  resetConfirm(){
    const alertData = {
      "type": 'info',
      "bodyMessage": 'Reset This Query!',
      "headerMessage": 'Are You Sure ?',
      "yesButtonText": 'Yes',
      "noButtonText" : 'No'
    }
    this.modelService.open('confirm-modal',alertData);
  }
  

  submitdata() {
    const payload = this.getQuery();
    this.loadQuery(payload);
  }
  
  loadQuery(payload){
    this.apiService.getGridData(payload);
  }

  private getQuery() {
    let reportFormValue = this.reportForm.getRawValue();
    let apiprams = reportFormValue.collectionName;
    const payload = this.commonFunctionService.getDataForGrid(1, {}, { 'name': apiprams }, [], {}, '');
    payload.data.crList = this.crList;
    return payload;
  }

  getValueForGrid(field, object) {
    return this.commonFunctionService.getValueForGrid(field, object);
  }
  getValueForGridTooltip(field, object) {
    return this.commonFunctionService.getValueForGridTooltip(field, object);
  }

  compareObjects(o1: any, o2: any): boolean {
    if(o1 != null && o2 != null){
      return o1._id === o2._id;
    }else{
      return false;
    }
    
  }
  
  savemodal() {    
    this.modelService.open('savequery-modal',{})
  }
  saveQueryResponce(responce){
    if (responce) {
      this.reset();
            
    } else {
     this.reset(); 
    }
    this.mySaveQueryData = '';
  }

  loadquerymodal() {
    const criteria = ["status;eq;Active;STATIC"];
    const crList = this.commonFunctionService.getCriteriaList(criteria,{});
    const payload = this.commonFunctionService.getDataForGrid(1, {}, { 'name': 'save_query' }, [], {}, '');
    payload.data.crList = crList;
    this.apiService.getReportLoadGridData(payload)
    this.modelService.open('loadquery-modal',{})
    this.getCollectionName();
  }
  loadQueryResponce(responce){
    if (responce.action == 'load' || responce.action == 'edit') {
      const collection_list = this.staticData['collection_name'];
      const query = responce.data.query;
      this.mySaveQueryData = responce.data;
      const value =  query.value;  
      const index = this.commonFunctionService.getIndexInArrayById(collection_list,value,'FORM_GROUP.collection_name');
      const collection = collection_list[index];
      const data ={
        'collection_name' : collection
      }
      this.getFielsAndColumn(data);
      this.reportForm.get('collection_name').setValue(collection);
      if(collection.FORM_GROUP && collection.FORM_GROUP.collection_name && collection.FORM_GROUP.collection_name != ""){
        const collectionName = collection.FORM_GROUP.collection_name;
        this.reportForm.get('collectionName').setValue(collectionName);
      }
      this.crList = query.crList;
      this.updatemode = true;    
      if(responce.action == 'load'){        
        const getFilterData = {
          data: query,
          path: null
        }
        this.loadQuery(getFilterData);
      }
    } else {
     //this.reset(); 
    }
  }

  exportExcel() {  
    let tempNme = this.reportForm.get('collection_name').value.name;
    if(this.permissionService.checkPermission(tempNme,'export')){  
      let gridName = '';
      let grid_api_params_criteria = [];
     
      const data = this.commonFunctionService.getPaylodWithCriteria(tempNme,'',grid_api_params_criteria,'');     
      delete data.log;
      delete data.key;
      
      if(this.grid && this.grid.export_template && this.grid.export_template != null){
        gridName = this.grid.export_template;
      }else{
        gridName = this.grid._id;
      }
      
      data['key'] = this.storageService.getRefCode();
      data['key3']=gridName;
      data.crList = this.crList;
      const getExportData = {
        data: {
          refCode: this.storageService.getRefCode(),
          log: this.storageService.getUserLog(),
          kvp: data
        },
        responce: { responseType: "arraybuffer" },
        path: tempNme
      }
      var fileName = tempNme;
      fileName = fileName.charAt(0).toUpperCase() + fileName.slice(1)
      this.downloadClick = fileName + '-' + new Date().toLocaleDateString();
      this.apiService.GetExportExclLink(getExportData);
    }else{
      this.notificationService.notify("bg-danger", "Permission denied !!!");
    }
  }


  setExportExcelLink(exportExcelLink:any){
    if (exportExcelLink != '' && exportExcelLink != null && this.downloadClick != '') {
      let link = document.createElement('a');
      link.setAttribute('type', 'hidden');
      const file = new Blob([exportExcelLink], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(file);
      link.href = url;
      link.download = this.downloadClick;
      document.body.appendChild(link);
      link.click();
      link.remove();
      this.downloadClick = '';
      this.apiService.resetGetExportExclLink();
    }
  }

  filterFields(fields:any){
    let filterFields = [];
    fields.forEach(field => {
      if(this.isCheckType(field)){
        filterFields.push(field);
      }
    });
    return filterFields;
  }
  isCheckType(field){
    let check:boolean = true;
    this.disableTypeList.forEach(type => {
      if(field.type == type){
        check = false;
      }
    });
    return check;
  }
  getTimeFormat(field){
    if(field && field.time_format && field.time_format != ''){
      return Number(field.time_format);
    }else{
      return Number('12');
    }    
  }

}
