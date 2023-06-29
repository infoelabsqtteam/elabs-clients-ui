import { Component, Input, OnInit } from '@angular/core';
import { CommonFunctionService, StorageService, PermissionService, DataShareService, ModelService} from '@core/web-core';

@Component({
  selector: 'app-chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.css']
})
export class ChartViewComponent implements OnInit {

  userInfo: any;
  currentMenu:any='';
  pageNumber: number = 1;
  tabs:any=[];
  tab:any=[];
  formName:any='NEW';
  @Input() selectTabIndex:number;
  chartDataSubscription;
  
  constructor(
    private ModalService:ModelService,
    private commonFunctionService:CommonFunctionService,
    private storageService: StorageService,
    private permissionService: PermissionService,
    private dataShareService:DataShareService
    ) { 
    this.chartDataSubscription=this.dataShareService.chartData.subscribe(data =>{
      this.setChartData(data);
    })
    this.userInfo = this.storageService.GetUserInfo();
    this.currentMenu = this.storageService.GetActiveMenu();
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.chartDataSubscription){
      this.chartDataSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
  }
  setChartData(chartData){
    if (chartData) {
       console.log(chartData);
    }
  }

  

  



}
