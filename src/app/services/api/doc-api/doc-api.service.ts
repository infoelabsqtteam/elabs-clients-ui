import { Injectable } from '@angular/core';
import { EnvService } from '../../env/env.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DocDataShareService } from '../../data-share/doc-data-share/doc-data-share.service';

@Injectable({
  providedIn: 'root'
})
export class DocApiService {

  constructor(
    private http:HttpClient,
    private envService:EnvService,
    private docDataShare:DocDataShareService
  ) { }

  SearchDocData(payload){
    let api = this.envService.getApi('GET_CUSTOM_TEMPLATE');
    this.http.post(api, payload).subscribe(
      (respData) =>{
        this.docDataShare.setDocData(respData);
      },
      (error)=>{
        console.log(error);
      }
    )
  }
  GetHomeVdr(payload){
    let api = this.envService.getApi('GET_VDR_DATA');
    this.http.post(api + '/' + payload.appId+ '/' + payload.refCode, payload.log).subscribe(
      (respData) =>{
        if(respData['success']){
          this.docDataShare.setVdrData(respData['success']);
          this.docDataShare.setMoveFolderData(respData['success']);
        }
      },
      (error)=>{
        console.log(error);
      }
    )
  }
  GetHomeVdrBack(payload){
    let api = this.envService.getApi('GET_VDR_DATA');
    this.http.post(api + '/' + payload.appId+ '/' + payload.refCode, payload.log).subscribe(
      (respData) =>{
        if(respData['success']){
          this.docDataShare.setMoveFolderData(respData['success']);
        }
      },
      (error)=>{
        console.log(error);
      }
    )
  }
  GetMoveFolderData(payload){
    let api = this.envService.getApi('GET_VDR_DATA');
    this.http.post(api, payload).subscribe(
      (respData) =>{
        this.docDataShare.setMoveFolderData(respData);
      },
      (error)=>{
        console.log(error);
      }
    )
  }
  GetMoveFolderChild(payload){
    let api = this.envService.getApi('MOVE_FOLDER_CHILD');
    this.http.post(api, payload).subscribe(
      (respData) =>{
        this.docDataShare.setMoveFolderChildData(respData);
        this.docDataShare.setMoveFolderData(respData);
      },
      (error)=>{
        console.log(error);
      }
    )
  }
  SaveUploadFile(payload){
    let api = this.envService.getApi('UPLOAD_DOC_FILE');
    this.http.post(api, payload).subscribe(
      (respData) =>{
        this.docDataShare.setDocUploadResponce(respData);
      },
      (error)=>{
        console.log(error);
      }
    )
  }
  CreateFolder(payload){
    let api = this.envService.getApi('CREATE_FOLDER');
    this.http.post(api, payload).subscribe(
      (respData) =>{
        this.docDataShare.setCreateFolder(respData);
      },
      (error)=>{
        console.log(error);
      }
    )
  }
  GetFolderChild(payload){
    let api = this.envService.getApi('MOVE_FOLDER_CHILD');
    this.http.post(api, payload).subscribe(
      (respData) =>{
        this.docDataShare.setVdrData(respData);
      },
      (error)=>{
        console.log(error);
      }
    )
  }
  GetFolderByKey(payload){
    let api = this.envService.getApi('GET_FOLDER_BY_KEY');
    this.http.post(api, payload).subscribe(
      (respData) =>{
        this.docDataShare.setVdrData(respData['success']);        
      },
      (error)=>{
        console.log(error);
      }
    )
  }
  GetDocAudit(payload){
    let api = this.envService.getApi('GET_DOC_AUDIT');
    this.http.post(api, payload).subscribe(
      (respData) =>{
        this.docDataShare.setDocAudit(respData);
      },
      (error)=>{
        console.log(error);
      }
    )
  }
  ResetAudit(){
    this.docDataShare.setDocAudit([]);
  }
  DocFileDownload(payload){
    let api = this.envService.getApi('DOC_FILE_DOWNLOAD');
    this.http.post(api, payload).subscribe(
      (respData) =>{
        this.docDataShare.setDocFileDownloadLink(respData['success']);
      },
      (error)=>{
        console.log(error);
      }
    )
  }
  ResetDownloadLink(){
    this.docDataShare.setDocFileDownloadLink('');
  }
  GetDocFileViewLink(payload){
    let api = this.envService.getApi('DOC_FILE_VIEW');
    this.http.post(api, payload).subscribe(
      (respData) =>{
        const data = respData['success'];
        this.docDataShare.setDocFileViewLink(data);
      },
      (error)=>{
        console.log(error);
      }
    )
  }
  DocDelete(payload){
    let api = this.envService.getApi('DOC_DELETE');
    this.http.post(api + payload.action + "/" + payload.projectMod, payload.data).subscribe(
      (respData) =>{
        this.docDataShare.setDocDeleteResponce(respData);
      },
      (error)=>{
        console.log(error);
      }
    )
  }
  ResetDeleteDocResponce(){
    this.docDataShare.setDocDeleteResponce(null);
  }
  GetBackFoldersByKey(payload){
    let api = this.envService.getApi('GET_FOLDER_BY_KEY');
    this.http.post(api, payload).subscribe(
      (respData) =>{
        this.docDataShare.setMoveFolderChildData(respData);
        this.docDataShare.setMoveFolderData(respData['success']);
      },
      (error)=>{
        console.log(error);
      }
    )
  }
  GetBackHomeVdr(payload){
    let api = this.envService.getApi('GET_VDR_DATA');
    this.http.post(api, payload).subscribe(
      (respData) =>{
        this.docDataShare.setMoveFolderChildData(respData);
      },
      (error)=>{
        console.log(error);
      }
    )
  }
  toShare(payload){
    let api = this.envService.getApi('DOC_SHARE');
    this.http.post(api, payload).subscribe(
      (respData) =>{
        this.docDataShare.setDocShareResponce(respData);
      },
      (error)=>{
        console.log(error);
      }
    )
  }

}
