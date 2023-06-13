import { Component, OnInit,AfterViewInit,Input, SimpleChanges } from '@angular/core';
import { DataShareService } from '../../../services/data-share/data-share.service';
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
import { StorageService } from '../../../services/storage/storage.service';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../services/api/api.service';
import { CommonFunctionService } from '../../../services/common-utils/common-function.service';
import { ModelService } from 'src/app/services/model/model.service';
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
  @Input() showMongoChart:boolean;
  pageNumber:any=1;
  itemNumOfGrid: any = 6;
  gridDataSubscription:Subscription;
  darkTheme:any={};
  total;
  noOfItems:any = [
    6,9,12,15,18,21,24
  ]

  constructor(
    private dataShareService:DataShareService,
    private storageService:StorageService,
    private apiService:ApiService,
    private commonFunctionService:CommonFunctionService,
    private modelService:ModelService,
    private chartService:ChartService
  ) {
    this.accessToken = this.storageService.GetIdToken();      
    this.gridDataSubscription = this.dataShareService.mongoDbChartList.subscribe(data =>{
    this.total = data.data_size; 
      const chartData = data.data;
      if(chartData && chartData.length > 0){
        this.chartIdList = chartData;
        setTimeout(() => {
          this.populateMongodbChart();
        }, 100);
      }
    })
       this.getPage(1); 
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
      this.getPage(1);
      setTimeout(() => {
        this.populateMongodbChart();
      }, 100);
    }
  }
  populateMongodbChart(){
    if(this.accessToken != "" && this.accessToken != null){      
      let height = '350px';
      if(this.chartIdList && this.chartIdList.length > 0){        
        this.createdChartList = [];
        for (let i = 0; i < this.chartIdList.length; i++) {
          const url = this.chartIdList[i].chartUrl;
          if(url && url != ''){
            const sdk = new ChartsEmbedSDK({
              baseUrl: url, // Optional: ~REPLACE~ with the Base URL from your Embed Chart dialog
              getUserToken: () => this.accessToken
            });
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
              .catch(() =>
              console.log('Chart failed to initialise')
              // window.alert('Chart failed to initialise')
              );
            }
          }
        }        
      }
    }
  }

  filterModel(data:any,filter:any){
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
    this.chartService.getDownloadData(chart,object);
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

  selectNoOfItem(){
    this.getPage(1);
  }


  getPage(page: number,criteria?:any) {
    let Criteria:any = [];
    let cr=["status;eq;Active;STATIC","package_name;eq;mongodb_chart;STATIC"]
    Criteria= cr;
    if(criteria && criteria.length > 0){
      criteria.forEach(data => {
        Criteria.push(data);
      });     
    }
    this.pageNumber = page;
    this.getMongoChartList(Criteria);
  }

}
