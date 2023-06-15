import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';

import {FormGroup, FormControl} from '@angular/forms';
import { ModelService } from '@core/service-lib';



@Component({
  selector: 'app-template-modal',
  templateUrl: './template-modal.component.html',
  styleUrls: ['./template-modal.component.css']
})
export class TemplateModalComponent implements OnInit {
  @Input() id: string;
  @Output() temlateModalResponce = new EventEmitter();
  @ViewChild('templateModal') public templateModal: ModalDirective;
  templateName:any='';
  objectData:any={};
  campaignOne: FormGroup;
  campaignTwo: FormGroup;
  constructor(private modalService: ModelService, private el: ElementRef) { 
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    this.campaignOne = new FormGroup({
      start: new FormControl(new Date(year, month, 13)),
      end: new FormControl(new Date(year, month, 16))
    });

    this.campaignTwo = new FormGroup({
      start: new FormControl(new Date(year, month, 15)),
      end: new FormControl(new Date(year, month, 19))
    });
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
    this.templateModal.show();
    this.templateName = alert.data.report_template;
    this.objectData=alert.data;
  } 
  closeModal(){
    this.templateModal.hide();
  }
  modifyTemplate(){    
    this.temlateModalResponce.emit('this is template modal :- '+this.templateName);
    this.closeModal();
  }

}
