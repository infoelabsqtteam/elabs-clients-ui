import { Component, OnInit, Input, Output,ViewChild,EventEmitter, HostListener } from '@angular/core';


import { CommonFunctionService } from '../../../services/common-utils/common-function.service';
import { ModalDirective } from 'angular-bootstrap-md';
import { ModelService } from 'src/app/services/model/model.service';

@Component({
  selector: 'app-shortcutinfo',
  templateUrl: './shortcutinfo.component.html',
  styleUrls: ['./shortcutinfo.component.css']
})
export class ShortcutinfoComponent implements OnInit {


  @Output() shortcutinfoResponce = new EventEmitter();
  @Input() id: string;
  @ViewChild('shortcutinfo') public shortcutinfo: ModalDirective;
  constructor(private commonFunctionService:CommonFunctionService, private modalService: ModelService) {}


  @HostListener('window:keyup.alt.c') onCtrC(){
    this.close();
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
    this.shortcutinfo.show();
  }
  close(){
    this.shortcutinfo.hide();
  }


}
