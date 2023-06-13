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
    //let themedata = this.getHostKeyValue('theme_setting');    
    //this.setApplicationSetting();
    if(serverHostName != '' || serverHostName != setHostName) {
      const hostName = serverHostName +'/rest/';
      this.storageService.setHostNameDinamically(hostName);
      //this.setThemeSetting(themedata);
    }
  }
  
  getHostKeyValue(keyName){
    let hostname = this.getHostName('hostname');
    let value:any = '';    
    if(serverHostList && serverHostList.length > 0){
      for (let index = 0; index < serverHostList.length; index++) {
        const element = serverHostList[index];
        if(hostname == element.clientEndpoint){
          if(keyName == "object"){
            value = element;
            break;
          }else{
            value = element[keyName];
            break;
          }
          
        }        
      }
    }
    return value;
  }
  getHostName(key){
    return this.document.location[key];
  }


  setGoogleLocation(geolocation){
    (Common as any).GOOGLE_MAP_IN_FORM = geolocation;
  }

  setApplicationSetting(){
    let geolocation = this.storageService.getApplicationValueByKey('google_map');
    this.setGoogleLocation(geolocation);
  }

  themeSettingList = [
    {'propertyName':'--headerbg','key':'header_bg_color'},
    {'propertyName':'--navtxtcolor','key':'header_txt_color'},
    {'propertyName':'--navtxthovercolor','key':'header_txt_hover_color'},
    {'propertyName':'--headericon','key':'header_icon_color'},
    {'propertyName':'--headericonhover','key':'header_icon_hover_color'},
    {'propertyName':'--buttonColor','key':'btn_color'},
    {'propertyName':'--buttonHoverColor','key':'btn_hover_color'},
    {'propertyName':'--footerbg','key':'footer_bg'},
    {'propertyName':'--themecolor','key':'theme_color'},
    {'propertyName':'--activebg','key':'active_bg_color'},
    {'propertyName':'--popupHeaderBg','key':'popup_header_bg'},
    {'propertyName':'--formLabelBg','key':'form_label_bg'}
  ]
  setThemeSetting(settingObj) {
    this.themeSettingList.forEach(Object => {
      let propertyName = Object.propertyName;
      let key = Object.key;
      if(settingObj[key] && settingObj[key] != "" ) {
        document.documentElement.style.setProperty(propertyName, settingObj[key]);
      }
    });
  }
  checkRedirectionUrl(){
    let redirectURL = '';
    const url = this.storageService.getApplicationSetting();
    if(url && url['redirect_url']){
      redirectURL = url['redirect_url'];
    }
    return redirectURL;
  }
}

