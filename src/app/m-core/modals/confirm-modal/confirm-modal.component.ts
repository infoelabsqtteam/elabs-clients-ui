import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { ModelService } from '@core/service-lib';


@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {

  public icon_name = '';
  public class_name = "";
  public alertData:any = {};
  private element: any;
  bodyMessage:any='Body Message';
  headerMessage:any='Header Message';
  yesButtonLabel:any='';
  noButtonLabel:any = '';
  

  @Input() id: string;
  @Output() alertResponce = new EventEmitter();
  @ViewChild('alertModal') public alertModal: ModalDirective; 


  constructor(private modalService: ModelService, private el: ElementRef) {
    this.element = el.nativeElement;
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

  showModal(alert){
    this.alertModal.show()
    this.alertData = alert.data;
    this.bodyMessage = alert.bodyMessage;
    this.headerMessage = alert.headerMessage
    this.yesButtonLabel = alert.yesButtonText ? alert.yesButtonText : '';
    this.noButtonLabel = alert.noButtonText ? alert.noButtonText : '';
    if(alert.type == 'info'){     
      this.icon_name = "info-circle";
      this.class_name = "info";
    }else if(alert.type == 'success'){      
      this.icon_name = "check-circle";
      this.class_name = "success";
    }else if(alert.type == 'delete'){      
      this.icon_name = "times";
      this.class_name = "primary";
    }else{
      this.icon_name = "";
      this.class_name = "";
    }    
  }

  ok(){
    this.alertModal.hide();
    this.alertResponce.emit(true);
  }

  cancel(){
    this.alertModal.hide();
    this.alertResponce.emit(false);
  }
  yesButtonText(){
    if(this.yesButtonLabel != ''){
      return this.yesButtonLabel;
    }else{
      return 'Ok';
    }
  }
  noButtonText(){
    if(this.noButtonLabel != ''){
      return this.noButtonLabel;
    }else{
      return 'Cancel';
    }
  }

}
