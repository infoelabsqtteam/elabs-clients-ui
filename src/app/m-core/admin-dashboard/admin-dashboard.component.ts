import { Component, OnInit ,OnDestroy } from '@angular/core';
import { UntypedFormBuilder, FormControl } from '@angular/forms';
import { AuthDataShareService, DataShareService, StorageService} from '@core/web-core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit,OnDestroy {

  
   userInfo:any = {};
   chartPermission:boolean = false;
   welcometitle:any;
   selected = new FormControl(0);

  
  settingModelRestSubscription:Subscription;

  components = [
    { label: 'Dashbord Count', selector:'app-count-dashbord' },
    { label: 'Chart', selector:'app-mongodb-chart' },
    { label: 'Old Chart', selector:'app-chart' },
    { label: 'Dashboard', selector:'app-dashboard-chart' },
    { label: 'In Progress Records', selector:'app-grid' }
    
  ];
  
  
  constructor(
    public formBuilder: UntypedFormBuilder,
    private dataShareService:DataShareService,
    private storageService:StorageService,
    private authDataShareService:AuthDataShareService
  ) {
      this.welcometitle = this.storageService.getPageTitle();
      this.settingModelRestSubscription = this.authDataShareService.settingData.subscribe(data =>{
        this.initialize();
      })
      
    }

  ngOnDestroy(){
    this.dataShareService.setChartModelShowHide(true);
  }

  ngOnInit(): void {
      this.initialize();  
  }
  /**
   * Initialize
   */
  initialize(): void {
    this.dataShareService.setChartModelShowHide(false);
    this.userInfo = this.storageService.GetUserInfo();
    if(this.userInfo && this.userInfo.chart) {
      this.chartPermission = true;
    }else {
      this.chartPermission = false;
    }
  } 
  
  getTabIndex(event){ 
    this.selected.setValue(event);
  }


  

  

}
