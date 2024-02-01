import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ApiCallService, ApiService, CommonFunctionService, CoreFunctionService, DataShareService, ModelService } from '@core/web-core';
import { ModalDirective } from 'angular-bootstrap-md';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-permission-tree-controls',
  templateUrl: './add-permission-tree-controls.component.html',
  styleUrls: ['./add-permission-tree-controls.component.css']
})
export class AddPermissionTreeControlsComponent implements OnInit {

  criteria:FormGroup;
  @Input() id: string;
  @Output() permissionControlResponce = new EventEmitter();
  @ViewChild('permissionControl') public permissionControl: ModalDirective; 

  fieldName:string='';
  listOfFieldUpdateMode={
    crList:false,
    userCrList:false
  };
  custMizedFormValue:any={};  
  list_of_fields:any =[
    {"field_name":"fName","label":"Field Name"},
    {"field_name":"operator","label":"Operator"},
    {"field_name":"fValue","label":"Field Value"}
  ]
  staticDataSubscription:Subscription;
  staticData:any={};


  constructor(
    private modalService:ModelService,
    private fb:FormBuilder,
    private commonFunctionService:CommonFunctionService,
    private coreFunctionService:CoreFunctionService,
    private dataShareServices:DataShareService,
    private apiCallService:ApiCallService,
    private apiService:ApiService
  ) { }

  ngOnInit() {
    let modal = this;
    if (!this.id) {
        console.error('modal must have an id');
        return;
    }
    this.modalService.remove(this.id);
    this.modalService.add(this);
    this.initForm();
  }
  initForm(){
    this.criteria = this.fb.group({
      "selfData": new FormControl(false),
      "crList" : new FormGroup({
          "fName": new FormControl("",Validators.required),
          "operator": new FormControl("",Validators.required),
          "fValue": new FormControl("",Validators.required),
        }),
      "userCrList" : new FormGroup({
        "fName": new FormControl("",Validators.required),
        "operator": new FormControl("",Validators.required),
        "fValue": new FormControl("",Validators.required),
      })
    })
  }
  get crListContral(){
    return this.criteria.controls['crList'];
  }
  get userCrListContral(){
    return this.criteria.controls['userCrList'];
  }
  showModal(alert){ 
    let data = {};
    let tab = {};
    let criteria:any = {};
    if(alert && alert.reference){
      tab = alert.reference;
      data['tab'] = tab;
    } 
    if(alert && alert.criteria){
      criteria = alert.criteria;
    }
    if(alert.item){
      this.fieldName = alert.item;
    }
    if(criteria && criteria['crList']){
      this.custMizedFormValue['crList'] = criteria['crList'];
      this.custMizedFormValue['userCrList'] = criteria['userCrList'];
      if(criteria.selfData) this.criteria.get('selfData').setValue(criteria.selfData);
    }else{
      this.reset();
    }
    this.subscribeStaticData();
    let payload = this.apiCallService.getPaylodWithCriteria("QTMP:GET_GRID_OR_FORM_FIELDS_BY_TAB","",[],data);
    this.apiService.getStatiData([payload]);
    this.permissionControl.show();    
  } 
  reset(){
    this.criteria.reset();
    this.updateIndex={
      crList:-1,
      userCrList:-1
    };
    this.listOfFieldUpdateMode={
      crList:false,
      userCrList:false
    };
    this.deleteIndex = -1;
    this.custMizedFormValue={};
  }
  subscribeStaticData(){
    this.staticDataSubscription = this.dataShareServices.staticData.subscribe(value => {
      this.setStaticData(value);
    });
  }
  setStaticData(data:any){
    if(data && typeof data == "object" && Object.keys(data).length > 0){
      Object.keys(data).forEach(key => {
        this.staticData[key] = data[key];
      });
    }    
  }
  unsbuscribeStaticData(){
    if(this.staticDataSubscription){
      this.staticDataSubscription.unsubscribe();
    }
  }
  closeModal(){    
    this.close();
  }
  close(){
    this.unsbuscribeStaticData();
    this.staticData = {};
    this.permissionControl.hide();
    this.reset();
  }
  selectGridData(){
    let value = this.criteria.getRawValue();
    if(this.custMizedFormValue && Object.keys(this.custMizedFormValue).length > 0){
      Object.keys(this.custMizedFormValue).forEach((key) =>{
        value[key] = this.custMizedFormValue[key];
      })
    }
    this.permissionControlResponce.next(value);
    this.close();
  }
  addCrList(key){
    let crList = this.criteria.get(key).value;
    if(this.listOfFieldUpdateMode[key]){
      let index = this.updateIndex[key];
      this.custMizedFormValue[key][index]=crList;
      this.updateIndex[key]=-1;
      this.listOfFieldUpdateMode[key] = false;
    }else{
      if(!this.custMizedFormValue[key]) this.custMizedFormValue[key]=[];
      this.custMizedFormValue[key].push(crList);
    }    
    this.criteria.get(key).reset();
  }
  updateIndex={
    crList:-1,
    userCrList:-1
  };
  editListOfFiedls(i,key){
    this.updateIndex[key]=i;
    this.listOfFieldUpdateMode[key] = true;
    let data = this.custMizedFormValue[key][i];
    this.criteria.get(key).setValue(data);
  }
  deleteIndex:number=-1;
  deleteKey:string='';
  openModal(i,key){
    this.deleteIndex = i;
    this.deleteKey = key
    this.commonFunctionService.openAlertModal('permission-confirm-modal','delete','Are You Sure ?','Delete This record.');
  }
  permissionAlertResponce(responce){
    if(responce){
      this.custMizedFormValue[this.deleteKey].splice(this.deleteIndex,1);      
    }
    this.deleteIndex = -1;
    this.deleteKey = '';
  }
  compareObjects(o1: any, o2: any): boolean {
    if(o1 != null && o2 != null){
      return o1._id === o2._id;
    }else{
      return false;
    }    
  }
  setValue(fName:string,callBackField:string,key:string){
    if(fName == 'fName'){
      let value = this.criteria.value[key].fName;
      let list = this.staticData['grid_field_list'];
      let index = this.commonFunctionService.getIndexInArrayById(list,value,'field_name');
      let type = list[index].type;
      let operatorType = '';
      switch (type.toLowerCase()) {
        case 'text':
          operatorType = 'string';
          break;
        case 'date' :
          operatorType = 'date';   
        case 'number' :
          operatorType = 'number';  
        default:
          break;
      }
      this.staticData[callBackField] = this.coreFunctionService.getOperators(operatorType);
    }
  }

  
}
