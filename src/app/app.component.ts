import { Component, OnInit ,HostListener } from '@angular/core';
import { Router,NavigationEnd } from '@angular/router';
import {Title} from "@angular/platform-browser";
import { StorageService } from './services/storage/storage.service';
import { DataShareService } from './services/data-share/data-share.service';
import { ModelService } from './services/model/model.service';
import { CommonFunctionService } from './services/common-utils/common-function.service';
import { LoaderService } from './services/loader/loader.service';
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
            this.dataShareService.subscribeTemeSetting("setting");
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
      if (event instanceof NavigationEnd) {
        if(event.urlAfterRedirects == "/"){ 
          this.storageService.setRedirectUrl(event.urlAfterRedirects);
          this.redirectToHomePage();
        }
        if (
          event.id === 1 &&
          event.url === event.urlAfterRedirects && !event.url.startsWith("/download-manual-report") && !event.url.startsWith("/verify") && !event.url.startsWith("/pbl") && !event.url.startsWith("/unsubscribe") && !event.url.startsWith("/privacy-policy")
        ) {
          this.storageService.setRedirectUrl(event.urlAfterRedirects);
          this.redirectToHomePageWithStorage();
        }
      }      
   })
    
    //Amplify.configure(awsconfig);
  }

  redirectToHomePage(){
    //this.storageService.removeDataFormStorage();
    //this.localSetting();
    this.redirectToHomePageWithStorage();
  }
  redirectToHomePageWithStorage(){
    if(!this.checkApplicationSetting()){
      this.commonfunctionService.getApplicationAllSettings();
    }
    if(this.checkIdTokenStatus()){
      this.authApiService.redirectionWithMenuType();
    }else{
      this.authApiService.redirectToSignPage();
    }
  }
  checkIdTokenStatus(){
    let tokenStatus = false;
    if (this.storageService != null && this.storageService.GetIdToken() != null) {      
      if(this.storageService.GetIdTokenStatus() == StorageTokenStatus.ID_TOKEN_ACTIVE){
        tokenStatus = true;           
      }else{
        tokenStatus = false; 
      }
    }else{
      tokenStatus = false; 
    }
    return tokenStatus;
  }
  checkApplicationSetting(){
    let exists = false;
    let applicationSetting = this.storageService.getApplicationSetting();
    if(applicationSetting){
      exists = true;
    }else{
      exists = false;
    }
    return exists;
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

  // localSetting(){
  //   const settingObj = this.envService.getHostKeyValue('object');
  //   this.storageService.setApplicationSetting(settingObj);
  //   this.envService.setApplicationSetting();
  //   const themSettingObj = this.envService.getHostKeyValue('theme_setting');
  //   this.storageService.setThemeSetting(themSettingObj);
  //   this.envService.setThemeSetting(themSettingObj);
  //   this.loadPage();
  // }
}
