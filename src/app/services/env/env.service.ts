import { Inject, Injectable } from '@angular/core';
import { Common } from '../../shared/enums/common.enum';
import { EndPoint } from '../../shared/enums/end-point.enum';
import { environment } from '../../../environments/environment';
import { CommonFunctionService } from '../common-utils/common-function.service';
import { StorageService } from '../../services/storage/storage.service';
import { StorageTokenStatus } from 'src/app/shared/enums/storage-token-status.enum';
import { CoreFunctionService } from '../common-utils/core-function/core-function.service';

import { DOCUMENT } from '@angular/common';
import { serverHostList } from './serverHostList';

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  requestType: any = '';


  constructor(
    private storageService: StorageService,
    private coreFunctionService:CoreFunctionService,
    @Inject(DOCUMENT) private document: Document,
  ) { }



  getBaseUrl(){
    let baseUrl = '';
    const host = this.storageService.getHostNameDinamically();
    if(this.coreFunctionService.isNotBlank(host)){
      baseUrl = this.storageService.getHostNameDinamically()
    }else{
      // baseUrl = environment.serverhost
      baseUrl = this.getHostKeyValue('serverEndpoint') +'/rest/';
      this.setDinamicallyHost();
    }
    return baseUrl;
  }
  getAppName(){
    return environment.appName;
  }
  getAppId(){
    return environment.appId;
  }

  baseUrl(applicationAction: string) {    
    return this.getBaseUrl() +  (<any>EndPoint)[applicationAction];
  }
  publicBaseUrl(applicationAction: string) {
      return this.getBaseUrl() + EndPoint.PUBLIC + (<any>EndPoint)[applicationAction];
  }
  otpApi(){
    return "https://2factor.in/API/V1/" + Common.API_KEY + "/SMS/"
  }
  verifyOtpApi(){
    return "https://2factor.in/API/V1/" + Common.API_KEY + "/SMS/VERIFY/"
  }
  getApi(apiName:string){
    let api;
    if(this.getRequestType() == 'PUBLIC'){
        api = this.publicBaseUrl(apiName)
    }else{
        api = this.baseUrl(apiName)
    }
    return api;
  }
  getAuthApi(apiName:string){
    let api;
    api = this.baseUrl(apiName)
    return api;
  }
  
  setRequestType(type) {
    this.requestType = type;
  }
  getRequestType() {
    if(this.requestType == ''){
      if(this.checkLogedIn()){
        this.requestType = "PRIVATE";
      }else{
        this.requestType = "PUBLIC";
      }
    }
    return this.requestType;
  }
  checkLogedIn(){
    if (this.storageService != null && this.storageService.GetIdToken() != null) {
      if(this.storageService.GetIdTokenStatus() == StorageTokenStatus.ID_TOKEN_ACTIVE){
        return true;
      }else{        
        return false;
      }      
    }
    return false;
  }

  setDinamicallyHost(){
    let setHostName = this.storageService.getHostNameDinamically();
    let serverHostName = this.getHostKeyValue('serverEndpoint');
    let projectFolderName = this.getHostKeyValue('folder');
    let menuType = this.getHostKeyValue('menu_type');
    let tempTheme = this.getHostKeyValue('theme');
    let giolocation = this.getHostKeyValue('google_map');
    let tempName = this.getHostKeyValue('temp_name');
    let themedata = this.getHostKeyValue('theme_setting');
    let pageTitle = this.getHostKeyValue('title');
    let verify_type = this.getHostKeyValue('varify_mode');
    if(serverHostName != '' || serverHostName != setHostName) {
      const hostName = serverHostName +'/rest/';
      const path = 'assets/img/logo/' + projectFolderName + '/';
      this.storageService.setHostNameDinamically(hostName);
      this.storageService.setLogoPath(path); 
      this.storageService.SetMenuType(menuType);
      this.setGoogleLocation(giolocation); 
      this.storageService.setTempName(tempName);
      this.setApplicationSetting(themedata);
      this.storageService.setPageTitle(pageTitle);
      if(verify_type){
        this.storageService.setVerifyType(verify_type);
      }      
      this.storageService.setPageTheme(tempTheme);
    }
  }
  
  getHostKeyValue(keyName){
    let hostname = this.getHostName('hostname');
    let value = '';    
    if(serverHostList && serverHostList.length > 0){
      for (let index = 0; index < serverHostList.length; index++) {
        const element = serverHostList[index];
        if(hostname == element.clientEndpoint){
          value = element[keyName];
          break;
        }        
      }
    }
    return value;
  }
  getHostName(key){
    return this.document.location[key];
  }


  setGoogleLocation(giolocation){
    (Common as any).GOOGLE_MAP_IN_FORM = giolocation;
  }

  setApplicationSetting(settingObj) {
      if(settingObj.header_bg_color != "" ) {
        document.documentElement.style.setProperty('--headerbg', settingObj.header_bg_color);
      }
      if (settingObj.header_txt_color != "") {
        document.documentElement.style.setProperty('--navtxtcolor', settingObj.header_txt_color);
      }
      if (settingObj.header_txt_hover_color != "") {
        document.documentElement.style.setProperty('--navtxthovercolor', settingObj.header_txt_hover_color);
      }
      if (settingObj.header_icon_color != "") {
        document.documentElement.style.setProperty('--headericon', settingObj.header_icon_color);
      }
      if (settingObj.header_icon_hover_color != "") {
        document.documentElement.style.setProperty('--headericonhover', settingObj.header_icon_hover_color);
      }
      if (settingObj.btn_color != "") {
        document.documentElement.style.setProperty('--buttonColor', settingObj.btn_color);
      }
      if (settingObj.btn_hover_color != "") {
        document.documentElement.style.setProperty('--buttonHoverColor', settingObj.btn_hover_color);
      }
      if (settingObj.footer_bg != "") {
        document.documentElement.style.setProperty('--footerbg', settingObj.footer_bg);
      }
      if (settingObj.theme_color != "") {
        document.documentElement.style.setProperty('--themecolor', settingObj.theme_color);
      }
      if (settingObj.active_bg_color != "") {
        document.documentElement.style.setProperty('--activebg', settingObj.active_bg_color);
      }
      if (settingObj.popup_header_bg != "") {
        document.documentElement.style.setProperty('--popupHeaderBg', settingObj.popup_header_bg);
      }
      if (settingObj.form_label_bg != "") {
        document.documentElement.style.setProperty('--formLabelBg', settingObj.form_label_bg);
      }
  }
  checkRedirectionUrl(){
    let redirectURL = '';
    const url = this.getHostKeyValue('redirect_url')
    if(url){
      redirectURL = url;
    }
    return redirectURL;
  }
}

