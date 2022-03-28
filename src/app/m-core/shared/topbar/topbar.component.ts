import { Component, OnInit, Inject, Output, EventEmitter , Input,OnChanges,SimpleChanges, HostListener} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { StorageService } from '../../../services/storage/storage.service';
import { PermissionService } from '../../../services/permission/permission.service';
import { DataShareService } from '../../../services/data-share/data-share.service';
import { ApiService } from '../../../services/api/api.service';
import { AuthService } from 'src/app/services/api/auth/auth.service';
import { NotificationService } from 'src/app/services/notify/notification.service';
import { EnvService } from 'src/app/services/env/env.service';
import { ModelService } from 'src/app/services/model/model.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit, OnChanges {
  active_menu_d: any = 'custom-template';
  element: any;
  configData: any;
  cookieValue;
  flagvalue;
  countryName;
  valueset: string;
  public menuData: any=[];
  AllModuleList:any=[];

  logoPath = '';
  public userInfo: any;
  public userName: any;
  public userEmail: any;
  public teamname: any;
  public userFirstLetter: any;
  gitVersionSubscription:any;
  gitVersion: any;
  

  header2 = true;
  @HostListener('window:keyup.alt.o') onCtrlO(){
      this.shortcutinfo();
  }

  @HostListener('window:keyup.alt.control.c') onCtrlChart(){
    this.chartModel();
  }


  // tslint:disable-next-line: max-line-length
  constructor(
    @Inject(DOCUMENT) private document: any, 
      private router: Router,
      private storageService: StorageService,
      private permissionService:PermissionService, 
      private notificationService: NotificationService,
      private dataShareService:DataShareService,
      private apiService:ApiService,
      private authService:AuthService,
      private envService:EnvService,
      private modelService:ModelService
) {
    this.AllModuleList = this.storageService.GetModules();
    this.logoPath = this.storageService.getLogoPath() + "logo.png";
    this.gitVersionSubscription = this.dataShareService.gitVirsion.subscribe( data =>{
      if(data && data['git.build.version']){
        this.gitVersion = data['git.build.version'];
      }
    })


    if (this.storageService.GetUserInfo()) {
          this.userInfo = this.storageService.GetUserInfo();
          this.userName = this.userInfo.name;
          this.userEmail = this.userInfo.email;
          
          let teamvalue = this.userInfo.list1
          for (var _i = 0; _i < teamvalue.length; _i++) {
              this.teamname = teamvalue[_i].name;
          }

          if (this.userName && this.userName != null) {
              this.userFirstLetter = this.userName.charAt(0).toUpperCase()
          } else {
              if (this.userInfo.email && this.userInfo.email != null) {
                  this.userFirstLetter = this.userInfo.email.toUpperCase()
              }
          }
      }
   }

  @Output() mobileMenuButtonClicked = new EventEmitter();
  @Output() goToHome = new EventEmitter();
  @Input() moduleIndex: any;

  ngOnInit(): void {
    this.AllModuleList = this.storageService.GetModules();
    this.element = document.documentElement;
    this.configData = {
      suppressScrollX: true,
      wheelSpeed: 0.3
    }; 
    
    if(this.moduleIndex != -1){
      const module =   this.AllModuleList[this.moduleIndex]
      if(module.menu_list != undefined && module.menu_list != null){
        this.menuData = module.menu_list;
        const menu = this.menuData[0];
        if(menu && menu.submenu){
          this.getTemplateData(menu.submenu[0]);
        }else{
          this.getTemplateData(menu)
        }
      }else{
        this.menuData = [];
      }     
    }else{
      this.menuData = [];
    }
    // this.store.select('menu').subscribe((state => {
    //     if (state.menuData && state.menuData.length > 0) {
    //         this.menuData = state.menuData;
    //     }
    // }))
    
    
  }
  ngOnChanges(changes: SimpleChanges) {
        
    this.ngOnInit();
    //this.handleDisabeIf();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }
  activeLinkD(link, check) {
    this.active_menu_d = link;
    if (check) {
        this.dataShareService.sendCurrentPage('DASHBOARD')
        this.router.navigate([link])
    }

  }
  getTemplateData(submenu) {
      if(this.permissionService.checkPermission(submenu.name,'view')){
          this.storageService.SetActiveMenu(submenu);
          if (submenu.label == "Navigation") {
              this.router.navigate(['Navigation']);
          }
          else if (submenu.label == "Permissions") {
              this.router.navigate(['permissions']);
          }else if (submenu.label == "Compare") {
              this.router.navigate(['diff_html']);
          }else if (submenu.name == "document_library") {
              this.router.navigate(['vdr']);
          }
          else {
              this.apiService.resetTempData();
              this.apiService.resetGridData();
              this.router.navigate(['template']);             
          }
      }else{
          this.notificationService.notify("bg-danger", "Permission denied !!!");
      }
  }
  goToMOdule(){     
    this.menuData=[];
    this.goToHome.emit();
    this.router.navigate(['/dashboard']);
}
goToVdr(){
  this.router.navigate(['/vdr']);
}
  


  /**
   * Logout the user
   */
  
  logout() {
      const payload = {
          appName: this.envService.getAppName(),
          data:{
              accessToken:this.storageService.GetAccessToken()
          }
      }
      this.authService.Logout(payload);
  }
  getCurrentMenu(){
    const currentMenu = this.storageService.GetActiveMenu();
    if(currentMenu && currentMenu.name && currentMenu.name != null){
      return currentMenu.name;
    }else{
      return;
    }       
  }
  shortcutinfo() {
    this.modelService.open('shortcutinfo_model',{})
  }
  chartModel() {
    this.modelService.open('chart_model',{})
  }
  gitInfo() {
    this.modelService.open('git_version',{})
  }
}
