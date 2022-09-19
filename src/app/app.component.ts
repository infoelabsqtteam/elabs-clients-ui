import { Component, OnInit ,HostListener, Inject } from '@angular/core';
import { Router,ActivatedRoute,NavigationStart,NavigationEnd } from '@angular/router';
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from '../aws-exports';
import {Title} from "@angular/platform-browser";
import { StorageService } from './services/storage/storage.service';
import { DataShareService } from './services/data-share/data-share.service';
import { ModelService } from './services/model/model.service';
import { CommonFunctionService } from './services/common-utils/common-function.service';
import { LoaderService } from './services/loader/loader.service';
import { ApiService } from './services/api/api.service';
import { EnvService } from './services/env/env.service';
import { StorageTokenStatus } from './shared/enums/storage-token-status.enum';
import { AuthService } from './services/api/auth/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  loadedFeature = 'signin';
  pageName: any;
  redirectToHitUrl:boolean=false;
  settingModelRestSubscription:Subscription;
  showHideSetting:boolean = false;
  themeSettingSubscription:Subscription;
  applicationSettingSubscription:Subscription;

  favIcon: HTMLLinkElement = document.querySelector('#favIcon');
  themeName:any = '';

  constructor(
    private titleService:Title,
    private router: Router, 
    private storageService: StorageService, 
    private dataShareService:DataShareService,
    private modelService:ModelService,
    public loaderService:LoaderService,
    private authApiService: AuthService,
    private commonfunctionService:CommonFunctionService,
    private envService: EnvService,
    

  ) {
    

    //this.localSetting();
    this.commonfunctionService.getApplicationAllSettings();
    if(this.dataShareService.themeSetting != undefined){
      this.themeSettingSubscription = this.dataShareService.themeSetting.subscribe(
        data =>{
          const themeSetting = data;
          if(themeSetting && themeSetting.length > 0) {
            const settingObj = themeSetting[0];
            this.storageService.setThemeSetting(settingObj);
            this.envService.setThemeSetting(settingObj);
            this.dataShareService.resetThemeSetting([]);
            this.dataShareService.subscribeTemeSetting("setting");
          }
        })
    }
    if(this.dataShareService.applicationSetting != undefined){
      this.themeSettingSubscription = this.dataShareService.applicationSetting.subscribe(
        data =>{
          const applicationSetting = data;
          if(applicationSetting && applicationSetting.length > 0) {
            const settingObj = applicationSetting[0];
            this.storageService.setApplicationSetting(settingObj);
            this.envService.setApplicationSetting();
            this.loadPage();
            this.dataShareService.resetApplicationSetting([]);
          }
        })
    }
   
    this.settingModelRestSubscription = this.dataShareService.settingData.subscribe(data =>{
      if(data == "logged_in"){
        this.showHideSetting = false;
      }else if (data == "logged_out"){
        this.showHideSetting = true;
        //this.localSetting();
      }else if(data == "hide"){
        this.showHideSetting = true;
      }

    })
   }

  ngOnInit() {     
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
          event.url === event.urlAfterRedirects && !event.url.startsWith("/download-manual-report") && !event.url.startsWith("/verify") && !event.url.startsWith("/pbl") && !event.url.startsWith("/unsubscribe") && !event.url.startsWith("/privacy-policy")
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

  redirectToHomePage(){
    this.storageService.removeDataFormStorage();
    //this.localSetting();
    this.redirectToHomePageWithStorage();
  }
  redirectToHomePageWithStorage(){
    if (this.storageService != null && this.storageService.GetIdToken() != null) {
        const idToken = this.storageService.GetIdToken();
        if(this.storageService.GetIdTokenStatus() == StorageTokenStatus.ID_TOKEN_ACTIVE){
          this.authApiService.redirectionWithMenuType();            
        }else{
          this.authApiService.redirectToSignPage(); 
        }
      }else{
        this.authApiService.redirectToSignPage(); 
      }
  }

  @HostListener("window:onbeforeunload",["$event"])
    clearLocalStorage(event){
      this.storageService.removeDataFormStorage();
      //this.localSetting();
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
  loadPage(){
    this.favIcon.href = this.storageService.getLogoPath() + "favicon.ico";
    this.titleService.setTitle(this.storageService.getPageTitle());
    this.themeName = this.storageService.getPageThmem();
  }

  localSetting(){
    const settingObj = this.envService.getHostKeyValue('object');
    this.storageService.setApplicationSetting(settingObj);
    this.envService.setApplicationSetting();
    const themSettingObj = this.envService.getHostKeyValue('theme_setting');
    this.storageService.setThemeSetting(themSettingObj);
    this.envService.setThemeSetting(themSettingObj);
    this.loadPage();
  }
}
