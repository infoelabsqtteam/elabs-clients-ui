import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { DocDataShareService } from 'src/app/services/data-share/doc-data-share/doc-data-share.service';
import { ModelService } from 'src/app/services/model/model.service';
import { NotificationService } from 'src/app/services/notify/notification.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-download-progress',
  templateUrl: './download-progress.component.html',
  styleUrls: ['./download-progress.component.css']
})
export class DownloadProgressComponent implements OnInit {

  
  diameter:any=30;
  strokeWidth:any=3;
  color:any='primary';
  mode:any='determinate';

  @Input() id: string; 
  @Output() downloadFileResponce = new EventEmitter();
  @ViewChild('downloadProgressModal') public downloadProgressModal: ModalDirective; 


  constructor(    private modelService:ModelService,
    private storageService:StorageService,
    private docDataShareService:DocDataShareService,
    private notificationService:NotificationService) { }

  ngOnInit(){
    let modal = this;
    if (!this.id) {
        console.error('modal must have an id');
        return;
    }
    this.modelService.remove(this.id);
    this.modelService.add(this);
  }

  showModal(alert){
    this.downloadProgressModal.show()
      
  }

  close(){
    this.downloadProgressModal.hide();
  }

}
