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
  pageNumber: number = 0;
  itemNumOfGrid: any = 25;
  favrotedata;
  favDataSubscription;
  saveResponceSubscription:Subscription;
  userPreferenceSubscription:Subscription;
  
  @Output() moduleSelect = new EventEmitter();

  constructor( 
    private router: Router,
    private storageService:StorageService,
    private permissionService:PermissionService, 
    private notificationService: NotificationService,
    private commonFunctionService:CommonFunctionService,
    private dataShareService:DataShareService,
    private apiService:ApiService,
    private commonfunctionService:CommonFunctionService
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
    this.AllModuleList = this.modifyModuleListWithPermission(moduleList);;
    this.initialize();
  }

  ngAfterViewInit() {
    
  }
  modifyModuleListWithPermission(moduleList){
    let modifyModuleList = [];
    if(moduleList && moduleList.length > 0){
      moduleList.forEach(module => {
        if(module && module.menu_list && module.menu_list.length > 0){
          let menuList = module.menu_list;
          module.menu_list = this.setDisplayInMenuWithPermission(menuList);
          modifyModuleList.push(module);
        }else{
          modifyModuleList.push(module);
        }
      });
    }
    return modifyModuleList;
  }
  setDisplayInMenuWithPermission(menuList){
    let modifyMenuList = [];
    if(menuList && menuList.length > 0){
        for (let index = 0; index < menuList.length; index++) {
            const menu = menuList[index];
            if(menu.submenu && menu.submenu != null){
                let modifySubMenuList = [];
                let check = 0;
                for (let j = 0; j < menu.submenu.length; j++) {
                    const submenu = menu.submenu[j];
                    if(!this.checkPermission(submenu)){
                        submenu['display'] = true;
                        modifySubMenuList.push(submenu);
                        check = 1;
                    }else{
                        submenu['display'] = false;
                        modifySubMenuList.push(submenu);
                    }
                }
                if(check == 1){
                    menu['display'] = true;                        
                }else{
                    menu['display'] = false;
                }
                menu.submenu = modifySubMenuList;
                modifyMenuList.push(menu);
            }else{
                if(!this.checkPermission(menu)){
                    menu['display'] = true;
                    modifyMenuList.push(menu);
                }else{
                    menu['display'] = false;
                    modifyMenuList.push(menu); 
                }
            }                
        }
    }
    return modifyMenuList;
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

  
  
  GoToSelectedModule(module){ 
    // console.log(index)
    const moduleList = this.storageService.GetModules();
    let index = -1;
    moduleList.forEach((elem, i) => {
      if(elem._id == module._id){
        index = i;
      }
    });
    if(index != -1){
      const moduleObject=this.AllModuleList[index];
      this.setAppId(moduleObject);
      this.moduleSelect.emit(index);
    }    
  }
  getTemplateData(module,submenu) {
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
            this.GoToSelectedModule(module);
            this.router.navigate(['template']);  
          }           
        }
    }else{
        this.notificationService.notify("bg-danger", "Permission denied !!!");
    }
}
checkPermission(menu){
  return !this.permissionService.checkPermission(menu.name, 'view')
}
setAppId(module){
  this.storageService.setModule(module.name);
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
