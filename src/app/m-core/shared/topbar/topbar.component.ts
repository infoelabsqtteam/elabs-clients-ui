import { Component, OnInit, Inject, Output, EventEmitter , Input,OnChanges,SimpleChanges} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import * as AppConstants from '../../../shared/app.constants';
import { StorageService } from '../../../services/storage/storage.service';
import { PermissionService } from '../../../services/permission/permission.service';
import { DataShareService } from '../../../services/data-share/data-share.service';
import { ApiService } from '../../../services/api/api.service';
import { AuthService } from 'src/app/services/api/auth/auth.service';
import { NotificationService } from 'src/app/services/notify/notification.service';

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

  // tslint:disable-next-line: max-line-length
  constructor(
    @Inject(DOCUMENT) private document: any, 
      private router: Router,
      private storageService: StorageService,
      private permissionService:PermissionService, 
      private notificationService: NotificationService,
      private dataShareService:DataShareService,
      private apiService:ApiService,
      private authService:AuthService
) {
    this.AllModuleList = this.storageService.GetModules();
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
          appName: AppConstants.appName,
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
}
