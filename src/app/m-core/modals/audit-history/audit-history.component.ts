import { Component, OnInit, Input, Output, ViewChild, EventEmitter, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormGroupDirective, FormControlDirective, FormControlName } from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';
import { DataShareService } from 'src/app/services/data-share/data-share.service';
import { ModelService } from 'src/app/services/model/model.service';

@Component({
  selector: 'app-audit-history',
  templateUrl: './audit-history.component.html',
  styleUrls: ['./audit-history.component.css']
})
export class AuditHistoryComponent implements OnInit {
  @Output() addAndUpdateResponce = new EventEmitter();

  @Input() id: string;
  @ViewChild('auditHistory') public auditHistory: ModalDirective;
  @Input() auditData;
  @Input() aduitIndex;


  tempDataSubscription
  formData:any = [];
  selectedObject:any = [];
  previewObject;
  formshow = false;


  constructor(
    private modalService: ModelService,
    private dataShareService: DataShareService,
  ) {
    this.tempDataSubscription = this.dataShareService.tempData.subscribe(temp => {
      this.setTempData(temp);
    })
  }

  ngOnInit(): void {
    let modal = this;
    this.modalService.remove(this.id);
    this.modalService.add(this);
  }

  showModal(object) {
    this.auditHistory.show();
  }
  close() {
    this.auditHistory.hide();
   // this.resetData();
  }

  setTempData(tempData) {
    if(tempData && tempData.length > 0){
      for (let index = 0; index < tempData.length; index++) {
        this.formData = tempData[index].templateTabs;
      }
      this.formData[this.aduitIndex];
    }
  }


  // onChange(index) {
  //   this.formshow = true;
  //   this.selectedObject = this.formData[index-1];
  //   this.previewObject = this.formData[index-2];
  // }

  // resetData() {
  //   this.formshow = false;
  // }


}
