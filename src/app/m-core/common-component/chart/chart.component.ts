import { Component, OnInit, OnChanges, Input, Output, SimpleChanges, OnDestroy, ViewChild, ElementRef, NgZone, HostListener } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import { CommonFunctionService } from 'src/app/services/common-utils/common-function.service';
import { DataShareService } from 'src/app/services/data-share/data-share.service';
import { MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { ModelService } from "src/app/services/model/model.service";
import * as _moment from 'moment';

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
  public chartType:any = {};
  public chartDatasets:any = {};
  public chartLabels:any = {};
  public chartColors:any = {};
  public chartOptions:any = {};
  public chartLegend:any = {};
  public chartTitle:any = {};

  checkGetDashletData:boolean=true;
  dashletData:any={};
  pageNumber:any=1;
  itemNumOfGrid: any = 12;
  noOfItems:any = [
    6,9,12,15,18,21,24
  ]
  elements:any=[];
  staticData: any = {};
  copyStaticData:any={};
  tooltipMsg = "Selected chart is less then or equal "+ this.itemNumOfGrid;

  gridDataSubscription;
  staticDataSubscription;
  dashletDataSubscription;

  filterValue:any = [];
  filteredDashboardData:any = [];
  filterdata = '';
  
  total: number;
  showfilter:boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private commonFunctionService:CommonFunctionService,
    private apiService:ApiService,
    private dataShareService:DataShareService,
    private modelService: ModelService
  ) { 
    this.gridDataSubscription = this.dataShareService.dashletMaster.subscribe(data =>{
      this.setGridData(data);
    })
    this.staticDataSubscription = this.dataShareService.staticData.subscribe(data =>{
      this.setStaticData(data);
    })
    this.dashletDataSubscription = this.dataShareService.dashletData.subscribe(data =>{
      this.setDashLetData(data);
    }) 
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
        if(this.elements.length > 0){
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

  filterModel(data:any,filter:any){
    this.showfilter = true;
    let object = {
      'dashboardItem' : data,
      'dashletData' : this.dashletData,
      'filter':filter
    }
    this.modelService.open('chart-filter',object)

  }

  
}
