import { Component, OnInit,OnDestroy, OnChanges,SimpleChanges, Input } from '@angular/core';
import { CommonFunctionService } from '../../../services/common-utils/common-function.service';
import { StorageService} from '../../../services/storage/storage.service';
import { PermissionService } from '../../../services/permission/permission.service';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api/api.service';
import { DataShareService } from '../../../services/data-share/data-share.service';
import { NotificationService } from 'src/app/services/notify/notification.service';
import { ModelService } from 'src/app/services/model/model.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
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
  selector: 'app-grid-card-view',
  templateUrl: './grid-card-view.component.html',
  styleUrls: ['./grid-card-view.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class GridCardViewComponent implements OnInit,OnDestroy, OnChanges {
  elements:any=[];
  userInfo: any;
  currentMenu:any='';
  pageNumber: number = 1;
  @Input() selectTabIndex:number;
  selectedRowIndex: any = -1;
  itemNumOfGrid: any = 50;
  headElements = [];
  form_action_buttons:any=[];
  createFilterFormgroup: boolean = true;
  public selectedViewRowIndex = -1;
  public viewColumnName = '';
  tabs:any=[];
  tab:any=[];
  showNotify:boolean=false;
  deleteIndex:any=-1;
  current_selected_menu:any='';
  tableFields:any=[];
  total: number;
  updateGridData:boolean=false;
  formName:any='NEW';
  createFilterHeadElement:boolean=true;
  action_buttons:any=[];
  filterForm: FormGroup;
  filterFieldName:string='name';

  selectContactAdd:string='';

  @Input() selectContact:string;
  gridDataSubscription;
  tempDataSubscription;
  saveResponceSubscription;
  exportExcelSubscription;

  constructor(
    private ModalService:ModelService,
    private commonFunctionService:CommonFunctionService,
    private storageService: StorageService,
    private permissionService: PermissionService,
    private formBuilder: FormBuilder,
    private apiService:ApiService,
    private dataShareService:DataShareService,
    private notificationService:NotificationService
  ) { 
    this.gridDataSubscription = this.dataShareService.gridData.subscribe(data =>{
      this.setGridData(data);
    })
    this.tempDataSubscription = this.dataShareService.tempData.subscribe(temp => {
      this.setTempData(temp);
    })
    this.saveResponceSubscription = this.dataShareService.saveResponceData.subscribe(responce => {
      this.setSaveResponce(responce);
    })
    this.exportExcelSubscription = this.dataShareService.exportExcelLink.subscribe(data =>{
      this.setExportExcelLink(data);
    })
    this.userInfo = this.storageService.GetUserInfo();
    this.currentMenu = this.storageService.GetActiveMenu();
    if (this.currentMenu.name != '') {
      const payload = this.commonFunctionService.getTemData(this.currentMenu.name);
      this.apiService.GetTempData(payload);
      this.getPage(1);
    }
  }

  ngOnDestroy(){    
    if(this.gridDataSubscription){
      this.gridDataSubscription.unsubscribe();
    }
    if(this.tempDataSubscription){
      this.tempDataSubscription.unsubscribe();
    }
    if(this.saveResponceSubscription){
      this.saveResponceSubscription.unsubscribe();
    }
    if(this.exportExcelSubscription){
      this.exportExcelSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges) {    
    this.selectedRowIndex = -1;  
    this.createFilterFormgroup = true;  
    this.createFilterHeadElement = true;
    this.selectContactAdd = '';
    this.elements=[];
    // Set default values and re-fetch any data you need.
    this.currentMenu = this.storageService.GetActiveMenu();
    if (this.currentMenu != null && this.currentMenu != undefined && this.currentMenu.name && this.currentMenu.name != '') {
      this.current_selected_menu = this.currentMenu.name;
      const payload = this.commonFunctionService.getTemData(this.currentMenu.name);
      this.apiService.GetTempData(payload);
      this.getPage(1);
    }
    
  }
  ngOnInit(): void {
  }

  setTempData(tempData){
    if (tempData && tempData.length > 0) {
      this.tabs = tempData[0].templateTabs;
      this.getTabData(this.selectTabIndex,this.formName);
    }
  }
  setGridData(gridData){
    if (gridData) {
      if (gridData.data && gridData.data.length > 0) {
        this.elements = JSON.parse(JSON.stringify(gridData.data))
        this.total = gridData.data_size;
      } else {
        this.elements = [];
      }
    }
  }
  getTabData(index,formName) {
    if(index != undefined){
      this.tab = this.tabs[index]
      if(this.tab && this.tab != undefined){
        if(this.tab.tab_name && this.tab.tab_name != undefined){
          this.currentMenu.name = this.tab.tab_name;
        }
        if(this.tab.grid && this.tab.grid != undefined){
          if(this.tab.grid.gridColumns){
            if(this.createFilterHeadElement){
              this.headElements = this.tab.grid.gridColumns;
              this.createFilterHeadElement = false;
            }
          }else{
            this.headElements = []
          } 
          if(this.tab.grid.action_buttons && this.tab.grid.action_buttons != null && this.tab.grid.action_buttons != ''){
            this.action_buttons = this.tab.grid.action_buttons;
          }else{
            this.action_buttons = [];
          }
        }else{
          this.headElements = []
          this.action_buttons = [];
        }
        if(this.tab.forms && this.tab.forms != undefined && this.tab.forms != null){
          let form = this.commonFunctionService.getForm(this.tab.forms,formName);        
          if(form['tableFields'] && form['tableFields'] != undefined && form['tableFields'] != null){
            this.tableFields = form['tableFields'];
          }else{
            this.tableFields = [];
          } 
          if(form['tab_list_buttons'] && form['tab_list_buttons'] != undefined && form['tab_list_buttons'] != null){
            this.form_action_buttons = form['tab_list_buttons'];
          }       
        }else{
          this.tableFields = [];
        }
        
      }else{
        this.tableFields = [];
        this.headElements = [];
      }
      
      if (this.createFilterFormgroup) {
        this.createFilterFormgroup = false;
        const forControl = {};
        if(this.headElements.length > 0){
          this.headElements.forEach(element => {
            let fieldName = element.field_name;
            let mandatory = false;
            let disabled = false;
            switch (element.type.toLowerCase()) {
              case "text":
                this.commonFunctionService.createFormControl(forControl, element, '', "text")
                break;
              case "tree_view_selection":
                this.commonFunctionService.createFormControl(forControl, element, '', "text")
                break;
              case "dropdown":
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

          });
        }

        if (forControl) {
          this.filterForm = this.formBuilder.group(forControl);
        }
        const staticModalGroup = this.commonFunctionService.commanApiPayload(this.headElements,this.tableFields,this.form_action_buttons);      
        if (staticModalGroup.length > 0) {
          // this.store.dispatch(
          //   new CusTemGenAction.GetStaticData(staticModalGroup)
          // )
          this.apiService.getStatiData(staticModalGroup);
        }
      }
    }

  }
  setSaveResponce(saveFromDataRsponce){
    if (saveFromDataRsponce != '' && this.updateGridData) {
      if (saveFromDataRsponce.success == 'success') {
        this.updateGridData = false;
        this.notificationService.notify("bg-success", " Grid Data Update successfull !!!");
      }
      this.getPage(1)
      this.apiService.ResetSaveResponce();
    }
    if (saveFromDataRsponce.error && saveFromDataRsponce.error != '' && this.showNotify) {
      this.notificationService.notify("bg-danger", saveFromDataRsponce.error);
      this.showNotify = false;
      this.apiService.ResetSaveResponce();
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
    }
  }
  addNewForm(formName){
    if(this.selectContact != ''){
      this.selectContactAdd = this.selectContact;
    } 
    this.formName = formName;    
    if(this.tab && this.tab.forms){
      let form = this.commonFunctionService.getForm(this.tab.forms,this.formName);        
      if(form['tableFields'] && form['tableFields'] != undefined && form['tableFields'] != null){
        this.tableFields = form['tableFields'];
      }else{
        this.tableFields = [];
      }
      if(form['tab_list_buttons'] && form['tab_list_buttons'] != undefined && form['tab_list_buttons'] != null){
        this.form_action_buttons = form['tab_list_buttons'];
      }
    }else{
      this.tableFields = [];
    }
    
    const staticModalGroup=this.commonFunctionService.commanApiPayload([],this.tableFields,this.form_action_buttons);
    if(this.tab.api_params && this.tab.api_params != null && this.tab.api_params != "" && this.tab.api_params != undefined && this.selectedRowIndex == -1){
      
      let criteria = [];
      if(this.tab.api_params_criteria && this.tab.api_params_criteria != null){
        criteria=this.tab.api_params_criteria
      }
      staticModalGroup.push(this.commonFunctionService.getPaylodWithCriteria(this.tab.api_params,this.tab.call_back_field,criteria,{}))
      
    }
    if(this.tableFields.length > 0){
      let formData = {}
      this.ModalService.open('form-modal',formData)
    }else{
      this.notificationService.notify('text-danger','Fields are not available ?')
    }
        
    if(staticModalGroup.length > 0){
      // this.store.dispatch(
      //   new CusTemGenAction.GetStaticData(staticModalGroup)
      // )
      this.apiService.getStatiData(staticModalGroup);
    }
  }

  addAndUpdateResponce(event){
    //alert('scheduling dashboard');
    if (event == 'add') {
      this.selectedRowIndex = -1;
      this.getPage(1);
    } else if (event == 'update') {      
      this.selectedRowIndex = -1;
      this.getPage(1);
    }
    if (event == 'cancel') {
      this.selectedRowIndex = -1;
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
    if (!field.type) field.type = "Text";
    switch (field.type.toLowerCase()) {
      case "info":
        if (value && value != '') {
          this.selectedViewRowIndex = -1;
          this.viewColumnName = '';
          this.viewModal('basic-modal', value, field.label, i, field.field_name,editemode);
        };
        break;
      default: return;
    }

  }

  viewModal(id, object, field, index, columnName,editemode) {
    this.selectedViewRowIndex = index;
    this.viewColumnName = columnName;
    const alertData = {
      "field": field,
      "data": object,
      "menu_name": this.currentMenu.name,
      'editemode': editemode
    }
    this.ModalService.open(id, alertData);
  }

  

  progressWidth(parameterLimit,parametter){
    if(parametter != null && parametter.length > 0){
      return parametter.length*100/parameterLimit+'%';
    }else{
      return 0*100/parameterLimit+'%';
    }
    
  }
  progressText(parameterLimit,parametter){
    if(parametter != null && parametter.length > 0){
      return parametter.length+'/'+parameterLimit;
    }else{
      return 0+'/'+parameterLimit;
    }
  }
  addPlay(value,index){
    // let data={...this.elements[index]}
    // data['job_status']=value;
    // this.elements[index] = data;
    // data.log=this.storageService.getUserLog();
    // this.showNotify=true;
    // const saveFromData = {
    //   curTemp: this.currentMenu.name,
    //   data: data
    // }
    // this.store.dispatch(new CusTemGenAction.SaveFormData(saveFromData))
    this.commonFunctionService.openAlertModal('confirm-modal-schedule','info','info','this is ingo');
  }
  showParameters(object,i){
    let field = this.getGridColoumn();
    this.clickOnGridElement(field,object, i)
  }
  getGridColoumn(){
    let field={}
    this.headElements.forEach(element => {
      if(element.field_name == 'quotation_param_methods'){
        field=element;
      }
    });
    return field;
  }
  

  editedRowData(id,formName) {
    if (this.permissionService.checkPermission(this.currentMenu.name, 'edit') && this.tableFields.length > 0) {
      this.selectedRowIndex = id;
      if(formName == 'UPDATE'){   
        if(this.checkFieldsAvailability){
          this.addNewForm(formName);
        }else{
          return;
        }        
      }else{
        this.addNewForm(formName);
      }      
    } else {
      this.notificationService.notify("bg-danger", "Permission denied !!!");
    }
  }

  checkFieldsAvailability(){
    if(this.tab && this.tab.forms){
      const formName = 'NEW';
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

  openModal(id, index,  data, alertType,bodyMessage,headerMessage) {
    this.deleteIndex = index;
    this.commonFunctionService.openAlertModal(id,alertType,headerMessage,bodyMessage);    
  }

  alertResponce(responce) {
    if (responce) {
      this.deleteitem()
    } else {
      this.cancel();
    }
  }

  deleteitem() {
    let data=this.elements[this.deleteIndex]
    data['status']="I";
    data.log=this.storageService.getUserLog();
    this.showNotify=true;
    const saveFromData = {
      curTemp: this.currentMenu.name,
      data: data
    }
    this.apiService.SaveFormData(saveFromData);  
    this.cancel()
  }
  cancel() {    
    this.deleteIndex = -1;
  }

  numberOfTabs(item){
    const field_name = this.headElements[2].field_name
    if(item[field_name] && item[field_name] != null &&  item[field_name].length > 0){
      return item[field_name].length;
    }else{
      return 0;
    }
  }
  public downloadClick = '';
  isGridFieldExist(fieldName){
    if(this.tab.grid && this.tab.grid[fieldName] && this.tab.grid[fieldName] != undefined && this.tab.grid[fieldName] != null && this.tab.grid[fieldName] != ''){
     return true;
    }
    return false;
  }
  
  exportExcel() {  
    let tempNme = this.currentMenu.name;
    if(this.permissionService.checkPermission(tempNme,'export')){  
      let gridName = '';
      let grid_api_params_criteria = [];
      if(this.isGridFieldExist("api_params_criteria")){
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
      this.notificationService.notify("bg-danger", "Permission denied !!!");
    }
  }
  
  responceData(data){
    console.log(data);
    let updateData = {...this.elements[this.selectedViewRowIndex]};
    updateData[this.viewColumnName] = data;
    updateData.log = this.storageService.getUserLog();
      //console.log(updateData);
    const saveFromData = {
      curTemp: this.currentMenu.name,
      data: updateData
    }
    this.updateGridData = true;
    this.apiService.SaveFormData(saveFromData);
  }
  getActionButtonClass(btn){
    if(btn.field_class != ''){
      switch (btn.field_class) {
        case 'highlight_off':
          return 'text-danger';
        default:
          return;
      }
    }
  }

  

  gridButtonAction(gridData,index,button){
    if(button && button.onclick && button.onclick.action_name){
      switch (button.onclick.action_name.toUpperCase()) {
        case 'UPDATE':
          this.editedRowData(index,button.onclick.action_name.toUpperCase())
          break;
        case 'UPDATE_RESULT':
          this.showParameters(gridData,index);
          break;
        default:
          this.editedRowData(index,button.onclick.action_name)
          break;
      }
    }
  }
  applyFilter() {
    this.pageNumber = 1;
    this.getDataForGrid();
  }
  getDataForGrid(){
    let grid_api_params_criteria = [];
    if(this.tab.grid && this.tab.grid.grid_page_size && this.tab.grid.grid_page_size != null && this.tab.grid.grid_page_size != ''){
      this.itemNumOfGrid = this.tab.grid.grid_page_size;
    }
    if(this.isGridFieldExist("api_params_criteria")){
      grid_api_params_criteria = this.tab.grid.api_params_criteria;
    }
    const data = this.commonFunctionService.getPaylodWithCriteria(this.currentMenu.name,'',grid_api_params_criteria,'');
    data['pageNo'] = this.pageNumber - 1;
    data['pageSize'] = this.itemNumOfGrid;  
    let value = {};
    if(this.filterForm) { 
      value = this.filterForm.getRawValue();
    }
    this.commonFunctionService.getfilterCrlist(this.headElements,value).forEach(element => {
      data.crList.push(element);
    });
    const getFilterData = {
      data: data,
      path: null
    }
    //this.store.dispatch(new CusTemGenAction.GetGridData(getFilterData))
    this.apiService.getGridData(getFilterData)
  }
  getPage(page: number) {
    this.pageNumber = page;
    this.getDataForGrid();
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
  clearFilter(fieldName,type){
    if(type.toLowerCase() == 'daterange'){
      (<FormGroup>this.filterForm.controls[fieldName]).controls['start'].patchValue('');
      (<FormGroup>this.filterForm.controls[fieldName]).controls['end'].patchValue('');
    }else{
      this.filterForm.get([fieldName]).setValue('');
    }    
    this.applyFilter();
  }
  getddnDisplayVal(val) {
    return this.commonFunctionService.getddnDisplayVal(val);    
  }
}
