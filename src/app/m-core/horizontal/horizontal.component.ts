import { Component, OnInit } from '@angular/core';
import { DataShareService } from '../../services/data-share/data-share.service';
import { EnvService } from 'src/app/services/env/env.service';

@Component({
  selector: 'app-horizontal',
  templateUrl: './horizontal.component.html',
  styleUrls: ['./horizontal.component.scss']
})
export class HorizontalComponent implements OnInit {

  constructor(
    private dataShareService:DataShareService,
    private envService:EnvService
  ) { 
    
  }

  ngOnInit(): void {
    if(this.envService.getRequestType() == 'PUBLIC'){
      this.dataShareService.sendCurrentPage('HOME4')
    }else{
      this.dataShareService.sendCurrentPage('MODULE');
    }
  }


}
