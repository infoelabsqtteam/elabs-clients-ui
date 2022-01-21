import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataShareService } from '../../data-share/data-share.service';
import { EnvService } from '../../env/env.service';

@Injectable({
  providedIn: 'root'
})
export class CommonApiService {

  constructor(
    private dataShareService:DataShareService,
    private http:HttpClient,
    private envService:EnvService,
  ) { } 

  SaveNavigation(payload){
    let api = this.envService.getApi('SAVE_NAVIGATION');
    this.http.post(api, payload).subscribe(
      (respData) => {
          console.log(respData)
        },
      (error) => {
          console.log(error);
        }
    ) 
  }

  GetNavigation(payload){
    let api = this.envService.getApi('GET_CUSTOM_TEMPLATE');
    this.http.post(api, payload).subscribe(
      (respData) => {
          this.dataShareService.setNavigationData(respData);
        },
      (error) => {
          console.log(error);
        }
    ) 
  }

  SavePermission(payload){
    let api = this.envService.getApi('SAVE_PERMISSION');
    this.http.post(api, payload).subscribe(
      (respData) => {
          //this.dataShareService.setNavigationData(respData);
          console.log(respData);
        },
      (error) => {
          console.log(error);
        }
    ) 
  }
  GetPermission(payload){
    let api = this.envService.getApi('GET_CUSTOM_TEMPLATE');
    this.http.post(api, payload).subscribe(
      (respData) => {
          this.dataShareService.setPermissionData(respData);
        },
      (error) => {
          console.log(error);
        }
    ) 
  }
  SaveInformation(payload){
    let api = this.envService.getApi('SAVE_QUOTE');
    this.http.post(api, payload).subscribe(
      (respData) => {
          this.dataShareService.setQuoteData(respData);
        },
      (error) => {
          console.log(error);
        }
    ) 
  }
  ResetSave(){
    this.dataShareService.setQuoteData(null);
  }
  GetDepartments(payload){
    let api = this.envService.getApi('GET_CUSTOM_TEMPLATE');
    this.http.post(api, payload).subscribe(
      (respData) => {
          this.dataShareService.setDepartmentData(respData);
        },
      (error) => {
          console.log(error);
        }
    ) 
  }
  
  GetCategory(payload){
    let api = this.envService.getApi('GET_CUSTOM_TEMPLATE');
    this.http.post(api, payload).subscribe(
      (respData) => {
          this.dataShareService.setCategoryData(respData);
        },
      (error) => {
          console.log(error);
        }
    ) 
  }
  GetProductsByCategory(payload){
    let api = this.envService.getApi('GET_CUSTOM_TEMPLATE');
    this.http.post(api, payload).subscribe(
      (respData) => {
          this.dataShareService.setProductData(respData);
        },
      (error) => {
          console.log(error);
        }
    ) 
  }
  GetTestParameter(payload){
    let api = this.envService.getApi('GET_CUSTOM_TEMPLATE');
    this.http.post(api, payload).subscribe(
      (respData) => {
          this.dataShareService.setTestParameter(respData);
        },
      (error) => {
          console.log(error);
        }
    ) 
  }
  
}
