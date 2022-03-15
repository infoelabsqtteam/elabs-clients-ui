import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { CommonFunctionService } from 'src/app/services/common-utils/common-function.service';
import { DataShareService } from 'src/app/services/data-share/data-share.service';
import { EnvService } from 'src/app/services/env/env.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {

   gridData :any = [];
   gridDataSubscription;
   privacyPolicy: any={};

  constructor(private router: Router,
              private commonFunctionService : CommonFunctionService,
              private apiService : ApiService,
              private dataShareServices :DataShareService,
              private envService : EnvService
    ) { 
      this. getPrivacyPolicy()
      this.gridDataSubscription = this.dataShareServices.tempData.subscribe(data =>{
        if(data && data.length > 0){
          this.gridData= data;
          const domainName = this.envService.getHostKeyValue('clientEndpoint');
          let index = this.commonFunctionService.getIndexInArrayById(this.gridData,domainName,"domainName")
          this.privacyPolicy =this.gridData[index]
        } else {
          this.gridData = [];
        }
      })   
  }

  ngOnInit(): void {
  }
  terms(){
    this.router.navigateByUrl('/auth/signine');
  };
  
  getPrivacyPolicy(){
    const payload = this.commonFunctionService.getDataForGrid(1, {}, { 'name': "privacy_policy" }, [], {}, '');
    this.apiService.GetTempData(payload.data);
  }
}
