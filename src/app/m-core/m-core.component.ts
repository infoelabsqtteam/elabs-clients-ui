import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { LAYOUT_VERTICAL, LAYOUT_HORIZONTAL } from './m-core.model';
import { StorageService, DataShareService, EnvService, MenuOrModuleCommonService } from '@core/web-core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-mcore',
  templateUrl: './m-core.component.html',
  styleUrls: ['./m-core.component.css']
})
export class McoreComponent implements OnInit {
  @ViewChild('rightsidenav', { static: true }) rightsidenav: MatSidenav;
  @ViewChild('drawer', { static: false }) drawer: MatSidenav;
  // layout related config
  layoutType: string="vertical";
  isShow:boolean = true;

  applicationSettingSubscription:Subscription;
  logoPath:any = '';
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    private storageService:StorageService,
    private dataShareService:DataShareService,
    private envService:EnvService,
    private menuOrModuleCommonService:MenuOrModuleCommonService,
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher
    ) {
    this.dataShareService.sendCurrentPage('DASHBOARD');
    this.dataShareService.chartModelShowHide.subscribe(data =>{
      this.isShow = data;
    });
    this.mobileQuery = media.matchMedia('(max-width:991px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    

    this.pageload();
    this.applicationSettingSubscription = this.dataShareService.applicationSettings.subscribe(setting =>{
      if(setting == 'setting'){
        this.pageload();
      }
    })
   }

  ngOnInit() {
    // default settings
    const menuType =  this.storageService.GetMenuType();
    if(this.envService.getRequestType() == 'PUBLIC'){
      this.layoutType = LAYOUT_HORIZONTAL; 
      this.dataShareService.sendCurrentPage('HOME4')
    }
    else{
      this.dataShareService.sendCurrentPage('MODULE');
      if(menuType == 'Horizontal'){
        this.layoutType = LAYOUT_HORIZONTAL; 
       // this.layoutType = LAYOUT_VERTICAL;
      }else{
        this.layoutType = LAYOUT_VERTICAL; 
      } 
    }
       
  }
  ngOnDestroy() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  /**
   * Check if the vertical layout is requested
   */
  isVerticalLayoutRequested() {
    return this.layoutType === LAYOUT_VERTICAL;
  }

  /**
   * Check if the horizontal layout is requested
   */
  isHorizontalLayoutRequested() {
    return this.layoutType === LAYOUT_HORIZONTAL;
  }
  
  shortcutinfoResponce(responce){
    // console.log(responce);
  }
  chartModalResponce(responce){
    // console.log(responce);
  }
  gitModalResponce(responce){
    // console.log(responce);
  }
 
  pageload(){
    this.logoPath = this.storageService.getLogoPath() + "logo.png";
  }
  goToHomePage(){
    this.menuOrModuleCommonService.goToMOdule();
  }
  toggleSideBar(){
    this.drawer.toggle()
  }

}
