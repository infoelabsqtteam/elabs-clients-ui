import { Component, OnInit } from '@angular/core';
import { DataShareService, EnvService, StorageService, MenuOrModuleCommonService } from '@core/web-core';

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
