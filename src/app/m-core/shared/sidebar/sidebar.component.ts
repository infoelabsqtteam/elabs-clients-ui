import { Component, OnInit, ViewChild, ElementRef, AfterViewInit,Output, EventEmitter , Input } from '@angular/core';

import { Router, NavigationEnd } from '@angular/router';
import { StorageService } from '../../../services/storage/storage.service';
import { PermissionService } from '../../../services/permission/permission.service';
import { MENU } from './menu';
import { MenuItem } from './menu.model';
import { ApiService } from '../../../services/api/api.service';
import { NotificationService } from 'src/app/services/notify/notification.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, AfterViewInit {

  menu: any;

  menuItems = [];
  AllModuleList:any=[];
  modal:any='';
  sidebar2 = true;
   
  @Output() moduleSelect = new EventEmitter();

  constructor( 
    private router: Router,
    private storageService:StorageService,
    private permissionService:PermissionService, 
    private notificationService: NotificationService,
    private apiService:ApiService
  ) {
   
  }

  ngOnInit(): void {
    this.AllModuleList = this.storageService.GetModules();
    this.initialize();
  }

  ngAfterViewInit() {
    
  }

  

  /**
   * Initialize
   */
  initialize(): void {
    this.menuItems = MENU;
  }

  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasMenu(item) {
    if(item.menu_list != undefined && item.menu_list != null){
      if(item.menu_list.length > 0){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }
  hasSubMenu(item){
    if(item.submenu != undefined && item.submenu != null){
      if(item.submenu.length > 0){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  
  
  GoToSelectedModule(module){ 
    // console.log(index)
    const moduleList = this.storageService.GetModules();
    let index = -1;
    moduleList.forEach((elem, i) => {
      if(elem._id == module._id){
        index = i;
      }
    });
    if(index != -1){
      const moduleObject=this.AllModuleList[index];
      this.setAppId(moduleObject);
      this.moduleSelect.emit(index);
    }    
  }
  getTemplateData(module,submenu) {
    if(this.permissionService.checkPermission(submenu.name,'view')){
        this.storageService.SetActiveMenu(submenu);
        if (submenu.label == "Navigation") {
            this.router.navigate(['Navigation']);
        }
        else if (submenu.label == "Permissions") {
            this.router.navigate(['permissions']);
        }
        else {
          const menu = submenu;
          if(menu.name == "document_library"){
            this.router.navigate(['vdr']);
          }else if(menu.name == "report"){
            this.router.navigate(['report']);
          }
          else{
            this.apiService.resetTempData();
            this.apiService.resetGridData();
            this.GoToSelectedModule(module);
            this.router.navigate(['template']);  
          }           
        }
    }else{
        this.notificationService.notify("bg-danger", "Permission denied !!!");
    }
}
setAppId(module){
  this.storageService.setModule(module.name);
}
favrotedata;
favroteitem(event) {
  event.target.classList.toggle("active");
}

}
