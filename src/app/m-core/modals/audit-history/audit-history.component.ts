import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ApiCallService, ApiService, CommonFunctionService, DataShareService, GridCommonFunctionService, ModelService } from '@core/web-core';

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
  allVersionList:any;
  objectid:any;
  gridButton:any = [];
  currentObject:any = [];
  previousObject:any = [];
  formFields:any = [];
  lastEdit:number;

  

  constructor(
    public dialog: MatDialog,
    private apiService:ApiService,
    private modalService: ModelService,
    private apiCallService:ApiCallService,
    private dataShareService: DataShareService,
    private commonFunctionService:CommonFunctionService, 
    private gridCommonFunctionServie:GridCommonFunctionService,
  ) {
    this.dataShareService.auditHistoryList.subscribe(auditHistory => {
      this.setAuditHistory(auditHistory);
    });
    this.dataShareService.auditVersionList.subscribe(data => {
      this.allVersionList = data;
      this.lastEdit = this.allVersionList[0];
    })
  }

  setAuditHistory(auditHistory: any) {
    if(auditHistory) {
        this.getCurrentObj(auditHistory.currentObject);
        this.getFormFields(auditHistory.auditFields)
        this.getPrevObject(auditHistory.previousObject);
        this.compareData();
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
    this.auditHistory.hide();
  }

  changeAuditVersion(version) {
    let auditSelectedVersion = JSON.parse(version)
    this.getAuditData(auditSelectedVersion);
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
    if(version >= 0) {
      payloadData.path = version;
    }
    this.commonFunctionService.getAuditHistory(payloadData);
  }

  getAuditVersionList() {
    this.apiService.getAuditVersionList(this.objectid);
  }
  
  getFormFields(formFields) {
    let modifyFormField = this.gridCommonFunctionServie.modifyGridColumns(formFields,{});
    this.formFields = modifyFormField;
  }

  getCurrentObj(data){
    let currentData = [];
    if(data && data != null) {
      currentData.push(data);
      this.currentObject = data;
    }
  }

  getPrevObject(data){
    if(data != null && data != undefined){
      let previewData = [];
      if(data && data != null) {
        previewData.push(data);
        this.previousObject = data;
      } 
    } else{
      this.previousObject = {};
    }
  }


  compareData() {
    this.gridCommonFunctionServie.compareAuditHistoryData(this.formFields,this.currentObject,this.previousObject);
  }
  

  copmareListOfFields(fields) {
    this.gridCommonFunctionServie.copmareListOfFields(fields,this.currentObject,this.previousObject);
  }
 
}



