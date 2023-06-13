import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, tap, switchMap, mergeMap, catchError } from 'rxjs/operators';
import { from, of, Observable } from 'rxjs';//fromPromise
import { DataShareService } from '../data-share/data-share.service';
import { EnvService } from '../env/env.service';
import { Router,ActivatedRoute,NavigationStart,NavigationEnd } from '@angular/router';
import { response } from 'express';
import { ModelService } from '../model/model.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  serverReq:boolean = false;

constructor(
  private dataShareService:DataShareService,
  private http:HttpClient,
  private envService:EnvService,
  private router:Router,
  private modalService: ModelService, 
  private stroageService:StorageService
) { }
  getStatiData(payloads){ 
    this.dataShareService.setReqResponce(true);
    let reqLength = payloads.length;
    let responceCount = 0;
    from(payloads)
    .pipe(
      mergeMap((payload)=>         
        this.staticDataCall([payload]))
      )
      .subscribe(
        (res) => {
          this.setStaticData(res['success'])
          responceCount = responceCount + 1;
          if(responceCount == reqLength){
            this.dataShareService.setReqResponce(false);
          }
        },
        (error)=>{
          console.log(error);
        }
    )
  }
  staticDataCall(payload){
    let api = this.envService.getApi('GET_STATIC_DATA');
    return this.http.post(api, payload)
  }
  setStaticData(data){
    const staticData = this.dataShareService.getStatiData();
    const currentData = {};    
    if(data.length > 0){                
      data.forEach(element => {
        if(element.adkeys){
            if(element.adkeys.totalRows && element.adkeys.totalRows != ''){
                staticData[element.field] = [];
                currentData[element.field] = [];
                for (let index = 0; index < element.adkeys.totalRows; index++) {
                    staticData[element.field].push(element.data);
                    currentData[element.field].push(element.data);                              
                }
            }
            if(element.adkeys.index && element.adkeys.index != ''){
                if(staticData[element.field] && staticData[element.field].length > 0){
                    const index = element.adkeys.index;
                    staticData[element.field][index] = element.data;
                    currentData[element.field][index] = element.data;
                }
            }
        }else{
            staticData[element.field] = element.data;
            currentData[element.field] = element.data;
        }                    
      }); 
    }
    if(data['staticDataMessgae'] != null && data['staticDataMessgae'] != ''){
      staticData['staticDataMessgae'] = data['staticDataMessgae'];
      currentData['staticDataMessgae'] = data['staticDataMessgae'];
    } 
    this.dataShareService.shareStaticData(staticData,currentData);

  }
  ResetStaticData(keyName){
    let staticData = this.dataShareService.getStatiData();
    staticData[keyName.field] = null;
    this.dataShareService.shareStaticData(staticData,{});
  }
  resetStaticAllData(){
    this.dataShareService.shareStaticData({},{})
  }
  getGridCountData(payloads){ 
    from(payloads)
    .pipe(
      mergeMap((payload)=>         
        this.gridCountDataCall([payload]))
      )
      .subscribe(
        (res) => {
          this.setGridCountData(res['success'])
        },
        (error)=>{
          console.log(error);
        }
    )
  }
  gridCountDataCall(payload){
    let api = this.envService.getApi('GET_COUNT_DATA');
    return this.http.post(api, payload)
  }
  setGridCountData(data){
    const gridCountData = this.dataShareService.getGridCountData();    
    if(data.length > 0){                
      data.forEach(element => {
        gridCountData[element.field] = element.data_size            
      }); 
    } 
    this.dataShareService.shareGridCountData(gridCountData);

  }
  resetGridCountAllData(){
    this.dataShareService.shareGridCountData({})
  }
  getGridData(payload){
    let api = this.envService.getApi('GET_GRID_DATA');
    this.http.post(api + '/' + payload.path, payload.data).subscribe(
      (respData) => {
          this.dataShareService.shareGridData(respData)
        },
      (error) => {
          console.log(error);
        }
    ) 
  }
  resetGridData(){
    this.dataShareService.shareGridData([])
  }
  getDashletMster(payload){
    let api = this.envService.getApi('GET_GRID_DATA');
    this.http.post(api + '/' + payload.path, payload.data).subscribe(
      (respData) => {
          this.dataShareService.shareDashletMaster(respData)
        },
      (error) => {
          console.log(error);
        }
    ) 
  }
  getMongoDashletMster(payload){
    let api = this.envService.getApi('GET_GRID_DATA');
    this.http.post(api + '/' + payload.path, payload.data).subscribe(
      (respData) => {
          this.dataShareService.shareMongoChart(respData)
        },
      (error) => {
          console.log(error);
        }
    ) 
  }
  GetTempMenu(payload){
    let api = this.envService.getApi('GET_CUSTOM_TEMPLATE');
    this.http.post(api, payload).subscribe(
      (respData) => {
          this.dataShareService.shareMenuData(respData)
        },
      (error) => {
          console.log(error);
        }
    )
  }
  resetMenuData(){
    this.dataShareService.shareMenuData([])
  }

  GetTempData(payload){
    let api = this.envService.getApi('GET_CUSTOM_TEMPLATE');
    this.http.post(api, payload).subscribe(
      (respData) => {
          this.dataShareService.shareTempData(respData)
        },
      (error) => {
          console.log(error);
        }
    ) 
  }
  resetTempData(){
    this.dataShareService.shareTempData([])
  }
  deleteGridRow(payload){
    let api = this.envService.getApi('DELETE_GRID_ROW');
    this.http.post(api+ '/' + payload.curTemp,payload).subscribe(
      (response) => {
        this.dataShareService.setDeleteGridRowResponce(response);
      }
    )
  }

  SaveFormData(payload){
    let api = this.envService.getApi('SAVE_FORM_DATA');
    this.saveCall(api+ '/' + payload.curTemp,payload)
  }
  SendEmail(payload){
    let api = this.envService.getApi('SEND_EMAIL');
    this.saveCall(api+ '/' + payload.curTemp,payload)
  }
  DynamicApiCall(payload){
    let api = this.envService.getBaseUrl();
    let list = payload.path.split("/");
    let callName = list[list.length-1];
    switch(callName){
      case "gsd":
        this.getStatiData(payload.data);
      break;
      default:
        this.saveCall(api+payload.path,payload)
    }
    
  }
  saveCall(api,payload){    
    this.http.post(api, payload.data).subscribe(
      (respData) => {
          this.dataShareService.setSaveResponce(respData)
        },
      (error) => {
          console.log(error);
        }
    )
  }
  
  ResetSaveResponce(){
    this.dataShareService.setSaveResponce('')
  }
  GetFilterGridData(payload){
    let api = this.envService.getApi('GET_GRID_DATA');
    this.http.post(api + '/' + payload.path, payload.data).subscribe(
      (respData) => {
          this.dataShareService.shareGridData(respData)
        },
      (error) => {
          console.log(error);
        }
    ) 
  }
  GetTypeaheadData(payload){
    let api = this.envService.getApi('GET_STATIC_DATA');
    this.http.post(api, payload).subscribe(
      (respData) => {
        let currentstaticData=[];
        let result =[];        
        currentstaticData=respData['success'];
        if(currentstaticData.length > 0){
            result = currentstaticData[0].data
         }
          this.dataShareService.setTypeAheadData(result)
        },
      (error) => {
          console.log(error);
        }
    ) 
  }
  clearTypeaheadData(){
    this.dataShareService.setTypeAheadData([])
  }
  GetForm(payload){
    let endPoint = '';
    if(this.envService.getRequestType() == 'PUBLIC'){
      endPoint = 'GET_FORM_PUBLIC';
    }else{
      endPoint = 'GET_FORM';
    }
    let api = this.envService.getApi(endPoint);
    if(payload._id && payload._id != undefined && payload._id != null &&payload._id != ''){
        api = api + '/' + payload._id;
    }
    this.http.post(api, payload.data).subscribe(
      (respData) => {
        let dinamicForm;
        if(respData && respData['success'] != null){
            const object = JSON.parse(JSON.stringify(respData['success']));
            object['view_mode'] = "inlineFormView";
            dinamicForm = {                     
                DINAMIC_FORM : object
            }
        }
          this.dataShareService.setForm(dinamicForm)
        },
      (error) => {
          console.log(error);
        }
    ) 
  }
  GetNestedForm(payload){
    let api = this.envService.getApi('GET_CUSTOM_TEMPLATE');
    this.http.post(api, payload).subscribe(
      (respData) => {        
          this.dataShareService.setNestedForm(respData[0]);
        },
      (error) => {
          console.log(error);
        }
    )
  }
  GetHostName(payload){
    let api = this.envService.getApi('GET_GRID_DATA');
    this.http.post(api + '/' + payload.path, payload.data).subscribe(
      (respData) => {
          this.dataShareService.setHostData(respData['data'])
        },
      (error) => {
          console.log(error);
        }
    )
  }   
  GetDashletData(payloads:any){
    //this.dataShareService.setDashletData({});
    from(payloads)
    .pipe(
      mergeMap((payload)=>         
        this.dashletDataCall(payload))
      )
      .subscribe(
        (res) => {
          this.SetDashletData(res)
        },
        (error)=>{
          console.log(error);
        }
    )
  } 
  dashletDataCall(payload:any){
    let api = this.envService.getApi('GET_DASHLET_DATA');
    return this.http.post(api + '/' + payload._id, payload.data);
  }
  SetDashletData(respData:any){
    let currentStaticData=[];
    let getDashletData = this.dataShareService.getDashletData();
    const dashletData = JSON.parse(JSON.stringify(getDashletData));
    currentStaticData.push(respData);
    if(currentStaticData.length > 0){                
        currentStaticData.forEach(element => {
            if(element && element.field != undefined && element.field != null){
                dashletData[element.field] = element.data   
            }                                   
        });                 

    } 
    this.dataShareService.setDashletData(dashletData);        
  }
  GetExportExclLink(payload){
    let api = this.envService.getApi('EXPORT_GRID_DATA');
    this.http.post(api, payload.data, payload.responce).subscribe(
      (respData) => {
          this.dataShareService.setExportExcelLink(respData)
        },
      (error) => {
        this.modalService.close('download-progress-modal'); 
          console.log(error);
        }
    )
  }
  resetGetExportExclLink(){
    this.dataShareService.setExportExcelLink('');
  }
  GetProductList(payload){
    let api = this.envService.getApi('GET_PARAMETER_LIST');
    this.http.post(api, payload).subscribe(
      (respData) => {
          this.dataShareService.setProductList(respData)
        },
      (error) => {
          console.log(error);
        }
    )
  } 
  GetPreviewHtml(payload){
    let api = this.envService.getApi('GET_PREVIEW_HTML');
    this.http.post(api + '/' + payload._id, payload.data).subscribe(
      (respData) => {
          this.dataShareService.setPreviewHtml(respData['success']);
        },
      (error) => {
          console.log(error);
        }
    )
  }
  resetPreviewHtml(){
    this.dataShareService.setPreviewHtml('');
  }
  UpdateProductBranch(payload){
    let api = this.envService.getApi('SAVE_PARAMETER_LIST');
    this.http.post(api + '/' + payload._id, payload.data).subscribe(
      (respData) => {
          this.dataShareService.setUpdateProductBranch(respData);
        },
      (error) => {
          console.log(error);
        }
    )
  }
  GetJobSchedules(payload){
    let api = this.envService.getApi('GET_GRID_DATA');
    this.http.post(api + '/' + payload._id, payload.data).subscribe(
      (respData) => {
          this.dataShareService.setJobScheduleData(respData);
        },
      (error) => {
          console.log(error);
        }
    )
  }
  GetPdfData(payload){
    let api = this.envService.getApi('GET_PDF');
    this.http.post<HttpResponse<any>>(api + '/' + payload._id, payload.data, { responseType: 'arraybuffer' as 'json', observe: 'response' as 'body' }).subscribe(
      (respData) => {
          var contentDisposition = respData.headers.get('Content-Disposition');
          var filename = "";
          let matches = /filename="(.*?)"/g.exec(contentDisposition);
          if (matches != null && matches[1]) {
              filename = matches[1].replace(/['"]/g, '');
              filename = filename.substring(filename.indexOf("=") + 1, filename.length)
          }
          this.dataShareService.setDownloadPdfData({ data: respData.body, filename: filename });
        },
      (error) => {
          console.log(error);
        }
    )
  }
  ResetPdfData(){
    this.dataShareService.setDownloadPdfData('');
  }
  GetFileData(payload){
    let api = this.envService.getApi('GET_FILE');
    this.http.post<HttpResponse<any>>(api + '/' + payload._id, payload.data, { responseType: 'arraybuffer' as 'json', observe: 'response' as 'body' }).subscribe(
      (respData) => {
          var contentDisposition = respData.headers.get('Content-Disposition');
          var filename = "";
          let matches = /filename="(.*?)"/g.exec(contentDisposition);
          if (matches != null && matches[1]) {
              filename = matches[1].replace(/['"]/g, '');
              filename = filename.substring(filename.indexOf("=") + 1, filename.length)
          }
          this.dataShareService.setFileData({ data: respData.body, filename: filename });
        },
      (error) => {
          console.log(error);
        }
    )
  }
  PrintTemplate(payload){
    let api = this.envService.getApi('GET_FILE');
    this.http.post<HttpResponse<any>>(api + '/' + payload._id, payload.data, { responseType: 'arraybuffer' as 'json', observe: 'response' as 'body' }).subscribe(
      (respData) => {
          var contentDisposition = respData.headers.get('Content-Disposition');
          var filename = "";
          let matches = /filename="(.*?)"/g.exec(contentDisposition);
          if (matches != null && matches[1]) {
              filename = matches[1].replace(/['"]/g, '');
              filename = filename.substring(filename.indexOf("=") + 1, filename.length)
          }
          this.dataShareService.setPrintTemplate({ data: respData.body, filename: filename });
        },
      (error) => {
          console.log(error);
        }
    )
  }
  ResetFileData(){
    this.dataShareService.setFileData('');
  }
  DownloadFile(payload){
    let api = this.envService.getApi('DOWNLOAD_PDF');
    this.http.post(api + '/' + payload.path, payload.data).subscribe(
      (respData) => {          
          this.dataShareService.setFileDownloadUrl(respData['success']);
        },
      (error) => {
          console.log(error);
        }
    )
  }
  ResetDownloadUrl(){
    this.dataShareService.setFileDownloadUrl('');
  }
  FileUpload(payload){
    let api = this.envService.getApi('GET_PDF');
    this.http.post(api + '/' + payload._id, payload.data, payload.responce).subscribe(
      (respData) => {          
          console.log(respData);
        },
      (error) => {
          console.log(error);
        }
    )
  }
  GetChartData(payload){
    let api = this.envService.getApi('GET_CHART_DATA');
    this.http.post(api, payload).subscribe(
      (respData) => {          
          this.dataShareService.setChartData(respData);
        },
      (error) => {
          console.log(error);
        }
    )
  }
  GetQr(payload){
    let api = this.envService.getApi('GET_QR_CODE');
    this.http.post(api + payload['number'], payload,{responseType: 'blob'} ).subscribe(
      (respData) => {          
        this.dataShareService.setFileData({ data: respData, filename: "qr-"+payload['from']+"-"+(payload['to']-1) });
        },
      (error) => {
          console.log(error);
        }
    )
  }

  getAuditHistory(payload){
    let api = this.envService.getApi('AUDIT_HISTORY');
    this.http.post(api +"/"+ payload['_id'], payload).subscribe(
      (respData) => {          
        this.dataShareService.setAuditHistoryData(respData);
        },
      (error) => {
          console.log(error);
        }
    )
  }

  getAplicationsThemeSetting(payload) {
    let api = this.envService.getApi('GET_CUSTOM_TEMPLATE');
    this.http.post(api, payload).subscribe(
      (respData) => {
        if(JSON.stringify(respData) != "{}"){ 
          this.dataShareService.setThemeSetting(respData)
        }
        },
      (error) => {
          console.log(error);
        }
    )
  }
  getAplicationsSetting(payload) {
    let api = this.envService.getApi('GET_CUSTOM_TEMPLATE');
    this.http.post(api, payload).subscribe(
      (respData) => {
        if(JSON.stringify(respData) != "{}"){ 
          this.dataShareService.setApplicationSetting(respData)
        }
        },
      (error) => {
          console.log(error);
        }
    )
  }
  fieldDinamicApi(api,payload){
    const host = this.envService.getBaseUrl();
    this.http.post(host+api, payload).subscribe(
      (respData) => {         
        this.dataShareService.setFieldDinamicApiResponce(respData)
      },
      (error) => {
          console.log(error);
        }
    )
  }

  getNextFormData(payload) {
    let api = this.envService.getApi('GET_GRID_DATA');
    this.http.post(api + '/' + payload.path, payload.data).subscribe(
      (respData) => {
        if(JSON.stringify(respData) != "{}"){ 
          this.dataShareService.setNextFormData(respData)
        }
        },
      (error) => {
          console.log(error);
        }
    )
  }
  

  gitVersion(payload) {
    let api = this.envService.getApi('GIT_VERSION');
    this.http.get<any>(api).subscribe(
      (respData) => {
        this.dataShareService.setGitVersion(respData);
        },
      (error) => {
          console.log(error);
        }
    )
  }


  getReportLoadGridData(payload){
    let api = this.envService.getApi('GET_GRID_DATA');
    this.http.post(api + '/' + payload.path, payload.data).subscribe(
      (respData) => {
          this.dataShareService.setReportLoadGridData(respData)
        },
      (error) => {
          console.log(error);
        }
    ) 
  }


  getFavouriteData(payload){
    let api = this.envService.getApi('GET_GRID_DATA');
    this.http.post(api + '/' + payload.path, payload.data).subscribe(
      (respData) => {
          if(respData && respData['data'] && respData['data'].length > 0){
            const userPreference = respData['data'][0];
            this.stroageService.setUserPreference(userPreference);
            this.dataShareService.setUserPreference(userPreference);
          }else{            
            this.dataShareService.setUserPreference(respData['data']);
          }          
        },
      (error) => {
          console.log(error);
        }
    ) 
  }

  getUserNotification(payload){
    let api = this.envService.getApi('GET_GRID_DATA');
    this.http.post(api + '/' + payload.path, payload.data).subscribe(
      (respData) => {
          this.dataShareService.shareUserNotification(respData)
        },
      (error) => {
          console.log(error);
        }
    ) 
  }
  resetUserNotification(){
    this.dataShareService.shareUserNotification([])
  }

  getDownloadManual(payload){
    let api = this.envService.getApi('DOWNLOAD_MANUAL');
    this.http.post(api,payload).subscribe(
      (respData:any) => {
        const url= respData.fileUrl;
        this.dataShareService.sharePublicUrlFromS3(url);
        },
      (error) => {
          console.log(error);
        }
    ) 
  }

}
