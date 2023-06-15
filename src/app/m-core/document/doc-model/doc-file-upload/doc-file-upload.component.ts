import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { DocApiService, DocDataShareService, NotificationService, StorageService, ModelService} from '@core/service-lib';
import * as S3 from 'aws-sdk/clients/s3';
import { config } from '../../config.modal';


@Component({
  selector: 'app-doc-file-upload',
  templateUrl: './doc-file-upload.component.html',
  styleUrls: ['./doc-file-upload.component.css']
})
export class DocFileUploadComponent implements OnInit {


  public fileDrop: boolean;
  public uploadFile: boolean = false;
  public files: any[] = [];
  uploadFileIndex:any=0;
  currentFileIndex:any=-1;
  docFileUploadResponceSubscription:any;
  uploadProgressValue = 0;
  progressBarColor = 'primary';
  progressMode='determinate';
  bufferValue = 100;
  public UploadFile = [];


  @Input() id: string;
  @Input() folderName: string;
  @Input() vdrprentfolder:any;
  @Output() uploadDocFileResponce = new EventEmitter();
  @ViewChild('uploadDocFileModal') public uploadDocFileModal: ModalDirective; 
  @ViewChild('fileDropRef', {static: false}) fileDropRef:ElementRef;

  constructor(
    private modelService:ModelService,
	private docApiService:DocApiService,
	private storageService:StorageService,
	private docDataShareService:DocDataShareService,
	private notificationService:NotificationService

  ) { 
	this.docFileUploadResponceSubscription = this.docDataShareService.uploadResponce.subscribe(responce =>{
		this.setDocUploadResponce(responce);
	})
  }

  ngOnInit() {
    let modal = this;
      if (!this.id) {
          console.error('modal must have an id');
          return;
      }
      this.modelService.remove(this.id);
      this.modelService.add(this);
  }
  showModal(object){
    this.uploadDocFileModal.show()   
    this.vdrprentfolder = object.parentFolder 
  }
  cancel(){
    this.close()
    this.uploadDocFileResponce.emit(false);
    this.files = [];
  }
  setDocUploadResponce(uploadResponce){
	if (uploadResponce && this.uploadData.length > 0 && (this.uploadFileIndex - 1) <= this.uploadData.length) {
		this.files[this.uploadFileIndex-1].upload = true;
		if((this.uploadFileIndex+1) <= this.uploadData.length){
			this.setUploadFile(this.uploadFileIndex);
			this.fileUpload();
		}else{
			this.currentFileIndex = -1;
			this.close();
			this.uploadDocFileResponce.emit('success');
		}		
	}
}
  close(){
	    this.uploadFileIndex=0;
        this.currentFileIndex=-1;
		this.uploadDocFileModal.hide();
		this.files = [];
		this.uploadFile = false;
		this.uploadData = [];
		this.uploadFilesData = [];
		this.UploadFile = [];
		this.fileDropRef.nativeElement.value = "";
  }

  /**
	 * on file drop handler
	 */
	onFileDropped($event) {
		this.prepareFilesList($event);
  }
  /**
	 * handle file from browsing
	 */
	fileBrowseHandler(files) {
		this.prepareFilesList(files);
	}

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
			item.upload = false;
			this.files.push(item);
		}
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			this.uploadFilesData.push(file);
			var reader = new FileReader();
			reader.onload = this.readNoticeFile
			reader.readAsDataURL(file);
		}

  }
  readNoticeFile = (e) => {
		var rxFile = this.uploadFilesData[0];
		this.uploadFilesData.splice(0, 1);
		this.uploadData.push({
			fileData: e.target.result.split(',')[1],
			fileName: rxFile.name,
			fileExtn: rxFile.name.split('.')[1],
			size: rxFile.size,
			innerBucketPath: this.vdrprentfolder.key + rxFile.name,
			type : rxFile.type
		});
  }
  
  /**
	 * Delete file from files list
	 * @param index (File index)
	 */
	deleteFile(index: number) {
		this.files.splice(index, 1);
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
  
  uploadFilesSimulator(){
	this.uploadFile = true;
    const object = {
      uploadData : this.uploadData
    }
	this.setUploadFile(this.uploadFileIndex);
	this.fileUpload();
    //this.uploadDocFileResponce.emit(object);
  }
  fileUpload(){
	this.uploadFiles();
  }
  setUploadFile(index){
	const file = this.uploadData[index];
	this.currentFileIndex = index;
	this.uploadFileIndex = this.uploadFileIndex + 1;
	this.UploadFile = [];
	this.UploadFile.push(file);
  }

	public newFolder: any = {};
	uploadFiles() {
		this.useDetails();
		var newObj:any = Object.assign({}, this.newFolder);
		var sessionid = Object.assign({}, this.storageService.getUserLog())
		newObj.log.sessionId = sessionid.sessionId + ";" + this.storageService.GetIdToken();
		// newObj.rollName = newObj.parentFolder;
		// newObj.isFolder = false;
		const file = this.files[this.currentFileIndex]
		newObj.rollName = file.name;
		newObj.fileExt = file.name.split('.')[1];
		newObj.fileSize = file.size;
		this.uploadByS3(newObj,file);	
	}
	uploadByS3(newObj,file){
		let bucketaName = this.storageService.getBucketName();
		if(bucketaName != ''){
			const bucket = new S3(config);	        
			const params = {
				Bucket: bucketaName,
				Key: newObj.key + file.name,
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
				const key = data.Key;
				newObj.key = key;
				newObj.capKey = key.toUpperCase();
				newObj.bucket = data.Bucket;
				this.files[this.currentFileIndex].upload = true;
				this.uploadProgressValue = 0;
				this.docApiService.SaveUploadFile(newObj);
				this.uploadFilesData = [];					
				return true;
			});
		}else{
			this.notificationService.notify('bg-danger','Bucket Name is Required !!!');
		}
	}
	useDetails() {
		this.newFolder = {
			parentId: this.vdrprentfolder._id,
			parentFolder: this.vdrprentfolder.rollName,
			parentTag: this.vdrprentfolder.eTag,
			folder: false,
			key: this.vdrprentfolder.key + this.folderName,
			log: this.storageService.getUserLog(),
			createdBy: this.storageService.getUserLog().userId,		
			bucket:this.vdrprentfolder.bucket,			
			refCode:this.storageService.getRefCode(),
			appId:this.storageService.getAppId()
		}
	}

	


}
