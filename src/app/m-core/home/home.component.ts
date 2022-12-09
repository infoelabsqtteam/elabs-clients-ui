import { Component, OnInit, OnDestroy } from '@angular/core';
import { StorageService } from '../../services/storage/storage.service';
import { CommonFunctionService } from '../../services/common-utils/common-function.service';
import { DataShareService } from '../../services/data-share/data-share.service';
import { AuthService } from 'src/app/services/api/auth/auth.service';
import { MenuOrModuleCommonService } from 'src/app/services/menu-or-module-common/menu-or-module-common.service';



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
    if(this.AllModuleList != undefined && Array.isArray(this.AllModuleList)){
      if(this.AllModuleList.length == 1){
        this.GoToSelectedModule(this.AllModuleList[0],0);
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
  GoToSelectedModule(module,index){
    this.menuOrModuleCommounService.setModuleName(module.name); 
    this.dataShareService.sendCurrentPage('DASHBOARD');
    this.dataShareService.setModuleIndex(index);    
  }
  gotoHomePage(){
    this.authService.Logout(this.commonFunctionService.gotoHomePage());
    ;
  }

}
