import { Component, OnInit } from '@angular/core';
import { StorageService,DataShareService } from '@core/web-core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@Component({
  selector: 'app-notification-setting',
  templateUrl: './notification-setting.component.html',
  styles: [
  ]
})
export class NotificationSettingComponent implements OnInit {

  AllModuleList:any=[];
  nofifyIcon='fa-bell-slash'
  userNotificationSubsription;
  noficationData=[];
  constructor(
    private storageService:StorageService,
    private dataShareService:DataShareService,
  )
  { 

    this.dataShareService.userNotification.subscribe(data =>{
      console.log("object notiSetting",data);
      this.noficationData.push(data);
    })
    this.AllModuleList = this.storageService.GetModules();
    

  }

  ngOnInit(): void {
    this.AllModuleList.forEach((module)=>{
      // module.notify="fa-bell-slash"
      module.notify="notifications_off"
    })
       console.log(this.AllModuleList);
    console.log(this.storageService.getThemeSetting());
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

  notificationFunction(e:any,i){
    e.stopPropagation();
    this.AllModuleList[i].notify=this.AllModuleList[i].notify=='notifications_off'? 'notifications_active' : 'notifications_off'
  
    // this.nofifyIcon=this.nofifyIcon=='fa-bell-slash'? 'fa-bell' : 'fa-bell-slash'
  }

  menuNotification(e:any,m){
    e.stopPropagation();
    console.log("e>>",e);
    console.log("e>>",m);
  }

}
