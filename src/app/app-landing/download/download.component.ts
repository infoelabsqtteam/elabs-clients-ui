import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiCallService, DataShareService, DownloadService, EncryptionService, RouterService, StorageService, ModelService, EnvService } from '@core/web-core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {

  welcometitle:any;

  fileDataSubscription:Subscription;
  changeRequestType:boolean=false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private encryptionService: EncryptionService,
    private apiCallService:ApiCallService,
    private dataShareService:DataShareService,
    private downloadService:DownloadService,
    private routerService:RouterService,
    private storageService:StorageService,
    private modelService:ModelService,
    private envService:EnvService
  ) { 
    this.welcometitle = this.storageService.getPageTitle();
    this.fileDataSubscription = this.dataShareService.getfileData.subscribe(data =>{
      this.setFileData(data);
    })
    let routers = this.activatedRoute;
    let id = routers.snapshot.params?.id ? routers.snapshot.params.id : '';
    let value = routers.snapshot.params?.value ? routers.snapshot.params.value : '';
    if(id && value){
      let data:any = {};
      data._id = this.encryptionService.decryptRequest(id);
      this.modelService.open('app-loader',{text:'Downloading...'});
      let requestType = this.envService.getRequestType();
      if(requestType && requestType == "PRIVATE"){
        this.changeRequestType = true;
        this.envService.setRequestType("PUBLIC");
      }
      this.apiCallService.getPdf(data,value);
    }
  }

  ngOnInit() {
  }
  setFileData(getfileData){
    if(this.changeRequestType){
      this.envService.setRequestType("PRIVATE");
    }    
    if (getfileData != '' && getfileData != null) {
      const file = new Blob([getfileData.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(file);
      this.downloadService.download(url,getfileData.filename);
      this.modelService.close('app-loader');
      this.routerService.openInSameTabWithoutHistory(url);  
    }
  }

}
