import { Component, OnInit,AfterViewInit,Input, SimpleChanges, OnDestroy, ViewChild } from '@angular/core';
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
import { Subscription } from 'rxjs';
import { StorageService, CommonFunctionService, ApiService, ChartService, ModelService, DataShareService} from '@core/web-core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-dashboard-chart',
  templateUrl: './dashboard-chart.component.html',
  styleUrls: ['./dashboard-chart.component.css']
})
export class DashboardChartComponent implements OnInit,AfterViewInit,OnDestroy {

  chartIdList:any = [];
  createdChartList:any={};
  dashboardIdList:any = [];
  dashbord:any={};
  dashbordId:string='';
  accessToken:string="";
  @Input() showDashboardMongoChart:boolean;
  pageNumber:any=1;
  itemNumOfGrid: any = 25;
  gridDataSubscription:Subscription;
  dashbordSubscription:Subscription;
  darkTheme:any={};

  @ViewChild('sidefilter') sidefilter: MatSidenav;

  constructor(
    private dataShareService:DataShareService,
    private storageService:StorageService,
    private apiService:ApiService,
    private commonFunctionService:CommonFunctionService,
    private modelService:ModelService,
    private chartService:ChartService
  ) {
    this.accessToken = this.storageService.GetIdToken();     
    this.dashbordSubscription = this.dataShareService.mongoDashbordList.subscribe(data =>{
      this.dashboardIdList = data.data;
      this.populateDashbord(this.dashboardIdList,0);
      console.log(data.data);
    }) 
    
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
      return getFilterData;      
  }
  updateDashbord(){
    if(this.dashbordId && this.dashbordId != ''){
      let dIndex = this.commonFunctionService.getIndexInArrayById(this.dashboardIdList,this.dashbordId);
      this.populateDashbord(this.dashboardIdList,dIndex);
    }
  }
  populateDashbord(list,index){
    if(list && list.length > 0){
      this.dashbord = list[index];
      this.dashbordId = this.dashbord._id;
      if(this.dashbord && this.dashbord.chartList && this.dashbord.chartList.length > 0){
        let chartList = this.dashbord.chartList;
        let ids = "";
        chartList.forEach(chart => {
          let id = chart._id;
          if(ids == ""){
            ids = id; 
          }else{
            ids = ids + ":" + id;
          }
        });
        if(ids != ""){
          let criteriaList = [];
          let cr = "_id;in;"+ids+";STATIC";
          criteriaList.push(cr);
          this.getPage(1,criteriaList);
        }
      }
    }
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
    if(this.dashbordSubscription){
      this.dashbordSubscription.unsubscribe();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(this.showDashboardMongoChart){
      this.subscribe();
      this.getDashbord(1);
      // setTimeout(() => {
      //   this.populateDashboardChart();
      // }, 100);
    }
    
  }
  subscribe(){
    this.gridDataSubscription = this.dataShareService.mongoDbChartList.subscribe(data =>{
      const chartData = data.data;
      if(chartData && chartData.length > 0){
        this.chartIdList = chartData;
        setTimeout(() => {
          this.populateMongodbChart();
        }, 100);
      }
    })
  }
  populateMongodbChart(){
    if(this.accessToken != "" && this.accessToken != null){      
      let height = '350px';
      if(this.chartIdList && this.chartIdList.length > 0){        
        this.createdChartList = {};
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

  filterModel(data:any,filter:any){
    let object = {
      'dashboardItem' : data,
      'dashletData' : "",
      'filter':filter
    }
    this.modelService.open('chart-filter',object);
  }

  selectNoOfItem(){
    this.getPage(1);
  }


  getPage(page: number,criteria?:any) {
    let Criteria:any = [];
    let cr=["status;eq;Active;STATIC","package_name;eq;mongodb_chart;STATIC"];
    Criteria= cr;
    if(criteria && criteria.length > 0){
      criteria.forEach(data => {
        Criteria.push(data);
      });     
    }
    this.pageNumber = page;
    this.apiService.getMongoDashletMster(this.getMongoChartList(Criteria));
  }
  getDashbord(page: number,criteria?:any) {
    let Criteria:any = [];
    let cr=["status;eq;Active;STATIC","package_name;eq;mongodb_dashboard;STATIC"];
    Criteria= cr;
    if(criteria && criteria.length > 0){
      criteria.forEach(data => {
        Criteria.push(data);
      });     
    }
    this.pageNumber = page;
    this.apiService.getMongoDashbord(this.getMongoChartList(Criteria));
  }
  filterData(responce){
    console.log(responce);
    if(this.createdChartList && Object.keys(this.createdChartList).length > 0){
      if(responce && responce.data && typeof responce.data == 'object'){
        Object.keys(this.createdChartList).forEach(key => {
          let chart = this.createdChartList[key];
          chart.setFilter(responce.data);
        });
      }
    }
    this.sidefilter.close();
  }
}
