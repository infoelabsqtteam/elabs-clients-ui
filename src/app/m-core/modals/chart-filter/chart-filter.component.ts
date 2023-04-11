import { Component, OnInit, OnChanges, Input, Output, SimpleChanges, OnDestroy, ViewChild, ElementRef, NgZone, HostListener, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';
import { ApiService } from 'src/app/services/api/api.service';
import { CommonFunctionService } from 'src/app/services/common-utils/common-function.service';
import { DataShareService } from 'src/app/services/data-share/data-share.service';
import { EnvService } from 'src/app/services/env/env.service';
import { ModelService } from 'src/app/services/model/model.service';
import { MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as XLSX from 'xlsx';
import { StorageService } from 'src/app/services/storage/storage.service';
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
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
  selector: 'app-chart-filter',
  templateUrl: './chart-filter.component.html',
  styles: [
  ],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
  ],
})
export class ChartFilterComponent implements OnInit {
  
  
  @Input() id: string;
  @ViewChild('chartFilterModal') public chartFilterModal: ModalDirective;  
  dashboardItem :any = {};
  dashletData:any = {};
  accessToken:string="";

  dashboardFilter:FormGroup;

  public chartType:any = {};
  public chartDatasets:any = {};
  public chartLabels:any = {};
  public chartColors:any = {};
  public chartOptions:any = {};
  public chartLegend:any = {};
  public chartTitle:any = {};

  checkGetDashletData:boolean=true;
  staticData: any = {};
  copyStaticData:any={};
  typeAheadData:any=[];
  showFilter:boolean=false;
  createdChartList:any=[];

  staticDataSubscription;
  dashletDataSubscription;
  typeaheadDataSubscription;
  

  minDate: Date;
  maxDate: Date;

  filename = "ExcelSheet.xlsx";
  tableData;
  tableHead;

  constructor(
    private modalService: ModelService,
    public formBuilder: FormBuilder,
    private commonFunctionService:CommonFunctionService,
    private apiService:ApiService,
    private dataShareService:DataShareService,
    private envService:EnvService,
    private storageService: StorageService,
  ) {
    this.accessToken = this.storageService.GetIdToken();
    this.staticDataSubscription = this.dataShareService.staticData.subscribe(data =>{
      this.setStaticData(data);
    })
    this.dashletDataSubscription = this.dataShareService.dashletData.subscribe(data =>{
      this.setDashLetData(data);
    })
    this.typeaheadDataSubscription = this.dataShareService.typeAheadData.subscribe(data =>{
      this.setTypeaheadData(data);
    })
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 100, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31); 
  }


  
  ngOnChanges(changes: SimpleChanges) {
    
  }
  ngOnDestroy(){
    this.checkGetDashletData = false;
    if(this.staticDataSubscription){
      this.staticDataSubscription.unsubscribe();
    }
    if(this.dashletDataSubscription){
      this.dashletDataSubscription.unsubscribe();
    }
    if(this.typeaheadDataSubscription){
      this.typeaheadDataSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    let modal = this;
    if (!this.id) {
        console.error('modal must have an id');
        return;
    }
    this.modalService.remove(this.id);
    this.modalService.add(this);
  }


  setDashLetData(dashletData:any){
    if (dashletData) {
      let dashletValue = {};
      if(this.dashboardItem && this.dashboardItem.call_back_field && dashletData[this.dashboardItem.call_back_field]){
        dashletValue[this.dashboardItem.call_back_field] = dashletData[this.dashboardItem.call_back_field];
        Object.keys(dashletValue).forEach(key => { 
          this.chartDatasets[key] = JSON.parse(JSON.stringify(dashletValue[key]['dataSets']));  
          this.chartLabels[key] = JSON.parse(JSON.stringify(dashletValue[key]['label']));
          this.chartType[key]=JSON.parse(JSON.stringify(dashletValue[key]['type']));
          this.chartColors[key]=JSON.parse(JSON.stringify(dashletValue[key]['colors']));
          this.chartLegend[key]=JSON.parse(JSON.stringify(dashletValue[key]['legend']));
          this.chartOptions[key]=JSON.parse(JSON.stringify(dashletValue[key]['options']));
          this.tableData = this.chartDatasets[key]; 
          this.tableHead = this.chartLabels[key];
          if(dashletValue[key]['title']){
            this.chartTitle[key]=JSON.parse(JSON.stringify(dashletValue[key]['title']));
          }        
        })
      }
    }
  }

  getddnDisplayVal(val) {
    return this.commonFunctionService.getddnDisplayVal(val);    
  }

  getDivClass(field) {
    return this.commonFunctionService.getDivClass(field,[]);
  }
  chartHover(e){}
  chartClicked(e){}
  compareObjects(o1: any, o2: any): boolean {
    return o1._id === o2._id;
  }


  getDashletData(elements){
    if(elements && elements.length > 0){
      let payloads = [];
      let value = {};
      if(this.showFilter){
        value = this.dashboardFilter.getRawValue();
      }
      elements.forEach(element => {
        const fields = element.fields;        
        //const filterData = this.getSingleCardFilterValue(element,value);
        const filterData = value;
        let crList = [];
        if(fields && fields.length > 0){
          crList = this.commonFunctionService.getfilterCrlist(fields,filterData);
        }        
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
        const key = elements[0].call_back_field;
        this.dataShareService.resetDashletDataByKey(key);
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
  getOptionText(option) {
    if (option && option.name) {
      return option.name;
    }else{
      return option;
    }
  }
  updateData(event, field) {
    if(event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 13 || event.keyCode == 27 || event.keyCode == 9){
      return false;
    }    
    //let objectValue = this.getSingleCardFilterValue(field,this.dashboardFilter.getRawValue()); 
    this.callTypeaheadData(field,this.dashboardFilter.getRawValue()); 
  }
  callTypeaheadData(field,objectValue){
    this.clearTypeaheadData();  
    const field_name = field.field_name;
    const value = this.commonFunctionService.getObjectValue(field_name,objectValue);
    if(value && value != ''){
      const payload = [];
      const params = field.api_params;
      const criteria = field.api_params_criteria;
      payload.push(this.commonFunctionService.getPaylodWithCriteria(params, '', criteria, objectValue,field.data_template));
      this.apiService.GetTypeaheadData(payload);  
    }  
  }
  clearTypeaheadData() {
    this.apiService.clearTypeaheadData();
  }




  dashletFilter(item){
    if(item.package_name == "mongodb_chart"){
      this.setFilterInMongodbChart(item);
    }else{
      this.getDashletData([item]);
    }
  }
  getMongodbFilterObject(data){
    let object = {};
    if(Object.keys(data).length > 0){
      Object.keys(data).forEach(key => {
        if(data[key] && data[key] != ''){
          object[key] = data[key];
        }
      });
    }
    return object;
  }
  setFilterInMongodbChart(chart){
    let id = "filter_"+chart.chartId;
    let chartObject = this.createdChartList[id];
    let filterData = this.getMongodbFilterObject(this.dashboardFilter.getRawValue());
    chartObject.setFilter(filterData);
  }
  setFilterForm(dashlet){    
    if(this.checkGetDashletData && dashlet._id && dashlet._id != ''){
      this.checkGetDashletData = false;
      let forControl = {};
      let formField = [];      
      if(dashlet.fields && dashlet.fields.length > 0){
        // const groupField = {
        //   "field_name":dashlet.name
        // }
        //const list_of_fields = {};
        dashlet.fields.forEach(field => {                    
          formField.push(field);
          switch(field.type){ 
            case "date":
              field['minDate'] = this.minDate
              field['maxDate'] = this.maxDate;
              this.commonFunctionService.createFormControl(forControl, field, '', "text")
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
              this.commonFunctionService.createFormControl(forControl, field, date_range, "group")                                    
              break; 
                                      
            default:
              this.commonFunctionService.createFormControl(forControl, field, '', "text");
              break;
          }   
        });
        //this.commonFunctionService.createFormControl(forControl, groupField, list_of_fields, "group")
      } 
      if(formField.length > 0){
        let staticModalGroup = this.commonFunctionService.commanApiPayload([],formField,[]);
        if(staticModalGroup.length > 0){  
          this.apiService.getStatiData(staticModalGroup);
        }
      }
      if (forControl) {
        this.dashboardFilter = this.formBuilder.group(forControl);              
      }
    } 
  }
  setStaticData(staticData){
    if (staticData) {
      this.staticData = staticData;
      Object.keys(this.staticData).forEach(key => {  
        if(this.staticData[key]){      
          this.copyStaticData[key] = JSON.parse(JSON.stringify(this.staticData[key]));
        }
      }) 
    }
  }

  setTypeaheadData(typeAheadData){
    if (typeAheadData.length > 0) {
      this.typeAheadData = typeAheadData;
    } else {
      this.typeAheadData = [];
    }
  }


  showModal(object){
    if(object.dashboardItem){
      this.dashboardItem = object.dashboardItem;
      this.dashletData = object.dashletData;
      this.checkGetDashletData = true;   
      if(object.filter){
        this.showFilter = true;
        this.setFilterForm(this.dashboardItem);
      }else{
        this.showFilter = false;
      }   
      if(this.dashletData && this.dashletData != ''){
        this.setDashLetData(this.dashletData);
      }
      this.chartFilterModal.show();
      if(object.filter){
        this.dashboardFilter.reset();
      }
      if(this.dashboardItem.package_name == "mongodb_chart"){
        setTimeout(() => {
          this.populateMongodbChart(this.dashboardItem);
        }, 100);
      }
    }    
    
  }
  populateMongodbChart(chart){
    if(this.accessToken != "" && this.accessToken != null){
      const sdk = new ChartsEmbedSDK({
        baseUrl: chart.chartUrl, // Optional: ~REPLACE~ with the Base URL from your Embed Chart dialog
        getUserToken: () => this.accessToken
      });
      if(chart && chart.chartId){        
        const id = "filter_"+chart.chartId;
        const idRef = document.getElementById(id);
        let height = "500px";
        if(idRef){
          let cretedChart = sdk.createChart({
            chartId: chart.chartId, // Optional: ~REPLACE~ with the Chart ID from your Embed Chart dialog
            height: height
          });
          this.createdChartList[id] = cretedChart;
          cretedChart
          .render(idRef)
          .catch(() => 
          console.log('Chart failed to initialise')
          //window.alert('Chart failed to initialise')
          );
        }        
      }
    }
  }
  close(item){
    this.checkGetDashletData = false;
    this.reset(item);
    this.chartFilterModal.hide();
  }

  reset(item){
    if(this.dashboardFilter){
      this.dashboardFilter.reset();
    }    
    if(this.showFilter){      
      if(this.dashboardItem.package_name == "mongodb_chart"){
        this.setFilterInMongodbChart(item);
      }else{
        this.getDashletData([item]);
      }
    }    
  }

  exportexcel():void {
    let list = [];
    for (let index = 0; index < this.tableData.length; index++) {
      let row = this.tableData[index];
      const element = {};
      for (let j = 0; j < row.length; j++) {
        let col = this.tableHead[j];
        element[col] = row[j];
      }
      list.push(element);
    }
    const ws:XLSX.WorkSheet = XLSX.utils.json_to_sheet(list);
    const wb:XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,'Sheet1');
    XLSX.writeFile(wb,this.filename);
  }

  chartjsimg: any;
  canvasimg() {
    var canvas = document.getElementById('chartjs') as HTMLCanvasElement;
    this.chartjsimg = canvas.toDataURL('image/png');
  }

  setValue(parentfield,field, add,event?) {    
 
    if (field.type == 'typeahead') {
      this.clearTypeaheadData();
    }

  }


}
