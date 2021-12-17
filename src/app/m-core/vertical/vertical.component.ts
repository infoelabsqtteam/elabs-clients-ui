import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-vertical',
  templateUrl: './vertical.component.html',
  styleUrls: ['./vertical.component.css']
})
export class VerticalComponent implements OnInit {
  moduleIndex : any = -1;
  dashbordPage:boolean=false;
  navigationSubscription;
  

  constructor(private router: Router) {
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
  }
  goToHome(){
    this.moduleIndex = -1;
  } 

}
