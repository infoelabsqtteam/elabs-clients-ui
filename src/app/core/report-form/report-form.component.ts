import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { CommonFunctionService } from 'src/app/services/common-utils/common-function.service';
import { DataShareService } from 'src/app/services/data-share/data-share.service';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styles: [
  ]
})
export class ReportFormComponent implements OnInit {

  staticDataSubscription:any;
  staticData = [];
  datalist:any=[];

  chipsData = ['data1', 'data 2', 'data 3']
  

  constructor(
    private commonFunctionService:CommonFunctionService,
    private dataShareServices :DataShareService,
    private apiService:ApiService
  ) { 

    this.staticDataSubscription = this.dataShareServices.staticData.subscribe( data =>{
      this.staticData = data;
      //this.setStaticData(data);
    })
    const params = "pojo_master"; 
    const callback = "collection_name";
    const criteria = [
      "report_flag;eq;true;STATIC" 
    ]
    const payload = this.commonFunctionService.getPaylodWithCriteria(params,callback,criteria,{},'GET_FORM_FIELDS_FROM_POJO')
    console.log(payload);
    this.apiService.getStatiData([payload]);
  }

  ngOnInit(): void {
  }
  getddnDisplayVal(val) {
    return this.commonFunctionService.getddnDisplayVal(val);    
  }



  dropchips(index: any) {  
    this.chipsData.splice(index, 1);  
  }


}
