import { Component, OnInit } from '@angular/core';
import { DataShareService } from '../../services/data-share/data-share.service';
import { EnvService } from 'src/app/services/env/env.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-horizontal',
  templateUrl: './horizontal.component.html',
  styleUrls: ['./horizontal.component.scss']
})
export class HorizontalComponent implements OnInit {
  logoPath = ''
  constructor(
    private dataShareService:DataShareService,
    private envService:EnvService,
    private storageService: StorageService,
  ) {
    this.logoPath = this.storageService.getLogoPath() + "logo.png";
  }

  ngOnInit(): void {
    if(this.envService.getRequestType() == 'PUBLIC'){
      this.dataShareService.sendCurrentPage('HOME4')
    }else{
      this.dataShareService.sendCurrentPage('MODULE');
    }
  }


}
