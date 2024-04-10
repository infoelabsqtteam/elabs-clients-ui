import { Component, OnInit,OnDestroy } from '@angular/core';
import { chardData,tableData,progressReportData,reportData } from './chartJson';
// import { CountdownTimerService } from 'ngx-timer';
import { CommonFunctionService, StorageService, PermissionService, ApiService, DataShareService, NotificationService, ModelService, ApiCallService } from '@core/web-core';


@Component({
  selector: 'app-scheduling-dashboard',
  templateUrl: './scheduling-dashboard.component.html',
  styleUrls: ['./scheduling-dashboard.component.css']
})
export class SchedulingDashboardComponent implements OnInit,OnDestroy {
  public chardData = chardData;
  public tableData = tableData;
  public reportData = reportData;
  public progressReportData = progressReportData;
  public chartType:any = {};
  public chartDatasets:any = {};
  public chartLabels:any = {};
  public chartColors:any = {};
  public chartOptions:any = {};
  public chartLegend:any = {};
  getJobSchedulesData:any=[];
  headElements:any=[];
  selectTabIndex: number = 0;
  selectedRowIndex: any = -1;
  currentMenu: any;
  getAllStaticData:boolean=true;
  updateGridData:boolean=false;
  showNotify:boolean=false;
  gridDataSubscription;
  tempDataSubscription;
  saveResponceSubscription;

  constructor(
    // private countDownService:CountdownTimerService,
    private commonFunctionService:CommonFunctionService,
    private ModalService:ModelService,
    private storageService: StorageService, 
    private permissionService: PermissionService,
    private apiService:ApiService,
    private dataShareService:DataShareService,
    private notificationService:NotificationService,
    private apiCallService:ApiCallService
  ) {
    this.gridDataSubscription = this.dataShareService.gridData.subscribe(data =>{
      this.setGridData(data);
    })
    this.tempDataSubscription = this.dataShareService.tempData.subscribe( temp => {
      this.setTempData(temp);
    })
    this.saveResponceSubscription = this.dataShareService.saveResponceData.subscribe(responce => {
      this.setSaveResponce(responce);
    })
    this.currentMenu = this.storageService.GetActiveMenu();
    if (this.currentMenu.name != '') {
      const payload = this.apiCallService.getTemData(this.currentMenu.name);
      this.apiService.GetTempData(payload);
    }
    this.getData();
    this.apiService.resetTempData();
   }

  ngOnDestroy() {
    if(this.gridDataSubscription){
      this.gridDataSubscription.unsubscribe();
    }
    if(this.saveResponceSubscription){
      this.saveResponceSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.chardData.forEach(element => {
      this.chartType[element.objType]=element.type;
      this.chartDatasets[element.objType]=element.datasets;
      this.chartLabels[element.objType]=element.labels;
      this.chartColors[element.objType]=element.colors;
      this.chartLegend[element.objType]=element.legend;
      this.chartOptions[element.objType]=element.options
    });   
    
  }

  setTempData(tempData){
    if (tempData && tempData.length > 0) {
      if(this.getAllStaticData){
        if(tempData[0].data.templateTabs){
          let tabs = tempData[0].data.templateTabs;
          let tableFields = tabs[this.selectTabIndex].tableFields;
          this.headElements = tabs[this.selectTabIndex].tableGrids[0].gridColumns;
          const staticModalGroup = this.apiCallService.commanApiPayload(this.headElements,tableFields,[]);      
          if (staticModalGroup.length > 0) {
            this.apiService.getStatiData(staticModalGroup)
          }
          this.getAllStaticData = false; 
        }
      }       
    }
  }
  setGridData(gridData){
    if (gridData) {
      if (gridData.data && gridData.data.length > 0) {
        this.getJobSchedulesData = gridData.data;
      } else {
        this.getJobSchedulesData = [];
      }
    }
  }
  setSaveResponce(saveFromDataRsponce){
    if (saveFromDataRsponce != '' && this.updateGridData) {
      if (saveFromDataRsponce == 'success') {
        this.updateGridData = false;
        this.notificationService.notify("bg-success", " Grid Data Update successfull !!!");
      }
      this.getData();
      this.apiService.ResetSaveResponce();
    }
    if (saveFromDataRsponce) {
      if (saveFromDataRsponce.success && saveFromDataRsponce.success != '' && this.showNotify) { 
        this.notificationService.notify("bg-success", " Update successfull !!!"); 
        this.showNotify = false;
        this.getData();
        this.apiService.ResetSaveResponce();         
      }
      if (saveFromDataRsponce.error && saveFromDataRsponce.error != '' && this.showNotify) {
        this.notificationService.notify("bg-danger", saveFromDataRsponce.error);
        this.showNotify = false;
        this.apiService.ResetSaveResponce();
      }
      
    } 
  }
  getData(){
    const getJobschedules={
      path: null,
      data : this.apiCallService.getPaylodWithCriteria('job_schedules','',[],'')
    }
    this.apiService.getGridData(getJobschedules)
  }
  
  
  startJobs(){
    let cdate = new Date();
    cdate.setHours(cdate.getHours() + 3);
    // this.countDownService.startTimer(cdate);
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
  
  addOrder(){
    const addOrder = {}
    this.ModalService.open('add-order-modal',addOrder);
  }
  addNewForm(){
    let formData = {}
    this.ModalService.open('form-modal',formData)
  }
  addOrderModalResponce(event){
    alert(event);
  }
  addAndUpdateResponce(event){
    //alert('scheduling dashboard');
    if (event == 'add') {
      this.selectedRowIndex = -1;
      this.getData();
    } else if (event == 'update') {      
      this.selectedRowIndex = -1;
      this.getData();
    }
    if (event == 'cancel') {
      this.selectedRowIndex = -1;
    }
  }
  editedRowData(id) {
    if (this.permissionService.checkPermission(this.currentMenu.name, 'edit')) {
      this.selectedRowIndex = id;
      this.addNewForm();
    } else {
      this.notificationService.notify("bg-danger", "Permission denied !!!");
    }
  }
  addPlay(value,index){
    let data=this.getJobSchedulesData[index]
    data['job_status']=value;
    data.log=this.storageService.getUserLog();
    this.showNotify=true;
    const saveFromData = {
      curTemp: this.currentMenu.name,
      data: data
    }
    this.apiService.SaveFormData(saveFromData);
  }
  deleteIndex:any=-1;
  openModal(id, index,  data, alertType) {
    this.deleteIndex = index;
    const alertData = {
      "event": true,
      "type": alertType,
      "data": data
    }
    this.ModalService.open(id, alertData);
  }
  alertResponce(responce) {
    if (responce) {
      this.deleteitem()
    } else {
      this.cancel();
    }
  }
  deleteitem() {
    let data=this.getJobSchedulesData[this.deleteIndex]
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
  selectedViewRowIndex:any=-1;
  viewColumnName:any="";
  showParameters(object,i){
    let field = this.getGridColoumn();
    this.clickOnGridElement(field,object, i)
  }
  getGridColoumn(){
    let field={}
    this.headElements.forEach(element => {
      if(element.gird_list_column_name == 'quotation_param_methods'){
        field=element;
      }
    });
    return field;
  }
  clickOnGridElement(field,object, i) {    
    let value={};
    value['data'] = this.commonFunctionService.getObjectValue(field.gird_list_column_name, object)
    if(field.gridColumns && field.gridColumns.length > 0){
      value['gridColumns'] = field.gridColumns;
    }
    let editemode = false;
    if(field.gird_list_field_editable){
      editemode = true;
    }
    if (!field.gird_list_column_type) field.gird_list_column_type = "Text";
    switch (field.gird_list_column_type.toLowerCase()) {
      case "info":
        if (value && value != '') {
          this.selectedViewRowIndex = -1;
          this.viewColumnName = '';
          this.viewModal('basic-modal', value, field.gird_list_field_label, i, field.gird_list_column_name,editemode);
        };
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
  responceData(data){
    console.log(data);
    let updateData = this.getJobSchedulesData[this.selectedViewRowIndex];
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

  chartHover(e){}
  chartClicked(e){}
}
