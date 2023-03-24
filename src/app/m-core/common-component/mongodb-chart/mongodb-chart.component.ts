import { Component, OnInit,AfterViewInit,Input, SimpleChanges } from '@angular/core';
import { DataShareService } from '../../../services/data-share/data-share.service';
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
import { StorageService } from '../../../services/storage/storage.service';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { CommonFunctionService } from '../../../services/common-utils/common-function.service';
import { ModelService } from 'src/app/services/model/model.service';
import { chatData } from '../../admin-dashboard/data';
import { ChartService } from 'src/app/services/chart/chart.service';

@Component({
  selector: 'app-mongodb-chart',
  templateUrl: './mongodb-chart.component.html',
  styleUrls: ['./mongodb-chart.component.css']
})
export class MongodbChartComponent implements OnInit,AfterViewInit {

  chartIdList:any = [];
  createdChartList:any=[];
  accessToken:string="";
  mongoChartUrl:string="https://charts.mongodb.com/charts-nonproduction-cgurq";
  @Input() showMongoChart:boolean;
  pageNumber:any=1;
  itemNumOfGrid: any = 12;
  gridDataSubscription:Subscription;
  darkTheme:any={};

  constructor(
    private dataShareService:DataShareService,
    private storageService:StorageService,
    private apiService:ApiService,
    private commonFunctionService:CommonFunctionService,
    private modelService:ModelService,
    private chartService:ChartService
  ) {
      this.getMongoChartList([]);
      this.accessToken = this.storageService.GetIdToken();      
      this.gridDataSubscription = this.dataShareService.mongoDbChartList.subscribe(data =>{
        const chartData = data.data;
        if(chartData.length > 0){
          this.chartIdList = chartData;
          setTimeout(() => {
            this.populateMongodbChart();
          }, 100);
        }
      })      
   }

  getMongoChartList(Criteria){
    const data = this.commonFunctionService.getPaylodWithCriteria('mongo_dashlet_master','',Criteria,'');
      data['pageNo'] = this.pageNumber - 1;
      data['pageSize'] = this.itemNumOfGrid; 
      const getFilterData = {
        data: data,
        path: null
      }
      this.apiService.getMongoDashletMster(getFilterData)
  }

  ngOnInit() {
  }
  ngAfterViewInit(){
     //this.populateMongodbChart();
     
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(this.showMongoChart){
      setTimeout(() => {
        this.populateMongodbChart();
      }, 100);
      
    }
  }
  populateMongodbChart(){
    if(this.accessToken != "" && this.accessToken != null){
      const sdk = new ChartsEmbedSDK({
        baseUrl: this.mongoChartUrl, // Optional: ~REPLACE~ with the Base URL from your Embed Chart dialog
        getUserToken: () => this.accessToken
      });
      let height = '350px';
      if(this.chartIdList && this.chartIdList.length > 0){
        this.createdChartList = [];
        for (let i = 0; i < this.chartIdList.length; i++) {
          let chart = this.chartIdList[i];
          const id = chart.chartId;
          const idRef = document.getElementById(id);
          if(chart && chart.height && chart.height != ""){
            height = chart.height;
          }
          if(idRef){
            let cretedChart = sdk.createChart({
              chartId: id, // Optional: ~REPLACE~ with the Chart ID from your Embed Chart dialog
              height: height
            });
            this.createdChartList[id] = cretedChart;
            cretedChart
            .render(idRef)
            .catch(() => window.alert('Chart failed to initialise'));
          }
        }
        
      }
    }
  }

  filterModel(data:any,filter:any){
    data.fields = [];
    let object = {
      'dashboardItem' : data,
      'dashletData' : "",
      'filter':filter
    }
    this.modelService.open('chart-filter',object);
  }
  download(object){
    let chartId = object.chartId;
    let chart = this.createdChartList[chartId];
    let fileName = object.name;
    let DataList = [];
    DataList = this.chartService.getDownloadData(chart);
    if(DataList && DataList.length > 0){      
      this.chartService.downloadFile(DataList,fileName);
    }

  }  
  changeTheme(object,value){
    let chartId = object.chartId;
    let chart = this.createdChartList[chartId];
    if(value){
      chart.setTheme("dark");
    }else{
      chart.setTheme("light");
    }
  }

}
