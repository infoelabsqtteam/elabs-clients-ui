import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { MatChipInputEvent } from '@angular/material/chips';
import { ApiService, CommonFunctionService, DataShareService, ModelService, NotificationService, ApiCallResponceService, ApiCallService, CheckIfService, minieditorConfig } from '@core/web-core';



import { AngularEditorConfig } from '@kolkov/angular-editor';
import { COMMA, ENTER, I, SPACE } from '@angular/cdk/keycodes';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bulk-update',
  templateUrl: './bulk-update.component.html',
  styleUrls: ['./bulk-update.component.scss']
})
export class BulkUpdateComponent implements OnInit {

  editableGridColumns:any = [];
  data:any={};
  notUpdate:any={};
  selectable = true;
  deleteIndex: any;
  parentObj: any;
  removable = true;
  fieldNameForDeletion: any;
  isBulkUpdateOpen:boolean=true;
  typeAheadData: any=[];
  addedDataInList: any;
  typeaheadObjectWithtext;
  term: any={};
  copyStaticData: [] = [];
  typeaheadDataSubscription:Subscription;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  minieditorConfig: AngularEditorConfig = minieditorConfig as AngularEditorConfig;

  @Input() id: string;
  @Output() bulkUpdateResponce = new EventEmitter();
  @ViewChild('bulkUpdateModal') public bulkUpdateModal: ModalDirective;
  @ViewChild('chipsInput') chipsInput: ElementRef<HTMLInputElement>;

  @ViewChild('typeheadInput') typeheadInput: ElementRef<HTMLInputElement>;
  @ViewChild('typeheadchips') typeheadchips: ElementRef<HTMLInputElement>;

  constructor(
    private dataShareService:DataShareService,
    private modalService: ModelService,
    private CommonFunctionService:CommonFunctionService,
    private apiservice:ApiService,
    private notificationService:NotificationService,
    private apiCallService:ApiCallService,
    private checkIfService:CheckIfService
  ) { 
    this.typeaheadDataSubscription = this.dataShareService.typeAheadData.subscribe(data => {
      this.setTypeaheadData(data);
    })
  }

  ngOnInit() {
    let modal = this;
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }
    this.modalService.remove(this.id);
    this.modalService.add(this);
  }
  showModal(alert) {  
    if(alert.editedColumns && alert.editedColumns.length > 0){
      this.editableGridColumns = alert.editedColumns;
      for (let i = 0; i < this.editableGridColumns.length; i++) {
        const column = this.editableGridColumns[i];
        if(column && column.field_name){
          this.data[column.field_name] = alert.data[column.field_name];
          this.notUpdate[column.field_name] = false;
        }        
        // if (column.is_disabled) {
        //   column['disabled'] = true;
        // }else if(column.etc_fields && column.etc_fields.disable_if && column.etc_fields.disable_if != ''){
        //   column['disabled'] = true;
        // }else{
        //   column['disabled'] = false;
        // }        
      }      
      this.copyStaticData = alert.copyStaticData;
    }  
    this.bulkUpdateModal.show();
  }
  closeModal() {
    this.dataShareService.setIsGridSelectionOpenOrNot(true);
    this.typeAheadData = [];
    this.apiservice.clearTypeaheadData();
    this.bulkUpdateModal.hide();
  }
  typeheaderrormsg:any;
  bulkUpdate(){
    Object.keys(this.notUpdate).forEach(key =>{
      if(this.notUpdate[key]){
        delete this.data[key];
      }
    });
    for (let i = 0; i < this.editableGridColumns.length; i++) {
      if(this.editableGridColumns[i].errorMsg) {
        this.typeheaderrormsg = "Data Invalid";
        return;
      }else {
        this.typeheaderrormsg = "";
      }
    }
    this.bulkUpdateResponce.emit(this.data);
    this.closeModal();
  }
  custmizedFormValueData(fieldName) {
    if (this.data && this.data[fieldName.field_name] && this.data[fieldName.field_name].length > 0) {
      return this.data[fieldName.field_name];
    }
  }
  openModal(id, chipIndex, parentObj, fieldName, alertType) {
    this.deleteIndex = chipIndex;
    if (parentObj != '') {
      this.parentObj = parentObj;
      this.fieldNameForDeletion = fieldName;
    }
    this.CommonFunctionService.openAlertModal(id, alertType, 'Are You Sure ?', 'Delete This record.');
  }
  bulkUpdateAlertResponce(responce) {
    if (responce) {
      this.deleteitem()
    } else {
      this.cancel();
    }
  }
  cancel() {
    this.deleteIndex = -1;
    this.fieldNameForDeletion = {};
  }
  deleteitem() {
    this.parentObj[this.fieldNameForDeletion.field_name].splice(this.deleteIndex, 1)
  }
  getddnDisplayVal(val) {
    return this.CommonFunctionService.getddnDisplayVal(val);
  }
  getOptionText(option) {
    if (option && option.name) {
      return option.name;
    } else {
      return option;
    }
  }
  
  searchTypeaheadData(field, currentObject,chipsInputValue) {
    if(chipsInputValue != ''){
      this.typeaheadObjectWithtext = currentObject;
      this.addedDataInList = this.typeaheadObjectWithtext[field.field_name]
      if(this.addedDataInList.name && this.addedDataInList.code) {
        this.typeaheadObjectWithtext[field.field_name] = chipsInputValue;
        delete field["errorMsg"];
      }else {
        field["errorMsg"] = true;
        this.typeheaderrormsg = "";
      }
      this.typeaheadObjectWithtext[field.field_name] = chipsInputValue;

      let call_back_field = '';
      let criteria = [];
      const staticModal = []
      if (field.call_back_field && field.call_back_field != '') {
        call_back_field = field.call_back_field;
      }
      if(field.api_params_criteria && field.api_params_criteria != ''){
        criteria =  field.api_params_criteria;
      }
      let staticModalGroup = this.apiCallService.getPaylodWithCriteria(field.api_params, call_back_field, criteria, this.typeaheadObjectWithtext ? this.typeaheadObjectWithtext : {});
      staticModal.push(staticModalGroup);
      this.apiservice.GetTypeaheadData(staticModal);

      this.typeaheadObjectWithtext[field.field_name] = this.addedDataInList;
    }else{
      this.typeAheadData = [];
      delete field["errorMsg"];
    }
  }
  setTypeaheadData(typeAheadData) {
    if (typeAheadData && typeAheadData.length > 0) {
      this.typeAheadData = typeAheadData;
    } else {
      this.typeAheadData = [];
    }
  }
  compareObjects(o1: any, o2: any): boolean {
    if (o1 != null && o2 != null) {
      return o1._id === o2._id;
    } else {
      return false;
    }

  }
  add(event: MatChipInputEvent, field, chipsInput,data){
    let selectedData = "";
    if(event && event.value){
      selectedData = event.value
    } 
    if(selectedData != ""){  
      this.setData(selectedData,field, chipsInput) 
    }
  }
  setValue(event: MatChipInputEvent, field,chipsInput,data) {
    let selectedData = "";
    if(event && event["option"] && event["option"].value){
      selectedData = event["option"].value
    } 
    if(selectedData != ""){ 
      this.setData(selectedData,field,chipsInput);  
    }
  }
  setData(selectedData, field, chipsInput){
    if(field.type != "typeahead"){
      if (this.data[field.field_name] == null) this.data[field.field_name] = [];
      let duplicacy = this.checkIfService.checkDataAlreadyAddedInListOrNot(field,selectedData,this.data[field.field_name]);
      if(duplicacy && duplicacy.status){
        this.notificationService.notify('bg-danger','Entered value for '+field.label+' is already added. !!!');
      }else{
        this.data[field.field_name].push(selectedData);
      }
      if(this.chipsInput && this.chipsInput.nativeElement && this.chipsInput.nativeElement.value){
        this.chipsInput.nativeElement.value = "";
      }
      if(this.typeheadchips && this.typeheadchips.nativeElement && this.typeheadchips.nativeElement.value){
        this.typeheadchips.nativeElement.value = "";
      }
      if(this.typeheadInput && this.typeheadInput.nativeElement && this.typeheadInput.nativeElement.value){
        this.typeheadInput.nativeElement.value = "";
      }
      chipsInput.value = "";
    }    
    this.typeAheadData = [];
    delete field["errorMsg"];   
  }

}
