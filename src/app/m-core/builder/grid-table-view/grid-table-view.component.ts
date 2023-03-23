import { Router, NavigationEnd,ActivatedRoute } from '@angular/router';
import { Component, OnInit,Input,OnChanges, ViewChild, HostListener, ChangeDetectorRef, OnDestroy, SimpleChanges,Inject } from '@angular/core';
import { DatePipe, Location,DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, NgForm } from '@angular/forms';
import { StorageService} from '../../../services/storage/storage.service';
import { CommonFunctionService } from '../../../services/common-utils/common-function.service';
import { PermissionService } from '../../../services/permission/permission.service';
import { ApiService } from '../../../services/api/api.service';
import { DataShareService } from '../../../services/data-share/data-share.service';
import { KeyCode} from '../../../shared/enums/keycodes.enum';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { NotificationService } from '../../../services/notify/notification.service';
import { ModelService } from '../../../services/model/model.service';
import { MomentUtcDateAdapter } from './moment-utc-date-adapter';
import { Common } from '../../../shared/enums/common.enum';
import { Subscription } from 'rxjs';
import { V } from '@angular/cdk/keycodes';
import { MenuOrModuleCommonService } from '../../../services/menu-or-module-common/menu-or-module-common.service';

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
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
   // {provide: DateAdapter, useClass: MomentUtcDateAdapter},
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class GridTableViewComponent implements OnInit,OnDestroy, OnChanges {

  

  filterForm: FormGroup;
  tabs: any = [];
  public tab: any = [];
  //selectTabIndex: number = 0;
  tableGrids: any = [];
  template_name: any = '';
  elements: any = [];
  previous: any = [];
  headElements = [];
  actionButtons:any=[];
  createFilterFormgroup: boolean = true;
  createFilterHeadElement: boolean = true;
  firstItemIndex: any;
  lastItemIndex: any;
  maxVisibleItems = 25;
  tableGrid1: any = [];
  tableGrid2: any = [];
  currentMenu: any;
  selectedRowIndex: any = -1;

  rowSelectionIndex:number=0;
  columnSelectionIndex: number = -1;
  selectedRowData:any = {};
  isShowDiv = false;

  loadngAfterOnInit: boolean = true
  temView: boolean = false;
  treeView: boolean = false;
  public orderBy = '-';
  pageNumber: number = Common.PAGE_NO;
  total: number;
  loading: boolean;
  itemNumOfGrid: any = Common.ITEM_NUM_OF_GRID;
  userInfo: any;
  staticData: any = {};
  copyStaticData:any={};
  pageLoading:boolean=true;
  treeViewData: any = {};
  public curTreeViewField: any = {};
  public alertData = {};
  public viewColumnName = '';
  public updateGridData = false;
  public selectedViewRowIndex = -1;
  tableFields:any=[];
  formName:any='';
  gridButtons:any=[];
  downloadPdfCheck: any = '';
  downloadQRCode: any = '';
  previewData: any = "";
  checkPreviewData = false;
  editedRowCopyData:any={};
  editedRowIndex:number=-1;
  dinamic_form:any = {};
  flagForTdsForm:boolean = false;
  currentRowIndex:any = -1;
  checkForDownloadReport:boolean = false;

  selectContactAdd:string='';
  tab_api_params_criteria:any = {};
  bulkuploadList:String[] = [];
  isBulkUpdate:boolean = false;
  details:any = {};
  selectAllcheck:boolean = false;
  tabFilterData:any=[];
  typeAheadData: string[] = [];
  typegrapyCriteriaList:any=[];

  
  navigationSubscription;
  gridDataSubscription;
  staticDataSubscription;
  tempDataSubscription;
  saveResponceSubscription:Subscription;
  gridFilterDataSubscription;
  dinamicFormSubscription;
  fileDataSubscription;
  exportExcelSubscription;
  pdfFileSubscription;
  previewHtmlSubscription;
  typeaheadDataSubscription;

  filterdata = '';
  fixedcolwidth = 150;
  recordId:any="";
  rowId:any="";
  updateNotification:boolean=true;
  currentBrowseUrl:string="";
  queryParams:any={};

  @Input() selectTabIndex:number;
  @Input() selectContact:string;

  showColumnList:any={};



  @HostListener('window:keyup', ['$event'])

  keyEvent(event: KeyboardEvent) {
    //console.log(event);
    if(this.formName == ""){
      switch (event.keyCode ) {

        case KeyCode.RIGHT_ARROW:
          if(this.rowSelectionIndex >= 0){
            if(this.columnSelectionIndex == -1){
              this.columnSelectionIndex = 0
            }
            else if (this.columnSelectionIndex > -1 && this.columnSelectionIndex != (this.headElements.length -1)) {
              this.columnSelectionIndex = this.columnSelectionIndex +1
            }
          }
          break;


        case KeyCode.LEFT_ARROW:
          if(this.rowSelectionIndex >= 0){
            if(this.columnSelectionIndex == 0){
              this.columnSelectionIndex = 0
            }
            else if (this.columnSelectionIndex != 0 && this.columnSelectionIndex <= (this.headElements.length -1)) {
              this.columnSelectionIndex = this.columnSelectionIndex -1
            }
          }
          break;


        case KeyCode.UP_ARROW:
          this.columnSelectionIndex = -1
          if(this.rowSelectionIndex == 0 ){
            this.rowSelectionIndex = 0;
            this.selectedRowData= this.elements[this.rowSelectionIndex];
          }else{
            this.rowSelectionIndex = this.rowSelectionIndex - 1;
            this.selectedRowData= this.elements[this.rowSelectionIndex];
          } 
          break;


        case KeyCode.DOWN_ARROW:
          this.columnSelectionIndex = -1
          if(this.rowSelectionIndex == (this.elements.length - 1) ){
            this.getPage(this.pageNumber + 1)
            this.rowSelectionIndex = 0;
            this.selectedRowData= this.elements[this.rowSelectionIndex];
          }else{
            this.rowSelectionIndex = this.rowSelectionIndex + 1;
            this.selectedRowData= this.elements[this.rowSelectionIndex];
          } 
          break;


        // case KeyCode.ENTER:
          
        //   if(this.rowSelectionIndex >= 0 && this.columnSelectionIndex == -1) {
        //     this.viewchage()
        //     this.selectedRowData= this.elements[this.rowSelectionIndex];
        //   }else if (this.rowSelectionIndex >= 0 && this.columnSelectionIndex > -1 && this.columnSelectionIndex <= (this.headElements.length -1)){
        //     const elId = this.headElements[this.columnSelectionIndex];
        //     const el = this.elements[this.rowSelectionIndex];
        //     this.clickOnGridElement(elId,el,this.rowSelectionIndex)
        //   }
        //     break;

        default:
          break;
      }
    }

  }

  @HostListener('window:keyup.shift.control.e') onCtrlE() {
    this.editedRowData(this.rowSelectionIndex,'UPDATE')
  }
  @HostListener('window:keyup.alt.a') onCtrlA() {
    this.onBulkUpdate();
  }
  @HostListener('window:keyup.alt.control.d') onCtrlD() {
    this.exportExcel();
  }

  @HostListener('window:keyup.alt.i') onCtrlEsc() {
    this.tableclose()
  }


  @HostListener('window:keyup.alt.n') onCtrlN() {
    let totalPageNumber = Math.floor(this.total/this.itemNumOfGrid);
    let text = this.total % this.itemNumOfGrid;
    if(text > 0) {
      totalPageNumber = totalPageNumber + 1;
    }
    let page:number = 0
    if(this.pageNumber < totalPageNumber) {
      page = this.pageNumber + 1
    } else if (this.pageNumber == totalPageNumber){
      page = 1;
    }
    if(page > 0) {
      this.getPage(page)
    }

  }

  @HostListener('window:keyup.alt.p') onCtrlP() {
    let totalPageNumber = Math.floor(this.total/this.itemNumOfGrid);
    let text = this.total % this.itemNumOfGrid;
    if(text > 0) {
      totalPageNumber = totalPageNumber + 1;
    }
    let page:number = 0
    if (this.pageNumber == 1){
      page = totalPageNumber;
    }else if(this.pageNumber <= totalPageNumber) {
      page = this.pageNumber - 1
    } 
    if(page > 0) {
      this.getPage(page)
    }
  }


  viewchage() {
    this.isShowDiv = !this.isShowDiv;
  }

  tableclose() {
    if(this.rowSelectionIndex >= 0 && this.columnSelectionIndex == -1) {
      this.viewchage()
      this.selectedRowData= this.elements[this.rowSelectionIndex];
    }else if (this.rowSelectionIndex >= 0 && this.columnSelectionIndex > -1 && this.columnSelectionIndex <= (this.headElements.length -1)){
      const elId = this.headElements[this.columnSelectionIndex];
      const el = this.elements[this.rowSelectionIndex];
      this.clickOnGridElement(elId,el,this.rowSelectionIndex)
    }
  }


  constructor(
    private cdRef: ChangeDetectorRef, 
    private storageService: StorageService,
    private commonFunctionService:CommonFunctionService, 
    private permissionService: PermissionService, 
    private modalService: ModelService, 
    private formBuilder: FormBuilder, 
    private router: Router, 
    private routers: ActivatedRoute,
    private datePipe: DatePipe,
    private apiService:ApiService,
    private dataShareService:DataShareService,
    private notificationService:NotificationService,
    private _location:Location,
    @Inject(DOCUMENT) private document: Document,
    private menuOrModuleCommounService:MenuOrModuleCommonService
  ) {
    this.getUrlParameter();    
    this.tempDataSubscription = this.dataShareService.tempData.subscribe( temp => {
      this.setTempData(temp);
    })
    this.gridDataSubscription = this.dataShareService.gridData.subscribe(data =>{
      this.setGridData(data);
    })
    this.staticDataSubscription = this.dataShareService.staticData.subscribe(data =>{
      this.setStaticData(data);
    })
    
    this.gridFilterDataSubscription = this.dataShareService.gridFilterData.subscribe(data =>{
      this.setGridFilterData(data);
    })
    this.dinamicFormSubscription = this.dataShareService.form.subscribe(form =>{
      this.setDinamicForm(form);
    })
    this.fileDataSubscription = this.dataShareService.getfileData.subscribe(data =>{
      this.setFileData(data);
    })
    this.exportExcelSubscription = this.dataShareService.exportExcelLink.subscribe(data =>{
      this.setExportExcelLink(data);
    })
    this.pdfFileSubscription = this.dataShareService.downloadPdfData.subscribe(data =>{
      this.setDownloadPdfData(data);
    })
    this.previewHtmlSubscription = this.dataShareService.previewHtml.subscribe(data =>{
      this.setPreviewHtml(data);
    })
    this.typeaheadDataSubscription = this.dataShareService.typeAheadData.subscribe(data =>{
      this.setTypeaheadData(data);
    })
    this.userInfo = this.storageService.GetUserInfo();
    this.currentMenu = this.storageService.GetActiveMenu(); 
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });   

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
    this.loadngAfterOnInit = true
    this.temView = false;
    this.createFilterFormgroup = true;
    this.createFilterHeadElement = true;
    this.pageLoading=true;
    this.selectedRowIndex = -1;
    this.pageNumber = 1;
    this.selectContactAdd = '';
    this.formName='';    
    //this.elements=[];
    //this.gridButtons=[];
    this.details = {};
    // Set default values and re-fetch any data you need.
    this.currentMenu = this.storageService.GetActiveMenu();
    this.getUrlParameter();    
  }
  getCurrentBrowseUrl(){
    return this.document.location.hash.substring(1);
  }
  saveCallSubscribe(){
    this.saveResponceSubscription = this.dataShareService.saveResponceData.subscribe(responce => {
      this.setSaveResponce(responce);
    })
  }
  unsubscribe(variable){
    if(variable){
      variable.unsubscribe();
    }
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
    if(this.staticDataSubscription){
      this.staticDataSubscription.unsubscribe();
    }
    if(this.tempDataSubscription){
      this.tempDataSubscription.unsubscribe();
    }
    if(this.saveResponceSubscription){
      this.saveResponceSubscription.unsubscribe();
    }
    if(this.gridFilterDataSubscription){
      this.gridFilterDataSubscription.unsubscribe();
    }  
    if(this.dinamicFormSubscription){
      this.dinamicFormSubscription.unsubscribe();
    } 
    if(this.fileDataSubscription){
      this.fileDataSubscription.unsubscribe();
    } 
    if(this.exportExcelSubscription){
      this.exportExcelSubscription.unsubscribe();
    }
    if(this.pdfFileSubscription){
      this.pdfFileSubscription.unsubscribe();
    }
    if(this.previewHtmlSubscription){
      this.previewHtmlSubscription.unsubscribe();
    } 
    //this.tableFields = [];
    //this.actionButtons = [];
    //this.elements = [];
    this.editedRowIndex = -1;
    this.selectContactAdd = '';
    this.pageNumber = 1;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.loadngAfterOnInit = true
    this.temView = false;
    this.createFilterFormgroup = true;
    this.createFilterHeadElement = true;
    this.pageLoading=true;
    this.selectedRowIndex = -1;
    this.selectContactAdd = '';
    this.formName='';
    this.gridButtons=[];   
    this.elements=[];
    this.total = 0;
    this.headElements = [];
    this.details = {};
    // Set default values and re-fetch any data you need.
    this.currentMenu = this.storageService.GetActiveMenu();
    if(this.selectTabIndex != -1){
      const tempData = this.dataShareService.getTempData();
      this.setTempData(tempData);
      this.ngOnInit();
    }
    
  }

  ngOnInit(): void {
  }
  setTempData(tempData){
    if (tempData && tempData.length > 0) {
      this.tabs = tempData[0].templateTabs;
      this.getTabData(this.selectTabIndex,this.formName);
      this.temView = true;
    } else {
      this.temView = false;
      this.tableFields=[];
      this.actionButtons =[];
    } 
  }
  setGridData(gridData){
    if (gridData) {
      if (gridData.data && gridData.data.length > 0) {
        this.elements = JSON.parse(JSON.stringify(gridData.data));
        this.total = gridData.data_size;
        if(this.bulkuploadList.length > 0){
          this.bulkuploadList = [];
        }
        let checkboxes = document.getElementById("selectAllCheckbox");
        if(checkboxes != null){
          checkboxes['checked'] = false;
        }
        let index = -1;
        if(this.recordId != '' && this.updateNotification){
          this.updateNotification = false; 
          index = this.commonFunctionService.getIndexInArrayById(this.elements,this.recordId);                   
        }else if(this.rowId != ''){
          index = this.commonFunctionService.getIndexInArrayById(this.elements,this.rowId,"serialId");                    
        }else if(Object.keys(this.queryParams).length > 0){
          let keys = Object.keys(this.queryParams); 
          index = this.commonFunctionService.getIndexInArrayById(this.elements,this.queryParams,keys);
        }
        if(index != -1){
          this.editedRowData(index,"UPDATE");
        }
      } else {
        this.elements = [];
        this.total = 0;
        this.rowId = "";
      }
    }else{
      this.rowId = "";
    }
  }
  setStaticData(staticData){
    if (staticData) {
      this.staticData = staticData;
      Object.keys(this.staticData).forEach(key => {     
        if(this.staticData[key]){
          this.copyStaticData[key] = JSON.parse(JSON.stringify(this.staticData[key]));
        }
      })
    }
  }
  setGridFilterData(gridFilterData){
    if (gridFilterData) {
      if (gridFilterData.data && gridFilterData.data.length > 0) {
        this.tabFilterData = JSON.parse(JSON.stringify(gridFilterData.data));          
      } else {
        this.tabFilterData = [];
      }
    }
  }
  setTypeaheadData(typeAheadData){
    if (typeAheadData.length > 0) {
      this.typeAheadData = typeAheadData;
    } else {
      this.typeAheadData = [];
    }
  }
  setDinamicForm(form){
    if(form && form.DINAMIC_FORM && this.flagForTdsForm){
      this.dinamic_form = form.DINAMIC_FORM;
      this.flagForTdsForm = false;
      this.addNewForm('DINAMIC_FORM');
    } 
  }
  getTabData(index,formName) {
    this.tab = this.tabs[index]
    if(this.tab != undefined){
      if(this.tab.tab_name && this.tab.tab_name != null && this.tab.tab_name != undefined && this.tab.tab_name != ''){
        const menu = {"name":this.tab.tab_name};
        this.storageService.SetActiveMenu(menu);
        this.currentMenu.name = this.tab.tab_name;
      }  
      if(this.tab.grid && this.tab.grid != undefined){
        if(this.tab.grid.gridColumns && this.createFilterHeadElement){
          this.headElements = this.commonFunctionService.updateFieldInList('show',this.tab.grid.gridColumns);          
          this.createFilterHeadElement = false;
        }
        if(this.tab.grid.gridColumns == undefined && this.tab.grid.gridColumns == null){
          this.headElements = [];
        } 
        if(this.tab.grid.action_buttons && this.tab.grid.action_buttons != null){
          this.gridButtons = this.tab.grid.action_buttons;
        }
        if(this.tab.grid.details && this.tab.grid.details != null){
          this.details = this.tab.grid.details;
        }
        if(this.tab.grid.colorCriteria && this.tab.grid.colorCriteria != null && this.tab.grid.colorCriteria.length >= 1){
          this.typegrapyCriteriaList = this.tab.grid.colorCriteria;
        }else{
          this.typegrapyCriteriaList = [];
        }     
      }else{
        this.headElements = [];
      } 
      if(this.tab.forms && this.tab.forms != undefined && this.tab.forms != null){
        let form = this.commonFunctionService.getForm(this.tab.forms,formName);        
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
      if (this.tab.tree_view && this.tab.tree_view == 'yes') {
        this.treeView = true;
      } else {
        this.treeView = false;
      }
      // this.tableGrids = this.tab.tableGrids;

      // for (let index = 0; index < this.tableGrids.length; index++) {
      //   if (index == 0) {
      //     this.tableGrid1 = this.tableGrids[index];
      //   }
      //   if (index == 1) {
      //     this.tableGrid2 = this.tableGrids[index];
      //   }
      // }
      if (this.createFilterFormgroup) {
        this.createFilterFormgroup = false;
        const forControl = {};
        if(this.headElements.length > 0){
          this.headElements.forEach((element:any) => {
            if(element != null && element.type != null){
            let fieldName = element.field_name;
            let mandatory = false;
            let disabled = false;
            switch (element.type.toLowerCase()) {
              case "text":
              case "info":
                case "number":
                case "reference_names":
                case "chips" :
                this.commonFunctionService.createFormControl(forControl, element, '', "text")
                break;
              case "tree_view_selection":
                this.commonFunctionService.createFormControl(forControl, element, '', "text")
                break;
              case "dropdown":
                this.commonFunctionService.createFormControl(forControl, element, '', "text")
                break;
              case "typeahead":
                this.commonFunctionService.createFormControl(forControl, element, '', "text")
                break;
              case "date":
              case "datetime":
                this.commonFunctionService.createFormControl(forControl, element, '', "text")
                break;
              case "daterange":
                const list_of_fields={}
                const start={field_name:'start',is_disabled:false,is_mandatory:false}
                this.commonFunctionService.createFormControl(list_of_fields, start, '', "text")
                const end={field_name:'end',is_disabled:false,is_mandatory:false}
                this.commonFunctionService.createFormControl(list_of_fields, end, '', "text")
                this.commonFunctionService.createFormControl(forControl, element, list_of_fields, "group")
                break;
              default:
                break;
            }      
          }
          });
        }

        if (forControl) {
          this.filterForm = this.formBuilder.group(forControl);
        }
        
        const staticModalGroup = this.commonFunctionService.commanApiPayload(this.headElements,[],[]);      
        if (staticModalGroup.length > 0) {
          // this.store.dispatch(
          //   new CusTemGenAction.GetStaticData(staticModalGroup)
          // )
          this.apiService.getStatiData(staticModalGroup);

        }            
        if (this.tabs.length >= 1) {
          const menu = {"name":this.tab.tab_name};
          this.storageService.SetActiveMenu(menu);
          this.currentMenu.name = this.tab.tab_name;          
          this.getPage(1);
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
  updateColumnList(field,index){
    
  }
  getTabsCount(tabs){
    this.commonFunctionService.getTabsCountPyload(tabs);    
  }
  setSaveResponce(saveFromDataRsponce){
    if (saveFromDataRsponce.success != '' && this.updateGridData) {
      if (saveFromDataRsponce.success == 'success') {
        this.updateGridData = false;
        this.notificationService.notify("bg-success", " Grid Data Update successfull !!!");
        this.getPage(this.pageNumber);
      }
      this.apiService.ResetSaveResponce();
    }
    if (saveFromDataRsponce.error && saveFromDataRsponce.error != '' && this.updateGridData) {
      this.notificationService.notify("bg-danger", saveFromDataRsponce.error);
      this.updateGridData = false;
      this.apiService.ResetSaveResponce();
    }
    this.unsubscribe(this.saveResponceSubscription);
  }
  setFileData(getfileData){
    if (getfileData != '' && getfileData != null && this.checkForDownloadReport) {
      let link = document.createElement('a');
      link.setAttribute('type', 'hidden');

      const file = new Blob([getfileData.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(file);
      link.href = url;
      link.download = getfileData.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      // this.downloadPdfCheck = '';
      this.checkForDownloadReport = false;
      this.apiService.ResetFileData();
    }
  }
  setExportExcelLink(exportExcelLink:any){
    if (exportExcelLink != '' && exportExcelLink != null && this.downloadClick != '') {
      let link = document.createElement('a');
      link.setAttribute('type', 'hidden');
      const file = new Blob([exportExcelLink], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(file);
      link.href = url;
      link.download = this.downloadClick;
      document.body.appendChild(link);
      link.click();
      link.remove();
      this.downloadClick = '';
      this.apiService.resetGetExportExclLink();
      this.modalService.close('download-progress-modal'); 

    }
  }
  setDownloadPdfData(downloadPdfData){
    if (downloadPdfData != '' && downloadPdfData != null && this.downloadPdfCheck != '') {
      let link = document.createElement('a');
      link.setAttribute('type', 'hidden');
      const file = new Blob([downloadPdfData.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(file);
      link.href = url;
      link.download = downloadPdfData.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      this.downloadPdfCheck = '';
      this.apiService.ResetPdfData();
    }
  }
  setPreviewHtml(previewHtml){
    if (previewHtml != '' && this.checkPreviewData) {
      this.previewData = previewHtml;
      this.preview();
      this.checkPreviewData = false;
    }
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
      this._location.go(this.currentBrowseUrl); 
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
        }else{
          return;
        }        
      }else{
        this.addNewForm(formName);
      }  
      this.selectedRowIndex = id;    
    } else {
      this.menuOrModuleCommounService.checkTokenStatusForPermission();
      //this.notificationService.notify("bg-danger", "Permission denied !!!");
    }
  }
  addAndUpdateResponce(element) {
    this.selectedRowIndex = -1;
    if(this.pageNumber == undefined || this.pageNumber == -1 || this.pageNumber == 0){
      this.pageNumber = 1;
    }    
    this.isBulkUpdate = false;
    this.bulkuploadList = [];
    this.formName = '';
    this.updateRouteUrl();
    this.rowId = "";
    this.recordId = "";
    this.queryParams = {};
    this.getPage(this.pageNumber);
    //this.getTabsCount(this.tabs);   
  }
  
  addNewForm(formName){
    //console.log("addNewForm ="+ Date.now());
    if(this.selectContact != ''){
      this.selectContactAdd = this.selectContact;
    }    
    this.formName = formName;
    let form = null;
    if(formName != 'DINAMIC_FORM' && this.tab && this.tab.forms){
      form = this.commonFunctionService.getForm(this.tab.forms,this.formName);
    }else if(formName == 'DINAMIC_FORM'){
      form = this.dinamic_form;
    }else{
      form = null
    }
    if(form != null){              
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
    
    // const staticModalGroup=this.commonFunctionService.commanApiPayload([],this.tableFields,this.actionButtons);
    // if(this.tab.api_params && this.tab.api_params != null && this.tab.api_params != "" && this.tab.api_params != undefined && this.selectedRowIndex == -1){
      
    //   let criteria = [];
    //   if(this.tab.api_params_criteria && this.tab.api_params_criteria != null){
    //     criteria=this.tab.api_params_criteria
    //   }
    //   staticModalGroup.push(this.commonFunctionService.getPaylodWithCriteria(this.tab.api_params,this.tab.call_back_field,criteria,{}))
      
    // }
    //console.log("tableFields ="+ Date.now());
    if(this.tableFields.length > 0){
      // this.tableFields.forEach(element => {
      //   if(element.type == 'pdf_view'){
      //     const object = this.elements[this.selectedRowIndex];
      //     staticModalGroup.push(this.commonFunctionService.getPaylodWithCriteria(element.onchange_api_params,element.onchange_call_back_field,element.onchange_api_params_criteria,object))
      //   }
      // });
      let formData = {}
      this.updateRouteUrl();
      this.modalService.open('form-modal',formData)
    }else{
      this.notificationService.notify('text-danger','Action not allowed!!!')
    }
        
    // if(staticModalGroup.length > 0){
    //   //console.log("staticModalGroup "+ Date.now());
    //   this.store.dispatch(
    //     new CusTemGenAction.GetStaticData(staticModalGroup)
    //   )
    // }
    
    if(formName == 'DINAMIC_FORM'){
      this.selectedRowIndex = this.currentRowIndex;
    }
  }
  getNumberOfGridColumns() {
    if (this.headElements.length > 0) {
      return this.headElements.length + 1;
    } else {
      return 1;
    }
  }
  templateModal(id,object,index,columnName){
    this.selectedViewRowIndex = index;
    this.viewColumnName = columnName;
    const tempData = {
      "data": object
    }
    this.modalService.open(id, tempData);
  }
  temlateModalResponce(event){
    console.log(event);
  }

  
  viewModal(id, object, field, index, columnName,editemode) {
    this.selectedViewRowIndex = index;
    this.viewColumnName = columnName;
    this.commonFunctionService.viewModal(id, object, field, this.currentMenu,editemode)    
  }
  responceData(data) {
    let updateData = {...this.elements[this.selectedViewRowIndex]};
    updateData[this.viewColumnName] = data;    
      //console.log(updateData);
    
    this.updateRowData(updateData);    
  }
  updateRowData(updateData){
    this.updateGridData = true;
    updateData.log = this.storageService.getUserLog();
    const saveFromData = {
      curTemp: this.currentMenu.name,
      data: updateData
    }
    this.apiService.SaveFormData(saveFromData);
    this.saveCallSubscribe();
  }
  getTreeViewNode(node) {
    //console.log(node);
  }
  
  
  getValueForGrid(field, object) {
    return this.commonFunctionService.getValueForGrid(field, object);
  }
  getValueForGridTooltip(field, object) {
    return this.commonFunctionService.getValueForGridTooltip(field, object);
  }
  getTooltipText(object,field){
    if(field.field_class == 'sorttext'){
      return this.getddnDisplayVal(object)
    }    
  }
  clickOnGridElement(field, object, i) {
    let value={};
    value['data'] = this.commonFunctionService.getObjectValue(field.field_name, object)
    if(field.gridColumns && field.gridColumns.length > 0){
      value['gridColumns'] = field.gridColumns;
    }
    let editemode = false;
    if(field.editable){
      editemode = true;
    }
    if(field.bulk_download){
      value['bulk_download'] = true;
    }else{
      value['bulk_download'] = false;
    }
    if (!field.type) field.type = "Text";
    switch (field.type.toLowerCase()) {
      case "info":
        if (value && value != '') {
          this.selectedViewRowIndex = -1;
          this.viewColumnName = '';
          this.viewModal('basic-modal', value, field, i, field.field_name,editemode);
        };
        break;
      case "template":
        if (value && value != '') {
          this.selectedViewRowIndex = -1;
          this.viewColumnName = '';
          this.templateModal('template-modal',object,i, field.field_name)
        };
        break;
      case "html":
        if (value && value != '') {
          this.viewModal('grid-html-view-modal', value, field, i, field.field_name,editemode);
        };
        break;
      case "file":
        if (value['data'] && value['data'] != '') {
          this.selectedViewRowIndex = -1;
          this.viewColumnName = '';
          this.viewModal('fileview-grid-modal', value, field, i, field.field_name,editemode);
        };
        break;
      case "download_file":
        this.checkForDownloadReport = true;
        let data = object[field.field_name];
        const payload = {
          "_id":object._id,
          "data":{
            "current_tab":this.currentMenu.name,
            "field_name":field.field_name,
            "data":data
          }
        }
        this.commonFunctionService.download_file(payload);
        break;
      default: return;
    }

  }
  
  
  getPage(page: number) {
    this.apiService.resetGridData();
    this.pageNumber = page;
    let contact = {};
    let leadId = '';
    if(this.selectContact != ''){
      this.tabFilterData.forEach(element => {
        if(element._id == this.selectContact['_id']){
          contact  = element;
        }
      });
      if(contact['lead'] && contact['lead']._id){
        leadId = contact['lead']._id;
      }
    }
    const pagePayload = this.commonFunctionService.getPage(page,this.tab,this.currentMenu,this.headElements,this.filterForm.getRawValue(),leadId)
    let crList = pagePayload.data.crList;
    let criteriaList:any = [];
    if(this.recordId){      
      let criteria = "_id;eq;"+this.recordId+";STATIC";
      criteriaList.push(criteria);            
    }
    if(this.rowId){      
      let criteria = "serialId;eq;"+this.rowId+";STATIC";
      criteriaList.push(criteria);
    }
    if(Object.keys(this.queryParams).length > 0){     
      Object.keys(this.queryParams).forEach(key =>{
        let criteria = key+";eq;"+this.queryParams[key]+";STATIC";
        criteriaList.push(criteria);
      })
    }
    if(criteriaList.length > 0){
      this.commonFunctionService.getCriteriaList(criteriaList,{}).forEach(element => {
        crList.push(element);
      });
      pagePayload.data.crList = crList;
    }    
    this.apiService.getGridData(pagePayload);
  }
  public downloadClick = '';

  exportExcel() { 
    this.modalService.open('download-progress-modal', {}); 
    let tempNme = this.currentMenu.name;
    if(this.permissionService.checkPermission(tempNme,'export')){  
      let gridName = '';
      let grid_api_params_criteria = [];
      if(this.commonFunctionService.isGridFieldExist(this.tab,"api_params_criteria")){
        grid_api_params_criteria = this.tab.grid.api_params_criteria;
      }
      const data = this.commonFunctionService.getPaylodWithCriteria(this.currentMenu.name,'',grid_api_params_criteria,'');
      if(this.tab && this.tab.grid){
        if(this.tab.grid.export_template && this.tab.grid.export_template != null){
          gridName = this.tab.grid.export_template;
        }else{
          gridName = this.tab.grid._id;
        }
      }
      delete data.log;
      delete data.key;
      data['key'] = this.userInfo.refCode;
      data['key3']=gridName;
      const value = this.filterForm.getRawValue();
      const filtewCrlist = this.commonFunctionService.getfilterCrlist(this.headElements,value);
      if(filtewCrlist.length > 0){
        filtewCrlist.forEach(element => {
          data.crList.push(element);
        });
      }
      const getExportData = {
        data: {
          refCode: this.userInfo.refCode,
          log: this.storageService.getUserLog(),
          kvp: data
        },
        responce: { responseType: "arraybuffer" },
        path: tempNme
      }
      var fileName = tempNme;
      fileName = fileName.charAt(0).toUpperCase() + fileName.slice(1)
      this.downloadClick = fileName + '-' + new Date().toLocaleDateString();
      this.apiService.GetExportExclLink(getExportData);
    }else{
      this.menuOrModuleCommounService.checkTokenStatusForPermission();
      //this.notificationService.notify("bg-danger", "Permission denied !!!");
    }
  }

  onSort(columnObject) {
    const columnName = this.orderBy + columnObject.field_name;
    const value = this.filterForm.getRawValue();
    const getSortData = {
      data: {
        crList: this.commonFunctionService.getfilterCrlist(this.headElements,value),
        refCode: this.userInfo.refCode,
        key2: this.storageService.getAppId(),
        log: this.storageService.getUserLog(),
        value: this.currentMenu.name,
        pageNo: this.pageNumber - 1,
        pageSize: this.itemNumOfGrid
      },
      path: columnName
    }
    //this.store.dispatch(new CusTemGenAction.GetGridData(getSortData))
    this.apiService.getGridData(getSortData)
    if (this.orderBy == '-') {
      this.orderBy = '';
    } else {
      this.orderBy = '-';
    }
  }
  applyFilter() {
    this.pageNumber = 1;
    const pagePayload = this.commonFunctionService.getDataForGrid(this.pageNumber,this.tab,this.currentMenu,this.headElements,this.filterForm.getRawValue(),this.selectContact);
    this.apiService.getGridData(pagePayload);
    // this.getDataForGrid();
  }
  
  
  

  gateTabName(tab) {
    if (tab.label && tab.label != '' && tab.label != null) {
      return tab.label;
    } else {
      return tab.tab_name;
    }
  }

  
  openTreeView(field) {
    let fieldName;
    if( field && field.field_list_tree_view_object && field.field_list_tree_view_object.field_list_name){
      fieldName = field.field_list_tree_view_object;
    }else{
      fieldName = field;
    }
    if (!this.treeViewData[fieldName.field_name]) this.treeViewData[fieldName.field_name] = [];
    this.treeViewData[fieldName.field_name] = [];
    this.curTreeViewField = fieldName;
    const staticModalGroup:any = [];
    if (fieldName.api_params && fieldName.api_params != '') {
      staticModalGroup.push(this.commonFunctionService.getPaylodWithCriteria(fieldName.api_params, fieldName.call_back_field, fieldName.api_params_criteria, {}));
    }
    if(staticModalGroup.length > 0){
      this.apiService.getStatiData(staticModalGroup);
    }
    this.commonFunctionService.openTreeModal(fieldName.label, fieldName.ddn_field, 'filter-tree-view-modal');   
  }

  treeViewResponce(event) {
    //console.log(event);
    const obj = {}
    Object.keys(event).forEach(key => {
      if (key != 'add_on_click') {
        if (key != 'children') {
          obj[key] = event[key];
        }
      }
    });
    this.filterForm.get([this.curTreeViewField.field_name])!.setValue(obj);
    this.applyFilter();
    if (!this.treeViewData[this.curTreeViewField.field_name]) this.treeViewData[this.curTreeViewField.field_name] = [];
    this.treeViewData[this.curTreeViewField.field_name].push(obj);
    this.curTreeViewField = {};
  }
  
  compareObjects(o1: any, o2: any): boolean {
    return o1._id === o2._id;
  }
  
  getddnDisplayVal(val) {
    return this.commonFunctionService.getddnDisplayVal(val);    
  }
  getOptionText(option) {
    if (option && option.name) {
      return option.name;
    }else{
      return option;
    }
  }
  
  previewModalResponce(data){
    alert(data);
  }
  checkClearBtn(field,type){
    switch (type.toLowerCase()) {
      case "daterange":
        if(this.filterForm.value[field].start != '' && this.filterForm.value[field].start != null){
          return true;
        }else{
          return false;
        }   
      default:
        if(this.filterForm.value[field] != ''){
          return true;
        }else{
          return false;
        }
    }  
    
  }

  gridButtonAction(gridData,index,button){
    if(button && button.onclick && button.onclick.action_name){
      switch (button.onclick.action_name.toUpperCase()) {
        case "PREVIEW":
          this.checkPreviewData = true;
          this.commonFunctionService.preview(gridData,this.currentMenu,'grid-preview-modal')          
          break;
        case "TEMPLATE": 
          let object =JSON.parse(JSON.stringify(gridData))    
          console.log(gridData); 
          this.templateModal('template-modal',object,index, 'Template')
          break;
        case 'UPDATE':
          this.editedRowData(index,button.onclick.action_name.toUpperCase())
          break;
        case 'DOWNLOAD':
          let currentMenu = '';
          if(this.currentMenu.name && this.currentMenu.name != null && this.currentMenu.name != undefined && this.currentMenu.name != ''){
            currentMenu = this.currentMenu.name
          }
          this.downloadPdfCheck = this.commonFunctionService.downloadPdf(gridData,currentMenu);         
          break;
          case 'GETFILE':
            let currentsMenu = '';
          if(this.currentMenu.name && this.currentMenu.name != null && this.currentMenu.name != undefined && this.currentMenu.name != ''){
            currentsMenu = this.currentMenu.name
          }
          this.downloadPdfCheck = this.commonFunctionService.getPdf(gridData,currentsMenu);         
          break;
          case 'TDS':
            let currentMenuForTds = '';
            this.flagForTdsForm = true;
            this.currentRowIndex = index;
          if(this.currentMenu.name && this.currentMenu.name != null && this.currentMenu.name != undefined && this.currentMenu.name != ''){
            currentMenuForTds = this.currentMenu.name
          }
          const getFormData:any = this.commonFunctionService.getFormForTds(gridData,currentMenuForTds,this.elements[index]);        
          if(getFormData._id && getFormData._id != undefined && getFormData._id != null && getFormData._id != ''){
            getFormData.data['data']=gridData;
            this.apiService.GetForm(getFormData);
          }else{
            getFormData.data=gridData;
            this.apiService.GetForm(getFormData);
          }
          break;
        case 'CANCEL':
          this.editedRowData(index,button.onclick.action_name)
          break;
        case 'INLINEEDIT':
          this.gridInlineEdit(gridData,index);
          break;
        case 'COMMUNICATION':
          this.commonFunctionService.openModal('communication-modal',gridData);
          break;
        case 'DOWNLOAD_QR':
          this.downloadQRCode = this.commonFunctionService.getQRCode(gridData,this.elements[index]);
          this.checkForDownloadReport = true;
          break;
        case 'DELETE_ROW':
          if(this.permissionService.checkPermission(this.currentMenu.name, 'delete')){
            this.editedRowData(index,button.onclick.action_name)
          }else{
            this.menuOrModuleCommounService.checkTokenStatusForPermission();
            //this.notificationService.notify("bg-danger", "Permission denied !!!");
          }
          break;
          case 'AUDIT_HISTORY':
            if (this.permissionService.checkPermission(this.currentMenu.name, 'auditHistory')) {
              let obj = {
                "aduitTabIndex": this.selectTabIndex,
                "tabname": this.tabs
              }
              this.commonFunctionService.getAuditHistory(gridData,this.elements[index]);
              this.modalService.open('audit-history',obj);
            }else {
              this.menuOrModuleCommounService.checkTokenStatusForPermission();
              //this.notificationService.notify("bg-danger", "Permission denied !!!");
            }
          break;
        default:
          this.editedRowData(index,button.onclick.action_name)
          break;
      }
    }
  }
  checkFieldsAvailability(formName){
    if(this.tab && this.tab.forms){
      let form = this.commonFunctionService.getForm(this.tab.forms,formName);        
      if(form['tableFields'] && form['tableFields'] != undefined && form['tableFields'] != null){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }
  preview(): void {
    let popupWin;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');    
    popupWin.document.write('<div class="noprint" style="text-align:right;"><a onClick="window.print()" style="text-align: right;display: inline-block;cursor: pointer;border: 2px solid #4285f4!important;background-color: transparent!important;color: #4285f4!important;box-shadow: 0 2px 5px 0 rgba(0,0,0,.16), 0 2px 10px 0 rgba(0,0,0,.12);padding: 7px 25px;font-size: .81rem;transition: .2s ease-in-out;margin: .375rem;text-transform: uppercase;">Print</a></div><style>@media print{.noprint{display:none;}}</style>'+this.previewData);   
    popupWin.document.close();
  }  
  pdfViewModalResponce(event){
    console.log(event);
  }
  gridInlineEdit(data,index){
    this.editedRowCopyData = JSON.parse(JSON.stringify(data));
    this.editedRowIndex = index;
  }
  saveGridData(){
    this.elements[this.editedRowIndex] = this.editedRowCopyData;
    const updateData = this.elements[this.editedRowIndex]
    this.updateRowData(updateData);
    this.editedRowCopyData = {};
    this.editedRowIndex = -1;
  }
  CancilGridEdite(){
    this.editedRowCopyData = {};
    this.editedRowIndex = -1;
  }
  setValue(column,i){
    if(column.onchange_api_params && column.onchange_call_back_field){
      this.changeDropdown(column.onchange_api_params, column.onchange_call_back_field, column.onchange_api_params_criteria, this.elements[i],i);
    }
  }
  changeDropdown(params, callback, criteria, object,i) {    
    const paramlist = params.split(";");
    if(paramlist.length>1){
      
    }else{
      const staticModal:any = []
      const staticModalPayload = this.commonFunctionService.getPaylodWithCriteria(params, callback, criteria, object);
      // staticModalPayload['adkeys'] = {'index':i};
      staticModal.push(staticModalPayload)      
      if(params.indexOf("FORM_GROUP") >= 0){
        staticModal[0]["data"]=object;
      }
      // this.store.dispatch(
      //   new CusTemGenAction.GetStaticData(staticModal)
      // )
      this.apiService.getStatiData(staticModal);
   }
  }
  fileViewresponceData(event){
    console.log(event);
  }
  getGridColumnWidth(column){
    if(column.width && column.width != '0'){
      return column.width+'px';
    }else{
      if(this.headElements.length > 8){
        return '150px';
      }else{
        return '';
      }      
    }    
  }

  getDivClass(field) {
    const fieldsLangth = this.headElements.length;
    return this.commonFunctionService.getFixedDivClass(field,fieldsLangth);
  }

  onBulkUpdate(){
    this.isBulkUpdate = true;
    this.addNewForm('NEW');
  }

  onBulkUploadCheck(element, index, form:NgForm){
    if(form.value.check){
      this.bulkuploadList.push(element._id);
    }
    else{
      this.bulkuploadList = this.bulkuploadList.filter(item => item !== element._id);
    }
    console.log(this.bulkuploadList)
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

  selectAll(){
    let SelectAllcheckboxe:any = document.getElementById("selectAllCheckbox");
    this.selectAllcheck = SelectAllcheckboxe['checked']
    this.bulkuploadList = [];
    for(let i=0; i<this.elements.length;i++){
      let id = 'checkbox'+i;
      let checkboxes:any = document.getElementById(id);
      checkboxes['checked'] = this.selectAllcheck;
      if(this.selectAllcheck){
        this.bulkuploadList.push(this.elements[i]._id);
      }else{
        this.bulkuploadList = [];
      }

    }
    console.log(this.bulkuploadList)
  }

  updateData(event, field) {
    if(event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 13 || event.keyCode == 27 || event.keyCode == 9){
      return false;
    }
    let objectValue = this.filterForm.getRawValue();
    this.callTypeaheadData(field,objectValue);      

  }
  callTypeaheadData(field,objectValue){
    this.clearTypeaheadData();   
    const payload:any = [];
    const params = field.api_params;
    const criteria = field.api_params_criteria;
    payload.push(this.commonFunctionService.getPaylodWithCriteria(params, '', criteria, objectValue,field.data_template));
    this.apiService.GetTypeaheadData(payload);    
  }
  clearTypeaheadData() {
    this.apiService.clearTypeaheadData();
  }
  checkTypgraphCondition(object,name){
    let background = '';
    if(this.typegrapyCriteriaList && this.typegrapyCriteriaList.length >= 1){
      let criteriaMatched = false;
      let matchedelement = {};
      for (let index = 0; index < this.typegrapyCriteriaList.length; index++) {
        const element = this.typegrapyCriteriaList[index];
        let crList = element['crList'];
        let childConditionsMatched = false;
        for (let j = 0; j < crList.length; j++) {
          const child = crList[j];
          let modify = child.replaceAll(';', "#");
          if(!this.commonFunctionService.checkIfConditionForArrayListValue(modify,object)){
            childConditionsMatched = false;
            break;
          }else{
            childConditionsMatched = true;
          }          
        }
        if(childConditionsMatched){
          matchedelement = this.typegrapyCriteriaList[index]
          criteriaMatched = true;
          break;
        }else{
          criteriaMatched = false;
        }
      }
      if(criteriaMatched){ 
        let typograpy = matchedelement['typoGraphy']; 
        let value = '';
        switch (name) {
          case 'background-color':
            value = typograpy['background_color'];
            break;        
          default:
            break;
        }
        background = value;
      }      
    }
    return background;
  }
  clearFilter(fieldName,type){
    if(type.toLowerCase() == 'daterange'){
      (<FormGroup>this.filterForm.controls[fieldName]).controls['start'].patchValue('');
      (<FormGroup>this.filterForm.controls[fieldName]).controls['end'].patchValue('');
    }else{
      this.filterForm.get([fieldName])!.setValue('');
    }    
    this.applyFilter();
  }

}
