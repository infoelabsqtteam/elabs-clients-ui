import { Component, OnInit,OnDestroy } from '@angular/core';
import { CommonFunctionService } from '../../../services/common-utils/common-function.service';
import { StorageService} from '../../../services/storage/storage.service';
import { ApiService } from '../../../services/api/api.service';
import { DataShareService } from '../../../services/data-share/data-share.service';

@Component({
  selector: 'app-gmap-view',
  templateUrl: './gmap-view.component.html',
  styleUrls: ['./gmap-view.component.css']
})
export class GmapViewComponent implements OnInit,OnDestroy {

  elements:any=[];
  userInfo: any;
  currentMenu:any='';
  tab:any=[];
  headElements = [];
  filterForm:any={};
  selectContact:any='';
  staticData: any = {};
  copyStaticData:any={};

  zoom:number = 12;
  lat = 41.85;
  lng = -87.65;

  origin:any = { lat: 29.8174782, lng: -95.6814757 };
  destination:any = { lat: 40.6976637, lng: -74.119764 };
  waypoints:any = [
     {location: { lat: 39.0921167, lng: -94.8559005 }},
     {location: { lat: 41.8339037, lng: -87.8720468 }}
  ];
  gridDataSubscription;
  staticDataSubscription;
  
  constructor(
    private commonFunctionService:CommonFunctionService,
    private storageService: StorageService,
    private apiService:ApiService,
    private dataShareService:DataShareService
  ) { 
    this.gridDataSubscription = this.dataShareService.gridData.subscribe(data =>{
      this.setGridData(data);
    })
    this.staticDataSubscription = this.dataShareService.staticData.subscribe(data =>{
      this.setStaticData(data);
    })
    this.userInfo = this.storageService.GetUserInfo();
    this.currentMenu = this.storageService.GetActiveMenu();
    if (this.currentMenu.name != '') {
      this.getMaplist({});
    }
    const payloadList = [
      {
        "api_params" : 'user',
        "call_back_field" : 'user_list',
        "criteria":[],
        'object' : {}
      }
    ]
    this.getCall(payloadList);
  }
  ngOnDestroy() {
    if(this.gridDataSubscription){
      this.gridDataSubscription.unsubscribe();
    }
    if(this.staticDataSubscription){
      this.staticDataSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
  }

  setGridData(gridData){
    if (gridData) {
      if (gridData.data && gridData.data.length > 0) {
        this.elements = JSON.parse(JSON.stringify(gridData.data))
        this.waypoints =[];
        this.elements.forEach((element,i) => {
          const object  = { 
            "lat": element.latitude, 
            "lng": element.longitude 
          }
          if(i == 0){
            this.origin = object;
          }else if(this.elements.length - 1 == i){
            this.destination = object;
            this.lat = element.latitude;
            this.lng = element.longitude;
          }else{
            this.waypoints.push({"location":object});
          }
        });
      } else {
        this.elements = [];
      }
    }
  }
  setStaticData(staticData){
    if (staticData) {
      this.staticData = staticData; 
      Object.keys(this.staticData).forEach(key => {        
        this.copyStaticData[key] = JSON.parse(JSON.stringify(this.staticData[key]));
      })
    }
  }
  compareObjects(o1: any, o2: any): boolean {
    return o1._id === o2._id;
  }

  getddnDisplayVal(val) {
    return this.commonFunctionService.getddnDisplayVal(val);    
  }
  getCall(payloadList){
    const stati_group = [];
    payloadList.forEach(element => {
      const getCompanyPayload = this.commonFunctionService.getPaylodWithCriteria(element.api_params,element.call_back_field,element.criteria,element.object)
      stati_group.push(getCompanyPayload);
    });
    if(stati_group.length > 0){
      // this.store.dispatch(
      //   new CusTemGenAction.GetStaticData(stati_group)
      // )  
      this.apiService.getStatiData(stati_group);      
    }
  }
  getMaplist(value){
    if(value == undefined || !value._id){
      if(this.copyStaticData['user_list']){
        value = this.copyStaticData['user_list'][0];
      }
    }
    const criteria = []
    if(value != undefined && value._id){
      const cRvalue  = "user._id;eq;"+value._id+";STATIC";
      criteria.push(cRvalue);
      const object = {
        "field_name":"user",
        "type":"text",
        "api_params_criteria":criteria
      }
      this.headElements.push(object);
      const filterValue = {"user":value}
      this.filterForm['value']=filterValue;
    }    
    const pagePayload = this.commonFunctionService.getPage(1,this.tab,this.currentMenu,this.headElements,this.filterForm.getrawvalue(),this.selectContact);
    this.apiService.getGridData(pagePayload);
    this.headElements=[]
    this.filterForm={};
  }

}
