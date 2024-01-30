import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ApiCallService, ApiService, CommonFunctionService, DataShareService, ModelService } from '@core/web-core';
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
  listOfFieldUpdateMode:boolean=false;
  ListOfCrList:any=[];
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
      "crList" : new FormGroup({
          "fName": new FormControl("",Validators.required),
          "operator": new FormControl("",Validators.required),
          "fValue": new FormControl("",Validators.required),
        })
    })
  }
  get crListContral(){
    return this.criteria.controls['crList'];
  }
  showModal(alert){ 
    let data = {};
    let tab = {};
    let criteria = {};
    if(alert && alert.reference){
      tab = alert.reference;
      data['tab'] = tab;
    } 
    if(alert && alert.criteria){
      criteria = alert.criteria;
    }
    if(criteria && criteria['crList']){
      this.ListOfCrList = criteria['crList'];
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
    this.updateIndex=-1;
    this.listOfFieldUpdateMode = false;
    this.deleteIndex = -1;
    this.ListOfCrList=[];
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
    value['crList'] = this.ListOfCrList;
    this.permissionControlResponce.next(value);
    this.close();
  }
  addCrList(){
    let crList = this.criteria.get('crList').value;
    if(this.listOfFieldUpdateMode){
      this.ListOfCrList[this.updateIndex]=crList;
      this.updateIndex=-1;
      this.listOfFieldUpdateMode = false;
    }else{
      this.ListOfCrList.push(crList);
    }    
    this.criteria.get('crList').reset();
  }
  updateIndex:number=-1;
  editListOfFiedls(i){
    this.updateIndex=i;
    this.listOfFieldUpdateMode = true;
    let data = this.ListOfCrList[i];
    this.criteria.get('crList').setValue(data);
  }
  deleteIndex:number=-1;
  openModal(i){
    this.deleteIndex = i;
    this.commonFunctionService.openAlertModal('permission-confirm-modal','delete','Are You Sure ?','Delete This record.');
  }
  permissionAlertResponce(responce){
    if(responce){
      this.ListOfCrList.splice(this.deleteIndex,1);
      this.deleteIndex = -1;
    }
  }
  compareObjects(o1: any, o2: any): boolean {
    if(o1 != null && o2 != null){
      return o1._id === o2._id;
    }else{
      return false;
    }    
  }
  setValue(){

  }

}
