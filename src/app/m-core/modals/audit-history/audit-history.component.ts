import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { CommonFunctionService, DataShareService, ModelService } from '@core/web-core';

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
  tempDataSubscription
  selectedTab: any;

  auditHistoryList: any;
  selectedObject: any;
  previousAuditData: any;

  constructor(
    private modalService: ModelService,
    private dataShareService: DataShareService,
    private commonFunctionService:CommonFunctionService, 
  ) {
    this.dataShareService.auditHistoryList.subscribe(auditHistory => {
      this.setAuditHistory(auditHistory);
    })
  }

  setAuditHistory(auditHistory: any) {
    this.auditHistoryList = auditHistory;
    this.selectedObject = this.auditHistoryList[0];
  }

  ngOnInit(): void {
    this.modalService.remove(this.id);
    this.modalService.add(this);
  }

  showModal(object) {
    this.aduitTabIndex = object["aduitTabIndex"];
    this.selectedTab = object["tabname"][this.aduitTabIndex];
    this.auditHistory.show();
  }
  close() {
    this.previousAuditData = [];
    this.auditHistory.hide();
  }

  handleChange(index) {
    this.commonFunctionService.getAuditHistory(this.selectedObject);
    this.selectedObject = this.auditHistoryList[index];   
    if (index == 0) {
      this.previousAuditData = {};
    } else {
      this.previousAuditData = this.auditHistoryList[index - 1];
    }
  }

  isShowObj = false;
  showIndex = false;
  toggleAudit(index) {
    this.isShowObj = !this.isShowObj;
    this.showIndex = index;
  }



}



