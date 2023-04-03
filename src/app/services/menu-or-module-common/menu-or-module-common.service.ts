import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api/api.service';
import { AuthService } from '../api/auth/auth.service';
import { CommonFunctionService } from '../common-utils/common-function.service';
import { DataShareService } from '../data-share/data-share.service';
import { NotificationService } from '../notify/notification.service';
import { PermissionService } from '../permission/permission.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class MenuOrModuleCommonService {

constructor(
  private storageService: StorageService, 
  private permissionService:PermissionService,
  private commonFunctionService:CommonFunctionService,
  private dataShareService:DataShareService,
  private notificationService:NotificationService,
  private apiService:ApiService,
  private router:Router,
  private authService:AuthService
) { }

  modifyModuleListWithPermission(moduleList){
    let modifyModuleList = [];
    if(moduleList && moduleList.length > 0){
      moduleList.forEach(module => {
        if(module && module.menu_list && module.menu_list.length > 0){
          let menuList = module.menu_list;
          module.menu_list = this.setDisplayInMenuWithPermission(menuList);
          if(this.setDisplayInModuleWithPermission(module.menu_list)){
            module['display'] = true;
          }else{
            module['display'] = false;
          }
          modifyModuleList.push(module);
        }else{
          modifyModuleList.push(module);
        }
      });
    }
    return modifyModuleList;
  }
  getDefaultMenuIndex(menuList){    
    let defaultmenuIndex = 0;
    let defaultSubmenuIndex = -1;
    let defaultIndexs = {
      'defaultmenuIndex':defaultmenuIndex,
      'defaultSubmenuIndex' :defaultSubmenuIndex
    };
    if(menuList && menuList.length > 0){ 
      defaultmenuIndex = this.getDefaultIndex(menuList)         
      const defaultMenu =menuList[defaultmenuIndex];
      if(defaultMenu.submenu && defaultMenu.submenu.length > 0){
        defaultSubmenuIndex = this.getDefaultIndex(defaultMenu.submenu);
        if(defaultSubmenuIndex == -1){
          defaultSubmenuIndex = 0;
        }
      }
    }
    defaultIndexs.defaultmenuIndex = defaultmenuIndex;
    defaultIndexs.defaultSubmenuIndex = defaultSubmenuIndex;
    return defaultIndexs;
  }
  getDefaultIndex(menuList){
    let defaultmenuIndex = 0;
    if(menuList && menuList.length > 0){ 
      for (let index = 0; index <  menuList.length; index++) {
        if(menuList[index].defaultMenu){
          defaultmenuIndex = index;
          break;
        }            
      } 
    }
    return defaultmenuIndex;
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
  setDisplayInModuleWithPermission(menuList){
    let check = false;
    if(menuList && menuList.length > 0){
      for (let index = 0; index < menuList.length; index++) {
        const menu = menuList[index];
        if(menu.submenu && menu.submenu != null){
          for (let j = 0; j < menu.submenu.length; j++) {
            const submenu = menu.submenu[j];
            if(submenu.display){
              check = true;
              break;
            }            
          }
        }else{
          if(menu.display){
            check = true;
            break;
          }
        }        
      }
    }
    return check;
  }
  getDefaultMenu(menuList){
      let menu:any = {};
      let defaultMenu:any = {};
      let defaultMenuIndexs = this.getDefaultMenuIndex(menuList);
      menu['indexs'] = defaultMenuIndexs;
      if(defaultMenuIndexs.defaultSubmenuIndex > -1){
          defaultMenu = menuList[defaultMenuIndexs.defaultmenuIndex].submenu[defaultMenuIndexs.defaultSubmenuIndex];
      }else{
          defaultMenu = menuList[defaultMenuIndexs.defaultmenuIndex];
      }

      if(defaultMenu.display){
        menu['menu'] = defaultMenu; 
      }else{
          menu['menu'] = this.findMenuWithPermission(menuList);
      }
      return menu;
  }
  findMenuWithPermission(menuList){
      let modifyMenu = {};
      if(menuList && menuList.length > 0){
          for (let index = 0; index < menuList.length; index++) {
              const menu = menuList[index];
              if(menu.display && menu.submenu && menu.submenu != null){
                  for (let j = 0; j < menu.submenu.length; j++) {
                      const submenu = menu.submenu[j];
                      if(submenu.display){
                          modifyMenu = submenu;
                          break;
                      }
                  }
              }else{
                  if(menu.display){
                      modifyMenu = menu;
                      break;
                  }
              }                
          }
      }
      return modifyMenu;
  }
  setModuleName(moduleName){
    this.storageService.setModule(moduleName);
  }
  getModuleIndexById(moduleId){
    let moduleList = this.storageService.GetModules();
    return this.commonFunctionService.getIndexInArrayById(moduleList,moduleId);    
  }
  shareMenuIndex(menuIndex,subMenuIndex,moduleIndex?){
    let indexs = {};
    indexs['menuIndex'] = menuIndex;
    indexs['submenuIndex'] = subMenuIndex;
    indexs['moduleIndex'] = moduleIndex;
    this.dataShareService.setMenuIndexs(indexs);
}
  getIndexsByMenuName(menuList,menuName){
    let indexs= {
      'menuindex':-1,
      'submenuindex':-1
    }
    for (let index = 0; index < menuList.length; index++) {
      const menu = menuList[index];
      if(menu.name == menuName){
        indexs.menuindex = index;
        indexs.submenuindex = -1;
      }else{
        if(menu.submenu && menu.submenu.length > 0){
          for (let j = 0; j < menu.submenu.length; j++) {
            const subMenu = menu.submenu[j];
            if(subMenu.name == menuName){
              indexs.menuindex = index;
              indexs.submenuindex = j;
            }
          }
        }
      }      
    }
    return indexs;
  }
  getMenuNameById(module,menuId,submenuId,key?){
    let menuName:any = {};
    let menuList = module.menu_list;
    let menuIndex = this.commonFunctionService.getIndexInArrayById(menuList,menuId,key);
    menuName['menuIndex'] = menuIndex;
    let menu = menuList[menuIndex];    
    if(submenuId != ""){
      if(menu.submenu){
        let subMenuList = menu.submenu;
        if(subMenuList && subMenuList.length > 0){
            let subMenuIndex = this.commonFunctionService.getIndexInArrayById(subMenuList,submenuId,key);
            menuName['subMenuIndex'] = subMenuIndex;
            let submenu = subMenuList[subMenuIndex];
            menuName['name'] = submenu.name;
        }
      }
    }else{
      menuName['name'] = menu.name;
    }
    return menuName;
  }
  checkPermission(menu){
      return !this.permissionService.checkPermission(menu.name, 'view')
  }
  getTemplateData(module,submenu) {
    if(submenu && submenu.name && this.permissionService.checkPermission(submenu.name,'view')){
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
            const route = 'browse/'+module.name+"/"+submenu.name;
            //console.log(route);
            this.router.navigate([route]);  
            //this.router.navigate(['template']);  
          }           
        }
    }else{
      this.checkTokenStatusForPermission();       
    }
  }
  checkTokenStatusForPermission(){
    let getTokenStatus = this.authService.checkIdTokenStatus()
    if(getTokenStatus.status){
      this.notificationService.notify("bg-danger", "Permission denied !!!");
    }else{
      if(getTokenStatus.msg != ""){
        this.notificationService.notify("bg-info", getTokenStatus.msg);
      }
      this.authService.gotToSigninPage();
    }
  }
  GoToSelectedModule(item){        
    if(item && item.name){           
        this.setModuleName(item.name);
    }
    this.dataShareService.sendCurrentPage('DASHBOARD');
  }

}
