import { Component, OnInit, Input, Output, EventEmitter, ViewChild, } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { ModelService } from '@core/service-lib';

@Component({
  selector: 'app-add-order-modal',
  templateUrl: './add-order-modal.component.html',
  styleUrls: ['./add-order-modal.component.css']
})
export class AddOrderModalComponent implements OnInit {

  @Input() id: string;
  @Output() addOrderModalResponce = new EventEmitter();
  @ViewChild('addOrderModal') public addOrderModal: ModalDirective;

  constructor(private modalService: ModelService) { }

  ngOnInit(): void {
    let modal = this;
    if (!this.id) {
        console.error('modal must have an id');
        return;
    }
    this.modalService.remove(this.id);
    this.modalService.add(this);
  }
  showModal(){
    this.addOrderModal.show();
  }
  closeModal(){
    this.addOrderModal.hide();
  }
  addOrder(){
    this.closeModal();
    this.addOrderModalResponce.emit('add order responce')
  }

}
