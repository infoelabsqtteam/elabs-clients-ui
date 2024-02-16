import { Component, OnInit, OnDestroy } from '@angular/core';
import { StorageService, CommonFunctionService, DataShareService, AuthService, MenuOrModuleCommonService, AuthDataShareService} from '@core/web-core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  AllModuleList:any=[];
  filterdata = ''; 
  module:boolean=true;
  settingModelRestSubscription:Subscription;

  constructor(
    private commonFunctionService: CommonFunctionService,
    private storageService:StorageService,
    private dataShareService:DataShareService,
    private authService:AuthService,
    private menuOrModuleCommounService:MenuOrModuleCommonService,
    private authDataShareService:AuthDataShareService
  ) {
    
    this.initialize();
    if(this.AllModuleList != undefined && Array.isArray(this.AllModuleList)){
      if(this.AllModuleList.length == 1){
        this.GoToSelectedModule(this.AllModuleList[0],"");
      }      
    }else{
      this.module = false;
    }

    this.settingModelRestSubscription = this.authDataShareService.settingData.subscribe(data =>{
      this.initialize();
    })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    
  }
  ngOnInit() {
    
  } 
  /**
   * Initialize
   */
  initialize(): void {
    this.AllModuleList = this.storageService.GetModules();
  } 
  GoToSelectedModule(module,event){
    if(event != "" && event.ctrlKey){
      const rout = 'browse/'+module.name;
      this.storageService.setChildWindowUrl(rout);
      window.open(rout, '_blank');
    }else{
      this.menuOrModuleCommounService.setModuleName(module.name); 
      this.dataShareService.sendCurrentPage('DASHBOARD');
      let mIndex = this.commonFunctionService.getIndexInArrayById(this.AllModuleList,module.name,'name');      
      if(mIndex != -1){
        this.dataShareService.setModuleIndex(mIndex);    
      }
    }     
  }
  gotoHomePage(){
    this.authService.Logout(this.commonFunctionService.gotoHomePage());
    ;
  }

}
