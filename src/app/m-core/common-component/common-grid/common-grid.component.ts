import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ApiCallService, ApiService, CheckIfService, Common, CommonFunctionService, DataShareService, FormCreationService, GridCommonFunctionService, NotificationService, PermissionService, RouterService, StorageService } from '@core/web-core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-common-grid',
  templateUrl: './common-grid.component.html',
  styleUrls: ['./common-grid.component.css']
})
export class CommonGridComponent implements OnInit {

  @Input() selectContact:string;
  @Input() selectTabIndex:number;

  filterForm: UntypedFormGroup;
  
  treeView: boolean = false;
  isShowDiv: boolean = false;
  fixedcolwidth = 150;
  sortingColumnName:any = null;

  public orderBy = '-';
  pageNumber: number = Common.PAGE_NO;
  total: number;
  loading: boolean;
  itemNumOfGrid: any;
  currentMenu: any;
  sortIcon="down";
  gridDisable:boolean = false;
  selectAllcheck:boolean = false;
  isBulkUpdate:boolean = false;
  filterdata = '';
  rowSelectionIndex:number=0;
  selectedRowIndex: any = -1;
  editedRowIndex:number=-1;
  columnSelectionIndex: number = -1;
  currentRowIndex:any = -1;
  formName:any='';
  selectContactAdd:string='';
  currentBrowseUrl:string="";
  recordId:any="";
  rowId:any="";

  userInfo: any;

  headElements = [];
  gridButtons:any=[];
  actionButtons:any=[];
  elements: any = [];
  modifyGridData:any = [];
  tab: any = {};
  bulkuploadList:String[] = [];
  treeViewData: any = {};
  curTreeViewField: any = {};
  staticData: any = {};
  copyStaticData:any={};
  typeAheadData: string[] = [];
  details:any = {};
  dinamic_form:any = {};
  tableFields:any=[];
  queryParams:any={};
  tabFilterData:any=[];

  addUpdateFormResponceSubscription:Subscription;

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
    private dataShareService:DataShareService
  ) { }

  ngOnInit() {
  }


  onSort(columnObject) {
    let responce = this.gridCommonFunctionServie.onSort(columnObject,this.filterForm.getRawValue(),this.gridDisable,this.tab,this.modifyGridData,this.elements,this.sortingColumnName,this.sortIcon,this.orderBy,this.headElements,this.currentMenu,this.pageNumber,this.itemNumOfGrid);
    this.sortIcon = responce.sortIcon;
    this.sortingColumnName = responce.sortingColumnName;
    this.orderBy = responce.orderBy;
    this.elements = responce.elements;
    this.modifyGridData = responce.modifyGridData;
  }

  selectAll(){
    let SelectAllcheckboxe = document.getElementById("selectAllCheckbox");
    this.selectAllcheck = SelectAllcheckboxe['checked']
    this.bulkuploadList = [];
    for(let i=0; i<this.elements.length;i++){
      let id = 'checkbox'+i;
      let checkboxes = document.getElementById(id);
      checkboxes['checked'] = this.selectAllcheck;
      if(this.selectAllcheck){
        this.bulkuploadList.push(this.elements[i]._id);
      }else{
        this.bulkuploadList = [];
      }

    }
    // console.log(this.bulkuploadList)
  }
  applyFilter() {
    let responce = this.gridCommonFunctionServie.applyFilter(this.modifyGridData,this.elements,this.tab,this.currentMenu,this.headElements,this.filterForm.getRawValue(),this.selectContact,this.itemNumOfGrid,this.gridDisable);
    this.modifyGridData = responce.modifyGridData;
    this.elements = responce.elements;
    this.pageNumber = responce.pageNumber;
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
    this.rowSelectionIndex = i;
  }
  editedRowData(id,formName) {
    if (this.permissionService.checkPermission(this.currentMenu.name, 'edit')) {
      this.selectedRowIndex = id;      
      if(formName == 'UPDATE'){   
        if(this.checkIfService.checkUpdatePermission(this.elements[id],this.details)){
          return;
        }   
        if(this.checkIfService.checkFieldsAvailability('UPDATE',this.tab,this.gridButtons)){
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
  addNewForm(formName){
    if(this.selectContact != ''){
      this.selectContactAdd = this.selectContact;
    }    
    this.formName = formName;
    let fromResponce = this.formCreationService.getFieldsFromForms(this.tab,this.formName,this.dinamic_form,this.gridButtons,this.tableFields,this.actionButtons);
    this.tableFields = fromResponce.fields;
    this.actionButtons = fromResponce.buttons;
    
    if(this.tableFields.length > 0){
      this.currentBrowseUrl = this.routerService.updateRouteUrl(this.selectedRowIndex,this.elements,this.currentBrowseUrl).currentBrowseUrl;
      this.subscribeAddUpdateResponce();
      this.formCreationService.addNewForm(this.selectTabIndex,this.isBulkUpdate,this.bulkuploadList,this.selectedRowIndex,this.formName,this.selectContactAdd);
    }else{
      this.notificationService.notify('text-danger','Action not allowed!!!')
    }
    if(formName == 'DINAMIC_FORM'){
      this.selectedRowIndex = this.currentRowIndex;
    }
  }
  subscribeAddUpdateResponce(){
    this.addUpdateFormResponceSubscription = this.dataShareService.addAndUpdateResponce.subscribe(data =>{
      this.addAndUpdateResponce(data);
    })
  }
  addAndUpdateResponce(element) {
    this.selectedRowIndex = -1;
    if(this.pageNumber == undefined || this.pageNumber == -1 || this.pageNumber == 0){
      this.pageNumber = 1;
    }    
    this.isBulkUpdate = false;
    this.bulkuploadList = [];
    this.formName = '';
    this.currentBrowseUrl = this.routerService.updateRouteUrl(this.selectedRowIndex,this.elements,this.currentBrowseUrl).currentBrowseUrl;
    this.rowId = "";
    this.recordId = "";
    this.queryParams = {};
    this.getPage(this.pageNumber);
    if(this.addUpdateFormResponceSubscription){
      this.addUpdateFormResponceSubscription.unsubscribe();
    }  
  }
  getPage(page: number){
    let responce = this.gridCommonFunctionServie.getPage(page,this.selectContact,this.tabFilterData,this.tab,this.currentMenu,this.headElements,this.filterForm.getRawValue(),this.sortingColumnName,this.recordId,this.rowId,this.queryParams,this.itemNumOfGrid,this.gridDisable,this.modifyGridData,this.elements)
    this.elements = responce.elements;
    this.pageNumber = responce.pageNumber;
    this.modifyGridData = responce.modifyGridData;    
  }
  

}
