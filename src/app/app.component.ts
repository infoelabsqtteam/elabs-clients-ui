import { Component, OnInit ,HostListener, OnDestroy } from '@angular/core';
import { Router,NavigationEnd } from '@angular/router';
import {Title} from "@angular/platform-browser";
import { Subscription } from 'rxjs';
import { StorageService, DataShareService, ModelService, CommonFunctionService, LoaderService, EnvService, AuthService, AuthDataShareService, ApiCallService, AwsSecretManagerService } from '@core/web-core';
import { environment } from '../environments/environment'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

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
    private authService: AuthService,
    private commonfunctionService:CommonFunctionService,
    private envService: EnvService,
    private authDataShareService: AuthDataShareService,
    private apiCallService:ApiCallService,
    private awsSecretManagerService : AwsSecretManagerService
  ) {
    this.getAppSettingAsync()
    
    //this.localSetting();
    // this.apiCallService.getApplicationAllSettings();
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
   
    this.settingModelRestSubscription = this.authDataShareService.settingData.subscribe(data =>{
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
  ngOnDestroy(): void {
    this.unsubscribe(this.themeSettingSubscription);
    this.unsubscribe(this.applicationSettingSubscription);
    this.unsubscribe(this.settingModelRestSubscription);
  }

   async getAppSettingAsync (){

    let hostname:any ="";
    if(this.storageService.checkPlatForm() == 'mobile'){
      hostname = this.storageService.getClientName();
    }else{
      hostname = this.envService.getHostName('hostname');
    }
    if(hostname == 'localhost'){
      hostname = this.storageService.getClientCodeEnviorment().serverhost;
      this.storageService.setHostNameDinamically(hostname+"/rest/");
    }else{
      await this.awsSecretManagerService.getSecret(hostname);
    }
    this.apiCallService.getApplicationAllSettings();
    
   }
   
  ngOnInit() {     
    this.router.events.subscribe(event =>{
      if (event instanceof NavigationEnd) {
        if(event.urlAfterRedirects == "/"){ 
          this.redirectToHomePage();
        }else if(
          event.id === 1 &&
          event.url === event.urlAfterRedirects && !event.url.startsWith("/download-manual-report") && !event.url.startsWith("/verify") && !event.url.startsWith("/pbl") && !event.url.startsWith("/unsubscribe") && !event.url.startsWith("/privacy-policy")
        ) { 
          // if(event.url.startsWith("/browse") && this.storageService.getChildWindowUrl() == '/'){
          //   this.storageService.setRedirectUrl(event.urlAfterRedirects);
          // }  
          let themeSettings =  this.storageService.getThemeSetting();
          if(themeSettings){
            this.envService.setThemeSetting(themeSettings);
          }      
          this.redirectToHomePageWithStorage();
        }
      }      
   })
    
  }

  redirectToHomePage(){
    //this.storageService.removeDataFormStorage();
    //this.localSetting();
    this.redirectToHomePageWithStorage();
  }
  redirectToHomePageWithStorage(){
    if(!this.authService.checkApplicationSetting()){
      this.apiCallService.getApplicationAllSettings();
    }
    if(this.authService.checkIdTokenStatus().status){
      this.authService.redirectionWithMenuType();
    }else{
      this.authService.redirectToSignPage();
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

  unsubscribe(variable){
    if(variable){
        variable.unsubscribe();
    }
  }   
}
