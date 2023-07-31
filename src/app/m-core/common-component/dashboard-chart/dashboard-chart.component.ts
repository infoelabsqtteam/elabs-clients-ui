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
  dashboardIdList:any = [];
  dashbord:any={};
  accessToken:string="";
  @Input() showDashboardMongoChart:boolean;
  pageNumber:any=1;
  itemNumOfGrid: any = 25;
  gridDataSubscription:Subscription;
  dashbordSubscription:Subscription;
  darkTheme:any={};

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
      this.populateDashbord(this.dashboardIdList);
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
  populateDashbord(list){
    if(list && list.length > 0){
      this.dashbord = list[0];
      if(this.dashbord && this.dashbord.chartList && this.dashbord.chartList.length > 0){
        let chartList = this.dashbord.chartList;
        let chartIdList = [];
        chartList.forEach(chart => {
          chartIdList.push(chart._id);
        });
        if(chartIdList && chartIdList.length > 0){
          let criteriaList = [];
          let cr = "_id;in;"+chartIdList+";STATIC";
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
          
        }, 100);
      }
    })
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

}
