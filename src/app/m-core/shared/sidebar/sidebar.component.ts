import { Component, OnInit, ViewChild, ElementRef, AfterViewInit,Output, EventEmitter , Input } from '@angular/core';

import { Router, NavigationEnd } from '@angular/router';
import { StorageService } from '../../../services/storage/storage.service';
import { PermissionService } from '../../../services/permission/permission.service';
import { MENU } from './menu';
import { ApiService } from '../../../services/api/api.service';
import { NotificationService } from 'src/app/services/notify/notification.service';
import { CommonFunctionService } from 'src/app/services/common-utils/common-function.service';
import { DataShareService } from 'src/app/services/data-share/data-share.service';
import { Subscription } from 'rxjs';
import { MenuOrModuleCommonService } from 'src/app/services/menu-or-module-common/menu-or-module-common.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, AfterViewInit {

  menu: any;

  menuItems = [];
  AllModuleList:any=[];
  modal:any='';
  sidebar2 = true;
  saveResponceSubscription:Subscription;
  userPreferenceSubscription:Subscription;
  
  constructor( 
    private router: Router,
    private storageService:StorageService,
    private permissionService:PermissionService, 
    private notificationService: NotificationService,
    private commonFunctionService:CommonFunctionService,
    private dataShareService:DataShareService,
    private apiService:ApiService,
    private commonfunctionService:CommonFunctionService,
    private menuOrModuleCommounService:MenuOrModuleCommonService
  ) {
    
    // this.dataShareService.otherSaveCall.subscribe(responce => {
    //   this.setSaveResponce(responce);
    // })
  }
  saveCallSubscribe(){
    this.saveResponceSubscription = this.dataShareService.saveResponceData.subscribe(responce =>{
      this.setSaveResponce(responce);
    })
  }
  userPreferenceSubscribe(menu,field,parent){
    this.userPreferenceSubscription = this.dataShareService.userPreference.subscribe(responce =>{      
        this.updateUserPreference(menu,field,parent);
    })
  }
  unsubscribe(variable){
    if(variable){
      variable.unsubscribe();
    }
  }

  ngOnInit(): void {
    let moduleList = this.storageService.GetModules();
    this.AllModuleList = this.menuOrModuleCommounService.modifyModuleListWithPermission(moduleList);
    this.initialize();
  }

  ngAfterViewInit() {
    
  }
  

  setSaveResponce(saveFromDataRsponce){
    if (saveFromDataRsponce) {
        if (saveFromDataRsponce.success && saveFromDataRsponce.success != '') {
            if (saveFromDataRsponce.success == 'success') {
                this.commonfunctionService.getUserPrefrerence(this.storageService.GetUserInfo());
            }
        }
    }
    this.unsubscribe(this.saveResponceSubscription);
}

  /**
   * Initialize
   */
  initialize(): void {
    this.menuItems = MENU;
  }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasMenu(item) {
    if(item.menu_list != undefined && item.menu_list != null){
      if(item.menu_list.length > 0){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }
  hasSubMenu(item){
    if(item.submenu != undefined && item.submenu != null){
      if(item.submenu.length > 0){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  
  
  GoToSelectedModule(module,moduleIndex){
      this.menuOrModuleCommounService.setModuleName(module.name);
      this.dataShareService.sendCurrentPage('DASHBOARD')
      if(moduleIndex != -1){
        this.dataShareService.setModuleIndex(moduleIndex);    
      }    
  }
  getTemplateData(module,submenu,moduleIndex) {
    if(this.permissionService.checkPermission(submenu.name,'view')){
        this.storageService.SetActiveMenu(submenu);
        if (submenu.label == "Navigation") {
            this.router.navigate(['Navigation']);
        }
        else if (submenu.label == "Permissions") {
            this.router.navigate(['permissions']);
        }
        else {
          const menu = submenu;
          if(menu.name == "document_library"){
            this.router.navigate(['vdr']);
          }else if(menu.name == "report"){
            this.router.navigate(['report']);
          }
          else{
            this.apiService.resetTempData();
            this.apiService.resetGridData();
            this.GoToSelectedModule(module,-1);
            this.router.navigate(['template']);  
          }           
        }
    }else{
        this.notificationService.notify("bg-danger", "Permission denied !!!");
    }
}
addFebMenu(menu,parent){
  this.commonFunctionService.getUserPrefrerence(this.storageService.GetUserInfo());
  this.userPreferenceSubscribe(menu,'favoriteMenus',parent);
  // this.commonFunctionService.updateUserPreference(menu,'favoriteMenus',parent);
  // this.saveCallSubscribe();
}
updateUserPreference(menu,field,parent){
  this.unsubscribe(this.userPreferenceSubscription);
  this.commonFunctionService.updateUserPreference(menu,field,parent);
  this.saveCallSubscribe();
}
checkFebMenuAddOrNot(menu,parent){
  let menuId = menu._id;
  if(parent != ''){
    menuId = parent._id;
  }
  let userFebMenu = this.commonFunctionService.getUserPreferenceByFieldName('favoriteMenus');
  if(userFebMenu && userFebMenu != null && userFebMenu.length > 0){
    let match = -1;
    for (let index = 0; index < userFebMenu.length; index++) {
      const element = userFebMenu[index];
      if(element._id == menuId ){
        match = index;
        break;
      }     
    }
    if(match > -1){
      if(parent != ''){
        const submenu = userFebMenu[match]['submenu'];
        let subMatchIndex = -1;
        if(submenu && submenu.length > 0){
          for (let j = 0; j < submenu.length; j++) {
            const subMenu = submenu[j];
            if(subMenu._id == menu._id){
              subMatchIndex = j;
              break;
            }
            
          }
        }
        if(subMatchIndex > -1){
          return true
        }else{
          return false;
        }
      }else{
        return true;
      }      
    }else{
      return false;
    }
  }else{
    return false;
  }
}

}
