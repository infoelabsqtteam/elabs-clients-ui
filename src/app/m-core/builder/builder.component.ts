
import { Router, NavigationEnd,ActivatedRoute } from '@angular/router';
import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';

import { StorageService, CommonFunctionService, PermissionService, DataShareService, ApiService, NotificationService, EnvService, MenuOrModuleCommonService, ApiCallService, UserPrefrenceService} from '@core/web-core';


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
  isPageLoading: boolean = false;
  

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
    private _location:Location,
    private apiCallService:ApiCallService,
    private userPrefrenceService:UserPrefrenceService
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
                this.apiCallService.getUserPrefrerence(this.storageService.GetUserInfo());
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
        const payload = this.apiCallService.getTemData(this.currentMenu.name); 
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
      let AllModuleList = this.storageService.GetModules();
      // if(AllModuleList == undefined || AllModuleList == undefined || AllModuleList.length == 0 && this.storageService.GetModules().length > 0){
      //   AllModuleList = this.menuOrModuleCommounService.modifyModuleListWithPermission(this.storageService.GetModules());
      //   this.storageService.SetModifyModules(AllModuleList);
      // }
      if(AllModuleList != undefined && Array.isArray(AllModuleList)){
        const moduleName = routers.snapshot.params["moduleId"];
        const moduleIndex = this.commonFunctionService.getIndexInArrayById(AllModuleList,moduleName,'name');
        if(routers.snapshot.params["menuId"]){
            if(moduleIndex != -1 && AllModuleList[moduleIndex]){
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
    if(counts && Object.keys(counts).length > 0){
      Object.keys(counts).forEach(key => { 
        if(counts[key]){
          this.gridCountByTab[key] = JSON.parse(JSON.stringify(counts[key]));
        }     
      })
    }
  }
  
  setTempData(tempData:any){
    if (tempData && tempData.length > 0) {
      this.getTempData=true;
      this.storageService.setChildWindowUrl('/');    
      this.storageService.setRedirectUrl('/'); 
      if(tempData[0] && tempData[0].templateTabs && tempData[0].templateTabs.length > 0){
        this.tabs = this.menuOrModuleCommounService.viewPermissionInTabs(tempData[0].templateTabs);
      } 
      //this.tabs = tempData[0].templateTabs; 
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
        
      }       
    } else {
      this.permissionService.checkTokenStatusForPermission();
      this.notificationService.notify("bg-danger", "Permission denied !!!");
    }
    this.selectTabIndex = i;  
    this.getViewMode(); 
    this.selected = new FormControl(i);
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
  addFebTab(tab,parent){  
    this.isPageLoading = true;
    tab.favourite = !tab.favourite;
    this.apiCallService.getUserPrefrerence(this.storageService.GetUserInfo());
    this.userPreferenceSubscribe(tab,'tab',parent);
    // this.saveCallSubscribe();
  }
  
  async updateUserPreference(menu,field,parent){
    this.unsubscribe(this.userPreferenceSubscription);
    let response = await this.userPrefrenceService.updateUserPreference(menu,field,parent);
    if (response?.success) {
      this.isPageLoading = false;
      this.notificationService.notify('bg-success', 'favourite Tab updated successfully!');
    } else {
      this.isPageLoading = false;
      this.notificationService.notify('bg-warning', 'Failed to save data.');
    }
    this.saveCallSubscribe();
  }
//   checkFebTabAddOrNot(tab) {
//     const menus = this.storageService.getUserPreference()?.['favouriteMenus'] || {};
//     return this.userPrefrenceService.isIdExistInTemplateTabs(menus, tab._id);
// }
}

