import { Component, OnInit, OnDestroy } from '@angular/core';
import { StorageService } from '../../services/storage/storage.service';
import { CommonFunctionService } from '../../services/common-utils/common-function.service';
import { Router } from '@angular/router';
import { DataShareService } from '../../services/data-share/data-share.service';
import { ApiService } from '../../services/api/api.service';
import { AuthService } from 'src/app/services/api/auth/auth.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  AllModuleList:any=[];
  filterdata = '';
  userinfo:any={};  
  public menuData: any=[];
  getTemplateByMenu:boolean=false;
  module:boolean=true;
  menuDataSubscription;
  constructor(
    private commonFunctionService: CommonFunctionService,
    private router: Router,
    private storageService:StorageService,
    private dataShareService:DataShareService,
    private apiService:ApiService,
    private authService:AuthService
  ) {
    this.menuDataSubscription = this.dataShareService.menu.subscribe(menu =>{
        this.setMenuData(menu);
    })
    this.AllModuleList = this.storageService.GetModules();
    if(this.AllModuleList != undefined && Array.isArray(this.AllModuleList)){
      if(this.AllModuleList.length == 1){
        this.GoToSelectedModule(this.AllModuleList[0]);
      }      
    }else{
      this.module = false;
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.menuDataSubscription){
      this.menuDataSubscription.unsubscribe();
    }
  }
  ngOnInit() {
    
  } 
  setMenuData(menuData){
    if (menuData && menuData.length > 0) {
      this.menuData = menuData;
      if(this.getTemplateByMenu){
        let defaultmenuIndex = 0;
        for (let index = 0; index <  this.menuData.length; index++) {
          if(this.menuData[index].defaultMenu){
            defaultmenuIndex = index;
            break;
          }            
        }
        let defaultSubmenuIndex = -1;
        const defaultMenu =this.menuData[defaultmenuIndex];
        if(defaultMenu.submenu && defaultMenu.submenu.length > 0){
          for (let index = 0; index < defaultMenu.submenu.length; index++) {
            if(defaultMenu.submenu[index].defaultMenu){
              defaultSubmenuIndex = index;
              break;
            }              
          }
          if(defaultSubmenuIndex == -1){
            defaultSubmenuIndex = 0;
          }
        }
        if(defaultSubmenuIndex > -1){
          this.storageService.SetActiveMenu(this.menuData[defaultmenuIndex].submenu[defaultSubmenuIndex]);              
          this.apiService.resetTempData();
          this.apiService.resetGridData();            
          this.router.navigate(['template']);
        }else{
          const menu = this.menuData[defaultmenuIndex];
          if(menu.name == "document_library"){
            this.router.navigate(['vdr']);
          }else if(menu.name == "report"){
            this.router.navigate(['report']);
          }
          else{
            this.storageService.SetActiveMenu(this.menuData[defaultmenuIndex]);              
            this.apiService.resetTempData();
            this.apiService.resetGridData();
            this.router.navigate(['template']);
          }
        }          
      }
      this.getTemplateByMenu = false;
    }
  }  
  GoToSelectedModule(module){
    this.storageService.setModule(module.name); 
    this.dataShareService.sendCurrentPage('DASHBOARD')
    const criteria = "module_name;eq;"+module.name+";STATIC";
    const menuSearchModule = { "value": "menu", key2: module.name }
    const payload = this.commonFunctionService.getPaylodWithCriteria("menu",'',[criteria],{});
    //this.store.dispatch(new MenuActios.GetTempMenu(menuSearchModule))
    //.apiService.GetTempMenu(menuSearchModule);
    this.apiService.GetTempMenu(payload);
    // this.router.navigate(['/admin']);
    this.getTemplateByMenu = true;
    
  }
  gotoHomePage(){
    this.authService.Logout(this.commonFunctionService.gotoHomePage());
    ;
  }

}
