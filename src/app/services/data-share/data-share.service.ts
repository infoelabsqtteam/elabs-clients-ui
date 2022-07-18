import { Injectable,EventEmitter } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataShareService {
  sharedData:EventEmitter<any> = new EventEmitter();
  currentPage: EventEmitter<any> = new EventEmitter();
  currentpage:string = '';
  staticData: EventEmitter<any> = new EventEmitter<any>(null);
  setStaticData={};
  gridCountData: EventEmitter<any> = new EventEmitter<any>(null);
  setGridCountData={};
  gridData: EventEmitter<any> = new EventEmitter<any>(null);
  menu:EventEmitter<any> = new EventEmitter<any>(null);
  tempData:EventEmitter<any> = new EventEmitter<any>(null);
  tempStoreData:any; 
  saveFromDataRsponce:string='';
  deleteGridRowDataRsponce:string='';
  saveResponceData:EventEmitter<any>= new EventEmitter<any>(null);
  deleteGridRowResponceData:EventEmitter<any>= new EventEmitter<any>(null);
  gridFilterData:EventEmitter<any>= new EventEmitter<any>(null);
  typeAheadData:EventEmitter<any>= new EventEmitter<any>(null);
  form:EventEmitter<any>= new EventEmitter<any>(null);
  dinamicForm={};
  docData:EventEmitter<any>= new EventEmitter<any>(null);
  nestedForm:EventEmitter<any>= new EventEmitter<any>(null);
  settingData:EventEmitter<any> = new EventEmitter<any>();
  hostData:EventEmitter<any> = new EventEmitter<any>();
  dashletData:EventEmitter<any> = new EventEmitter<any>(); 
  DashLetData:any={};
  appName:EventEmitter<any> = new EventEmitter<any>();
  authenticated:EventEmitter<boolean> = new EventEmitter<boolean>(false)
  navigationData:EventEmitter<any> = new EventEmitter<any>();
  permissionData:EventEmitter<any> = new EventEmitter<any>();
  quoteData:EventEmitter<any> = new EventEmitter<any>();
  departmentData:EventEmitter<any> = new EventEmitter<any>();
  categoryData:EventEmitter<any> = new EventEmitter<any>();
  productData:EventEmitter<any> = new EventEmitter<any>();
  testParameters:EventEmitter<any> = new EventEmitter<any>();
  exportExcelLink:EventEmitter<any> = new EventEmitter<any>();
  getProductList:EventEmitter<any> = new EventEmitter<any>();
  previewHtml:EventEmitter<any> = new EventEmitter<any>();
  updateProductBranch:EventEmitter<any> = new EventEmitter<any>();
  getJobSchedulesData:EventEmitter<any> = new EventEmitter<any>();
  downloadPdfData:EventEmitter<any> = new EventEmitter<any>();
  getfileData:EventEmitter<any> = new EventEmitter<any>();
  fileDownloadUrl:EventEmitter<any> = new EventEmitter<any>();
  chartData:EventEmitter<any> = new EventEmitter<any>();
  applicationSetting:EventEmitter<any> = new EventEmitter<any>();
  fieldDinamicResponce:EventEmitter<any> = new EventEmitter<any>();
  checkValidation:EventEmitter<any> = new EventEmitter<any>();
  dashletMaster:EventEmitter<any> = new EventEmitter<any>();
  gitVirsion:EventEmitter<any> = new EventEmitter<any>();
  forgot:EventEmitter<any> = new EventEmitter<any>();
  nextFormData:EventEmitter<any> = new EventEmitter<any>();
  
  getReportLoadData:EventEmitter<any> = new EventEmitter<any>();
  getIsGridSelectionOpen:EventEmitter<any> = new EventEmitter<any>();
  chartModelShowHide:EventEmitter<any> = new EventEmitter<any>();

  favouriteData:EventEmitter<any> = new EventEmitter<any>();
  userNotification:EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  sendCurrentPage(responce) { 
    if(responce != undefined && responce != null){
      this.currentPage.emit(responce);
      this.currentpage = responce;
    }else{
      this.currentPage.emit('HOME');
      this.currentpage = 'HOME';
    }      
  }
  getCurrentPage(){
    return this.currentpage;
  }

  shareData(responce:any){
    this.sharedData.emit(responce);
  }
  shareStaticData(staticData:any){
    this.staticData.emit(staticData);
    this.setStaticData = staticData;
  }
  getStatiData(){
    return this.setStaticData;
  }
  shareGridCountData(gridCountData:any){
    this.gridCountData.emit(gridCountData);
    this.setGridCountData = gridCountData;
  }
  getGridCountData(){
    return this.setGridCountData;
  }
  shareGridData(gridData:any){
    this.gridData.emit(gridData);
  }
  shareDashletMaster(responce){
    this.dashletMaster.emit(responce)
  }
  shareMenuData(menuData:any){
    this.menu.emit(menuData);
  }
  shareTempData(tempData:any){
    this.tempData.emit(tempData);
    this.tempStoreData = tempData;
  }
  getTempData(){
    return this.tempStoreData;
  }
  setSaveResponce(responce:any){
    this.saveResponceData.emit(responce);
    this.saveFromDataRsponce = responce;
  }
  getSaveResponce(){
    return this.saveFromDataRsponce;
  }

  setDeleteGridRowResponce(responce){
    this.deleteGridRowResponceData.emit(responce);
    this.deleteGridRowDataRsponce = responce;
  }
  getDeleteRowDataResponce(){
    return this.deleteGridRowDataRsponce;
  }

  setGridFilterData(responce){
    this.gridFilterData.emit(responce);
  }
  setTypeAheadData(responce){
    this.typeAheadData.emit(responce);
  }
  setForm(form:any){
    this.form.emit(form);
    this.dinamicForm = form;
  }
  getDinamicForm(){
    return this.dinamicForm;
  }
  setNestedForm(form:any){
    this.nestedForm.emit(form)
  }

  restSettingModule(value){
    this.settingData.emit(value)
  }
  setHostData(data){
    this.hostData.emit(data);
  }
  setDashletData(dashletData){
    this.dashletData.emit(dashletData);
    this.DashLetData = dashletData;
  }
  getDashletData(){
    return this.DashLetData
  }
  resetDashletData(){
    this.DashLetData = {};
  }
  resetDashletDataByKey(keyName){
    delete this.DashLetData[keyName];
    this.dashletData.emit(this.DashLetData);
  }
  setAppName(response){
    this.appName.emit(response);
  }
  setAuthentication(responce:boolean){
    this.authenticated.emit(responce);
  }
  getAuthentication(){
    return this.authenticated;
  }
  setNavigationData(responce){
    this.navigationData.emit(responce);
  }
  setPermissionData(responce){
    this.permissionData.emit(responce);
  }
  setQuoteData(responce){
    this.quoteData.emit(responce);
  }
  setDepartmentData(responce){
    this.departmentData.emit(responce);
  }
  setCategoryData(responce){
    this.categoryData.emit(responce);
  }
  setProductData(responce){
    this.productData.emit(responce);
  }
  setTestParameter(responce){
    this.testParameters.emit(responce);
  }
  setExportExcelLink(responce){
    this.exportExcelLink.emit(responce);
  }
  setProductList(responce){
    this.getProductList.emit(responce)
  }
  setPreviewHtml(responce){
    this.previewHtml.emit(responce);
  }
  setUpdateProductBranch(responce){
    this.updateProductBranch.emit(responce);
  }
  setJobScheduleData(responce){
    this.getJobSchedulesData.emit(responce);
  }
  setDownloadPdfData(responce){
    this.downloadPdfData.emit(responce);
  }
  setFileData(responce){
    this.getfileData.emit(responce);
  }
  setFileDownloadUrl(responce){
    this.fileDownloadUrl.emit(responce)
  }
  setChartData(responce){
    this.chartData.emit(responce)
  }
  setThemeSetting(responce){
    this.applicationSetting.emit(responce)
  }
  setFieldDinamicApiResponce(responce){
    this.fieldDinamicResponce.emit(responce);
  }
  setValidationCondition(responce){
    this.checkValidation.emit(responce);
  }
  setGitVersion(responce){
    this.gitVirsion.emit(responce);
  }
  setForgot(responce){
    this.forgot.emit(responce);
  }
  setNextFormData(responce){
    this.nextFormData.emit(responce);
  }
  setReportLoadGridData(responce){
    this.getReportLoadData.emit(responce);
  }
  setIsGridSelectionOpenOrNot(check:boolean){
    this.getIsGridSelectionOpen.emit(check);
  }
  setChartModelShowHide(value){
    this.chartModelShowHide.emit(value);
  }
  setFavouritData(responce){
    this.favouriteData.emit(responce);
  }
  shareUserNotification(responce){
    this.userNotification.emit(responce);
  }
}
