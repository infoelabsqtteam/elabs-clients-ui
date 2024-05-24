import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { ApiCallService, ApiService, CheckIfService, CommonFunctionService, DataShareService, FormCreationService, GridCommonFunctionService, MenuOrModuleCommonService, ModelService, NotificationService, PermissionService, RouterService, StorageService } from '@core/web-core';
import { Subscription } from 'rxjs';
import { AppConfig, AppConfigInterface } from 'src/app/shared/config';

@Component({
  selector: 'app-common-grid',
  templateUrl: './common-grid.component.html',
  styleUrls: ['./common-grid.component.css']
})
export class CommonGridComponent implements OnInit,OnChanges,OnDestroy {

  public config:AppConfigInterface = AppConfig;

  @Input() selectContact:string;
  @Input() selectTabIndex:number;

  @ViewChild(MatMenuTrigger, {static: true}) matMenuTrigger: MatMenuTrigger;

  filterForm: UntypedFormGroup; 

  addUpdateFormResponceSubscription:Subscription;
  saveResponceSubscription:Subscription;
  gridDataSubscription:Subscription;
  staticDataSubscription:Subscription;
  gridFilterDataSubscription:Subscription;
  dinamicFormSubscription:Subscription;
  typeaheadDataSubscription:Subscription;
  roleChangeSubscription:Subscription;
  exportExcelSubscription:Subscription;
  pdfFileSubscription:Subscription;
  printFileSubscription:Subscription;
  previewHtmlSubscription:Subscription;
  fileDataSubscription:Subscription;


  constructor(
    private apiCallService:ApiCallService,
    private checkIfService:CheckIfService,
    private apiService:ApiService,
    private gridCommonFunctionServie:GridCommonFunctionService,
    private commonFunctionService:CommonFunctionService,
    private permissionService:PermissionService,
    private formCreationService:FormCreationService,
    private notificationService:NotificationService,
    private routerService:RouterService,
    private dataShareService:DataShareService,
    private modalService:ModelService,
    private storageService:StorageService,
    private menuOrModuleCommounService:MenuOrModuleCommonService,
    private formBuilder: UntypedFormBuilder,
  ) { 
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
    this.typeaheadDataSubscription = this.dataShareService.typeAheadData.subscribe(data =>{
      this.setTypeaheadData(data);
    });
    this.roleChangeSubscription = this.dataShareService.roleChange.subscribe(role =>{
      //this.modalService.close("form-modal");
      this.getPage(1);
    })
    this.fileDataSubscription = this.dataShareService.getfileData.subscribe(data =>{
      this.setFileData(data);
    })
    this.pdfFileSubscription = this.dataShareService.downloadPdfData.subscribe(data =>{
      this.setDownloadPdfData(data);
    })
    this.printFileSubscription = this.dataShareService.printData.subscribe(data =>{
      let template = data.data;
      const blob = new Blob([template], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = blobUrl;
        document.body.appendChild(iframe);
        iframe.contentWindow.print();
        this.modalService.close('download-progress-modal');
    })
    this.dataShareService.pdfFileName.subscribe(fileName =>{
      if(fileName != ''){
        this.config.downloadPdfCheck = fileName;
        let downloadPdfResponce = {
          'success' : 'success',
          'success_msg' : 'Downlaod Pdf File Successfully!!!'
        }
        this.dataShareService.setSaveResponce(downloadPdfResponce);
      }
    })
    this.previewHtmlSubscription = this.dataShareService.previewHtml.subscribe(data =>{
      this.setPreviewHtml(data);
    })
    this.config.userInfo = this.storageService.GetUserInfo();
    this.config.currentMenu = this.storageService.GetActiveMenu(); 
  }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    // this.config.loadngAfterOnInit = true
    // this.config.temView = false;
    // this.config.createFilterFormgroup = true;
    // this.config.createFilterHeadElement = true;
    this.config.pageLoading=true;
    this.config.selectedRowIndex = -1;
    this.config.selectContactAdd = '';
    this.config.formName='';
    this.config.gridButtons=[];   
    this.config.elements=[];
    this.config.modifyGridData = [];
    this.config.total = 0;
    this.config.headElements = [];
    this.config.details = {};
    // this.config.forms={};
    // Set default values and re-fetch any data you need.
    this.config.currentMenu = this.storageService.GetActiveMenu();
    if(this.selectTabIndex != -1){
      this.config.itemNumOfGrid = this.storageService.getDefaultNumOfItem();
      const tempData = this.dataShareService.getTempData();
      this.setTempData(tempData);
      this.ngOnInit();
    }
    // this.config.heavyDownload = false;

  }
  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we  
    // don't then we will continue to run our initialiseInvites()   
    // method on every navigationEnd event.
    if(this.saveResponceSubscription){
      this.saveResponceSubscription.unsubscribe();
    }
    this.config.editedRowIndex = -1;
    this.config.selectContactAdd = '';
    this.config.pageNumber = 1;
  }

  setTempData(tempData){
    if (tempData && tempData.length > 0) {
      this.config.tabs = tempData[0].templateTabs;
      let tab = this.config.tabs[this.selectTabIndex];
      if(tab && tab.tab_name && this.permissionService.checkPermission(tab.tab_name,'view')){
        if(!this.config.createFilterFormgroup) this.config.createFilterFormgroup = true;
        if(!this.config.createFilterHeadElement) this.config.createFilterHeadElement = true;
        this.getTabData(this.selectTabIndex,this.config.formName);
        // this.config.temView = true;
      }else{
        // this.config.temView = false;
        this.config.tableFields=[];
        this.config.actionButtons =[];
      }      
    } else {
      // this.config.temView = false;
      this.config.tableFields=[];
      this.config.actionButtons =[];
    } 
  }
  getTabData(index,formName) {
    this.config.tab = this.menuOrModuleCommounService.addPermissionInTab(this.config.tabs[index]);
    if(this.config.tab != undefined){
      this.config.sortingColumnName = null;
      if(this.config.tab.tab_name && this.config.tab.tab_name != null && this.config.tab.tab_name != undefined && this.config.tab.tab_name != ''){
        const menu = {"name":this.config.tab.tab_name};
        this.storageService.SetActiveMenu(menu);
        this.config.currentMenu.name = this.config.tab.tab_name;
      }  
      let grid = this.config.tab.grid;
      if(grid && grid != undefined){
        if(grid.gridColumns && this.config.createFilterHeadElement){
          this.config.headElements = this.gridCommonFunctionServie.modifyGridColumns(grid.gridColumns,{}); 
          this.config.createFilterHeadElement = false;
        }
        if(grid.gridColumns == undefined && grid.gridColumns == null){
          this.config.headElements = [];
        } 
        if(grid.action_buttons && grid.action_buttons != null){
          this.config.gridButtons = grid.action_buttons;
        }
        if(grid.details && grid.details != null){
          this.config.details = grid.details;
          this.config.itemNumOfGrid = this.gridCommonFunctionServie.getNoOfItems(grid, this.config.itemNumOfGrid);
          if(this.config.details && this.config.details.disableGrid) {
            this.config.gridDisable = true;
            this.config.pageLoading = false;
          }else {
            this.config.gridDisable = false;
          }
           
        }else {
          this.config.gridDisable = false;
        }
        if(grid.colorCriteria && grid.colorCriteria != null && grid.colorCriteria.length >= 1){
          this.config.typegrapyCriteriaList = grid.colorCriteria;
        }else{
          this.config.typegrapyCriteriaList = [];
        }
        if(this.config.tab.grid.heavyDownload && this.config.tab.grid.heavyDownload != null){
                  // this.config.heavyDownload = true;
        }else{
                  // this.config.heavyDownload = false;
        }
      }else{
        this.config.headElements = [];
      } 
      if(this.config.tab.forms && this.config.tab.forms != undefined && this.config.tab.forms != null){
        // this.config.forms = this.tab.forms;
        let form = this.commonFunctionService.getForm(this.config.tab.forms,formName,this.config.gridButtons);        
        if(form['tableFields'] && form['tableFields'] != undefined && form['tableFields'] != null){
          this.config.tableFields = form['tableFields'];
        }else{
          this.config.tableFields = [];
        }
        if(form['tab_list_buttons'] && form['tab_list_buttons'] != undefined && form['tab_list_buttons'] != null){
          this.config.actionButtons = form['tab_list_buttons'];
        }        
      }else{
        this.config.tableFields = [];
      }    
      if (this.config.tab.tree_view && this.config.tab.tree_view == 'yes') {
        this.config.treeView = true;
      } else {
        this.config.treeView = false;
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
      if (this.config.createFilterFormgroup) {
        this.config.createFilterFormgroup = false;
        const forControl = {};
        if(this.config.headElements.length > 0){
          this.config.headElements.forEach(element => {
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
                this.formCreationService.createFormControl(forControl, element, '', "text")
                break;
              case "tree_view_selection":
                this.formCreationService.createFormControl(forControl, element, '', "text")
                break;
              case "dropdown":
                this.formCreationService.createFormControl(forControl, element, '', "text")
                break;
              case "typeahead":
                this.formCreationService.createFormControl(forControl, element, '', "text")
                break;
              case "date":
              case "datetime":
                this.formCreationService.createFormControl(forControl, element, '', "text")
                break;
              case "daterange":
                const list_of_fields={}
                const start={field_name:'start',is_disabled:false,is_mandatory:false}
                this.formCreationService.createFormControl(list_of_fields, start, '', "text")
                const end={field_name:'end',is_disabled:false,is_mandatory:false}
                this.formCreationService.createFormControl(list_of_fields, end, '', "text")
                this.formCreationService.createFormControl(forControl, element, list_of_fields, "group")
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
        
        const staticModalGroup = this.apiCallService.commanApiPayload(this.config.headElements,[],[]);      
        if (staticModalGroup.length > 0) {
          // this.store.dispatch(
          //   new CusTemGenAction.GetStaticData(staticModalGroup)
          // )
          this.apiService.getStatiData(staticModalGroup);

        }            
        if (this.config.tabs.length >= 1) {
          const menu = {"name":this.config.tab.tab_name};
          this.storageService.SetActiveMenu(menu);
          this.config.currentMenu.name = this.config.tab.tab_name;          
          this.getPage(1);
          let gridCount = this.dataShareService.getGridCountData(); 
          let gridCountKey = this.config.tab.tab_name+"_"+this.config.tab.name;
          if(index == 0 || gridCount[gridCountKey] == undefined){
            this.apiService.resetGridCountAllData();
            // this.getTabsCount(this.config.tabs);
          }
        }

      }
    }
  }
  setGridData(gridData){
    if (gridData) {
      if (gridData.data && gridData.data.length > 0) {
        this.config.elements = JSON.parse(JSON.stringify(gridData.data));
        this.config.total = gridData.data_size;
        this.config.modifyGridData = this.gridCommonFunctionServie.modifyGridData(this.config.elements,this.config.headElements,{},[],this.config.typegrapyCriteriaList);
        if(this.config.bulkuploadList.length > 0){
          this.config.bulkuploadList = [];
        }
        let checkboxes = document.getElementById("selectAllCheckbox");
        if(checkboxes != null){
          checkboxes['checked'] = false;
        }
        let index = -1;
        if(this.config.recordId != '' && this.config.updateNotification){
          this.config.updateNotification = false; 
          index = this.commonFunctionService.getIndexInArrayById(this.config.elements,this.config.recordId);                   
        }else if(this.config.rowId != ''){
          index = this.commonFunctionService.getIndexInArrayById(this.config.elements,this.config.rowId,"serialId");                    
        }else if(Object.keys(this.config.queryParams).length > 0){
          let keys = Object.keys(this.config.queryParams); 
          index = this.commonFunctionService.getIndexInArrayById(this.config.elements,this.config.queryParams,keys);
        }
        if(index != -1){
          this.editedRowData(index,"UPDATE");
        }
      } else {
        this.config.elements = [];
        this.config.modifyGridData = [];
        this.config.total = 0;
        this.config.rowId = "";
      }
    }else{
      this.config.rowId = "";
    }
    this.config.pageLoading=false;
  }
  setStaticData(staticData){
    if (staticData) {
      this.config.staticData = staticData;
      Object.keys(this.config.staticData).forEach(key => {     
        if(this.config.staticData[key]){
          this.config.copyStaticData[key] = JSON.parse(JSON.stringify(this.config.staticData[key]));
        }
      })
    }
  }
  setGridFilterData(gridFilterData){
    if (gridFilterData) {
      if (gridFilterData.data && gridFilterData.data.length > 0) {
        this.config.tabFilterData = JSON.parse(JSON.stringify(gridFilterData.data));          
      } else {
        this.config.tabFilterData = [];
      }
    }
  }
  setTypeaheadData(typeAheadData){
    if (typeAheadData && typeAheadData.length > 0) {
      this.config.typeAheadData = typeAheadData;
    } else {
      this.config.typeAheadData = [];
    }
  }
  setDinamicForm(form){
    if(form && form.DINAMIC_FORM && this.config.flagForTdsForm){
      this.config.dinamic_form = form.DINAMIC_FORM;
      this.config.flagForTdsForm = false;
      this.addNewForm('DINAMIC_FORM');
      this.apiCallService.getRealTimeGridData(this.config.currentMenu, this.config.elements[this.config.selectedRowIndex]);
    } 
  }
  setDownloadPdfData(downloadPdfData){
    if (downloadPdfData != '' && downloadPdfData != null && this.config.downloadPdfCheck != '') {
      let link = document.createElement('a');
      link.setAttribute('type', 'hidden');
      const file = new Blob([downloadPdfData.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(file);
      link.href = url;
      link.download = downloadPdfData.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      this.config.downloadPdfCheck = '';
      this.apiService.ResetPdfData();
    }
  }
  setPreviewHtml(previewHtml){
    if (previewHtml != '' && this.config.checkPreviewData) {
      this.config.previewData = previewHtml;
      this.preview();
      this.config.checkPreviewData = false;
    }
  }
  preview(): void {
    let popupWin;
     popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    if(this.config.isHidePrintbtn) {
      popupWin.document.write(this.config.previewData);
    }else {
      popupWin.document.write('<div class="noprint" style="text-align:right;"><a onClick="window.print()" style="text-align: right;display: inline-block;cursor: pointer;border: 2px solid #4285f4!important;background-color: transparent!important;color: #4285f4!important;box-shadow: 0 2px 5px 0 rgba(0,0,0,.16), 0 2px 10px 0 rgba(0,0,0,.12);padding: 7px 25px;font-size: .81rem;transition: .2s ease-in-out;margin: .375rem;text-transform: uppercase;">Print</a></div><style>@media print{.noprint{display:none;}}</style>'+this.config.previewData);
    }
    popupWin.document.close();
  }
  setFileData(getfileData){
    if (getfileData != '' && getfileData != null && this.config.checkForDownloadReport) {
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
      this.config.checkForDownloadReport = false;
      this.apiService.ResetFileData();
    }
  } 

  onSort(columnObject) {
    let responce = this.gridCommonFunctionServie.onSort(columnObject,this.filterForm.getRawValue(),this.config.gridDisable,this.config.tab,this.config.modifyGridData,this.config.elements,this.config.sortingColumnName,this.config.sortIcon,this.config.orderBy,this.config.headElements,this.config.currentMenu,this.config.pageNumber,this.config.itemNumOfGrid);
    this.config.sortIcon = responce.sortIcon;
    this.config.sortingColumnName = responce.sortingColumnName;
    this.config.orderBy = responce.orderBy;
    this.config.elements = responce.elements;
    this.config.modifyGridData = responce.modifyGridData;
  }

  selectAll(){
    let SelectAllcheckboxe = document.getElementById("selectAllCheckbox");
    this.config.selectAllcheck = SelectAllcheckboxe['checked']
    this.config.bulkuploadList = [];
    for(let i=0; i<this.config.elements.length;i++){
      let id = 'checkbox'+i;
      let checkboxes = document.getElementById(id);
      checkboxes['checked'] = this.config.selectAllcheck;
      if(this.config.selectAllcheck){
        this.config.bulkuploadList.push(this.config.elements[i]._id);
      }else{
        this.config.bulkuploadList = [];
      }

    }
    // console.log(this.config.bulkuploadList)
  }
  applyFilter() {
    let responce = this.gridCommonFunctionServie.applyFilter(this.config.modifyGridData,this.config.elements,this.config.tab,this.config.currentMenu,this.config.headElements,this.filterForm.getRawValue(),this.selectContact,this.config.itemNumOfGrid,this.config.gridDisable);
    this.config.modifyGridData = responce.modifyGridData;
    this.config.elements = responce.elements;
    this.config.pageNumber = responce.pageNumber;
  }

  openTreeView(field) {
    let fieldName;
    if( field && field.field_list_tree_view_object && field.field_list_tree_view_object.field_list_name){
      fieldName = field.field_list_tree_view_object;
    }else{
      fieldName = field;
    }
    if (!this.config.treeViewData[fieldName.field_name]) this.config.treeViewData[fieldName.field_name] = [];
    this.config.treeViewData[fieldName.field_name] = [];
    this.config.curTreeViewField = fieldName;
    const staticModalGroup = [];
    if (fieldName.api_params && fieldName.api_params != '') {
      staticModalGroup.push(this.apiCallService.getPaylodWithCriteria(fieldName.api_params, fieldName.call_back_field, fieldName.api_params_criteria, {}));
    }
    if(staticModalGroup.length > 0){
      this.apiService.getStatiData(staticModalGroup);
    }
    this.commonFunctionService.openTreeModal(fieldName.label, fieldName.ddn_field, 'filter-tree-view-modal');   
  }

  get filterFormValue() {
    return this.filterForm.value;
  } 

  clearFilter(fieldName,type){
    if(type.toLowerCase() == 'daterange'){
      (<UntypedFormGroup>this.filterForm.controls[fieldName]).controls['start'].patchValue('');
      (<UntypedFormGroup>this.filterForm.controls[fieldName]).controls['end'].patchValue('');
    }else{
      this.filterForm.get([fieldName]).setValue('');
    }    
    this.applyFilter();
  }
  updateData(event, field) {
    if(event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 13 || event.keyCode == 27 || event.keyCode == 9){
      return false;
    }
    let objectValue = this.filterForm.getRawValue();
    this.callTypeaheadData(field,objectValue);      

  }
  callTypeaheadData(field,objectValue){
    this.apiService.clearTypeaheadData();   
    const payload = [];
    const params = field.api_params;
    const criteria = field.api_params_criteria;
    payload.push(this.apiCallService.getPaylodWithCriteria(params, '', criteria, objectValue,field.data_template));
    this.apiService.GetTypeaheadData(payload);    
  }
  getOptionText(option) {
    if (option && option.name) {
      return option.name;
    }else{
      return option;
    }
  }
  selectRow(i){
    this.config.rowSelectionIndex = i;
  }
  editedRowData(id,formName) {
    if (this.permissionService.checkPermission(this.config.currentMenu.name, 'edit')) {
      this.config.curTreeViewField = id;      
      if(formName == 'UPDATE'){   
        if(this.checkIfService.checkUpdatePermission(this.config.elements[id],this.config.details)){
          return;
        }   
        if(this.checkIfService.checkFieldsAvailability('UPDATE',this.config.tab,this.config.gridButtons)){
          this.addNewForm(formName);
          this.apiCallService.getRealTimeGridData(this.config.currentMenu, this.config.elements[id]);
        }else{
          return;
        }        
      }else{
        this.addNewForm(formName);
        this.apiCallService.getRealTimeGridData(this.config.currentMenu, this.config.elements[id]);
      }  
      this.config.curTreeViewField = id;    
    } else {
      this.permissionService.checkTokenStatusForPermission();
      //this.notificationService.notify("bg-danger", "Permission denied !!!");
    }
  }
  addNewForm(formName){
    if(this.selectContact != ''){
      this.config.selectContactAdd = this.selectContact;
    }    
    this.config.formName = formName;
    let fromResponce = this.formCreationService.getFieldsFromForms(this.config.tab,this.config.formName,this.config.dinamic_form,this.config.gridButtons,this.config.tableFields,this.config.actionButtons);
    this.config.tableFields = fromResponce.fields;
    this.config.actionButtons = fromResponce.buttons;
    
    if(this.config.tableFields.length > 0){
      this.config.currentBrowseUrl = this.routerService.updateRouteUrl(this.config.curTreeViewField,this.config.elements,this.config.currentBrowseUrl).currentBrowseUrl;
      this.subscribeAddUpdateResponce();
      this.formCreationService.addNewForm(this.selectTabIndex,this.config.isBulkUpdate,this.config.bulkuploadList,this.config.curTreeViewField,this.config.formName,this.config.selectContactAdd);
    }else{
      this.notificationService.notify('text-danger','Action not allowed!!!')
    }
    if(formName == 'DINAMIC_FORM'){
      this.config.curTreeViewField = this.config.currentRowIndex;
    }
  }
  subscribeAddUpdateResponce(){
    this.addUpdateFormResponceSubscription = this.dataShareService.addAndUpdateResponce.subscribe(data =>{
      this.addAndUpdateResponce(data);
    })
  }
  addAndUpdateResponce(element) {
    this.config.curTreeViewField = -1;
    if(this.config.pageNumber == undefined || this.config.pageNumber == -1 || this.config.pageNumber == 0){
      this.config.pageNumber = 1;
    }    
    this.config.isBulkUpdate = false;
    this.config.bulkuploadList = [];
    this.config.formName = '';
    this.config.currentBrowseUrl = this.routerService.updateRouteUrl(this.config.curTreeViewField,this.config.elements,this.config.currentBrowseUrl).currentBrowseUrl;
    this.config.rowId = "";
    this.config.recordId = "";
    this.config.queryParams = {};
    this.getPage(this.config.pageNumber);
    if(this.addUpdateFormResponceSubscription){
      this.addUpdateFormResponceSubscription.unsubscribe();
    }  
  }
  getPage(page: number){
    let responce = this.gridCommonFunctionServie.getPage(page,this.selectContact,this.config.tabFilterData,this.config.tab,this.config.currentMenu,this.config.headElements,this.filterForm.getRawValue(),this.config.sortingColumnName,this.config.recordId,this.config.rowId,this.config.queryParams,this.config.itemNumOfGrid,this.config.gridDisable,this.config.modifyGridData,this.config.elements)
    this.config.elements = responce.elements;
    this.config.pageNumber = responce.pageNumber;
    this.config.modifyGridData = responce.modifyGridData;    
  }
  // Grid Right Click Method
  onRightClick(event: MouseEvent, index) { 
      event.preventDefault(); 
      this.config.menuTopLeftPosition.x = event.clientX + 'px'; 
      this.config.menuTopLeftPosition.y = event.clientY + 'px';  
      this.matMenuTrigger.menuData = {item: index}
      this.matMenuTrigger.openMenu(); 
  }

  onBulkUploadCheck(index, form:NgForm){
    let element = this.config.elements[index]
    if(form.value.check){
      this.config.bulkuploadList.push(element._id);
    }else{
      this.config.bulkuploadList = this.config.bulkuploadList.filter(item => item !== element._id);
    }
    // console.log(this.config.bulkuploadList)
  }
  gridButtonAction(index,button){
    let gridData = this.config.elements[index];
    if(button && button.onclick && button.onclick.action_name){
      switch (button.onclick.action_name.toUpperCase()) {
        case "PREVIEW":
          this.config.checkPreviewData = true;
          this.config.isHidePrintbtn = button?.printInPreview;
          this.apiCallService.preview(gridData,this.config.currentMenu,'grid-preview-modal')        
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
          if(this.config.currentMenu.name && this.config.currentMenu.name != null && this.config.currentMenu.name != undefined && this.config.currentMenu.name != ''){
            currentMenu = this.config.currentMenu.name
          }
          this.config.downloadPdfCheck = this.apiCallService.downloadPdf(gridData,currentMenu);         
          break;
        case 'GETFILE':
          let currentsMenu = '';
          if(this.config.currentMenu.name && this.config.currentMenu.name != null && this.config.currentMenu.name != undefined && this.config.currentMenu.name != ''){
            currentsMenu = this.config.currentMenu.name
          }
          this.config.downloadPdfCheck = this.apiCallService.getPdf(gridData,currentsMenu);         
          break;
        case 'TDS':
          let currentMenuForTds = '';
          this.config.flagForTdsForm = true;
          this.config.currentRowIndex = index;
          if(this.config.currentMenu.name && this.config.currentMenu.name != null && this.config.currentMenu.name != undefined && this.config.currentMenu.name != ''){
            currentMenuForTds = this.config.currentMenu.name
          }
          const getFormData:any = this.apiCallService.getFormForTds(gridData,currentMenuForTds,this.config.elements[index]);        
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
          this.config.downloadQRCode = this.commonFunctionService.getQRCode(gridData);
          this.config.checkForDownloadReport = true;
          break;
        case 'DELETE_ROW':
          if(this.permissionService.checkPermission(this.config.currentMenu.name, 'delete')){
            this.editedRowData(index,button.onclick.action_name)
          }else{
            this.permissionService.checkTokenStatusForPermission();
            //this.notificationService.notify("bg-danger", "Permission denied !!!");
          }
          break;
        case 'AUDIT_HISTORY':
          if (this.permissionService.checkPermission(this.config.currentMenu.name, 'auditHistory')) {
            let obj = {
              "aduitTabIndex": this.selectTabIndex,
              "tabname": this.config.tabs,
              "objectId": gridData._id
            }
            this.modalService.open('audit-history',obj);
          }else {
            this.permissionService.checkTokenStatusForPermission();
            //this.notificationService.notify("bg-danger", "Permission denied !!!");
          }
          break;
        case 'PRINT':
          let templateType = '';
          if(button.onclick.templateType && button.onclick.templateType != ''){
            templateType = button.onclick.templateType;
            gridData['print_template'] = templateType;
            const payload = {
              curTemp: this.config.currentMenu.name,
              data: gridData,
              _id :gridData._id
            }
            this.apiService.PrintTemplate(payload);
            this.modalService.open('download-progress-modal', {});
          }else{
            this.notificationService.notify('bg-danger','Template Type is null!!!');
          }
          break;
        default:
          this.editedRowData(index,button.onclick.action_name)
          break;
      }
    }
  }
  templateModal(id,object,index,columnName){
    this.config.selectedViewRowIndex = index;
    this.config.viewColumnName = columnName;
    const tempData = {
      "data": object
    }
    this.modalService.open(id, tempData);
  }
  gridInlineEdit(data,index){
    this.config.editedRowCopyData = JSON.parse(JSON.stringify(data));
    this.config.editedRowIndex = index;
  }
  saveGridData(){
    this.config.elements[this.config.editedRowIndex] = this.config.editedRowCopyData;
    const updateData = this.config.elements[this.config.editedRowIndex]
    this.updateRowData(updateData);
    this.config.editedRowCopyData = {};
    this.config.editedRowIndex = -1;
  }
  CancilGridEdite(){
    this.config.editedRowCopyData = {};
    this.config.editedRowIndex = -1;
  }
  updateRowData(updateData){
    this.config.updateGridData = true;
    updateData.log = this.storageService.getUserLog();
    const saveFromData = {
      curTemp: this.config.currentMenu.name,
      data: updateData
    }
    this.apiService.SaveFormData(saveFromData);
    this.saveCallSubscribe();
  }
  saveCallSubscribe(){
    this.saveResponceSubscription = this.dataShareService.saveResponceData.subscribe(responce => {
      this.setSaveResponce(responce);
    })
  }
  setSaveResponce(saveFromDataRsponce){
    if (saveFromDataRsponce.success != '' && this.config.updateGridData) {
      if (saveFromDataRsponce.success == 'success') {
        this.config.updateGridData = false;
        this.notificationService.notify("bg-success", " Grid Data Update successfull !!!");
        this.getPage(this.config.pageNumber);
      }
      this.apiService.ResetSaveResponce();
    }
    if (saveFromDataRsponce.error && saveFromDataRsponce.error != '' && this.config.updateGridData) {
      this.notificationService.notify("bg-danger", saveFromDataRsponce.error);
      this.config.updateGridData = false;
      this.apiService.ResetSaveResponce();
    }
    this.unsubscribe(this.saveResponceSubscription);
  }
  unsubscribe(variable){
    if(variable){
      variable.unsubscribe();
    }
  }
  clickOnGridElement(field, i) {
    let value={};
    let object = this.config.elements[i];
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
          this.config.selectedViewRowIndex = -1;
          this.config.viewColumnName = '';
          this.viewModal('basic-modal', value, field, i, field.field_name,editemode);
        };
        break;
      case "template":
        if (value && value != '') {
          this.config.selectedViewRowIndex = -1;
          this.config.viewColumnName = '';
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
          this.config.selectedViewRowIndex = -1;
          this.config.viewColumnName = '';
          this.viewModal('fileview-grid-modal', value, field, i, field.field_name,editemode);
        };
        break;
      case "download_file":
        this.config.checkForDownloadReport = true;
        let data = object[field.field_name];
        const payload = {
          "_id":object._id,
          "data":{
            "current_tab":this.config.currentMenu.name,
            "field_name":field.field_name,
            "data":data
          }
        }
        this.commonFunctionService.download_file(payload);
        break;
      default: return;
    }

  }
  viewModal(id, object, field, index, columnName,editemode) {
    this.config.selectedViewRowIndex = index;
    this.config.viewColumnName = columnName;
    this.commonFunctionService.viewModal(id, object, field, this.config.currentMenu,editemode)    
  }
  //copy icon on grid cell
  copyText(value:any){
    this.commonFunctionService.copyGridCellText(value);
  }
  compareObjects(o1: any, o2: any): boolean {
    return o1._id === o2._id;
  }
  setValue(column,i){
    if(column.onchange_api_params && column.onchange_call_back_field){
      this.changeDropdown(column.onchange_api_params, column.onchange_call_back_field, column.onchange_api_params_criteria, this.config.elements[i],i);
    }
  }
  changeDropdown(params, callback, criteria, object,i) {    
    const paramlist = params.split(";");
    if(paramlist.length>1){
      
    }else{
      const staticModal = []
      const staticModalPayload = this.apiCallService.getPaylodWithCriteria(params, callback, criteria, object);
      staticModal.push(staticModalPayload)      
      if(params.indexOf("FORM_GROUP") >= 0){
        staticModal[0]["data"]=object;
      }
      this.apiService.getStatiData(staticModal);
    }
  }
  tableclose() {
    if(this.config.rowSelectionIndex >= 0 && this.config.columnSelectionIndex == -1) {
      this.viewchage()
      this.config.selectedRowData= this.config.elements[this.config.rowSelectionIndex];
    }else if (this.config.rowSelectionIndex >= 0 && this.config.columnSelectionIndex > -1 && this.config.columnSelectionIndex <= (this.config.headElements.length -1)){
      const elId = this.config.headElements[this.config.columnSelectionIndex];
      this.clickOnGridElement(elId,this.config.rowSelectionIndex)
    }
  }
  viewchage() {
    this.config.isShowDiv = !this.config.isShowDiv;
  }  
  PageSizeChange(event: any): void {
    if(event.target.value && event.target.value != "") {
      this.config.itemNumOfGrid = event.target.value;
    }else {
      this.config.itemNumOfGrid = this.gridCommonFunctionServie.getNoOfItems( this.config.tab.grid,this.storageService.getDefaultNumOfItem());
    }
    this.applyFilter();
  }
  responceData(data) {
    let updateData = {...this.config.elements[this.config.selectedViewRowIndex]};
    updateData[this.config.viewColumnName] = data;    
      //console.log(updateData);
    
    this.updateRowData(updateData);    
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
    this.filterForm.get([this.config.curTreeViewField.field_name]).setValue(obj);
    this.applyFilter();
    if (!this.config.treeViewData[this.config.curTreeViewField.field_name]) this.config.treeViewData[this.config.curTreeViewField.field_name] = [];
    this.config.treeViewData[this.config.curTreeViewField.field_name].push(obj);
    this.config.curTreeViewField = {};
  }
  previewModalResponce(data){
    alert(data);
  }
  temlateModalResponce(event){
    console.log(event);
  }
  fileViewresponceData(event){
    console.log(event);
  }

}
