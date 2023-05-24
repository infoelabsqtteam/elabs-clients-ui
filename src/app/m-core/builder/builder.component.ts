
import { Router, NavigationEnd,ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, HostListener, ChangeDetectorRef, OnDestroy, Input } from '@angular/core';
import { StorageService} from '../../services/storage/storage.service';
import { CommonFunctionService } from '../../services/common-utils/common-function.service';
import { PermissionService } from '../../services/permission/permission.service';
import { DataShareService } from '../../services/data-share/data-share.service';
import { ApiService } from '../../services/api/api.service';
import { NotificationService } from 'src/app/services/notify/notification.service';
import { EnvService } from 'src/app/services/env/env.service';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MenuOrModuleCommonService } from 'src/app/services/menu-or-module-common/menu-or-module-common.service';
import { threadId } from 'worker_threads';
import { Location } from '@angular/common';




@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.css']
})
export class BuilderComponent implements OnInit,OnDestroy {

  grid_view_mode:any = '';  
  navigationSubscription;  
  selectTabIndex: number = 0;
  tabId:any = "";
  tabid:any = "";
  currentMenu:any;
  userInfo: any;
  tabs:any=[];
  gridCountByTab:any=[];
  total: number;
  isTabFilter:boolean=false;
  filterTab:any='';
  selectContact:string='';
  gridDataSubscription;
  tempDataSubscription;
  dinamicFormSubscription;
  gridDataCountSubscription:any;
  saveResponceSubscription:Subscription;
  userPreferenceSubscription:Subscription;
  selected = new FormControl(0);
  getTempData:boolean = true;
  currentUrl :String = "";
  

  @HostListener('window:keyup.alt.t') onCtrlT(){
    let tab = {};
    if((this.tabs.length-1) == this.selectTabIndex){
      this.selectTabIndex = 0;
      tab = this.tabs[this.selectTabIndex];
      this.getTab(this.selectTabIndex,tab["tab_name"],"")
    }
    else if (this.selectTabIndex >= 0) {
      this.selectTabIndex = this.selectTabIndex + 1;
      tab = this.tabs[this.selectTabIndex];
      this.getTab(this.selectTabIndex,tab["tab_name"],"")
    }
}
  constructor(
    private storageService: StorageService,
    private commonFunctionService:CommonFunctionService, 
    private router: Router,
    private routers: ActivatedRoute,
    private permissionService: PermissionService,
    private dataShareService:DataShareService,
    private apiService:ApiService,
    private notificationService:NotificationService,
    private envService:EnvService,
    private menuOrModuleCommounService:MenuOrModuleCommonService,
    private _location:Location
  ) {  
    this.initialiseInvites();
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
    this.gridDataSubscription = this.dataShareService.gridData.subscribe(data =>{
      this.setGridData(data);
    })
    this.tempDataSubscription = this.dataShareService.tempData.subscribe(data =>{      
      this.setTempData(data);
    })
    this.dinamicFormSubscription = this.dataShareService.form.subscribe(form =>{
      this.setDinamicForm(form);
    })
    this.gridDataCountSubscription = this.dataShareService.gridCountData.subscribe(counts =>{
      this.setGridCountData(counts);
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
  setSaveResponce(saveFromDataRsponce){
    if (saveFromDataRsponce) {
        if (saveFromDataRsponce.success && saveFromDataRsponce.success != '') {
            if (saveFromDataRsponce.success == 'success') {
                this.commonFunctionService.getUserPrefrerence(this.storageService.GetUserInfo());
            }
        }
    }
    this.unsubscribe(this.saveResponceSubscription);
}


  initialiseInvites() {    
    // Set default values and re-fetch any data you need.
    if(this.getTempData){
      this.getNavigationRouteData();
      this.getTempData = false;
      this.selectContact = '';
      this.selectTabIndex = 0;
      this.selected = new FormControl(0);   
      this.currentMenu = this.storageService.GetActiveMenu();
      if (this.currentMenu != null && this.currentMenu != undefined && this.currentMenu.name && this.currentMenu.name != '') {
        const payload = this.commonFunctionService.getTemData(this.currentMenu.name); 
        this.apiService.GetTempData(payload);     
      }
    }
    
    
  }
  getNavigationRouteData(){
    let routers = this.routers;
    if(routers.snapshot.params["key1"]){
      const index = JSON.stringify(routers.snapshot.params["key1"]);
      if(index != ''){
        const action = routers.snapshot.params["action"];
        const key1 = routers.snapshot.params["key1"];
        const key2 = routers.snapshot.params["key2"];
        const key3 = routers.snapshot.params["key3"];
        
        this.apiService.resetTempData();
        const data = {
          "obj":action,
          "key":key1,
          "key1": key2,
          "key2" : key3
        }
        let payloaddata = {};
        this.storageService.removeDataFormStorage();
        const getFormData = {
          data: payloaddata,
          _id:key1
        }
        getFormData.data=data;
        this.apiService.GetForm(getFormData);
        // alert('Index is:-' + index);
      }
    }
    if(routers.snapshot.params["tabId"]){
      this.tabId = routers.snapshot.params["tabId"]; 
      // let moduleId =  routers.snapshot.params["moduleId"];     
      // this.verticalComponent.changeModul(this.commonFunctionService.moduleIndex(moduleId));
    }
    if(routers.snapshot.params["tabid"]){
      const tabid = routers.snapshot.params["tabid"]; 
      let index = tabid.indexOf('?');
      if(index != -1){
        this.tabid = tabid.substring(0, index);
      }else{
        index = tabid.indexOf('%');
        if(index != -1){
          this.tabid = tabid.substring(0, index);
        }else{
          this.tabid = tabid;
        }        
      }
      // let moduleId =  routers.snapshot.params["moduleId"];     
      // this.verticalComponent.changeModul(this.commonFunctionService.moduleIndex(moduleId));
    }
    if(routers.snapshot.params["moduleId"]){
      let AllModuleList = this.storageService.GetModifyModules();
      if(AllModuleList == undefined || AllModuleList == undefined || AllModuleList.length == 0 && this.storageService.GetModules().length > 0){
        AllModuleList = this.menuOrModuleCommounService.modifyModuleListWithPermission(this.storageService.GetModules());
        this.storageService.SetModifyModules(AllModuleList);
      }
      if(AllModuleList != undefined && Array.isArray(AllModuleList)){
        const moduleName = routers.snapshot.params["moduleId"];
        const moduleIndex = this.commonFunctionService.getIndexInArrayById(AllModuleList,moduleName,'name');
        if(routers.snapshot.params["menuId"]){
            if(moduleIndex != -1 && AllModuleList[moduleIndex].display){
              const module = AllModuleList[moduleIndex];
              let menuList = [];
              if(module && module.menu_list && module.menu_list.length > 0){
                  menuList = module.menu_list
                  const menuName = routers.snapshot.params["menuId"];                            
                  const menuIndexs = this.menuOrModuleCommounService.getIndexsByMenuName(menuList,menuName);
                  const menuIndex = menuIndexs.menuindex;
                  const submenuIndex = menuIndexs.submenuindex;
                  let menu = {'name':menuName};
                  if(menuIndexs.submenuindex != -1){
                      menu = menuList[menuIndex].submenu[submenuIndex];
                  }else{
                      if(menuIndex != -1){
                          menu = menuList[menuIndex];
                      }else{
                          this.notificationService.notify('bg-info',"Menu not exits,connect to admin!");
                          this.storageService.SetActiveMenu({});
                          this.dataShareService.setModuleIndex(moduleIndex);
                      }
                  }
                  this.menuOrModuleCommounService.shareMenuIndex(menuIndex,submenuIndex,moduleIndex);
                  this.storageService.SetActiveMenu(menu);
                  this.menuOrModuleCommounService.GoToSelectedModule(module);
                  const url = '/browse/'+module.name+"/"+menu.name;
                  this.currentUrl = url;
                  if(this.tabid == ""){
                    this._location.go(url);   
                  }               
              }else{
                  this.storageService.SetActiveMenu({});
                  this.dataShareService.setModuleIndex(moduleIndex);
              }                        
            }else{
                this.notificationService.notify('bg-info',"Module not exits,connect to admin!");
                this.router.navigate['/dashboard'];
            }                    
        }else{
            if(moduleIndex != -1){
                this.storageService.SetActiveMenu({});
                this.dataShareService.setModuleIndex(moduleIndex);
            }else{
                this.notificationService.notify('bg-info',"Module not exits,connect to admin!");
                this.router.navigate['/dashboard'];
            }
        }  
      }                   
    } 
  }
  
  
  ngOnDestroy(){
    this.selectContact = '';
    this.apiService.resetTempData();
    this.storageService.SetActiveMenu({})
    if(this.gridDataSubscription){
      this.gridDataSubscription.unsubscribe();
    }
    if(this.tempDataSubscription){
      this.tempDataSubscription.unsubscribe();
    }
    if(this.dinamicFormSubscription){
      this.dinamicFormSubscription.unsubscribe();
    } 
    if(this.navigationSubscription){
      this.navigationSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    //console.log('this is builder oninit function');


  }
  setGridCountData(counts){
    Object.keys(counts).forEach(key => { 
      if(counts[key]){
        this.gridCountByTab[key] = JSON.parse(JSON.stringify(counts[key]));
      }     
    })
  }
  setTempData(tempData:any){
    if (tempData && tempData.length > 0) {
      this.getTempData=true;
      this.storageService.setChildWindowUrl('/');    
      this.storageService.setRedirectUrl('/');  
      this.tabs = tempData[0].templateTabs; 
      if(this.tabs == undefined || this.tabs == null){
        //this.notificationService.notify('bg-danger','Template Tabs are not availabel !!!')
        this.tabs = [];
      }
      if(this.tabs.length > 0){
        this.filterTab = tempData[0].filterTab;
        if(this.filterTab && this.filterTab.tab_name && this.filterTab.tab_name != ''){
          this.isTabFilter = true;
        }else{
          this.isTabFilter = false;          
        }
        if(this.tabId != ""){
          this.selectTabIndex = this.commonFunctionService.getIndexInArrayById(this.tabs,this.tabId);
        }
        if(this.tabid != ""){
          this.selectTabIndex = this.commonFunctionService.getIndexInArrayById(this.tabs,this.tabid,'tab_name');
        }
        if(this.selectTabIndex == -1){
          this.selectTabIndex = 0;
        }
        if(!this.permissionService.checkPermission(this.tabs[this.selectTabIndex].tab_name,'view')){          
          for (let i = 0; i < this.tabs.length; i++) {
            const tab = this.tabs[i];            
            if(this.permissionService.checkPermission(tab.tab_name,'view')){
              this.selectTabIndex = i;
            }
          }          
        } 
        this.selected = new FormControl(this.selectTabIndex);    
        this.getViewMode(); 
      }else{
        this.grid_view_mode = '';
      }  
    }
  }
  setGridData(gridData){
    if (gridData) {
      if (gridData.data && gridData.data.length > 0) {
        this.total = gridData.data_size;
        const currentTabName = this.storageService.GetActiveMenu()['name'];        
        const tab = this.tabs[this.selectTabIndex];
        const key = currentTabName+"_"+tab.name;
        this.gridCountByTab[key] = gridData.data_size;
      } else {
        this.total = 0;
      }
    }
  }
  setDinamicForm(form){
    if(form && form.DINAMIC_FORM){
      const dinamic_form = form.DINAMIC_FORM;
      if(dinamic_form.view_mode){
        this.grid_view_mode=dinamic_form.view_mode;
      }              
    }
    const data = this.dataShareService.getTempData();
    this.setTempData(data);
  }
  getTab(i, tabName,event) {
    if (this.permissionService.checkPermission(tabName, 'view')) {
      if(event != "" && event.ctrlKey){
        const url = this.currentUrl+"/"+tabName;
        this.storageService.setChildWindowUrl(url);
        window.open(url, '_blank');
      }else{
        if(this.selectTabIndex != i){
          this.apiService.resetGridData();
        }       
        this.selectTabIndex = i;  
        this.getViewMode(); 
      }       
    } else {
      this.menuOrModuleCommounService.checkTokenStatusForPermission();
      this.notificationService.notify("bg-danger", "Permission denied !!!");
    }
  } 
  checkPermission(tab){
    return !this.permissionService.checkPermission(tab.tab_name, 'view')
  }
  getViewMode(){    
      if(this.envService.getRequestType() == 'PUBLIC'){
        this.grid_view_mode="inlineFormView";
      }
      else{
        if(this.tabs[this.selectTabIndex] && this.tabs[this.selectTabIndex].grid && this.tabs[this.selectTabIndex].grid.grid_view && this.tabs[this.selectTabIndex].grid.grid_view != null && this.tabs[this.selectTabIndex].grid.grid_view != undefined && this.tabs[this.selectTabIndex].grid.grid_view != ''){
          this.grid_view_mode=this.tabs[this.selectTabIndex].grid.grid_view; 
        }
        else if(this.tabs[this.selectTabIndex] && this.tabs[this.selectTabIndex].chart_list != null && this.tabs[this.selectTabIndex].chart_list != undefined && this.tabs[this.selectTabIndex].chart_list != ''){
          this.grid_view_mode="chartView";
        }
        else{
          this.grid_view_mode="tableView";
        } 
      }
      const url = this.currentUrl+"/"+this.tabs[this.selectTabIndex].tab_name;
      this._location.go(url); 
  }
  
  gateTabName(tab) {
    if (tab.label && tab.label != '' && tab.label != null) {
      return tab.label;
    } else {
      return tab.tab_name;
    }
  }

  sidebarSearchResponce(selectedContact){
    if(selectedContact){
      this.selectContact = selectedContact;
    }
    else{
      this.selectContact = '';
    }
  }   





  
  addFebMenu(menu,parent){
    this.commonFunctionService.getUserPrefrerence(this.storageService.GetUserInfo());
    this.userPreferenceSubscribe(menu,'favoriteTabs',parent);
    // this.commonFunctionService.updateUserPreference(menu,'favoriteMenus',parent);
    // this.saveCallSubscribe();
  }
  updateUserPreference(menu,field,parent){
    this.unsubscribe(this.userPreferenceSubscription);
    this.commonFunctionService.updateUserPreference(menu,field,parent);
    this.saveCallSubscribe();
  }
  checkFebMenuAddOrNot(tab,parent){
    let tabId = tab._id;
    if(parent != ''){
      tabId = parent._id;
    }
    let userFebTab = this.commonFunctionService.getUserPreferenceByFieldName('favoriteTabs');
    if(userFebTab && userFebTab != null && userFebTab.length > 0){
      let match = -1;
      for (let index = 0; index < userFebTab.length; index++) {
        const element = userFebTab[index];
        if(element._id == tabId ){
          match = index;
          break;
        }     
      }
      if(match > -1){
        if(parent != ''){
          const submenu = userFebTab[match]['tab'];
          let subMatchIndex = -1;
          if(submenu && submenu.length > 0){
            for (let j = 0; j < submenu.length; j++) {
              const subMenu = submenu[j];
              if(subMenu._id == tab._id){
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


