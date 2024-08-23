import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonFunctionService, DataShareService, ModelService, NotificationService } from '@core/web-core';
import { ModalDirective } from 'angular-bootstrap-md';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-grid-modal',
  templateUrl: './grid-modal.component.html',
  styleUrls: ['./grid-modal.component.css']
})
export class GridModalComponent implements OnInit {

  @Input() id: string;    
  
  

  checkModalClass:boolean=false;
  formSize:any = 'modal-dialog-full-width';
  gridShowHide:boolean=false;
  tab:any;
  headElements:any;

  addUpdateFormResponceSubscription:Subscription;

  
  @ViewChild('gridModal') public gridModal: ModalDirective;
  constructor(
    private commonFunctionService:CommonFunctionService, 
    private modalService: ModelService,
    private dataShareService:DataShareService,
    private notificationService:NotificationService
    ) {
      
    }

  ngOnInit(): void {
    let modal = this;
    if (!this.id) {
        console.error('modal must have an id');
        return;
    }
    this.modalService.remove(this.id);
    this.modalService.add(this);
    
  }
  showModal(object){    
    this.gridShowHide = true;
    this.gridModal.show();
    this.checkModalClass = true;
    this.tab = object['tab'];
    this.headElements = object['headElements'];
  }
  
  close(){
    
    this.gridModal.hide();
    this.gridShowHide = false;
    this.checkModalClass = false;
  }
  seteditedRowData(value:any){
    this.notificationService.notify("bg-dager","This action is not allowed this time !!!");
    this.close();
  }
  openDinamicForm(value:any){
    this.notificationService.notify("bg-dager","This action is not allowed this time !!!");
    this.close();
  }

}
