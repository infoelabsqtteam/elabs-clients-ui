import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { ApiCallService, CommonFunctionService, DataShareService, ModelService } from '@core/web-core';

@Component({
  selector: 'app-audit-history',
  templateUrl: './audit-history.component.html',
  styleUrls: ['./audit-history.component.scss']
})
export class AuditHistoryComponent implements OnInit {
  @Output() addAndUpdateResponce = new EventEmitter();

  @Input() id: string;
  @ViewChild('auditHistory') public auditHistory: ModalDirective;
  aduitTabIndex;
  selectedTab: any;

  // auditHistoryList: any;
  // selectedObject: any;
  // previousAuditData: any;
  allVersionList:any;
  objectid:any;
  gridButton:any = [];


  

  constructor(
    private modalService: ModelService,
    private apiCallService:ApiCallService,
    private dataShareService: DataShareService,
    private commonFunctionService:CommonFunctionService, 
  ) {
    this.dataShareService.auditHistoryList.subscribe(auditHistory => {
      this.setAuditHistory(auditHistory);
    });
    this.dataShareService.auditVersionList.subscribe(data => {
      this.allVersionList = data;
    })
  }

  setAuditHistory(auditHistory: any) {
    if(auditHistory && auditHistory.versionList) {
      
    }
    
  }

  ngOnInit(): void {
    this.modalService.remove(this.id);
    this.modalService.add(this);
  }

  showModal(object) {
    this.aduitTabIndex = object["aduitTabIndex"];
    this.selectedTab = object["tabname"][this.aduitTabIndex];
    if(this.selectedTab && this.selectedTab.grid && this.selectedTab.grid.action_buttons) {
      this.gridButton =this.selectedTab.grid.action_buttons;
    }else {
      this.gridButton = []
    }
    this.objectid = object["objectId"];
    this.getAuditVersionList();
    this.getAuditData();
    this.auditHistory.show();
  }
  close() {
    // this.previousAuditData = [];
    this.auditHistory.hide();
  }

  changeAuditVersion(version) {
    let auditSelectedVersion = JSON.parse(version)
    this.getAuditData(auditSelectedVersion)
  }

  isShowObj = false;
  showIndex = false;
  toggleAudit(index) {
    this.isShowObj = !this.isShowObj;
    this.showIndex = index;
  }



  getAuditData(version?) {
    let form = this.commonFunctionService.getForm(this.selectedTab.forms,"NEW",this.gridButton);
    let params = this.objectid;
    let object = {
      "formId": form._id
    }
    let payload = this.apiCallService.getPaylodWithCriteria(params, "", [], {});
    payload['data'] = object;
    let payloadData = {
      "data" : payload,
      "path" : null
    }
    if(version) {
      payloadData.path = version;
    }
    this.commonFunctionService.getAuditHistory(payloadData);
  }

  getAuditVersionList() {
    this.commonFunctionService.getAuditVersionList(this.objectid);
  }



}



