import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { ApiService } from 'src/app/services/api/api.service';
import { ModelService } from 'src/app/services/model/model.service';

@Component({
  selector: 'app-chart-modal',
  templateUrl: './chart-modal.component.html',
  styleUrls: ['./chart-modal.component.css']
})
export class ChartModalComponent implements OnInit {

  @Input() id: string;
  @Output() chartModalResponce = new EventEmitter();
  @ViewChild('chartModel') public chartModel: ModalDirective;
  isShow:boolean=false;

  constructor(
    private modalService: ModelService
  ) { }

  ngOnInit() {
    let modal = this;
    if (!this.id) {
        console.error('modal must have an id');
        return;
    }
    this.modalService.remove(this.id);
    this.modalService.add(this);
  }
  showModal(data:any){
    this.chartModel.show();
    // this.isShow = true;
  }
  close(){
    this.chartModel.hide();
    // this.isShow = false;
  }

}
