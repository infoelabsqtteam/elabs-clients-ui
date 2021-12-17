import { Component, OnInit } from '@angular/core';
import { DataShareService } from '../../services/data-share/data-share.service';


@Component({
  selector: 'app-horizontal',
  templateUrl: './horizontal.component.html',
  styleUrls: ['./horizontal.component.scss']
})
export class HorizontalComponent implements OnInit {

  constructor(
    private dataShareService:DataShareService
  ) { 
    
  }

  ngOnInit(): void {
    this.dataShareService.sendCurrentPage('MODULE');
  }


}
