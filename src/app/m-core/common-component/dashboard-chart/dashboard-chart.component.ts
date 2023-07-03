import { Component, OnInit,AfterViewInit,Input, SimpleChanges, OnDestroy } from '@angular/core';
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
import { Subscription } from 'rxjs';
import { StorageService, CommonFunctionService, ApiService, ChartService, ModelService, DataShareService} from '@core/web-core';

@Component({
  selector: 'app-dashboard-chart',
  templateUrl: './dashboard-chart.component.html',
  styleUrls: ['./dashboard-chart.component.css']
})
export class DashboardChartComponent implements OnInit,AfterViewInit,OnDestroy {

  chartIdList:any = [];
  dashboardChartIdList:any = [];
  createdDashbordList:any=[];
  accessToken:string="";
  @Input() showDashboardMongoChart:boolean;
  pageNumber:any=1;
  itemNumOfGrid: any = 6;
  gridDataSubscription:Subscription;
  darkTheme:any={};
  total;
  noOfItems:any = [
    6,9,12,15,18,21,24
  ]
  charts: any;

  constructor(
    private dataShareService:DataShareService,
    private storageService:StorageService,
    private apiService:ApiService,
    private commonFunctionService:CommonFunctionService,
    private modelService:ModelService,
    private chartService:ChartService
  ) {
    this.accessToken = this.storageService.GetIdToken();      
    
      //  this.getPage(1); 
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
     //this.populateDashboardChart();
     
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.gridDataSubscription){
      this.gridDataSubscription.unsubscribe();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(this.showDashboardMongoChart){
      this.subscribe();
      this.getPage(1);
      setTimeout(() => {
        this.populateDashboardChart();
      }, 100);
    }
    
  }
  subscribe(){
    this.gridDataSubscription = this.dataShareService.mongoDbChartList.subscribe(data =>{
      this.total = data.data_size; 
      const chartData = data.data;
      if(chartData && chartData.length > 0){
        this.chartIdList = chartData;
        setTimeout(() => {
          this.populateDashboardChart();
        }, 100);
      }
    })
  }
  populateDashboardChart(){
    if(this.accessToken != "" && this.accessToken != null){      
      let height = '800px';
      if(this.chartIdList && this.chartIdList.length > 0){        
        this.createdDashbordList = [];
        for (let i = 0; i < this.chartIdList.length; i++) {
         // const url = this.chartIdList[i].chartUrl;
         let url = 'https://charts.mongodb.com/charts-nonproduction-cgurq';
          if(url && url != ''){
            const sdk = new ChartsEmbedSDK({
              baseUrl: url, // Optional: ~REPLACE~ with the Base URL from your Embed Chart dialog
              getUserToken: () => this.accessToken
            });
            let chart = this.chartIdList[i];
            // const id = chart.chartId;
            let id ="b2f745ea-8d03-4337-996e-e53e986058d0";
            const idRef = document.getElementById(id);
            if(chart && chart.height && chart.height != ""){
              height = chart.height;
            }
         //   if(idRef){
              let cretedChart = sdk.createDashboard({
                dashboardId: id, // Optional: ~REPLACE~ with the Chart ID from your Embed Chart dialog
                height: height,
                background:'black',
                showAttribution:false,
                showTitleAndDesc:true                
              });
              this.createdDashbordList[id] = cretedChart;
              let test = cretedChart.getImage({encoding:'base64'});
              console.log(test);
              cretedChart
              .render(idRef)
              .catch(() =>
              console.log('Chart failed to initialise')
              // window.alert('Chart failed to initialise')
              );
          //  }
          }
        }        
      }
    }
  }


getChartListFromDashboardId(){
  const data = {
    id: "b2f745ea-8d03-4337-996e-e53e986058d0",
    url: "https://charts.mongodb.com/charts-nonproduction-cgurq",
  };

  const sdk = new ChartsEmbedSDK({
    baseUrl: data.url, // Optional: ~REPLACE~ with the Base URL from your Embed Chart dialog
    getUserToken: () => this.accessToken
  });

  const id = data.id;
  const idRef = document.getElementById(id);

  const cretedChart = sdk.createDashboard({
    dashboardId: data.id, // Optional: ~REPLACE~ with the Chart ID from your Embed Chart dialog
  }).getAllCharts();
   console.log(cretedChart);
}

  filterModel(data:any,filter:any){
    let object = {
      'dashboardItem' : data,
      'dashletData' : "",
      'filter':filter
    }
    this.modelService.open('chart-filter',object);
  }
  download(){
    let chartId = 'b2f745ea-8d03-4337-996e-e53e986058d0';
    let chart = this.createdDashbordList[chartId];
    // if(allCharts && allCharts.length > 0){
    //   allCharts.forEach(chart => {
    //     chart.getData().then(data => {
    //       console.log(data);
    //     })
    //   });
    //}
    // chart.getImage({ encoding: 'base64'}).then((chartdata: string) => { 
    //   console.log(chartdata);   
      
    // }); 
    //this.chartService.getDownloadData(chart,object);
  }  
  changeTheme(object,value){
    let chartId = object.chartId;
    let chart = this.createdDashbordList[chartId];
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
    let cr=["status;eq;Active;STATIC","package_name;eq;mongodb_dashboard;STATIC"];
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
