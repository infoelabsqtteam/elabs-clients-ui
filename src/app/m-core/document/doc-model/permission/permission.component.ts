import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators,FormGroupDirective,FormControlDirective,FormControlName } from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';
import { ApiService } from 'src/app/services/api/api.service';
import { DocApiService } from 'src/app/services/api/doc-api/doc-api.service';
import { CommonFunctionService } from 'src/app/services/common-utils/common-function.service';
import { DataShareService } from 'src/app/services/data-share/data-share.service';
import { NotificationService } from 'src/app/services/notify/notification.service';
import { ModelService } from '../../../../services/model/model.service';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styles: [
  ]
})
export class PermissionComponent implements OnInit {

  @Input() id: string;
  @Output() permissionResponce = new EventEmitter();
  @ViewChild('permissionModal') public permissionModal: ModalDirective; 
  @Input() pathList;
  @Input() folder:any;
 
  permissionForm: FormGroup;
  typeaheadDataSubscription;
  typeAheadData: string[] = [];

  listOfPermission:any = [];
  colums = [
    { 'label' : 'User', 'field_name' : 'user.name', 'type': 'text'},
    { 'label' : 'Authorize', 'field_name' : 'authoriser','type': 'text'},
    { 'label' : 'Read', 'field_name' : 'viewer','type': 'text'},
    { 'label' : 'Write', 'field_name' : 'creator','type': 'text'},
    { 'label' : 'Download', 'field_name' : 'downloader','type': 'text'}
  ]
  

  constructor(
    private modelService:ModelService,
    private formBuilder: FormBuilder,
    private commonFunctionService:CommonFunctionService,
    private apiService:ApiService,
    private dataShareService:DataShareService,
    private notificationService:NotificationService,
    private docApiService:DocApiService
    ) {
      this.typeaheadDataSubscription = this.dataShareService.typeAheadData.subscribe(data =>{
        this.setTypeaheadData(data);
      })
    }

  ngOnInit(): void {
    let modal = this;
      if (!this.id) {
          console.error('modal must have an id');
          return;
      }
      this.modelService.remove(this.id);
      this.modelService.add(this);
      this.initForm();
  }
  initForm(){
    this.permissionForm = this.formBuilder.group({
      "user" : new FormControl('',Validators.required),
      "authoriser" : new FormControl(false),
      "viewer" : new FormControl(false),
      "creator" : new FormControl(false),
      "downloader" : new FormControl(false),
    })
  }


  setTypeaheadData(typeAheadData){
    if (typeAheadData.length > 0) {
      this.typeAheadData = typeAheadData;
    } else {
      this.typeAheadData = [];
    }
  }

  showModal(object){
    this.permissionModal.show()     
  }
  close(){
    this.permissionModal.hide();
  }

  savePermission() {
    const folder = this.folder;
    if(this.listOfPermission.length > 0){
      folder['permission'] = this.listOfPermission
      this.docApiService.SetDocPermission(folder);
      this.close();
    }

  }



  updateData(event) {
    if(event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 13 || event.keyCode == 27 || event.keyCode == 9){
      return false;
    }  
    let keyValue = event.target.value;
    let criteria = "altname;stwic;" + keyValue + ";STATIC"; 
    let field = {
      'api_params': 'user',
      'api_params_criteria': [criteria]
    }
    let objectValue = this.permissionForm.getRawValue();
    this.callTypeaheadData(field,objectValue);      
  }

  callTypeaheadData(field,objectValue){
    this.clearTypeaheadData();   
    const payload = [];
    const params = field.api_params;
    const criteria = field.api_params_criteria;
    payload.push(this.commonFunctionService.getPaylodWithCriteria(params, '', criteria, objectValue,field.data_template));
    this.apiService.GetTypeaheadData(payload);    
  }

  clearTypeaheadData() {
    this.apiService.clearTypeaheadData();
  }


  getOptionText(option) {
    if (option && option.name) {
      return option.name;
    }else{
      return option;
    }
  }



  getddnDisplayVal(val) {
    return this.commonFunctionService.getddnDisplayVal(val);    
  }

  addPermission() {
    let value = this.permissionForm.getRawValue();
    let primary_key_field_name = 'user._id';
      let primary_key_field_value = value['user']['_id'];
      let list = this.listOfPermission;
      let alreadyAdded = this.checkDataAlreadyAddedInListOrNot(primary_key_field_name,primary_key_field_value,list);
      if(alreadyAdded){
        this.notificationService.notify('bg-danger','Entered value for user is already added. !!!');
        return;
      }
      this.listOfPermission.push(value);
      this.resetForm();

  }

  checkDataAlreadyAddedInListOrNot(primary_key,incomingData,alreadyDataAddedlist){
    if(alreadyDataAddedlist == undefined){
      alreadyDataAddedlist = [];
    }
    let alreadyExist = "false";
    if(typeof incomingData == 'object'){
      alreadyDataAddedlist.forEach(element => {
        if(element._id == incomingData._id){
          alreadyExist =  "true";
        }
      });
    }
    else if(typeof incomingData == 'string'){
      alreadyDataAddedlist.forEach(element => {
        if(typeof element == 'string'){
          if(element == incomingData){
            alreadyExist =  "true";
          }
        }else{
          if(this.commonFunctionService.getObjectValue(primary_key,element) == incomingData){
            alreadyExist =  "true";
          }
        }
      
      });
    }else{
      alreadyExist =  "false";
    }
    if(alreadyExist == "true"){
      return true;
    }else{
      return false;
    }
  }

  getValueForGrid(field, object) {
    return this.commonFunctionService.getValueForGrid(field, object);
  }

  checkValidator() {
    return !this.permissionForm.valid;
  }
  resetForm(){
    this.permissionForm.reset();
    this.colums.forEach(element =>{
      if(element.field_name != 'user.name'){
        this.permissionForm.get(element.field_name).setValue(false);
      }
    })

  }
  
}
