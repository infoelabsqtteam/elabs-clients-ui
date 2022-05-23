
import { Router, NavigationEnd,ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, HostListener, ChangeDetectorRef, OnDestroy, Input } from '@angular/core';
import { StorageService} from '../../services/storage/storage.service';
import { CommonFunctionService } from '../../services/common-utils/common-function.service';
import { PermissionService } from '../../services/permission/permission.service';
import { DataShareService } from '../../services/data-share/data-share.service';
import { ApiService } from '../../services/api/api.service';
import { NotificationService } from 'src/app/services/notify/notification.service';
import { EnvService } from 'src/app/services/env/env.service';




@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.css']
})
export class BuilderComponent implements OnInit,OnDestroy {

  grid_view_mode:any = '';  
  navigationSubscription;  
  selectTabIndex: number = 0;
  selectedRowIndex: any = -1;
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
 
  

  @HostListener('window:keyup.alt.t') onCtrlT(){
    let tab = {};
    if((this.tabs.length-1) == this.selectTabIndex){
      this.selectTabIndex = 0;
      tab = this.tabs[this.selectTabIndex];
      this.getTab(this.selectTabIndex,tab["tab_name"])
    }
    else if (this.selectTabIndex >= 0) {
      this.selectTabIndex = this.selectTabIndex + 1;
      tab = this.tabs[this.selectTabIndex];
      this.getTab(this.selectTabIndex,tab["tab_name"])
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
    private envService:EnvService
  ) {    
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
    this.userInfo = this.storageService.GetUserInfo();
    
    
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
  initialiseInvites() {    
    // Set default values and re-fetch any data you need.
    this.selectContact = '';
    this.selectTabIndex = 0;
    this.currentMenu = this.storageService.GetActiveMenu();
    if (this.currentMenu != null && this.currentMenu != undefined && this.currentMenu.name && this.currentMenu.name != '') {
      const payload = this.commonFunctionService.getTemData(this.currentMenu.name); 
      this.apiService.GetTempData(payload);     
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
  }

  ngOnInit(): void {
    


  }
  setGridCountData(counts){
    Object.keys(counts).forEach(key => {        
      this.gridCountByTab[key] = JSON.parse(JSON.stringify(counts[key]));
    })
  }
  setTempData(tempData:any){
    if (tempData && tempData.length > 0) {
      this.tabs = tempData[0].templateTabs; 
      this.filterTab = tempData[0].filterTab;
      if(this.filterTab && this.filterTab.tab_name && this.filterTab.tab_name != ''){
        this.isTabFilter = true;
      }else{
        this.isTabFilter = false;          
      }
      if(this.tabs == undefined || this.tabs == null){
        this.notificationService.notify('bg-danger','Template Tabs are not availabel !!!')
        this.tabs = [];
      }else{
        if(this.envService.getRequestType() == 'PUBLIC'){
          this.grid_view_mode="inlineFormView";
        }
        else{
          if(this.tabs[this.selectTabIndex].grid.grid_view != null && this.tabs[this.selectTabIndex].grid.grid_view != undefined && this.tabs[this.selectTabIndex].grid.grid_view != ''){
            this.grid_view_mode=this.tabs[this.selectTabIndex].grid.grid_view; 
          }else{
            this.grid_view_mode="tableView";
          }
        }
       
      }    
    }
  }
  setGridData(gridData){
    if (gridData) {
      if (gridData.data && gridData.data.length > 0) {
        this.total = gridData.data_size;
        const currentTabName = this.storageService.GetActiveMenu()['name'];
        this.gridCountByTab[currentTabName] = gridData.data_size;
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
  getTab(i, tabName) {
    if (this.permissionService.checkPermission(tabName, 'view')) {
      this.apiService.resetGridData();        
      if(this.tabs[this.selectTabIndex].grid.grid_view != null && this.tabs[this.selectTabIndex].grid.grid_view != undefined && this.tabs[this.selectTabIndex].grid.grid_view != ''){
        this.grid_view_mode=this.tabs[this.selectTabIndex].grid.grid_view; 
      }
      else if(this.tabs[this.selectTabIndex].chart_list != null && this.tabs[this.selectTabIndex].chart_list != undefined && this.tabs[this.selectTabIndex].chart_list != ''){
        this.grid_view_mode="chartView";
      }
      else{
        this.grid_view_mode="tableView";
      } 
      this.selectTabIndex = i;   
    } else {
      this.notificationService.notify("bg-danger", "Permission denied !!!");
    }
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

  

}


