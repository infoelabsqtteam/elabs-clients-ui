import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { StorageService } from '../../../../services/storage/storage.service';
import { DocDataShareService } from '../../../../services/data-share/doc-data-share/doc-data-share.service';

@Component({
  selector: 'app-audit-list',
  templateUrl: './audit-list.component.html',
  styleUrls: ['./audit-list.component.css']
})
export class AuditListComponent implements OnInit {

  userInfo: any;
  caseInfo: any;
  docAuditList : any;
  sortAuditList:any;
  docAuditSubscription;

  constructor(
    private storageService: StorageService,
    private docDataShareService:DocDataShareService
  ) {
    this.docAuditSubscription = this.docDataShareService.docAudit.subscribe(data =>{
      this.setAuditdata(data);
    })
    this.userInfo = this.storageService.GetUserInfo();
    //this.caseInfo = this.storageService.getSelectedCase();
   }

   ngOnDestroy(): void {
     //Called once, before the instance is destroyed.
     //Add 'implements OnDestroy' to the class.
     if(this.docAuditSubscription){
       this.docAuditSubscription.unsubscribe();
     }
     
   }
   ngOnInit(){
  }
  setAuditdata(docAudit){
    if(docAudit && docAudit.success){
      this.docAuditList = docAudit.success;
      this.sortAuditList = this.docAuditList.sort((a, b) => {
        return b.createdDate > a.createdDate ? 1 : -1;    
      });
    }
  }

}
