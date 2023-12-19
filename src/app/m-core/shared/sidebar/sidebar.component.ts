import { Component, OnInit, ViewChild, ElementRef, AfterViewInit,Output, EventEmitter , Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MENU } from './menu';
import { Subscription } from 'rxjs';
import { StorageService, CommonFunctionService, DataShareService, MenuOrModuleCommonService, ApiCallService } from '@core/web-core';

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
  moduleIndex:number=-1;
  menuIndex:number=-1;
  subMenuIndex:number=-1;
  saveResponceSubscription:Subscription;
  userPreferenceSubscription:Subscription;
  moduleIndexSubscription:Subscription;
  menuIndexSubscription:Subscription;
  
  constructor( 
    private storageService:StorageService,
    private commonFunctionService:CommonFunctionService,
    private dataShareService:DataShareService,
    private commonfunctionService:CommonFunctionService,
    private menuOrModuleCommounService:MenuOrModuleCommonService,
    private apiCallService:ApiCallService
  ) {
    
    // this.dataShareService.otherSaveCall.subscribe(responce => {
    //   this.setSaveResponce(responce);
    // })
    this.moduleIndexSubscription = this.dataShareService.moduleIndex.subscribe(index =>{
      if(index != -1){
          this.moduleIndex = index;
      }else{
          this.modal = '';
          setTimeout(() => {
            this.moduleIndex = -1;  
          }, 10);                   
      }
    })
    this.menuIndexSubscription = this.dataShareService.menuIndexs.subscribe(indexs =>{      
      this.subMenuIndex = indexs.submenuIndex;      
      this.menuIndex = indexs.menuIndex;
      if(indexs.moduleIndex != undefined && indexs.moduleIndex != -1){
        this.moduleIndex = indexs.moduleIndex;
      }  
         
    })
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
    //let moduleList = this.storageService.GetModules();
    this.AllModuleList = this.storageService.GetModules();
    //this.storageService.SetModifyModules(this.AllModuleList);
    this.initialize();
  }

  ngAfterViewInit() {
    
  }
  

  setSaveResponce(saveFromDataRsponce){
    if (saveFromDataRsponce) {
        if (saveFromDataRsponce.success && saveFromDataRsponce.success != '') {
            if (saveFromDataRsponce.success == 'success') {
                this.apiCallService.getUserPrefrerence(this.storageService.GetUserInfo());
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

  
  
  GoToSelectedModule(module,event){
    if(event.ctrlKey){
      const rout = 'browse/'+module.name;
      this.storageService.setChildWindowUrl(rout);
      window.open(rout, '_blank');
    }else{      
      this.storageService.SetActiveMenu({}); 
      this.setSelectedModule(module);
    }
  }
  openInNewTab(module,menu){
    const rout = 'browse/'+module.name+'/'+menu.name;
    this.storageService.setChildWindowUrl(rout);
    window.open(rout, '_blank');
  }
  setSelectedModule(module){
      this.menuOrModuleCommounService.setModuleName(module.name);
      this.dataShareService.sendCurrentPage('DASHBOARD')
      let mIndex = this.commonFunctionService.getIndexInArrayById(this.AllModuleList,module.name,'name');      
      if(mIndex != -1){
        this.dataShareService.setModuleIndex(mIndex);    
      }
      this.moduleIndex = mIndex; 
  }
  getSubmenuTemplateData(module,submenu,submenuIndex,menuIndex,event){
    if(event.ctrlKey){
      const rout = 'browse/'+module.name+'/'+submenu.name;
      this.storageService.setChildWindowUrl(rout);
      window.open(rout, '_blank');
    }else{
      submenu['child'] = true;
      submenu['menuIndex'] = menuIndex;
      this.menuIndex = menuIndex;
      this.subMenuIndex = submenuIndex;
      this.menuOrModuleCommounService.getTemplateData(module,submenu);
    }
  }
  getmenuTemplateData(module,submenu,menuIndex,event){
    if(event.ctrlKey){
      const rout = 'browse/'+module.name+'/'+submenu.name;
      this.storageService.setChildWindowUrl(rout);
      window.open(rout, '_blank');
    }else{
      submenu['child'] = false;
      submenu['menuIndex'] = menuIndex;
      this.menuIndex = menuIndex;
      this.subMenuIndex = -1;
      this.menuOrModuleCommounService.getTemplateData(module,submenu);
    }
  }
//   getTemplateData(module,submenu) {
//     if(this.permissionService.checkPermission(submenu.name,'view')){
//         this.storageService.SetActiveMenu(submenu);
//         if (submenu.label == "Navigation") {
//             this.router.navigate(['Navigation']);
//         }
//         else if (submenu.label == "Permissions") {
//             this.router.navigate(['permissions']);
//         }
//         else {
//           const menu = submenu;
//           if(menu.name == "document_library"){
//             this.router.navigate(['vdr']);
//           }else if(menu.name == "report"){
//             this.router.navigate(['report']);
//           }
//           else{
//             this.apiService.resetTempData();
//             this.apiService.resetGridData();
//             this.setSelectedModule(module);
//             const route = module.name+"/"+submenu.name;
//             //console.log(route);
//             this.router.navigate([route]);  
//             //this.router.navigate(['template']); 
//           }           
//         }
//     }else{
//         this.notificationService.notify("bg-danger", "Permission denied !!!");
//     }
// }
addFebMenu(menu,parent){
  this.apiCallService.getUserPrefrerence(this.storageService.GetUserInfo());
  this.userPreferenceSubscribe(menu,'menus',parent);
  // this.commonFunctionService.updateUserPreference(modifiedMenuObj,'menus',parent);
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
  let userFebMenu = this.commonFunctionService.getUserPreferenceByFieldName('menus');
  if (userFebMenu && userFebMenu !== null && typeof userFebMenu === 'object' && Object.keys(userFebMenu).length > 0) {
    if (parent && parent !== '' && typeof parent === 'object' && userFebMenu) {
      return this.isMenuAlreadyPresent(menu,userFebMenu);
    }else{
      return this.isIdExist(userFebMenu,menuId);
    }
  } else {
      return false;
  }
}

isIdExist(obj, targetId) {
  for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key].reference && obj[key].reference._id === targetId) {
          return true;
      }
  }
  return false;
}
isMenuAlreadyPresent(targetMenu: any, userFebMenu: any): boolean {
  for (const key in userFebMenu) {
    if (userFebMenu.hasOwnProperty(key)) {
      const menu = userFebMenu[key];
      if (
        (menu.reference && menu.reference._id === targetMenu._id) ||
        menu.reference.name === targetMenu.name
      ) {
        return true; 
      }

      if (menu.submenus) {
        for (const submenuKey in menu.submenus) {
          if (menu.submenus.hasOwnProperty(submenuKey)) {
            const submenu = menu.submenus[submenuKey];      
            if (submenu.reference && submenu.reference._id === targetMenu._id) {
              return true; 
            }
          }
        }
      }
    }
  }
  return false;
}
}
