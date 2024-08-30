import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ApiCallService, ApiService, DataShareService, DownloadService, EncryptionService, RouterService } from '@core/web-core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {

  fileDataSubscription:Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private encryptionService: EncryptionService,
    private apiCallService:ApiCallService,
    private dataShareService:DataShareService,
    private downloadService:DownloadService,
    private routerService:RouterService
  ) { 
    this.fileDataSubscription = this.dataShareService.getfileData.subscribe(data =>{
      this.setFileData(data);
    })
    let routers = this.activatedRoute;
    let id = routers.snapshot.params?.id ? routers.snapshot.params.id : '';
    let value = routers.snapshot.params?.value ? routers.snapshot.params.value : '';
    // this.reportUrlNo = this.encryptionService.decryptRequest(reportNo);
    if(id && value){
      let data:any = {};
      data._id = id;
      this.apiCallService.getPdf(data,value);
    }
  }

  ngOnInit() {
  }
  setFileData(getfileData){
    if (getfileData != '' && getfileData != null) {
      const file = new Blob([getfileData.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(file);
      this.routerService.openInSameTabWithoutHistory(url);
      this.downloadService.download(url,getfileData.filename);      
    }
  }

}
