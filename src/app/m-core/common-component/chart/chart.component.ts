import { Component, OnInit, OnChanges, Input, Output, SimpleChanges, OnDestroy, ViewChild, ElementRef, NgZone, HostListener } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import { CommonFunctionService } from 'src/app/services/common-utils/common-function.service';
import { DataShareService } from 'src/app/services/data-share/data-share.service';
//import { EnvService } from 'src/app/services/env/env.service';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { ModelService } from "src/app/services/model/model.service";
//import { ModalDirective } from 'angular-bootstrap-md';
import * as _moment from 'moment';
import { NotificationService } from 'src/app/services/notify/notification.service';
//import { ConsoleLogger } from '@aws-amplify/core';
// import {default as _rollupMoment} from 'moment';
// const moment = _rollupMoment || _moment;

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
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ],
})
export class ChartComponent implements OnInit, OnDestroy, OnChanges {

  @Input() isShow: string;
  //@ViewChild('basicModal') public basicModal: ModalDirective;
  public chartType:any = {};
  public chartDatasets:any = {};
  public chartLabels:any = {};
  public chartColors:any = {};
  public chartOptions:any = {};
  public chartLegend:any = {};
  public chartTitle:any = {};

  //dashboardFilter:FormGroup;

  checkGetDashletData:boolean=true;
  dashletData:any={};
  //copyDashletData:any={};
  pageNumber:any=1;
  itemNumOfGrid: any = 12;
  noOfItems:any = [
    6,9,12,15,18,21,24
  ]
  elements:any=[];
  staticData: any = {};
  copyStaticData:any={};
  // typeAheadData:any=[];
  tooltipMsg = "Selected chart is less then or equal "+ this.itemNumOfGrid;

  gridDataSubscription;
  staticDataSubscription;
  dashletDataSubscription;
  //typeaheadDataSubscription;

  filterValue:any = [];
  filteredDashboardData:any = [];
  // minDate: Date;
  // maxDate: Date;

  
  total: number;
  showfilter:boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private commonFunctionService:CommonFunctionService,
    private apiService:ApiService,
    private dataShareService:DataShareService,
    //private envService:EnvService,
    private modelService: ModelService,
    private notificationService:NotificationService
  ) { 

    // if(this.envService.getRequestType() == 'PUBLIC'){
    //   this.envService.setRequestType('PRIVATE');
    // }
    this.gridDataSubscription = this.dataShareService.dashletMaster.subscribe(data =>{
      this.setGridData(data);
    })
    this.staticDataSubscription = this.dataShareService.staticData.subscribe(data =>{
      this.setStaticData(data);
    })
    this.dashletDataSubscription = this.dataShareService.dashletData.subscribe(data =>{
      this.setDashLetData(data);
    })
    // this.typeaheadDataSubscription = this.dataShareService.typeAheadData.subscribe(data =>{
    //   this.setTypeaheadData(data);
    // })
    //this.getPage(1)   
    // const currentYear = new Date().getFullYear();
    // this.minDate = new Date(currentYear - 100, 0, 1);
    // this.maxDate = new Date(currentYear + 1, 11, 31); 
  }

  clickFilter:boolean = false;
  filterchart() {    
    if(this.filterValue && this.filterValue.length > 0 && this.filterValue.length <= this.itemNumOfGrid) {
      this.clickFilter = true;
      let value = "";
      this.filterValue.forEach((element,i) => {
        if((this.filterValue.length - 1) == i){
          value = value + element;
        }else{
          value = value + element + ":";
        }
      });
      let cr = "_id;in;"+value+";STATIC";
      this.getPage(1,[cr]);
    }    
  }
  checkFilter(){
    if(this.filterValue && this.filterValue.length == 0){
      this.getPage(1)
    }
  }
  resetFilter(){
    this.filterValue = [];
    if(this.clickFilter){
      this.clickFilter = false;
      this.checkFilter();
    }
  }
  selectNoOfItem(){
    this.getPage(1);
  }
  onKey(value){
    this.copyStaticData['chart_list'] = this.search(value)
  }
  search(value: string) { 
    let filter = value.toLowerCase();
    return this.staticData['chart_list'].filter(option => option.name.toLowerCase().startsWith(filter));
  }


  ngOnChanges(changes: SimpleChanges) {
    if(this.isShow){
      this.getPage(1)
      this.getChartList();
      this.checkGetDashletData = true;
    }
  }
  ngOnDestroy(){
    this.checkGetDashletData = false;
    if(this.gridDataSubscription){
      this.gridDataSubscription.unsubscribe();
    }
    if(this.staticDataSubscription){
      this.staticDataSubscription.unsubscribe();
    }
    if(this.dashletDataSubscription){
      this.dashletDataSubscription.unsubscribe();
    }
    // if(this.typeaheadDataSubscription){
    //   this.typeaheadDataSubscription.unsubscribe();
    // }
  }

  ngOnInit() {
    
  }
  setDashLetData(dashletData:any){
    const dashlet = Object.keys(dashletData)
    if (dashletData && dashlet.length > 0) {
      this.dashletData = dashletData;
      Object.keys(this.dashletData).forEach(key => {                    
        this.chartDatasets[key] = JSON.parse(JSON.stringify(this.dashletData[key]['dataSets']));  
        this.chartLabels[key] = JSON.parse(JSON.stringify(this.dashletData[key]['label']));
        this.chartType[key]=JSON.parse(JSON.stringify(this.dashletData[key]['type']));
        this.chartColors[key]=JSON.parse(JSON.stringify(this.dashletData[key]['colors']));
        this.chartLegend[key]=JSON.parse(JSON.stringify(this.dashletData[key]['legend']));
        this.chartOptions[key]=JSON.parse(JSON.stringify(this.dashletData[key]['options']));
        if(this.dashletData[key]['title']){
          this.chartTitle[key]=JSON.parse(JSON.stringify(this.dashletData[key]['title']));
        }        
      })
    }
  }

  setGridData(gridData){
    if (gridData.data && gridData.data.length > 0) {
      this.elements = JSON.parse(JSON.stringify(gridData.data));
      this.total = gridData.data_size;
      this.filteredDashboardData = JSON.parse(JSON.stringify(this.elements));
      if(this.checkGetDashletData && this.elements.length > 0){
        this.checkGetDashletData = false;
        let forControl = {};
        let formField = [];
        if(this.elements.length > 0){
          // this.elements.forEach(dashlet => {
          //   if(dashlet.fields && dashlet.fields.length > 0){
          //     const groupField = {
          //       "field_name":dashlet.name
          //     }
          //     const list_of_fields = {};
          //     dashlet.fields.forEach(field => {                    
          //       formField.push(field);
          //       switch(field.type){ 
          //         case "date":
          //           field['minDate'] = this.minDate
          //           field['maxDate'] = this.maxDate;
          //           this.commonFunctionService.createFormControl(list_of_fields, field, '', "text")
          //             break; 
          //         case "daterange":
          //           const date_range = {};
          //           let list_of_dates = [
          //             {field_name : 'start'},
          //             {field_name : 'end'}
          //           ]
          //           if (list_of_dates.length > 0) {
          //             list_of_dates.forEach((data) => {
                        
          //               this.commonFunctionService.createFormControl(date_range, data, '', "text")
          //             });
          //           }
          //           this.commonFunctionService.createFormControl(list_of_fields, field, date_range, "group")                                    
          //           break; 
                                            
          //         default:
          //           this.commonFunctionService.createFormControl(list_of_fields, field, '', "text");
          //           break;
          //       }   
          //     });
          //     this.commonFunctionService.createFormControl(forControl, groupField, list_of_fields, "group")
          //   }                 
            
          // });
          // if(formField.length > 0){
          //   let staticModalGroup = this.commonFunctionService.commanApiPayload([],formField,[]);
          //   if(staticModalGroup.length > 0){      
          //     // this.store.dispatch(
          //     //   new CusTemGenAction.GetStaticData(staticModalGroup)
          //     // )
          //     //this.apiService.getStatiData(staticModalGroup);
          //   }
          // }
          // if (forControl) {
          //   this.dashboardFilter = this.formBuilder.group(forControl);              
          // }
          this.getDashletData(this.elements);
        }            
      }          
    } else {
      this.elements = [];
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
  // setTypeaheadData(typeAheadData){
  //   if (typeAheadData.length > 0) {
  //     this.typeAheadData = typeAheadData;
  //   } else {
  //     this.typeAheadData = [];
  //   }
  // }
  getDataForGrid(Criteria:any){    
    const data = this.commonFunctionService.getPaylodWithCriteria('dashlet_master','',Criteria,'');
    data['pageNo'] = this.pageNumber - 1;
    data['pageSize'] = this.itemNumOfGrid; 
    const getFilterData = {
      data: data,
      path: null
    }
    this.apiService.getDashletMster(getFilterData)
  }
  getPage(page: number,criteria?:any) {
    let Criteria:any = [];
    if(criteria && criteria.length > 0){
      Criteria = criteria;
    }
    this.pageNumber = page;
    this.getDataForGrid(Criteria);
    this.checkGetDashletData = true;
  }
  // dashletFilter(item){
  //   const element = [];
  //   const ele = JSON.parse(JSON.stringify(item));
  //   let value = this.dashboardFilter.getRawValue();
  //   const filterData = value[ele.name];
  //   ele[ele.name] = filterData;
  //   element.push(ele);
  //   this.getDashletData(element);
  // }

  //  getddnDisplayVal(val) {
  //   return this.commonFunctionService.getddnDisplayVal(val);    
  // }

  //   getDivClass(field) {
  //   // if(!this.commonFunctionService.showIf(field,this.templateForm.getRawValue())){
  //   //   return "d-none"
  //   // }
  //   return this.commonFunctionService.getDivClass(field,[]);
  // }
  getChartList(){
    const payload = this.commonFunctionService.getPaylodWithCriteria('dashlet_master','chart_list',[],'');
    this.apiService.getStatiData([payload]);
  }
  chartHover(e){}
  chartClicked(e){}
  compareObjects(o1: any, o2: any): boolean {
    return o1._id === o2._id;
  }
  getDashletData(elements){
    if(elements && elements.length > 0){
      let payloads = [];
      //let value = this.dashboardFilter.getRawValue();
      elements.forEach(element => {
        const fields = element.fields;        
        //const filterData = this.getSingleCardFilterValue(element,value);
        let crList = [];
        // if(fields && fields.length > 0){
        //   crList = this.commonFunctionService.getfilterCrlist(fields,filterData);
        // }        
        let object = {}
        // if(filterData){
        //   object = filterData;
        // }
        const data = {
          "data": object,
          "crList":crList
        }
        const payload={
          "_id" : element._id,
          "data" : data
        }
        payloads.push(payload);
      });
      if(payloads && payloads.length > 0 && payloads.length == elements.length){
        this.apiService.GetDashletData(payloads);
      }      
    }
  }
  getSingleCardFilterValue(field,object){
    let value = {};
    if (object && object[field.name]) {
      value = object[field.name]
    }
    return value;
  }
  // getOptionText(option) {
  //   if (option && option.name) {
  //     return option.name;
  //   }else{
  //     return option;
  //   }
  // }
  // updateData(event, parentfield, field) {
  //   if(event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 13 || event.keyCode == 27 || event.keyCode == 9){
  //     return false;
  //   }    
  //   let objectValue = this.getSingleCardFilterValue(parentfield,this.dashboardFilter.getRawValue()); 
  //   this.callTypeaheadData(field,objectValue); 
  // }
  // callTypeaheadData(field,objectValue){
  //   this.clearTypeaheadData();   
  //   const payload = [];
  //   const params = field.api_params;
  //   const criteria = field.api_params_criteria;
  //   payload.push(this.commonFunctionService.getPaylodWithCriteria(params, '', criteria, objectValue,field.data_template));
  //   this.apiService.GetTypeaheadData(payload);    
  // }
  // clearTypeaheadData() {
  //   this.apiService.clearTypeaheadData();
  // }


  showModal(data:any){
    this.showfilter = true;
    let object = {
      'dashboardItem' : data,
      'dashletData' : this.dashletData
    }
    this.modelService.open('chart-filter',object)

  }
  
  showSingleModal(data:any){
    this.showfilter = false;
    let object = {
      'dashboardItem' : data,
      'dashletData' : this.dashletData
    }
    this.modelService.open('chart-filter',object);

  }

  
}
