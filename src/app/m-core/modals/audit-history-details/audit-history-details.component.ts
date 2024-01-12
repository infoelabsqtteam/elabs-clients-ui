import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-audit-history-details',
  templateUrl: './audit-history-details.component.html',
  styleUrls: ['./audit-history-details.component.css']
})
export class AuditHistoryDetailsComponent implements OnInit {

  FieldData:any = [];
  fieldValue:any = {};

  constructor(@Inject(MAT_DIALOG_DATA) public data:any) {
    this.FieldData = data.formFields.gridColumns;
    this.fieldValue = data.currentData;
  }

  ngOnInit(): void {
  }

}
