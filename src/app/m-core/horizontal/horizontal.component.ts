import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { DataShareService, EnvService, StorageService, MenuOrModuleCommonService } from '@core/web-core';

@Component({
  selector: 'app-horizontal',
  templateUrl: './horizontal.component.html',
  styleUrls: ['./horizontal.component.scss']
})
export class HorizontalComponent implements OnInit {
  @ViewChild('rightsidenav', { static: true }) rightsidenav: MatSidenav;
  logoPath = ''
  @ViewChild('rightsidenav', { static: true }) rightsidenav: MatSidenav;
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
