import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { CommonFunctionService, ModelService, NotificationService, StorageService} from '@core/web-core';
import * as S3 from 'aws-sdk/clients/s3';
import { DocApiService } from '@core/web-core';
import { config } from '../../document/config.modal';


@Component({
  selector: 'app-file-upload-modal',
  templateUrl: './file-upload-modal.component.html',
  styleUrls: ['./file-upload-modal.component.css']
})
export class FileUploadModalComponent implements OnInit {
  @Input() id: string;
  @Output() fileUploadResponce = new EventEmitter();
  @ViewChild('docUploadModal') public docUploadModal: ModalDirective;

  fileDrop: boolean = false;
  uploadFile: boolean = false;
  files: any[] = [];
  field:any={};
  fileSize:any=0;
  fileSizeHints:any = '';
  uploadProgressValue = 0;
  currentFileIndex:any=-1;
  tableFields:any[] = [];
  s3bucket:any=''
  s3Key:any=''
  fileForS3:boolean = false;
  uploadStart:boolean=true;
  uploadDataForS3: any = [];

  constructor(
    private modalService: ModelService, 
    private el: ElementRef,
    private storageService: StorageService,
    private notificationService:NotificationService,
    private commonfunctionService:CommonFunctionService,
    private docApiService:DocApiService,
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
    this.prepareFilesList($event);
  }
	/**
	 * handle file from browsing
	 */
  fileBrowseHandler(files) {
    this.fileDrop = false;
    this.prepareFilesList(files);
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
  public xtr: any;
  public obj: any = {};
  public uploadData: any = []
  public uploadFilesData: any = [];
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      this.uploadFilesData.push(file);
      var reader = new FileReader();
      reader.onload = this.readNoticeFile
      reader.readAsDataURL(file);
    }
    // console.log(this.files);
    // console.log(this.uploadData);

  }
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

  readNoticeFile = (e) => {
    var rxFile = this.uploadFilesData[0];
    this.uploadFilesData.splice(0, 1);
    this.uploadData.push({
      fileData: e.target.result.split(',')[1],
      fileName: rxFile.name,
      fileExtn:  rxFile.name.split(".").pop(),
      size: rxFile.size,
      innerBucketPath: rxFile.name,
      log: this.storageService.getUserLog()
    });

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
  uploadFilesSimulator(index) {
    this.uploadFile = true;
    if(this.checkFileSize(this.files)){
      if (this.uploadData && this.uploadData.length > 0) {
        this.fileUploadResponce.emit(this.uploadData);
      } else {
        this.fileUploadResponce.emit([]);
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
    this.tableFields = object.tableFields;
    this.getBucketAndS3Key(object);
    if(this.field.type == 'file_for_s3'){
      this.fileForS3 = true;
    }
    this.uploadStart = true;
    this.uploadDataForS3 = [];
    this.docUploadModal.show();
  }

  getBucketAndS3Key(object) {

    //if default value is defined in field
    this.s3bucket = this.field && this.field.extraInfo != undefined && this.field.extraInfo != null ?  this.field.extraInfo.defaultBucket : '';
    this.s3Key = this.field && this.field.extraInfo != undefined && this.field.extraInfo != null ?  this.field.extraInfo.defaultS3Key : '';

    this.s3bucket = object.defaultBucket != undefined || object.defaultBucket != null ? object.defaultBucket : '';
    this.s3Key = object.defaultS3Key != undefined || object.defaultS3Key != null ? object.defaultS3Key : '';

    //if we added defaultBucket & defaultS3Key hidden fields in form
    if(this.s3bucket == '' || this.s3bucket == undefined){
      this.findDefaultBucket();
    }
    if(this.s3Key == '' || this.s3Key == undefined){
      this.findDefaultKey();
    }
  }

  cancel() {
    this.docUploadModal.hide();
    this.fileSize = 0;
    this.fileSizeHints = '';
    //this.fileUploadResponce.emit(this.uploadData);
  }

  uploadFilesSimulatorForS3(){
    this.uploadByS3(); 
  }

  uploadByS3(index?){
    this.uploadStart = false;

    // const file = this.files[0];
    if(index == null || index == undefined) index=0;
    let file = this.files[index];
    // this.files.forEach((file,i)=>{
      this.currentFileIndex = index;
      if(this.s3bucket != '' && this.s3bucket != undefined){
        const bucket = new S3(config);	        
        const params = {
          Bucket: this.s3bucket,
          Key: this.s3Key+'/'+file.name,
          Body: file,
          ACL: 'private',
          ContentType: file.type
        };

        bucket.upload(params).on('httpUploadProgress', (evt) => {        
          this.uploadProgressValue = Math.round(100.0 * (evt.loaded / evt.total));
          //console.log(this.uploadProgressValue + ' %' + evt.loaded + ' of ' + evt.total + ' Bytes');
        }).send( (err, data) => {
          if (err) {
            this.notificationService.notify("success","There was an error uploading your file: "+ err);
            //console.log('There was an error uploading your file: ', err);
            return false;
          }	
          // ++this.currentFileIndex;

          this.uploadProgressValue = 0;		
          let s3Object = {
            "bucket":data.Bucket,
            "rollName":file.name,
            "key": data.Key,
            "capKey":data.Key.toUpperCase(),
            "fileExt":file.name.substring(file.name.lastIndexOf('.'))
          }
          this.uploadDataForS3.push(s3Object);
          ++index;
          if(this.files[index] != null || this.files[index] != undefined){
            this.uploadByS3(index)
          }else{
            this.files = [];
            this.uploadData = [];
            this.fileUploadResponce.emit(this.uploadDataForS3);
            this.cancel();
          }
          // newObj.key = key;
          // newObj.capKey = key.toUpperCase();
          // newObj.bucket = data.Bucket;
          // this.files[this.currentFileIndex].upload = true;
          // this.uploadProgressValue = 0;
          // this.docApiService.SaveUploadFile(newObj);
          // this.uploadFilesData = [];					
          // return true;
        });
      }else{
        this.notificationService.notify('bg-danger','Bucket Name is Required !!!');
      }
    // })
    // this.uploadData = [];
    // this.currentFileIndex = -1;
    // this.files = [];
    // this.cancel();
	}

  findDefaultBucket(){
    if(this.s3bucket == '' || this.s3bucket == undefined){
      if(this.tableFields.length > 0){
        let defaultBucketTableFields = this.tableFields.filter(x => x.field_name == 'defaultBucket');
        if(defaultBucketTableFields.length >0){
          this.s3bucket = defaultBucketTableFields[0].defaultValue;
        }
      }
    }
  }

  findDefaultKey(){
    if(this.s3Key == '' || this.s3Key == undefined){
      if(this.tableFields.length > 0){
        let defaultKeyTableFields = this.tableFields.filter(x => x.field_name == 'defaultS3Key');
        if(defaultKeyTableFields.length >0){
          this.s3Key = defaultKeyTableFields[0].defaultValue;
        }
      } 
    }
}

}
