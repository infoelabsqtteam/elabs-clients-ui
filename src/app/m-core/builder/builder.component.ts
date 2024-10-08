
import { Router, NavigationEnd,ActivatedRoute } from '@angular/router';
import { Component, OnInit, HostListener, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Subscription } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { Location } from '@angular/common';

import { StorageService, CommonFunctionService, PermissionService, DataShareService, ApiService, NotificationService, EnvService, MenuOrModuleCommonService, ApiCallService, UserPrefrenceService} from '@core/web-core';


@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.css']
})
export class BuilderComponent implements OnInit, OnDestroy, AfterViewChecked  {

  grid_view_mode:any = '';  
  navigationSubscription;  
  selectTabIndex: number = -1;
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
  selected = new UntypedFormControl(0);
  getTempData:boolean = true;
  currentUrl :String = "";
  isPageLoading: boolean = false;
  
  // For Responsive Tabs
  selectedMoreMenu = "More";
  selectedMoreMenuTab:any = {};
  tabSliceCount : number;
  hasOverflow=false;
  @ViewChild('tabsGroup') tabsGroup: ElementRef;
  
  // when screen size changes call the updateTabsDynamically Fn
  @HostListener('window:resize', ['$event']) onResize(event) {
    this.updateTabsDynamically(this.tabs);
  }

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
  ngAfterViewChecked(): void {
    this.updateTabsDynamically(this.tabs);
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
      this.selectTabIndex = -1;
      this.selected = new UntypedFormControl(0);   
      this.currentMenu = this.storageService.GetActiveMenu();
      if (this.currentMenu  && this.currentMenu?.name) {
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
                this.storageService.setRedirectUrl('/');
                this.dataShareService.setModuleIndex(-1);     
                this.router.navigate(['/dashboard']);                        
            }                    
        }else{
            if(moduleIndex != -1){
                this.storageService.SetActiveMenu({});
                this.dataShareService.setModuleIndex(moduleIndex);
            }else{
                this.notificationService.notify('bg-info',"Module not exits,connect to admin!");
                this.storageService.setRedirectUrl('/');
                this.dataShareService.setModuleIndex(-1);
                this.router.navigate(['/dashboard']);
                
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
  updateTabsDynamically(tabs:[]) {
    if(this.tabsGroup && tabs && tabs.length>0){
      let moreMenuWidth = Math.ceil((this.selectedMoreMenu.length * 6)+35);
      let offSetWidth = this.tabsGroup.nativeElement.offsetWidth;
      if(offSetWidth){
        const tabGroupWidth = offSetWidth-moreMenuWidth;
        let tabsWidth: number = 0;
        tabs.forEach((tab: HTMLElement) => {
          tabsWidth += this.calculateTabWidth(tab).width;
        });
        if (tabsWidth >= tabGroupWidth) {
          let accumulatedWidth = moreMenuWidth;
          let sliceCount = -1;
          for (let i = 0; i < tabs.length; i++) {
            const tabWidth = this.calculateTabWidth(tabs[i]).width;
            accumulatedWidth += tabWidth;
            if (accumulatedWidth <= tabGroupWidth) {
              sliceCount = i+1;
            } else break;
          }
          this.tabSliceCount = sliceCount;
          this.hasOverflow = true;
        } else this.hasOverflow = false;
      }
    }
  }

  // Calculating tab width as per label, count & fav star icon width
  calculateTabWidth(tab:any){
    let label = this.gateTabName(tab);
    let count = this.gridCountByTab[tab.tab_name+'_'+tab.name] ? this.gridCountByTab[tab.tab_name+'_'+tab.name] : '';
    let tabLabel = `${label}(${count})`;
    return {label:tabLabel,width:Math.ceil(tabLabel.length * 5.5+35)};
  }

  isTabActive(tab){
    const currentMenu = this.storageService.GetActiveMenu();
    return tab?.tab_name== currentMenu?.name;
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
        let tabIndex = -1;
        this.filterTab = tempData[0]?.filterTab;
        if(this.filterTab?.tab_name){
          this.isTabFilter = true;
        }else{
          this.isTabFilter = false;          
        }
        if(this.tabId != ""){
          tabIndex = this.commonFunctionService.getIndexInArrayById(this.tabs,this.tabId);
        }
        if(this.tabid != ""){
          tabIndex = this.commonFunctionService.getIndexInArrayById(this.tabs,this.tabid,'tab_name');
        }
        if(tabIndex == -1){
          tabIndex = 0;
        }
        if(!this.permissionService.checkPermission(this.tabs[tabIndex].tab_name,'view')){          
          for (let i = 0; i < this.tabs.length; i++) {
            const tab = this.tabs[i];            
            if(this.permissionService.checkPermission(tab.tab_name,'view')){
              tabIndex = i;
              break;
            }
          }          
        } 
        this.selected = new UntypedFormControl(tabIndex);  
        setTimeout(() => {
          this.selectTabIndex = tabIndex;
        }, 10);          
        this.getViewMode(tabIndex);         
      }else{
        this.grid_view_mode = '';
      }  
      this.updateTabsDynamically(this.tabs);
    }
  }
  setGridData(gridData){
    if (gridData) {
      if (gridData.data && gridData.data.length >= 0) {
        this.total = gridData.data_size;                
        const tab = this.tabs[this.selectTabIndex];
        if(tab && tab.name){
          const currentTabName = this.storageService.GetActiveMenu()['name'];
          const key = currentTabName+"_"+tab.name;
          this.gridCountByTab[key] = gridData.data_size;
          let dashbordCountList = this.storageService.GetTabCounts();
          const dashbordCountKey = currentTabName+"_"+tab.label;
          dashbordCountList[dashbordCountKey] = gridData.data_size;
          this.storageService.SetTabCounts(dashbordCountList);
        }        
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
  getTab(i, tabName,event,sliceCount?) {
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
      if(sliceCount){
        i = i+sliceCount;  
        this.selectedMoreMenu = this.calculateTabWidth(this.tabs[i]).label;
        this.selectedMoreMenuTab = this.tabs[i];
      } else{
        this.selectedMoreMenu = "More";
        this.selectedMoreMenuTab = {};
      }
      this.selectTabIndex = i;  
      this.getViewMode(this.selectTabIndex); 
      this.selected = new UntypedFormControl(i);
    } else {
      this.permissionService.checkTokenStatusForPermission();
      this.notificationService.notify("bg-danger", "Permission denied !!!");
    }
    this.updateTabsDynamically(this.tabs);
  } 
  getViewMode(tabindex){   
      let tab = this.tabs[tabindex]; 
      if(this.envService.getRequestType() == 'PUBLIC'){
        this.grid_view_mode="inlineFormView";
      }
      else{        
        if(tab && tab?.grid && tab?.grid?.grid_view && tab?.grid?.grid_view != null && tab?.grid?.grid_view != undefined && tab?.grid?.grid_view != ''){
          this.grid_view_mode=tab.grid.grid_view; 
        }
        else if(tab && tab?.chart_list != null && tab?.chart_list != undefined && tab?.chart_list != ''){
          this.grid_view_mode="chartView";
        }
        else{
          this.grid_view_mode="tableView";
        } 
      }
      const url = this.currentUrl+"/"+tab.tab_name;
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
    this.updateUserPreference(tab,'tab',parent);
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
  }
}

