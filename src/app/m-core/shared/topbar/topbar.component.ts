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
  public userFirstLetter: any;
  gitVersionSubscription:any;
  gitVersion: any;
  gitbranch: any;
  gitbuild: any;
  gitnumber: any;
  gitunique: any;
  gittime: any;
  gitemail: any;
  gitname: any;
  gitcount: any;
  gitTagName: any;
  gitId: any;
  gitAbbrev: any;
  gitdescribe: any;
  gitDescribeShort: any;
  gitmessage: any;
  gitSortMsg: any;
  gitCommitTime: any;
  gitCommitEmail: any;
  gitCommitUser: any;
  gitdirty: any;
  gitahead: any;
  gitbehind: any;
  gitOriginUrl: any;
  gittags: any;
  gitCommitCount: any;

  header2 = true;
  @HostListener('window:keyup.alt.o') onCtrlO(){
      this.shortcutinfo();
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
    this.logoPath = this.envService.getLogoPath() + "logo.png";
    this.gitVersionSubscription = this.dataShareService.gitVirsion.subscribe( data =>{
      if(data && data['git.build.version']){
        this.gitVersion = data['git.build.version'];
      }
      if(data && data['git.branch']){
        this.gitbranch = data['git.branch'];
      }
      if(data && data['git.build.host']){
        this.gitbuild = data['git.build.host'];
      }
      if(data && data['git.build.number']){
        this.gitnumber = data['git.build.number'];
      }
      if(data && data['git.build.number.unique']){
        this.gitunique = data['git.build.number.unique'];
      }
      if(data && data['git.build.time']){
        this.gittime = data['git.build.time'];
      }
      if(data && data['git.build.user.email']){
        this.gitemail = data['git.build.user.email'];
      }
      if(data && data['git.build.user.name']){
        this.gitname = data['git.build.user.name'];
      }
      if(data && data['git.closest.tag.commit.count']){
        this.gitcount = data['git.closest.tag.commit.count'];
      }
      if(data && data['git.closest.tag.name']){
        this.gitTagName = data['git.closest.tag.name'];
      }
      if(data && data['git.commit.id']){
        this.gitId = data['git.commit.id'];
      }
      if(data && data['git.commit.id.abbrev']){
        this.gitAbbrev = data['git.commit.id.abbrev'];
      }
      if(data && data['git.commit.id.describe']){
        this.gitdescribe = data['git.commit.id.describe'];
      }
      if(data && data['git.commit.id.describe-short']){
        this.gitDescribeShort = data['git.commit.id.describe-short'];
      }
      if(data && data['git.commit.message.full']){
        this.gitmessage = data['git.commit.message.full'];
      }
      if(data && data['git.commit.message.short']){
        this.gitSortMsg = data['git.commit.message.short'];
      }
      if(data && data['git.commit.time']){
        this.gitCommitTime = data['git.commit.time'];
      }
      if(data && data['git.commit.user.email']){
        this.gitCommitEmail = data['git.commit.user.email'];
      }
      if(data && data['git.commit.user.name']){
        this.gitCommitUser = data['git.commit.user.name'];
      }
      if(data && data['git.dirty']){
        this.gitdirty = data['git.dirty'];
      }
      if(data && data['git.local.branch.ahead']){
        this.gitahead = data['git.local.branch.ahead'];
      }
      if(data && data['git.local.branch.behind']){
        this.gitbehind = data['git.local.branch.behind'];
      }
      if(data && data['git.remote.origin.url']){
        this.gitOriginUrl = data['git.remote.origin.url'];
      }
      if(data && data['git.tags']){
        this.gittags = data['git.tags'];
      }
      if(data && data['git.total.commit.count']){
        this.gitCommitCount = data['git.total.commit.count'];
      }

    })


    if (this.storageService.GetUserInfo()) {
          this.userInfo = this.storageService.GetUserInfo();
          this.userName = this.userInfo.name;
          this.userEmail = this.userInfo.email;
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
}
