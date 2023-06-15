import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { DocApiService, DocDataShareService, NotificationService, StorageService, ModelService} from '@core/service-lib';
import * as S3 from 'aws-sdk/clients/s3';
import { Bucket } from 'aws-sdk/clients/s3';
import { config } from '../../config.modal';


@Component({
  selector: 'lib-doc-file-download',
  templateUrl: './doc-file-download.component.html',
  styleUrls: ['./doc-file-download.component.css']
})
export class DocFileDownloadComponent implements OnInit {

  

  downloadProgressValue:any = 0;
  diameter:any=30;
  strokeWidth:any=3;
  color:any='primary';
  mode:any='determinate';
  vdrprentfolder:any ={};


  @Input() id: string; 
  @Output() downloadFileResponce = new EventEmitter();
  @ViewChild('downloadDocFileModal') public downloadDocFileModal: ModalDirective; 

  constructor(
    private modelService:ModelService,
	private docApiService:DocApiService,
	private storageService:StorageService,
	private docDataShareService:DocDataShareService,
	private notificationService:NotificationService

  ) { 
	
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
    this.downloadDocFileModal.show()    
    this.vdrprentfolder = object.folder; 
    //console.log(this.vdrprentfolder);
    let bucketaName = this.storageService.getBucketName();
    if(bucketaName != ''){
      const bucket = new S3(config);	
      const params = {        
        Bucket: bucketaName,
        Key: this.vdrprentfolder.key
      };

      bucket.getObject(params, (err:any, data:any) =>{
      if (err) {
        this.notificationService.notify('bg-danger',err);
      }else{
        let link = document.createElement('a');
        link.setAttribute('type', 'hidden');
        const file = new Blob([data.Body], { type: data.ContentType });
        const url = window.URL.createObjectURL(file);
        link.href = url;
        link.download = this.vdrprentfolder.rollName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        const dataDownload = this.vdrprentfolder;
        dataDownload.log = this.storageService.getUserLog();
        this.docApiService.SetDocFileAutditAfterDownload(dataDownload);
        this.cancel();
      }
      }).on('httpDownloadProgress',(progress) => {  
          
        this.downloadProgressValue = Math.round(100.0 * (progress.loaded / progress.total));
        //console.log(this.downloadProgressValue + ' %' + progress.loaded + ' of ' + progress.total + ' Bytes');
      });
    }else{
      this.notificationService.notify('bg-danger','Bucket Name is Required !!!');
    }
  }
  cancel(){
    this.close()
    this.downloadFileResponce.emit(false);
  }
  
  close(){
		this.downloadDocFileModal.hide();
		this.vdrprentfolder = {};
  }

  

}
