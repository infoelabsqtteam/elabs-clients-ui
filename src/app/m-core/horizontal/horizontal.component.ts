import { Component, OnInit } from '@angular/core';
import { DataShareService } from '../../services/data-share/data-share.service';
import { EnvService } from 'src/app/services/env/env.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { MenuOrModuleCommonService } from 'src/app/services/menu-or-module-common/menu-or-module-common.service';

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
    private menuOrModuleCommonService:MenuOrModuleCommonService
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
  goToHomePage(){
    this.menuOrModuleCommonService.goToMOdule();
  }


}
