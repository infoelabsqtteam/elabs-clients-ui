import { Injectable,EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocDataShareService {

  docData:EventEmitter<any>= new EventEmitter<any>(null);
  vdrData:EventEmitter<any>= new EventEmitter<any>(null);
  moveFolderData:EventEmitter<any>= new EventEmitter<any>(null);
  moveFolderChild:EventEmitter<any>= new EventEmitter<any>(null);
  uploadResponce:EventEmitter<any>= new EventEmitter<any>(null);
  createFolderData:EventEmitter<any>= new EventEmitter<any>(null);
  docAudit:EventEmitter<any>= new EventEmitter<any>(null);
  docFiledownloadLink:EventEmitter<any>= new EventEmitter<any>(null);
  docFileViewLink:EventEmitter<any>= new EventEmitter<any>(null);
  docDeleteResponce:EventEmitter<any>= new EventEmitter<any>(null);
  docShareResponce:EventEmitter<any>= new EventEmitter<any>(null);
  folder:EventEmitter<any>= new EventEmitter<any>(null);
  vdrPermission:EventEmitter<any>= new EventEmitter<any>(null);

  constructor() { }

  setDocData(data){
    this.docData.emit(data);
  }
  setVdrData(vdrData){
    this.vdrData.emit(vdrData);
  }
  setMoveFolderData(moveData){
    this.moveFolderData.emit(moveData)
  }
  setMoveFolderChildData(moveChildData){
    this.moveFolderChild.emit(moveChildData)
  }
  setDocUploadResponce(responce){
    this.uploadResponce.emit(responce);
  }
  setCreateFolder(createFolderData){
    this.createFolderData.emit(createFolderData);
  }
  setDocAudit(data){
    this.docAudit.emit(data);
  }
  setDocFileDownloadLink(responce){
    this.docFiledownloadLink.emit(responce);
  }
  setDocFileViewLink(responce){
    this.docFileViewLink.emit(responce);
  }
  setDocDeleteResponce(responce){
    this.docDeleteResponce.emit(responce);
  }
  setDocShareResponce(responce){
    this.docShareResponce.emit(responce);
  }
  setFolderData(responce){
    this.folder.emit(responce);
  }
  setVdrPermissionData(vdrData){
    this.vdrPermission.emit(vdrData);
  }
}
