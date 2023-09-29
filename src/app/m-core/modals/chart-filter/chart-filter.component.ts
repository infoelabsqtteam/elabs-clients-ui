import { Component, OnInit, OnChanges, Input, Output, SimpleChanges, OnDestroy, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';
import { MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as XLSX from 'xlsx';
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
import { ApiService, CommonFunctionService, DataShareService, ModelService, StorageService, ChartService } from '@core/web-core';


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
  dashbord:any={}; 

  public chartType:any = {};
  public chartDatasets:any = {};
  public chartLabels:any = {};
  public chartColors:any = {};
  public chartOptions:any = {};
  public chartLegend:any = {};
  public chartTitle:any = {};

  checkGetDashletData:boolean=true;
  
  showFilter:boolean=false;
  createdChartList:any=[];
  filename = "ExcelSheet.xlsx";
  tableData;
  tableHead;
  
  dashletDataSubscription;

  

  constructor(
    private modalService: ModelService,
    public formBuilder: FormBuilder,
    private commonFunctionService:CommonFunctionService,
    private apiService:ApiService,
    private dataShareService:DataShareService,
    private chartService:ChartService,
    private storageService: StorageService,
    private datePipe: DatePipe
  ) {
    this.accessToken = this.storageService.GetIdToken();    
    this.dashletDataSubscription = this.dataShareService.dashletData.subscribe(data =>{
      this.setDashLetData(data);
    })

  }


  
  ngOnChanges(changes: SimpleChanges) {
    
  }
  ngOnDestroy(){
    this.checkGetDashletData = false;    
    if(this.dashletDataSubscription){
      this.dashletDataSubscription.unsubscribe();
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

  
  chartHover(e){}
  chartClicked(e){}

  
  getDashletData(elements,data){
    if(elements && elements.length > 0){
      let payloads = [];
      let value = {};
      if(this.showFilter){
        value = data;
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
  filterData(responce){
    let item = responce.item;
    let data = responce.data;
    if(item && data){
      this.dashletFilter(item,data);
    }    
  }
  dashletFilter(item,data){
    if(item && item.package_name && item.package_name == "mongodb_chart"){
      this.setFilterInMongodbChart(item,data);
    }else{
      this.getDashletData([item],data);
    }
  }
  setFilterInMongodbChart(chart,data){
    let id = "filter_"+chart.chartId;
    let chartObject = this.createdChartList[id];    
    chartObject.setFilter(data);
  }
  
  
  

  


  showModal(object){
    if(object.dashboardItem){
      this.dashboardItem = object.dashboardItem;
      this.dashletData = object.dashletData;
      this.checkGetDashletData = true;   
      if(object.filter){
        this.showFilter = true;
        this.dashbord = this.dashboardItem;
        this.dashbord['classes'] = 'chartfilter px-3 pt-2 mb-3';
       // this.setFilterForm(this.dashboardItem);
      }else{
        this.showFilter = false;
      }   
      if(this.dashletData && this.dashletData != ''){
        this.setDashLetData(this.dashletData);
      }
      this.chartFilterModal.show();
      // if(object.filter){
      //   this.dashboardFilter.reset();
      // }
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
            height: height,
            showAttribution:false
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
    this.chartService.resetChartFilter();
    if(this.showFilter){      
      if(this.dashboardItem.package_name == "mongodb_chart"){
        this.setFilterInMongodbChart(item,{});
      }else{
        this.getDashletData([item],{});
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

  
  async download(object){
    let chartId = "filter_"+object.chartId;
    let chart = this.createdChartList[chartId];    
    let chartdatalist:any =  await this.chartService.getDownloadData(chart,object);
    if(chartdatalist && chartdatalist.url) {
      this.chartService.downlodBlobData(chartdatalist.url, chartdatalist.name);
    }
  } 

}
