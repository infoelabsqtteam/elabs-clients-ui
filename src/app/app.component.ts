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

  favIcon: HTMLLinkElement = document.querySelector('#favIcon');
  themeName:any = '';

  constructor(
    private titleService:Title,
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
    // const object = this.commonfunctionService.getPaylodWithCriteria("ui_theme_setting", "", [], {});
    // object["pageNo"] = 0;
    // object["pageSize"] = 25;
    // const payload = {
    //   "path": null,
    //   "data": object
    // }
    // this.apiService.getAplicationsThemeSetting(payload);
    if(this.dataShareService.applicationSetting != undefined){
      this.applicationSettingSubscription = this.dataShareService.applicationSetting.subscribe(
        data =>{
        //  console.log(data)
        const themeSettingDate = data.data;
        if(themeSettingDate && themeSettingDate.length > 0) {
          const settingObj = themeSettingDate[0];
          this.envService.setApplicationSetting(settingObj);
        }
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
    this.themeName = this.storageService.getPageThmem();
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
          event.url === event.urlAfterRedirects && !event.url.startsWith("/download-manual-report") && !event.url.startsWith("/verify") && !event.url.startsWith("/pbl") && !event.url.startsWith("/unsubscribe") && !event.url.startsWith("/report-form")
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
    this.redirectToHomePageWithStorage();
  }
  redirectToHomePageWithStorage(){
    this.loadPage();
    if (this.storageService != null && this.storageService.GetIdToken() != null) {
        const idToken = this.storageService.GetIdToken();
        if(this.storageService.GetIdTokenStatus() == StorageTokenStatus.ID_TOKEN_ACTIVE){
          this.router.navigate(['home'])   
        }else{
          this.router.navigate(['signin']) 
        }
      }else{
        this.router.navigate(['signin']) 
      }
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
  loadPage(){
    this.favIcon.href = this.storageService.getLogoPath() + "favicon.ico";
    this.titleService.setTitle(this.storageService.getPageTitle());
    this.envService.setDinamicallyHost();
  }
}
