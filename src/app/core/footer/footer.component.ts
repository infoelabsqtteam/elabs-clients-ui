import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {DataShareService, EnvService, StorageService } from '@core/web-core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  currentPage:boolean = false;
  menuBoxHome:boolean = false;
  subscription:any;
  template:string = "temp1";
  title = "";
  currentYear:any;
  applicationSettingSubscription:Subscription;

  constructor(
    private dataShareService:DataShareService,
    private envService:EnvService,
    private storageService:StorageService,
    private router: Router
  ) {
    this.pageloded();
    this.setpage(this.dataShareService.getCurrentPage());
    this.subscription = this.dataShareService.currentPage.subscribe(
        (data: any) => {
            this.setpage(data);
        },
        error => {
            console.log(error)
        },
        () => console.log('test')
    );    
    this.currentYear=(new Date()).getFullYear();
    this.applicationSettingSubscription = this.dataShareService.applicationSettings.subscribe(setting =>{
      if(setting == 'setting'){
        this.pageloded();
      }
  })
  }

  ngOnInit(): void {
    this.pageloded();
  }
  setpage(res){
    switch(res){
      case "HOME":
          this.currentPage = true;  
          this.menuBoxHome = false;
          break;
      case "EXAMTEST":
          this.currentPage = true;  
          this.menuBoxHome = false;
          break;
      case "DASHBOARD":
          this.currentPage = true;      
          this.menuBoxHome = false; 
          break;
      case "MODULE":
          this.currentPage = true;      
          this.menuBoxHome = false; 
          break;
      default :
          this.currentPage = true;   
          this.menuBoxHome = false;
          break;
          
    }
  }
  pageloded(){
    this.template = this.storageService.getTemplateName();
    this.title = this.storageService.getPageTitle();
  }
  navigateStatic(routerLink:string) {
    if(routerLink){
        this.router.navigate(['/'+routerLink]);
    }else{
        console.log(routerLink+' router is not a valid Link or undefined')
    }
  }
}
