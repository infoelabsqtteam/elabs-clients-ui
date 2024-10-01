import { ActivatedRoute } from '@angular/router';
import { Component, OnInit,Input,OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Subscription } from 'rxjs';
import { StorageService, CommonFunctionService, PermissionService, ApiService, DataShareService, NotificationService, MenuOrModuleCommonService, GridCommonFunctionService, ApiCallService, FormCreationService, CheckIfService, RouterService, AppConfig, AppConfigInterface, CoreFunctionService } from '@core/web-core';
import { CommonGridComponent } from '../../common-form-component/common-grid/common-grid.component';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-grid-table-view',
  templateUrl: './grid-table-view.component.html',
  styleUrls: ['./grid-table-view.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class GridTableViewComponent implements OnInit,OnDestroy, OnChanges {

  public appConfig:AppConfigInterface = AppConfig;

  @ViewChild(CommonGridComponent) gridPage!: CommonGridComponent;  
  @Input() selectTabIndex:number;
  @Input() selectContact:string;

  navigationSubscription:Subscription;
  gridDataSubscription:Subscription;  
  addUpdateFormResponceSubscription:Subscription;
  selectedRowIndexSubscription:Subscription;

  constructor(
    private storageService: StorageService,
    private commonFunctionService:CommonFunctionService, 
    private routers:ActivatedRoute,
    private permissionService: PermissionService,
    private apiService:ApiService,
    private dataShareService:DataShareService,
    private notificationService:NotificationService,
    private menuOrModuleCommounService:MenuOrModuleCommonService,
    private gridCommonFunctionServie:GridCommonFunctionService,
    private apiCallService:ApiCallService,
    private formCreationService:FormCreationService,
    private coreFunctionService : CoreFunctionService,
    private checkIfService:CheckIfService,
    private routerService:RouterService
  ) {
    this.getUrlParameter();  
    this.gridDataSubscription = this.dataShareService.gridData.subscribe(data =>{
      this.setGridData(data);
    })
    this.selectedRowIndexSubscription = this.dataShareService.selectedRowIndex$.subscribe(index => {
      this.appConfig.selectedRowIndex = index;
      this.appConfig.rowSelectionIndex = index;
    });
   
    this.appConfig.currentMenu = this.storageService.GetActiveMenu(); 
  }

  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we  
    // don't then we will continue to run our initialiseInvites()   
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
    if(this.gridDataSubscription){
      this.gridDataSubscription.unsubscribe();
    }
    this.appConfig.selectContactAdd = '';
  }

  ngOnChanges(changes: SimpleChanges) {
    this.appConfig.createFilterFormgroup = true;
    this.appConfig.createFilterHeadElement = true;
    this.appConfig.selectedRowIndex = -1;
    this.appConfig.selectContactAdd = '';
    this.appConfig.formName='';
    this.appConfig.gridButtons=[];   
    this.appConfig.elements=[];    
    this.appConfig.details = {};
    this.appConfig.forms={};
    this.appConfig.heavyDownload = false;
    this.appConfig.currentMenu = this.storageService.GetActiveMenu();
    if(this.selectTabIndex != -1){
      this.appConfig.headElements = [];
      const tempData = this.dataShareService.getTempData();
      this.setTempData(tempData);
      this.ngOnInit();
      this.appConfig.isAdFilter = false;
    }
    this.getUrlParameter();
  }
  ngOnInit(): void {  
  }

  getUrlParameter(){
    let routers = this.routers;
    if(routers.snapshot.params["formName"]){
      this.appConfig.formName = routers.snapshot.params["formName"];
    }  
  }
  setTempData(tempData){
    if (tempData && tempData.length > 0) {
      this.appConfig.tabs = tempData[0].templateTabs;
      let tab = this.appConfig.tabs[this.selectTabIndex];
      if(tab && tab.tab_name && this.permissionService.checkPermission(tab.tab_name,'view')){
        if(!this.appConfig.createFilterFormgroup) this.appConfig.createFilterFormgroup = true;
        if(!this.appConfig.createFilterHeadElement) this.appConfig.createFilterHeadElement = true;
        this.getTabData(this.selectTabIndex,this.appConfig.formName);
      }else{
        this.appConfig.tableFields=[];
        this.appConfig.actionButtons =[];
      }      
    } else {
      this.appConfig.tableFields=[];
      this.appConfig.actionButtons =[];
    } 
  }
  setGridData(gridData){    
    if (gridData && gridData.data && gridData.data.length > 0) {
      this.appConfig.elements = JSON.parse(JSON.stringify(gridData.data));        
    } else {
      this.appConfig.elements = [];
    }
  }
  getTabData(index,formName) {
    this.appConfig.tab = this.menuOrModuleCommounService.addPermissionInTab(this.appConfig.tabs[index]);
    if(this.appConfig.tab != undefined){
      if(this.appConfig.tab && this.appConfig.tab.tab_name){
        const menu = {"name":this.appConfig.tab.tab_name};
        this.storageService.SetActiveMenu(menu);
        this.appConfig.currentMenu.name = this.appConfig.tab.tab_name;
      }  
      let grid = this.appConfig.tab.grid;
      if(grid && grid != undefined){
        if(grid.gridColumns && this.appConfig.createFilterHeadElement){
          this.appConfig.headElements = this.gridCommonFunctionServie.modifyGridColumns(grid.gridColumns,{}); 
          this.appConfig.createFilterHeadElement = false;
        }
        if(grid.gridColumns == undefined && grid.gridColumns == null){
          this.appConfig.headElements = [];
        } 
        if(grid.action_buttons && grid.action_buttons != null){
          this.appConfig.gridButtons = grid.action_buttons;
        }
        if(this.appConfig.tab.grid.heavyDownload && this.appConfig.tab.grid.heavyDownload != null){
          this.appConfig.heavyDownload = true;
        }else{
          this.appConfig.heavyDownload = false;
        }
      }else{
        this.appConfig.headElements = [];
      } 
      if(grid && grid?.details){
        this.appConfig.details = grid.details;
      }
      if(this.appConfig.tab.forms && this.appConfig.tab.forms != undefined && this.appConfig.tab.forms != null){
        this.appConfig.forms = this.appConfig.tab.forms;
        let form = this.commonFunctionService.getForm(this.appConfig.tab.forms,formName,this.appConfig.gridButtons);        
        if(form['tableFields'] && form['tableFields'] != undefined && form['tableFields'] != null){
          this.appConfig.tableFields = form['tableFields'];
        }else{
          this.appConfig.tableFields = [];
        }
        if(form['tab_list_buttons'] && form['tab_list_buttons'] != undefined && form['tab_list_buttons'] != null){
          this.appConfig.actionButtons = form['tab_list_buttons'];
        }        
      }else{
        this.appConfig.tableFields = [];
      }    
      if (this.appConfig.createFilterFormgroup) {
        this.appConfig.createFilterFormgroup = false;                   
        if (this.appConfig.tabs.length >= 1) {
          const menu = {"name":this.appConfig.tab.tab_name};
          this.storageService.SetActiveMenu(menu);
          this.appConfig.currentMenu.name = this.appConfig.tab.tab_name;  
          let gridCount = this.dataShareService.getGridCountData(); 
          let gridCountKey = this.appConfig.tab.tab_name+"_"+this.appConfig.tab.name;
          if(index == 0 || gridCount[gridCountKey] == undefined){
            this.apiService.resetGridCountAllData();
            this.getTabsCount(this.appConfig.tabs);
          }
        }
      }
      // Calling for create From group for adFilter
      // this.createAdFilterFormgroup();
    }
  }
  getTabsCount(tabs){
    this.apiCallService.getTabsCountPyload(tabs);    
  }
  editedRowData(id,formName) {
    if (this.permissionService.checkPermission(this.appConfig.currentMenu.name, 'edit')) {
      this.appConfig.selectedRowIndex = id;      
      if(formName == 'UPDATE'){   
        if(this.checkIfService.checkUpdatePermission(this.appConfig.elements[id],this.appConfig.details)){
          return;
        }   
        if(this.checkIfService.checkFieldsAvailability('UPDATE',this.appConfig.tab,this.appConfig.gridButtons)){
          this.addNewForm(formName);
          this.apiCallService.getRealTimeGridData(this.appConfig.currentMenu, this.appConfig.elements[id]);
        }else{
          return;
        }        
      }else{
        this.addNewForm(formName);
        this.apiCallService.getRealTimeGridData(this.appConfig.currentMenu, this.appConfig.elements[id]);
      }    
    } else {
      this.permissionService.checkTokenStatusForPermission();
    }
  }
  seteditedRowData(event){
    this.editedRowData(event.index, event.formName);
  }
  openDinamicForm(event){
    if(event && event.formName){
      this.addNewForm(event.formName,event.form);
    }
  }
  cloneData() {
    if(this.appConfig.rowSelectionIndex != -1) {
      let selectedObject = JSON.parse(JSON.stringify(this.appConfig.elements[this.appConfig.rowSelectionIndex]));
      let copyObject = {};
      if(this.appConfig.tableFields && this.appConfig.tableFields.length > 0) {
        this.appConfig.tableFields.forEach(field => {
          let fieldName = "";
          if(field && field.field_name && field.field_name != ""){
            fieldName = field.field_name;
          }
          if(fieldName != "" && selectedObject[fieldName] != undefined) {
            copyObject[fieldName] = JSON.parse(JSON.stringify(selectedObject[fieldName]));
          }
        });
      }
      this.addNewForm('NEW');
      setTimeout(() => {
        this.dataShareService.shareGridRunningData({"data" : copyObject});
      },100)
    }
  }
  addAndUpdateResponce(element) {
    this.appConfig.selectedRowIndex = -1;
    this.appConfig.formName = '';
    this.appConfig.currentBrowseUrl = this.routerService.updateRouteUrl(this.appConfig.selectedRowIndex,this.appConfig.elements,this.appConfig.currentBrowseUrl).currentBrowseUrl;
    this.gridPage.getPage(this.gridPage.config.pageNumber);
    if(this.addUpdateFormResponceSubscription){
      this.addUpdateFormResponceSubscription.unsubscribe();
    }  
    
  }
  addNewForm(formName,form?:any,isBulkUpdate?:boolean,bulkuploadList?:any){
    if(this.selectContact != ''){
      this.appConfig.selectContactAdd = this.selectContact;
    }    
    this.appConfig.formName = formName;
    let fromResponce = this.formCreationService.getFieldsFromForms(this.appConfig.tab,this.appConfig.formName,form,this.appConfig.gridButtons,this.appConfig.tableFields,this.appConfig.actionButtons);
    this.appConfig.tableFields = fromResponce.fields;
    this.appConfig.actionButtons = fromResponce.buttons;
    
    if(this.appConfig.tableFields.length > 0){      
      this.appConfig.currentBrowseUrl = this.routerService.updateRouteUrl(this.appConfig.selectedRowIndex,this.appConfig.elements,this.appConfig.currentBrowseUrl).currentBrowseUrl;
      this.subscribeAddUpdateResponce();
      this.formCreationService.addNewForm(this.selectTabIndex,isBulkUpdate,bulkuploadList,this.appConfig.selectedRowIndex,this.appConfig.formName,this.appConfig.selectContactAdd);
    }else{
      this.notificationService.notify('bg-danger','Action not allowed!!!')
    }
  }
  subscribeAddUpdateResponce(){
    this.addUpdateFormResponceSubscription = this.dataShareService.addAndUpdateResponce.subscribe(data =>{
      this.addAndUpdateResponce(data);
    })
  }
 
  exportExcel() {
    this.gridPage.exportExcel();
  }
  exportCSV() {
    this.gridPage.exportExcel();
  }
  gridButtonAction(index,button){
    this.gridPage.gridButtonAction(index,button);
  }
  // Calling the clear Filter fn from adFilter component.
  clearAdFilter (){
    this.gridPage.clearAdFilter();
  }
}
