import { Component, OnInit, ViewChild, ElementRef, AfterViewInit,Output, EventEmitter , Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MENU } from './menu';
import { Subscription } from 'rxjs';
import { StorageService, PermissionService, ApiService, NotificationService, CommonFunctionService, DataShareService, MenuOrModuleCommonService } from '@core/web-core';

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
    let moduleList = this.storageService.GetModules();
    this.AllModuleList = this.menuOrModuleCommounService.modifyModuleListWithPermission(moduleList);
    this.storageService.SetModifyModules(this.AllModuleList);
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
