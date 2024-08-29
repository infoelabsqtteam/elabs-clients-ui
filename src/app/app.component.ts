import { Component, OnInit ,HostListener } from '@angular/core';
import { Router,NavigationEnd } from '@angular/router';
import {Title} from "@angular/platform-browser";
import { Subscription } from 'rxjs';
import { StorageService, DataShareService, ModelService, LoaderService, EnvService, AuthService, AuthDataShareService, AwsSecretManagerService, CookiesService, ApiCallService } from '@core/web-core';

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
  settingLoding = false;

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
    private envService: EnvService,
    private authDataShareService: AuthDataShareService,
    private apiCallService:ApiCallService,
    private awsSecretManagerService : AwsSecretManagerService,
    private cookieService: CookiesService
  ) {
    //this.localSetting();
    // this.apiCallService.getApplicationAllSettings();
    if(!this.settingLoding){
      this.getApplicationSettings();
      console.log("constructor first");
    }else {
      this.loadApplicationSetting('constructure');
      console.log("constructor second");
    }
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

    this.dataShareService.serverEndPoint.subscribe(data=>{
      if(data){
        this.awsSecretManagerService.getServerAndAppSetting();
      }
    })
   }

   
  ngOnInit() {
    this.initialOnInit();    
  }

  async initialOnInit(){
    try{
      if(!this.settingLoding){
        await this.getApplicationSettings();
        console.log("oninit first");
      }else {
        this.loadApplicationSetting('constructure');
        console.log("oninit second");
      }
      this.router.events.subscribe(event =>{
        if (event instanceof NavigationEnd) {
          if(event.urlAfterRedirects == "/"){ 
            this.redirectToHomePage();
            console.log("route first");
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
            console.log("route second");
          }
        }      
     })

    }catch(err){
      console.log(err);
    }
  }

  redirectToHomePage(){
    //this.storageService.removeDataFormStorage();
    //this.localSetting();
    this.redirectToHomePageWithStorage();
  }
  redirectToHomePageWithStorage(){
    if(!this.authService.checkApplicationSetting()){
      // this.apiCallService.getApplicationAllSettings();
      if(!this.settingLoding){
        this.getApplicationSettings();
      }else {
        this.loadApplicationSetting("first redirect home page");
      }
    }else {
      this.loadApplicationSetting("second redirect home page");
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

  async getApplicationSettings() {
    if(this.settingLoding){
      return;
    }
    const domainName = document.location.hostname;
    const hostNameInLocal = this.storageService.getHostNameDinamically();
    const hostNameInCookies = this.cookieService.getCookieByName(domainName);
    if(domainName != 'localhost'){
      if (!!hostNameInCookies && !hostNameInLocal) {
          let serverHost = new URL(hostNameInCookies)?.origin;
          this.dataShareService.shareServerHostName(serverHost);
          this.storageService.setHostNameDinamically(hostNameInCookies);
          this.loadApplicationSetting('first check cookie');
          console.log("first");
      } else {
        this.settingLoding = true;
          if (!hostNameInLocal || !this.authService.checkApplicationSetting()) {
            if(!this.authService.checkApplicationSetting() && hostNameInLocal){
              this.apiCallService.getApplicationAllSettings();
              console.log("second");
            } else{
              await this.awsSecretManagerService.getServerAndAppSetting();
              console.log("third");
            }

          } else {
              let serverHost = new URL(hostNameInLocal)?.origin;
              this.dataShareService.shareServerHostName(serverHost);
              this.storageService.setHostNameDinamically(hostNameInLocal);
              this.loadApplicationSetting('forth check cookie');
              console.log("forth");
          }
      }
    } else {
      await this.awsSecretManagerService.getServerAndAppSetting();
      console.log("fifth");
    }
    
    if(this.storageService.getHostNameDinamically()){
      this.settingLoding = false;
    }
  }


  loadApplicationSetting(commingPlace){
    this.envService.setApplicationSetting();
    this.loadPage();
    this.dataShareService.subscribeTemeSetting("setting");
    let themeSettings =  this.storageService.getThemeSetting();
    if(themeSettings){
      this.envService.setThemeSetting(themeSettings);
    }
    console.log(commingPlace);
  }
  
}
