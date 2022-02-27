import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { ApiService } from 'src/app/services/api/api.service';
import { CommonFunctionService } from 'src/app/services/common-utils/common-function.service';
import { CoreFunctionService } from 'src/app/services/common-utils/core-function/core-function.service';
import { DataShareService } from 'src/app/services/data-share/data-share.service';
import { EnvService } from 'src/app/services/env/env.service';
import { ModelService } from 'src/app/services/model/model.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-setting-modal',
  templateUrl: './setting-modal.component.html',
  styleUrls: ['./setting-modal.component.css']
})
export class SettingModalComponent implements OnInit {

  @Input() id: string;
  @Output() appSettingModalResponce = new EventEmitter();
  @ViewChild('settingModal') public settingModal: ModalDirective;
  public hostName:any = '';
  settingModelRestSubscription:any;
  hostDataSubscription;

  hostData:any = []

  constructor(
    private modalService: ModelService,
    private commonFunctionService: CommonFunctionService,
    private envService:EnvService,
    private dataShareService:DataShareService,
    private apiService:ApiService,
    private storageService:StorageService,
    private coreFunctionService:CoreFunctionService
  ) { 

    //this.getHostData();

    this.settingModelRestSubscription = this.dataShareService.settingData.subscribe(data =>{
      if(data == "logged_out"){
        this.hostName = '';
        this.storageService.setHostNameDinamically('');
        // this.getHostData()
        this.envService.setDinamicallyHost();
      }
    })
    this.hostDataSubscription = this.dataShareService.hostData.subscribe(data =>{
      this.setHostData(data);
    })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.settingModelRestSubscription){
      this.settingModelRestSubscription.unsubscribe();
    }
    if(this.hostDataSubscription){
      this.hostDataSubscription.unsubscribe();
    }
    
  }
  getHostData(){
    const data = this.commonFunctionService.getPaylodWithCriteria('host_master','',[],{});
    data['pageNo'] = 0;
    data['pageSize'] = 100;
    const getSortData = {
      data: data,
      path: null
    }
    this.apiService.GetHostName(getSortData)
  }

  ngOnInit() {

    let modal = this;
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }
    this.modalService.remove(this.id);
    this.modalService.add(this);


  }
  showModal(data:any){
    this.settingModal.show();
  }
  close(){
    this.settingModal.hide();
  }
  getddnDisplayVal(val) {
    return this.commonFunctionService.getddnDisplayVal(val);    
  }
  setHostName(){
    //console.log('set host name :- '+ this.hostName['host']);
    let hostName = '';
    if(this.hostName && this.hostName['host']){
      hostName = this.hostName['host']+'/rest/';
    }
    this.storageService.setHostNameDinamically(hostName);
    this.close();
  }
  setHostData(data:any){
    if(this.coreFunctionService.isNotBlank(data)){
      this.hostData = data;
      this.dataShareService.restSettingModule('hide');
    }else{
      this.hostData = [];
      this.dataShareService.restSettingModule('logged_in');
    }
    
  }

}
