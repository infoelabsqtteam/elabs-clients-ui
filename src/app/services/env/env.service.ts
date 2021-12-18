import { Inject, Injectable } from '@angular/core';
import { Common } from '../../shared/enums/common.enum';
import { EndPoint } from '../../shared/enums/end-point.enum';
import { environment } from '../../../environments/environment';
import { CommonFunctionService } from '../common-utils/common-function.service';
import { StorageService } from '../../services/storage/storage.service';
import { StorageTokenStatus } from 'src/app/shared/enums/storage-token-status.enum';
import { CoreFunctionService } from '../common-utils/core-function/core-function.service';

import { DOCUMENT } from '@angular/common';
import { serverHostList } from './serverHostList'

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  HOST_NAME : string = 'HOST_NAME';
  requestType: any = '';


  constructor(
    private storageService: StorageService,
    private coreFunctionService:CoreFunctionService,
    @Inject(DOCUMENT) private document: Document,
  ) { }

  setHostNameDinamically(host:string){
    localStorage.setItem(this.HOST_NAME, host);
  }

  getHostNameDinamically(){
    return localStorage.getItem(this.HOST_NAME);
  }

  getBaseUrl(){
    let baseUrl = '';
    const host = this.getHostNameDinamically();
    if(this.coreFunctionService.isNotBlank(host)){
      baseUrl = this.getHostNameDinamically()
    }else{
      // baseUrl = environment.serverhost
      baseUrl = this.getHostName();
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
    let setHostName = this.getHostNameDinamically();
    let serverHostName = this.getHostName()
    if(serverHostName != '' && serverHostName != setHostName) {
      const hostName = serverHostName +'/rest/';
      this.setHostNameDinamically(hostName);      
    }
  }
  
  getHostName(){
    let hostname = this.document.location.hostname;
    let serverHostName = '';    
    if(serverHostList && serverHostList.length > 0){
      for (let index = 0; index < serverHostList.length; index++) {
        const element = serverHostList[index];
        if(hostname == element.clientEndpoint){
          serverHostName = element.serverEndpoint;
          break;
        }        
      }
    }
    return serverHostName;
  }







}
