import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { CommonFunctionService, ModelService, NotificationService, StorageService} from '@core/web-core';
import { BehaviorSubject, Subject } from 'rxjs';
import { resolve } from 'path';


@Component({
  selector: 'app-file-upload-modal',
  templateUrl: './file-upload-modal.component.html',
  styleUrls: ['./file-upload-modal.component.css']
})
export class FileUploadModalComponent implements OnInit {
  @Input() id: string;
  //@Output() fileUpload: EventEmitter<any>  = new EventEmitter();
  @Output() fileUpload: Subject<any> = new BehaviorSubject<any>(null);
  @ViewChild('docUploadModal') public docUploadModal: ModalDirective;

  fileDrop: boolean = false;
  uploadFile: boolean = false;
  files: any[] = [];
  field:any={};
  fileSize:any=0;
  fileSizeHints:any = '';

  constructor(
    private modalService: ModelService, 
    private el: ElementRef,
    private storageService: StorageService,
    private notificationService:NotificationService,
    private commonfunctionService:CommonFunctionService
    ) { }

  ngOnInit(): void {
    let modal = this;
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }
    this.modalService.remove(this.id);
    this.modalService.add(this);
    this.uploadData = [];
  }

  uploadModal(tableFields: any) {
    this.docUploadModal.show()
  }

  onFileDropped($event, fileDrop: boolean, selectedFolder: any) {
    this.fileDrop = fileDrop;
    for (const item of $event) {
      item.progress = 0;
      this.files.push(item);
    }
    this.prepareFilesList($event);
  }
	/**
	 * handle file from browsing
	 */
  fileBrowseHandler(event:any) {
    this.fileDrop = false;
    this.setFilesOnChange(event);
  }

	/**
	 * Delete file from files list
	 * @param index (File index)
	 */
  deleteFile(index: number) {
    const file = this.uploadData[index];
    const index1 = this.commonfunctionService.getIndexInArrayById(this.files,file.fileName,'name');
    if(index1 != -1){
      this.delete(this.files,index1);
    }    
    this.uploadData.splice(index, 1);
  }
  delete(list,index){
    list.splice(index,1);
  }

	/**
	 * Simulate the upload process
	 */



	/**
	 * Convert Files list to normal array list
	 * @param files (Files List)
	 */
  // public xtr: any;
  // public obj: any = {};
  public uploadData: any = []
 // public uploadFilesData: any = [];
  // prepareFilesList(files: Array<any>) {
  //   for (const item of files) {
  //     item.progress = 0;
  //     this.files.push(item);
  //   }
  //   for (var i = 0; i < files.length; i++) {
  //     var file = files[i];
  //    // this.uploadFilesData.push(file);
  //     var reader = new FileReader();
  //     // reader.onload = this.readNoticeFile
  //     reader.onload = ((fileName: string) => (event: any) => {
  //       this.readNoticeFile(event, fileName);
  //     })(file.name);
  //     reader.readAsDataURL(file);
  //   }
  //   // console.log(this.files);
  //   // console.log(this.uploadData);

  // }
  base64ToArrayBuffer(base64) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    //const blob = new Blob([byteArray], {type: 'application/pdf'});
    //console.log(blob)
    return byteArray
    /* var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array; */
  }

  // readNoticeFile(e:any,fileName:string) {
  //   // var rxFile = this.uploadFilesData[0];
  //   // this.uploadFilesData.splice(0, 1);
  //   this.uploadData.push({
  //     fileData: e.target.result.split(',')[1],
  //     fileName: fileName,
  //     fileExtn:  fileName.split(".").pop(),
  //     // size: rxFile.size,
  //     innerBucketPath: fileName,
  //     log: this.storageService.getUserLog()
  //   });

  // }


  readNoticeFile(file: File): Promise<{ fileName: string,fileExtn: string, innerBucketPath: string, log:any, fileData: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        const dataURL = event.target.result;
        resolve({
          fileData: dataURL.split(',')[1],
          fileName: file.name,
          fileExtn:  file.name.split(".").pop(),
          // size: rxFile.size,
          innerBucketPath: file.name,
          log: this.storageService.getUserLog()
        });
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

  setFilesOnChange(event: any) {
    const files = event.target.files;
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.prepareFilesList(files);
  }


  prepareFilesList(files:any) {
    if (files && files.length > 0) {
      const promises: Promise<{ fileName: string,fileExtn: string, innerBucketPath: string, log:any, fileData: string }>[] = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(this.readNoticeFile(files[i]));
      }
      Promise.all(promises)
        .then((results) => {
          // All files have been processed
          if(results && results.length > 0 && this.uploadData) {
            results.forEach(element => {
              this.uploadData.push(element); 
            })
          }
        })
.catch((error) => {
          console.error('Error reading files:', error);
        });
    }
  }

	/**
	 * format bytes
	 * @param bytes (File size in bytes)
	 * @param decimals (Decimals point)
	 */
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  uploadFilesSimulator() {
    this.uploadFile = true;
    if(this.checkFileSize(this.files)){
      if (this.uploadData && this.uploadData.length > 0) {
        this.fileUpload.next(this.uploadData);
      } else {
        this.fileUpload.next([]);
      }
      this.docUploadModal.hide();
    }    
  }
  checkFileSize(files){
    let check = true;
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      if(this.fileSize != 0){
        const sizeInKb = (file?.size / 1024).toFixed(2);
        if(sizeInKb > this.fileSize){          
          this.notificationService.notify('bg-danger', file.name + " size is greter then " + this.fileSize + " KB")
          check = false;
          break;
        }
      }
    }
    return check;
  }
  showModal(object) {
    if(object && object.files){
      this.uploadData = object.files;
    }else{
      this.uploadData = [];
    }    
    if(object && object.field){
      this.field = object.field;
    }
    if(this.field && this.field.maxFileSize && this.field.maxFileSize != '' && this.field.maxFileSize > 0){
      this.fileSize = this.field.maxFileSize;
      this.fileSizeHints = "Max file Size " + this.fileSize + " KB"
    }else{
      this.fileSize = 0;
      this.fileSizeHints = '';
    }
    this.docUploadModal.show();
  }
  cancel() {
    this.docUploadModal.hide();
    this.fileSize = 0;
    this.fileSizeHints = '';
    //this.fileUploadResponce.emit(this.uploadData);
  }

}
