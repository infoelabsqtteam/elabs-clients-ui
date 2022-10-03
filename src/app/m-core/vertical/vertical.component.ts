import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router, NavigationEnd } from '@angular/router';
import { DataShareService } from 'src/app/services/data-share/data-share.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vertical',
  templateUrl: './vertical.component.html',
  styleUrls: ['./vertical.component.css']
})
export class VerticalComponent implements OnInit {
  moduleIndex : any = -1;
  dashbordPage:boolean=false;
  navigationSubscription;
  applicationSettingSubscription:Subscription;
  logoPath = ''


  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    private router: Router,
    private dataShareService:DataShareService,
    private storageService: StorageService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher
    ) {
    this.mobileQuery = media.matchMedia('(max-width:991px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    
    this.pageload();
    this.applicationSettingSubscription = this.dataShareService.applicationSettings.subscribe(setting =>{
      if(setting == 'setting'){
        this.pageload();
      }
    })
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
   }

  ngOnInit(): void {
    document.body.setAttribute('data-sidebar', 'dark');
    document.body.removeAttribute('data-layout-size');
    document.body.removeAttribute('data-layout');
    document.body.removeAttribute('data-topbar');
    document.body.classList.remove('auth-body-bg');
    const routIndex = window.location.href.indexOf("/dashboard");
    if ( routIndex != -1){
      // this.router.navigate(['download-report'])
      this.dashbordPage=true;
    }else{
      this.dashbordPage=false;
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  initialiseInvites() {    
    // Set default values and re-fetch any data you need.
    const routIndex = window.location.href.indexOf("/dashboard");
    if ( routIndex != -1){
      // this.router.navigate(['download-report'])
      this.dashbordPage=true;
    }else{
      this.dashbordPage=false;
    }
    
  }
  /**
   * On mobile toggle button clicked
   */
  onToggleMobileMenu() {
    document.body.classList.toggle('sidebar-enable');
    document.body.classList.toggle('vertical-collpsed');

    if (window.screen.width <= 768) {
      document.body.classList.remove('vertical-collpsed');
    }
  }
  changeModul(moduleIndex){
    this.moduleIndex = moduleIndex;
    if(this.moduleIndex != -1) {
      this.dataShareService.sendCurrentPage('DASHBOARD')
    }
  }
  goToHome(){
    this.moduleIndex = -1;
  } 
  pageload(){
    this.logoPath = this.storageService.getLogoPath() + "logo.png";
  }

}
