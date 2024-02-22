import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent ,MatDialogActions, MatDialogClose} from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';
import { StorageService } from '@core/web-core';

@Component({
  selector: 'app-notification-model',
  templateUrl: './notification-model.component.html',
  styleUrls: ['./notification-model.component.css'],
})
export class NotificationModelComponent implements OnInit {
notificationTypeCategories:any=[];

constructor(@Inject(MAT_DIALOG_DATA) public data:any,private storageService:StorageService) {
  let applicationSetting=this.storageService.getApplicationSetting();
  if(applicationSetting.notificationTypeCategories){
    this.notificationTypeCategories=applicationSetting.notificationTypeCategories;
  }
  // this.notificationTypeCategories=["SMS"];
  // console.log(data);
  console.log(this.notificationTypeCategories);
}

ngOnInit(): void {
}
checkAllTabAlerts(){
    let flag=false;
    if(this.data.module && this.data.module.menu_list){
      this.data.module.menu_list.forEach((menu:any)=>{
        if(menu.templateTabs && menu.templateTabs.length>0){
          menu.templateTabs.forEach((tab:any)=>{
            if(tab.email || tab.whatsapp || tab.sms){
              flag=true;
              return;
            }
          })
        }
        else if(menu.submenu && menu.submenu.length>0){
          menu.submenu.forEach((sub:any)=>{
            if(sub.templateTabs && sub.templateTabs.length>0){
              sub.templateTabs.forEach((tab:any)=>{
                if(tab.email || tab.whatsapp || tab.sms){
                  flag=true;
                  return;
                }
              })
            }
          })
        }
      })
    }
    return flag;
}

saveNotification(data){
    console.log(data);
}
checkfun(item:any,type,e:any) {
    if(e.target.checked){
      this.data.module.notification=true;
    }else{
      this.data.module.notification=this.checkAllTabAlerts();
    }
    console.log(item);
    console.log(this.data);
    }
}
