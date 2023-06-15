import { Component, OnInit, OnDestroy } from '@angular/core';
import { StorageService, CommonFunctionService, DataShareService, AuthService, MenuOrModuleCommonService} from '@core/service-lib';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  AllModuleList:any=[];
  filterdata = ''; 
  module:boolean=true;

  constructor(
    private commonFunctionService: CommonFunctionService,
    private storageService:StorageService,
    private dataShareService:DataShareService,
    private authService:AuthService,
    private menuOrModuleCommounService:MenuOrModuleCommonService
  ) {
    
    let moduleList = this.storageService.GetModules();
    this.AllModuleList = this.menuOrModuleCommounService.modifyModuleListWithPermission(moduleList);
    this.storageService.SetModifyModules(this.AllModuleList);
    if(this.AllModuleList != undefined && Array.isArray(this.AllModuleList)){
      if(this.AllModuleList.length == 1){
        this.GoToSelectedModule(this.AllModuleList[0],"");
      }      
    }else{
      this.module = false;
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    
  }
  ngOnInit() {
    
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
