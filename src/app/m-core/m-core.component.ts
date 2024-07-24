import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { LAYOUT_VERTICAL, LAYOUT_HORIZONTAL } from './m-core.model';
import { StorageService, DataShareService, EnvService, MenuOrModuleCommonService } from '@core/web-core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';


export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-mcore',
  templateUrl: './m-core.component.html',
  styleUrls: ['./m-core.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
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
    if(this.envService.getRequestType() == 'PUBLIC'){
      this.layoutType = LAYOUT_HORIZONTAL; 
      this.dataShareService.sendCurrentPage('MODULE')
    }
    else{    
      const menuType =  this.storageService.GetMenuType();  
      if(menuType == 'Horizontal'){
        this.layoutType = LAYOUT_HORIZONTAL; 
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
