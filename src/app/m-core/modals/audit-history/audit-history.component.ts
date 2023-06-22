import { Component, OnInit, Input, Output, ViewChild, EventEmitter, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormGroupDirective, FormControlDirective, FormControlName } from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';
import { DataShareService, ModelService } from '@core/web-core';


@Component({
  selector: 'app-audit-history',
  templateUrl: './audit-history.component.html',
  styleUrls: ['./audit-history.component.css']
})
export class AuditHistoryComponent implements OnInit {
  @Output() addAndUpdateResponce = new EventEmitter();

  @Input() id: string;
  @ViewChild('auditHistory') public auditHistory: ModalDirective;
  aduitTabIndex
  tempDataSubscription
  allTabs: any;
  selectedTab: any;

  auditHistoryList: any;
  singleAuditHistoryList: any;
  selectedObject: any;
  previousAuditData: any;
  showdata = false;
  showcompareData = false;

  constructor(
    private modalService: ModelService,
    private dataShareService: DataShareService,
  ) {
    this.dataShareService.auditHistoryList.subscribe(auditHistory => {
      this.setAuditHistory(auditHistory);
    })
  }

  setAuditHistory(auditHistory: any) {
    this.auditHistoryList = auditHistory;
    this.singleAuditHistoryList = auditHistory[0];
    console.log(this.singleAuditHistoryList)
  }

  ngOnInit(): void {
    let modal = this;
    this.modalService.remove(this.id);
    this.modalService.add(this);
  }

  showModal(object) {
    this.aduitTabIndex = object["aduitTabIndex"];
    this.selectedTab = object["tabname"][this.aduitTabIndex];
    this.auditHistory.show();
  }
  close() {
    this.showdata = false;
    this.previousAuditData = [];
    this.auditHistory.hide();
  }

  handleChange(index) {
    this.showdata = true;
    this.showcompareData = true;
    this.selectedObject = this.auditHistoryList[index];
    if (index == 0) {
      this.showdata = false;
      this.previousAuditData = {};
    } else {
      this.previousAuditData = this.auditHistoryList[index - 1];
    }
  }



}
