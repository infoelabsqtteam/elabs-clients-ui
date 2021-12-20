import { Component, OnInit ,HostListener, Inject } from '@angular/core';
import { Router,ActivatedRoute,NavigationStart,NavigationEnd } from '@angular/router';
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from '../aws-exports';

import { StorageService } from './services/storage/storage.service';
import { DataShareService } from './services/data-share/data-share.service';
import { ModelService } from './services/model/model.service';
import { CommonFunctionService } from './services/common-utils/common-function.service';
import { LoaderService } from './services/loader/loader.service';
import { ApiService } from './services/api/api.service';
import { EnvService } from './services/env/env.service';

import { BreadcrumbModule } from 'angular-bootstrap-md';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  loadedFeature = 'signin';
  pageName: any;
  redirectToHitUrl:boolean=false;
  settingModelRestSubscription;
  showHideSetting:boolean = false;
  applicationSettingSubscription


  constructor(
    private router: Router,
    private routers:ActivatedRoute, 
    private storageService: StorageService, 
    private dataShareService:DataShareService,
    private modelService:ModelService,
    private commonfunctionService:CommonFunctionService,
    public loaderService:LoaderService,
    private apiService: ApiService,
    private envService: EnvService,
    

  ) {
   
    this.envService.setDinamicallyHost();

    const object = this.commonfunctionService.getPaylodWithCriteria("ui_theme_setting", "", [], {});
    object["pageNo"] = 0;
    object["pageSize"] = 25;
    const payload = {
      "path": null,
      "data": object
    }
    this.apiService.getAplicationsThemeSetting(payload);
    if(this.dataShareService.applicationSetting != undefined){
      this.applicationSettingSubscription = this.dataShareService.applicationSetting.subscribe(
        data =>{
        //  console.log(data)
        this.setApplicationSetting(data.data)
        })
    }
   
    this.settingModelRestSubscription = this.dataShareService.settingData.subscribe(data =>{
      if(data == "logged_in"){
        this.showHideSetting = false;
      }else if (data == "logged_out"){
        this.showHideSetting = true;
      }else if(data == "hide"){
        this.showHideSetting = true;
      }

    })
   }

  
  ngOnInit() {
    this.envService.setDinamicallyHost();    
    this.router.events.subscribe(event =>{
      // if (event instanceof NavigationStart){
      //   console.log("Navigation Start :-"+event.url)
      //   if(event.url == '/' || event.url == '/home_page' || event.url == '/template'){
          
      //   }
      // }
      if (event instanceof NavigationEnd) {
        if(event.urlAfterRedirects == "/"){ 
          this.redirectToHomePage();
        }
        if (
          event.id === 1 &&
          event.url === event.urlAfterRedirects && event.url != "/download-manual-report"
        ) {
          this.redirectToHomePageWithStorage();
        }
      }      
   })

   
  

    // if (this.storageService != null && this.storageService.GetIdToken() != null) {
    //   const idToken = this.storageService.GetIdToken();
    //   if(this.storageService.GetIdTokenStatus() == appConstant.TOKEN_STATUS.ID_TOKEN_ACTIVE){
    //     this.store.dispatch(
    //       new authAction.GetUserInfoFromToken(idToken)
    //     )
    //   }else{        
    //     const payload = {
    //       appName: appConstant.appName,
    //       data:{
    //           accessToken:this.storageService.GetAccessToken()
    //       }
    //     }
    //     this.store.dispatch(
    //         new authAction.SessionExpired(payload)
    //     );
    //   }
      
    // }else if(this.router.url){
    //   console.log(this.router.url.indexOf('/template'));
    // }else{
      
    // }

    // if(this.router.url == '/'){
    //   this.redirectToHomePage();
    // }

    // if(this.router.url == '/'){
    //   this.redirectToHomePage();
    // }
    
    Amplify.configure(awsconfig);
  }


  setApplicationSetting(data) {
    if(data && data.length > 0) {
      const settingObj = data[0];
      if(settingObj.header_bg_color != "") {
        document.documentElement.style.setProperty('--headerbg', settingObj.header_bg_color);
        document.documentElement.style.setProperty('--navtxtcolor', settingObj.header_txt_color);
        document.documentElement.style.setProperty('--navtxthovercolor', settingObj.header_txt_hover_color);
        document.documentElement.style.setProperty('--headericon', settingObj.header_icon_color);
        document.documentElement.style.setProperty('--headericonhover', settingObj.header_icon_hover_color);
        document.documentElement.style.setProperty('--buttonColor', settingObj.btn_color);
        document.documentElement.style.setProperty('--buttonHoverColor', settingObj.btn_hover_color);

      }
    }
  }

  redirectToHomePage(){
    this.storageService.removeDataFormStorage();
    this.redirectToHomePageWithStorage();
  }
  redirectToHomePageWithStorage(){
    this.router.navigate(['signin'])
  }

  @HostListener("window:onbeforeunload",["$event"])
    clearLocalStorage(event){
      this.storageService.removeDataFormStorage();
    }

  openSettingModel(){
    const id = "app-setting-modal";
    const object = {

    }
    this.modelService.open(id,object);
  }
  appSettingModalResponce(event){
    console.log(event);
  }

  
}
