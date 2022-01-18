import { Component, OnInit, OnChanges, Input, Output, SimpleChanges, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import { CommonFunctionService } from 'src/app/services/common-utils/common-function.service';
import { DataShareService } from 'src/app/services/data-share/data-share.service';
import { EnvService } from 'src/app/services/env/env.service';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
// import {default as _rollupMoment} from 'moment';
// const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class ChartComponent implements OnInit, OnDestroy, OnChanges {

  @Input() isShow: string;

  public chartType:any = {};
  public chartDatasets:any = {};
  public chartLabels:any = {};
  public chartColors:any = {};
  public chartOptions:any = {};
  public chartLegend:any = {};
  public chartTitle:any = {};

  dashboardFilter:FormGroup;

  checkGetDashletData:boolean=true;
  dashletData:any={};
  copyDashletData:any={};
  pageNumber:any=1;
  itemNumOfGrid: any = 100;
  elements:any=[];
  staticData: any = {};
  copyStaticData:any={};

  gridDataSubscription;
  staticDataSubscription;
  dashletDataSubscription;

  filterValue:any = [];
  filteredDashboardData:any = [];
  chartTable = false;
  minDate: Date;
  maxDate: Date;

  constructor(
    public formBuilder: FormBuilder,
    private commonFunctionService:CommonFunctionService,
    private apiService:ApiService,
    private dataShareService:DataShareService,
    private envService:EnvService
  ) { 

    if(this.envService.getRequestType() == 'PUBLIC'){
      this.envService.setRequestType('PRIVATE');
    }
    this.gridDataSubscription = this.dataShareService.dashletMaster.subscribe(data =>{
      this.setGridData(data);
    })
    this.staticDataSubscription = this.dataShareService.staticData.subscribe(data =>{
      this.setStaticData(data);
    })
    this.dashletDataSubscription = this.dataShareService.dashletData.subscribe(data =>{
      this.setDashLetData(data);
    })
    this.getPage(1)   
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 100, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31); 
  }

  
 formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  filterchart() {
    this.filteredDashboardData = [];
    if(this.filterValue && this.filterValue.length > 0) {
      this.filterValue.forEach(element => {
        const index = this.commonFunctionService.getIndexInArrayById(this.elements, element);
        this.filteredDashboardData.push(this.elements[index]);
      });

      // for (let index = 0; index < this.elements.length; index++) {
      //   const element = this.elements[index];
      //   if(element._id == this.filterValue) {
      //     this.filteredDashboardData.push(element);
      //     break;
      //   }
      // }
    } else {
      this.filteredDashboardData = JSON.parse(JSON.stringify(this.elements));
    }
    
  }


  ngOnChanges(changes: SimpleChanges) {
    if(this.isShow){
      this.getPage(1)
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
  }

  ngOnInit() {
  }
  setDashLetData(dashletData:any){
    if (dashletData) {
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
      this.filteredDashboardData = JSON.parse(JSON.stringify(this.elements));
      if(this.checkGetDashletData && this.elements.length > 0){
        this.checkGetDashletData = false;
        let forControl = {};
        let formField = [];
        if(this.elements.length > 0){
          this.elements.forEach(dashlet => {
            if(dashlet.fields && dashlet.fields.length > 0){
              const groupField = {
                "field_name":dashlet.name
              }
              const list_of_fields = {};
              dashlet.fields.forEach(field => {                    
                formField.push(field);
                switch(field.type){ 
                  case "date":
                    field['minDate'] = this.minDate
                    field['maxDate'] = this.maxDate;
                    this.commonFunctionService.createFormControl(list_of_fields, field, '', "text")
                      break; 
                  case "daterange":
                    const date_range = {};
                    let list_of_dates = [
                      {field_name : 'start'},
                      {field_name : 'end'}
                    ]
                    if (list_of_dates.length > 0) {
                      list_of_dates.forEach((data) => {
                        
                        this.commonFunctionService.createFormControl(date_range, data, '', "text")
                      });
                    }
                    this.commonFunctionService.createFormControl(list_of_fields, field, date_range, "group")                                    
                    break; 
                                            
                  default:
                    this.commonFunctionService.createFormControl(list_of_fields, field, '', "text");
                    break;
                }   
              });
              this.commonFunctionService.createFormControl(forControl, groupField, list_of_fields, "group")
            }                 
            
          });
          if(formField.length > 0){
            let staticModalGroup = this.commonFunctionService.commanApiPayload([],formField,[]);
            if(staticModalGroup.length > 0){      
              // this.store.dispatch(
              //   new CusTemGenAction.GetStaticData(staticModalGroup)
              // )
              this.apiService.getStatiData(staticModalGroup);
            }
          }
          if (forControl) {
            this.dashboardFilter = this.formBuilder.group(forControl);              
          }
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
  getDataForGrid(){    
    const data = this.commonFunctionService.getPaylodWithCriteria('dashlet_master','',[],'');
    data['pageNo'] = this.pageNumber - 1;
    data['pageSize'] = this.itemNumOfGrid; 
    const getFilterData = {
      data: data,
      path: null
    }
    //this.store.dispatch(new CusTemGenAction.GetGridData(getFilterData))
    this.apiService.getDashletMster(getFilterData)
  }
  getPage(page: number) {
    this.pageNumber = page;
    this.getDataForGrid();
  }
  dashletFilter(index){
    const ele = JSON.parse(JSON.stringify(this.elements[index]));
    let value = this.dashboardFilter.getRawValue();
    const filterData = value[ele.name];
    ele[ele.name] = filterData;
    this.apiService.GetDashletData(ele);
  }

   getddnDisplayVal(val) {
    return this.commonFunctionService.getddnDisplayVal(val);    
  }

    getDivClass(field) {
    // if(!this.commonFunctionService.showIf(field,this.templateForm.getRawValue())){
    //   return "d-none"
    // }
    return this.commonFunctionService.getDivClass(field);
  }
  chartHover(e){}
  chartClicked(e){}
  compareObjects(o1: any, o2: any): boolean {
    return o1._id === o2._id;
  }
  getDashletData(elements){
    if(elements && elements.length > 0){
      elements.forEach(element => {
        let value = this.dashboardFilter.getRawValue();
        const filterData = value[element.name];
        let object = {}
        if(filterData){
          object = filterData;
        }
        const data = {
          "data": object
        }
        const payload={
          "_id" : element._id,
          "data" : data
        }
        this.apiService.GetDashletData(payload);
      });
    }
  }


  changeChartView() {
    this.chartTable = !this.chartTable;
  }











}
