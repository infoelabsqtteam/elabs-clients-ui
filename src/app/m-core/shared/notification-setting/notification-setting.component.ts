import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-notification-setting',
  templateUrl: './notification-setting.component.html',
  styles: [
  ]
})
export class NotificationSettingComponent implements OnInit {
  panelOpenState = false;
  menulist = ['Menu 1', 'Menu 2', 'Menu 3', 'Menu 4', 'Menu 5']


  AllModuleList:any=[];

  constructor(
    private storageService:StorageService,
  )
  { 
    this.AllModuleList = this.storageService.GetModules();
  }

  ngOnInit(): void {
  }


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

}
