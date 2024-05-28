import { Router, NavigationEnd,ActivatedRoute } from '@angular/router';
import { Component, OnInit,Input,OnChanges, HostListener, ChangeDetectorRef, OnDestroy, SimpleChanges,Inject, ViewChild } from '@angular/core';
import { DatePipe, Location,DOCUMENT } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, FormControl, FormArray, Validators, NgForm } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Subscription } from 'rxjs';
import { StorageService, CommonFunctionService, PermissionService, ApiService, DataShareService, NotificationService, ModelService, MenuOrModuleCommonService, GridCommonFunctionService,KeyCode,Common, ApiCallService, CheckIfService, FormCreationService, DownloadService } from '@core/web-core';
import { MatMenuTrigger } from '@angular/material/menu';
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

  // @ViewChild(MatMenuTrigger, {static: true}) matMenuTrigger: MatMenuTrigger;

  @ViewChild(CommonGridComponent) gridPage!: CommonGridComponent;

  
  tabs: any = [];
  public tab: any = [];
  elements: any = [];
  headElements = [];
  actionButtons:any=[];
  createFilterFormgroup: boolean = true;
  createFilterHeadElement: boolean = true;
  currentMenu: any;
  selectedRowIndex: any = -1;
  rowSelectionIndex:number=0;
  userInfo: any;

  
  tableFields:any=[];
  forms:any={};
  formName:any='';
  
  gridButtons:any=[];

  selectContactAdd:string='';
  // tab_api_params_criteria:any = {};
  bulkuploadList:String[] = [];
  // isBulkUpdate:boolean = false;
  details:any = {};
  // selectAllcheck:boolean = false;
  // tabFilterData:any=[];
  // typeAheadData: string[] = [];
  // typegrapyCriteriaList:any=[];
  // sortIcon="down"
  // isHidePrintbtn:boolean = false;
  
  navigationSubscription:Subscription;
  gridDataSubscription:Subscription;
  // staticDataSubscription:Subscription;
  // tempDataSubscription:Subscription;
  // saveResponceSubscription:Subscription;
  // printFileSubscription:Subscription;
  // gridFilterDataSubscription:Subscription;
  // dinamicFormSubscription:Subscription;
  // fileDataSubscription:Subscription;
  // exportExcelSubscription:Subscription;
  // pdfFileSubscription:Subscription;
  // previewHtmlSubscription:Subscription;
  // typeaheadDataSubscription:Subscription;
  exportCVSLinkSubscribe:Subscription;
  // roleChangeSubscription:Subscription;
  addUpdateFormResponceSubscription:Subscription;
  selectedRowIndexSubscription:Subscription;

  filterdata = '';
  fixedcolwidth = 150;
  recordId:any="";
  rowId:any="";
  updateNotification:boolean=true;
  currentBrowseUrl:string="";
  queryParams:any={};
  gridDisable:boolean = false;

  @Input() selectTabIndex:number;
  @Input() selectContact:string;

  showColumnList:any={};
  sortingColumnName:any = null;
  heavyDownload:boolean = false;


  


  constructor(
    private storageService: StorageService,
    private commonFunctionService:CommonFunctionService, 
    private permissionService: PermissionService, 
    private modalService: ModelService, 
    // private formBuilder: UntypedFormBuilder,
    private router: Router, 
    private routers: ActivatedRoute,
    private apiService:ApiService,
    private dataShareService:DataShareService,
    private notificationService:NotificationService,
    private _location:Location,
    @Inject(DOCUMENT) private document: Document,
    private menuOrModuleCommounService:MenuOrModuleCommonService,
    private gridCommonFunctionServie:GridCommonFunctionService,
    private apiCallService:ApiCallService,
    // private checkIfService:CheckIfService,
    private formCreationService:FormCreationService,
    private downloadService:DownloadService
  ) {
    this.getUrlParameter();  
    this.gridDataSubscription = this.dataShareService.gridData.subscribe(data =>{
      this.setGridData(data);
    })
    this.selectedRowIndexSubscription = this.dataShareService.selectedRowIndex$.subscribe(index => {
      this.selectedRowIndex = index;
      this.rowSelectionIndex = index;
    });
   
    // this.dinamicFormSubscription = this.dataShareService.form.subscribe(form =>{
    //   this.setDinamicForm(form);
    // })    
    this.userInfo = this.storageService.GetUserInfo();
    this.currentMenu = this.storageService.GetActiveMenu(); 
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });   

    this.exportCVSLinkSubscribe = this.dataShareService.exportCVSLink.subscribe(data =>{
      this.handleExportCsv(data);
    })   

  }

  handleExportCsv(data){
    if(data != null && data != undefined ){
      this.notificationService.notify("bg-success", " File is under processing");
    }else{
      this.notificationService.notify("bg-danger", " Data issue");
    }

  }

  getUrlParameter(){
    let routers = this.routers;
    if(routers.snapshot.params["formName"]){
      this.formName = routers.snapshot.params["formName"];
    }  
    if(routers.snapshot.params["recordId"]){      
      this.recordId = routers.snapshot.params["recordId"];
    } 
    if(routers.snapshot.params["rowId"]){      
      this.rowId = routers.snapshot.params["rowId"];
    } 
    this.routers.queryParams.subscribe(params => {
      this.queryParams = params;
    });
  }
  initialiseInvites() {
    // this.loadngAfterOnInit = true
    // this.temView = false;
    this.createFilterFormgroup = true;
    this.createFilterHeadElement = true;
    // this.pageLoading=true;
    this.selectedRowIndex = -1;
    // this.pageNumber = 1;
    this.selectContactAdd = '';
    this.formName='';    
    //this.elements=[];
    this.gridButtons=[];
    this.details = {};
    // Set default values and re-fetch any data you need.
    this.currentMenu = this.storageService.GetActiveMenu();
    this.getUrlParameter();    
  }
  getCurrentBrowseUrl(){
    //return this.document.location.hash.substring(1);
    return this.document.location.pathname;
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
    // if(this.saveResponceSubscription){
    //   this.saveResponceSubscription.unsubscribe();
    // }
    // if(this.dinamicFormSubscription){
    //   this.dinamicFormSubscription.unsubscribe();
    // } 
    // this.editedRowIndex = -1;
    this.selectContactAdd = '';
    // this.pageNumber = 1;
  }

  ngOnChanges(changes: SimpleChanges) {
    // this.loadngAfterOnInit = true
    // this.temView = false;
    this.createFilterFormgroup = true;
    this.createFilterHeadElement = true;
    // this.pageLoading=true;
    this.selectedRowIndex = -1;
    this.selectContactAdd = '';
    this.formName='';
    this.gridButtons=[];   
    this.elements=[];
    // this.modifyGridData = [];
    // this.total = 0;
    this.headElements = [];
    this.details = {};
    this.forms={};
    // Set default values and re-fetch any data you need.
    this.currentMenu = this.storageService.GetActiveMenu();
    if(this.selectTabIndex != -1){
      // this.itemNumOfGrid = this.storageService.getDefaultNumOfItem();
      const tempData = this.dataShareService.getTempData();
      this.setTempData(tempData);
      this.ngOnInit();
    }
    this.heavyDownload = false;

  }

  ngOnInit(): void {
  }
  setTempData(tempData){
    if (tempData && tempData.length > 0) {
      this.tabs = tempData[0].templateTabs;
      let tab = this.tabs[this.selectTabIndex];
      if(tab && tab.tab_name && this.permissionService.checkPermission(tab.tab_name,'view')){
        if(!this.createFilterFormgroup) this.createFilterFormgroup = true;
        if(!this.createFilterHeadElement) this.createFilterHeadElement = true;
        this.getTabData(this.selectTabIndex,this.formName);
        // this.temView = true;
      }else{
        // this.temView = false;
        this.tableFields=[];
        this.actionButtons =[];
      }      
    } else {
      // this.temView = false;
      this.tableFields=[];
      this.actionButtons =[];
    } 
  }
  setGridData(gridData){
    if (gridData) {
      if (gridData.data && gridData.data.length > 0) {
        this.elements = JSON.parse(JSON.stringify(gridData.data));        
      } else {
        this.elements = [];
      }
    }else{
      this.rowId = "";
    }
  }
  // setDinamicForm(form){
  //   if(form && form.DINAMIC_FORM && this.flagForTdsForm){
  //     this.dinamic_form = form.DINAMIC_FORM;
  //     this.flagForTdsForm = false;
  //     this.addNewForm('DINAMIC_FORM');
  //     this.apiCallService.getRealTimeGridData(this.currentMenu, this.elements[this.selectedRowIndex]);
  //   } 
  // }
  getTabData(index,formName) {
    this.tab = this.menuOrModuleCommounService.addPermissionInTab(this.tabs[index]);
    if(this.tab != undefined){
      this.sortingColumnName = null;
      if(this.tab.tab_name && this.tab.tab_name != null && this.tab.tab_name != undefined && this.tab.tab_name != ''){
        const menu = {"name":this.tab.tab_name};
        this.storageService.SetActiveMenu(menu);
        this.currentMenu.name = this.tab.tab_name;
      }  
      let grid = this.tab.grid;
      if(grid && grid != undefined){
        if(grid.gridColumns && this.createFilterHeadElement){
          this.headElements = this.gridCommonFunctionServie.modifyGridColumns(grid.gridColumns,{}); 
          this.createFilterHeadElement = false;
        }
        if(grid.gridColumns == undefined && grid.gridColumns == null){
          this.headElements = [];
        } 
        if(grid.action_buttons && grid.action_buttons != null){
          this.gridButtons = grid.action_buttons;
        }
        if(this.tab.grid.heavyDownload && this.tab.grid.heavyDownload != null){
                  this.heavyDownload = true;
        }else{
                  this.heavyDownload = false;
        }
      }else{
        this.headElements = [];
      } 
      if(grid.details && grid.details != null){
        this.details = grid.details;
      }
      if(this.tab.forms && this.tab.forms != undefined && this.tab.forms != null){
        this.forms = this.tab.forms;
        let form = this.commonFunctionService.getForm(this.tab.forms,formName,this.gridButtons);        
        if(form['tableFields'] && form['tableFields'] != undefined && form['tableFields'] != null){
          this.tableFields = form['tableFields'];
        }else{
          this.tableFields = [];
        }
        if(form['tab_list_buttons'] && form['tab_list_buttons'] != undefined && form['tab_list_buttons'] != null){
          this.actionButtons = form['tab_list_buttons'];
        }        
      }else{
        this.tableFields = [];
      }    
      if (this.createFilterFormgroup) {
        this.createFilterFormgroup = false;                   
        if (this.tabs.length >= 1) {
          const menu = {"name":this.tab.tab_name};
          this.storageService.SetActiveMenu(menu);
          this.currentMenu.name = this.tab.tab_name;  
          let gridCount = this.dataShareService.getGridCountData(); 
          let gridCountKey = this.tab.tab_name+"_"+this.tab.name;
          if(index == 0 || gridCount[gridCountKey] == undefined){
            this.apiService.resetGridCountAllData();
            this.getTabsCount(this.tabs);
          }
        }
      }
    }
  }
  getTabsCount(tabs){
    this.apiCallService.getTabsCountPyload(tabs);    
  }
  

  getTab(i) {
    
    this.selectTabIndex = i;
    this.selectedRowIndex = -1;
    
    this.createFilterFormgroup = true;
    this.headElements=[];
    this.getTabData(i,this.formName);
    //this.getPage(1);
    
  }
  updateRouteUrl(){    
    let record = "";
    if(this.selectedRowIndex != -1){
      record = this.elements[this.selectedRowIndex];
    }    
    let routeQuery = '';
    let routeQueryCriteri = ['serialId'];
    this.currentBrowseUrl = this.getCurrentBrowseUrl();
    if(record != ""){
      let queryList:any = [];
      routeQueryCriteri.forEach(criteria => {
        if(record && record[criteria]){
          const query = criteria+"="+record[criteria];
          queryList.push(query);
        }
      });
      if(queryList && queryList.length > 0){
        queryList.forEach((query,i) =>{
          if(i == 0){
            routeQuery = routeQuery + query;
          }else {
            routeQuery = routeQuery +"&"+ query;
          }
        })
      }   
      if(routeQuery && routeQuery != ''){
        this._location.go(this.currentBrowseUrl+"?"+routeQuery);
      }else {
        this._location.go(this.currentBrowseUrl);
      }       
    }else{
      let routUrl = this.currentBrowseUrl;
      if(this.currentBrowseUrl != ''){
        let url = this.currentBrowseUrl.split('?');
        if(url && url.length > 0){
          routUrl = url[0];
        }
      }
      this._location.go(routUrl); 
      this.currentBrowseUrl = "";
    }
  }
  editedRowData(id,formName) {
    if (this.permissionService.checkPermission(this.currentMenu.name, 'edit')) {
      this.selectedRowIndex = id;      
      if(formName == 'UPDATE'){   
        if(this.checkUpdatePermission(this.elements[id])){
          return;
        }   
        if(this.checkFieldsAvailability('UPDATE')){
          this.addNewForm(formName);
          this.apiCallService.getRealTimeGridData(this.currentMenu, this.elements[id]);
        }else{
          return;
        }        
      }else{
        this.addNewForm(formName);
        this.apiCallService.getRealTimeGridData(this.currentMenu, this.elements[id]);
      }  
      this.selectedRowIndex = id;    
    } else {
      this.permissionService.checkTokenStatusForPermission();
      //this.notificationService.notify("bg-danger", "Permission denied !!!");
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
    if(this.rowSelectionIndex != -1) {
      let selectedObject = JSON.parse(JSON.stringify(this.elements[this.rowSelectionIndex]));
      let copyObject = {};
      if(this.tableFields && this.tableFields.length > 0) {
        this.tableFields.forEach(field => {
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
      this.dataShareService.shareGridRunningData({"data" : copyObject});
      
    }
  }
  addAndUpdateResponce(element) {
    this.selectedRowIndex = -1;
    // if(this.pageNumber == undefined || this.pageNumber == -1 || this.pageNumber == 0){
    //   this.pageNumber = 1;
    // }    
    // this.isBulkUpdate = false;
    // this.bulkuploadList = [];
    this.formName = '';
    this.updateRouteUrl();
    this.rowId = "";
    this.recordId = "";
    this.queryParams = {};
    // this.getPage(this.pageNumber);
    //this.getTabsCount(this.tabs); 
    if(this.addUpdateFormResponceSubscription){
      this.addUpdateFormResponceSubscription.unsubscribe();
    }  
  }
  addNewForm(formName,form?:any,isBulkUpdate?:boolean,bulkuploadList?:any){
    if(this.selectContact != ''){
      this.selectContactAdd = this.selectContact;
    }    
    this.formName = formName;
    let fromResponce = this.formCreationService.getFieldsFromForms(this.tab,this.formName,form,this.gridButtons,this.tableFields,this.actionButtons);
    this.tableFields = fromResponce.fields;
    this.actionButtons = fromResponce.buttons;
    
    if(this.tableFields.length > 0){      
      this.updateRouteUrl();
      this.subscribeAddUpdateResponce();
      this.formCreationService.addNewForm(this.selectTabIndex,isBulkUpdate,bulkuploadList,this.selectedRowIndex,this.formName,this.selectContactAdd);
    }else{
      this.notificationService.notify('text-danger','Action not allowed!!!')
    }
    // if(formName == 'DINAMIC_FORM'){
    //   this.selectedRowIndex = this.currentRowIndex;
    // }
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
  checkFieldsAvailability(formName){
    if(this.tab && this.tab.forms){
      let form = this.commonFunctionService.getForm(this.tab.forms,formName,this.gridButtons);        
      if(form['tableFields'] && form['tableFields'] != undefined && form['tableFields'] != null){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }


  

  checkUpdatePermission(rowdata){
    if(this.details && this.details.permission_key && this.details.permission_key != '' && this.details.permission_value && this.details.permission_value != ''){ 
      const value = this.commonFunctionService.getObjectValue(this.details.permission_key,rowdata) 
      if(value == this.details.permission_value){
        this.notificationService.notify("btn-danger","Cannot be update!!!")
        return true;
      }
    }else{
      return false;
    }
  }


}
