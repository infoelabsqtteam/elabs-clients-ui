import { Component, OnInit,OnDestroy } from '@angular/core';
import { StorageService,DataShareService,ApiCallService,NotificationService,CoreFunctionService ,ModelService,CommonFunctionService,ApiService} from '@core/web-core';
// import {MatButtonToggleModule} from '@angular/material/button-toggle';
// import {MatListModule} from '@angular/material/list';
import {
  MatDialog
} from '@angular/material/dialog';
// import {MatButtonModule} from '@angular/material/button';
import { NotificationModelComponent } from '../notification-model/notification-model.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-setting',
  templateUrl: './notification-setting.component.html',
  styleUrls: ['./notification-setting_styles.css'],
})
export class NotificationSettingComponent implements OnInit,OnDestroy {

  AllModuleList:any=[];
  // nofifyIcon='fa-bell-slash'
  userNotificationSubsription:Subscription;
  saveResponceSubscription:Subscription;
  notificationData:any;
  notificationSetting:any={}
  currentData:any="";
  isPageLoading=false;
  constructor(
    private storageService:StorageService,
    private dataShareService:DataShareService,
    private modalService: ModelService,
    private commonFunctionService: CommonFunctionService,
    private apiService: ApiService,
    private apiCallService: ApiCallService,
    private coreFunctionService: CoreFunctionService,
    private notificationService: NotificationService,
    public dialog: MatDialog
  )
  { 
    this.userNotificationSubsription=this.dataShareService.userNotificationSetting.subscribe((res)=>{
      if(res){
        this.notificationSetting =this.notificationService.getModulesFromNotificationObject(res);
        if(this.notificationSetting.modules){
          this.AllModuleList=this.notificationSetting.modules;
        }
      }   
  })

  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    if(this.userNotificationSubsription){
      this.userNotificationSubsription.unsubscribe();
    }
  }

  openDialog(menu:any,module:any) {
    let data={menu,module}
    let dialogRef=this.dialog.open(NotificationModelComponent,{data});
  }

  saveNotification(){
    let data=this.notificationService.saveNotification(this.AllModuleList);
    this.updateUserNotification(data,"user_notification")
  }

  updateUserNotification(data: object, fieldName: string){
      this.isPageLoading=true;
      let userRef = this.commonFunctionService.getReferenceObject(
        this.storageService.GetUserInfo()
      );
      let payloadData={
        notifications : data,
        userId: userRef
      }
      const payload = {
          curTemp: 'user_notification',
          data: payloadData,
      };
      this.apiService.SaveFormData(payload);
      this.saveCallSubscribe();
  } 

  saveCallSubscribe(){
    this.saveResponceSubscription = this.dataShareService.saveResponceData.subscribe(responce =>{
      console.log(responce)
      if (responce) {
        if (responce.success && responce.success != '') {
            if (responce.success == 'success') {
                this.isPageLoading=false;
                this.notificationService.notify("bg-success","Notification setting updated successfully!");
            }
        }
    }
    this.unsubscribe(this.saveResponceSubscription);
    })
  }

  unsubscribe(variable){
    if(variable){
      variable.unsubscribe();
    }
  }

  getMenuDetails(module:any){
    let obj={};
    if(module){
     module.forEach((menu:any)=>{
      if(menu && menu.templateTabs){
        let menuName=menu.keyName;
        let menuDetails={
          reference:{
            name:menu.name,
            _id:menu._id
          },
          templateTabs:this.getTempDetails(menu.templateTabs)
        }
        obj[menuName]=menuDetails;
      }
      else if(menu.submenu){
        let menuName=menu.name;
        let menuDetails={
          reference:{
            name:menu.name,
            _id:menu._id
          },
          submenus:this.getMenuDetails(menu.submenu)
        }
        obj[menuName]=menuDetails;
      }
    })
  }
    return obj;

  }

  getTempDetails(tabs:any){
    let obj={};
    tabs.forEach((tab:any)=>{
      if(tab){
        let tabName=tab.keyName;
        let tabDetails={
          reference:{
            name:tab.name,
            _id:tab._id
          },
          activeAlerts:this.getActiveAlerts(tab)
        }
        obj[tabName]=tabDetails;
      }
    })
    return obj;
  }

  getActiveAlerts(tab:any){
    let arr=[];
    if(tab?.email){
      arr.push('EMAIL');
    }
    if(tab?.whatsapp){
      arr.push('WHATSAPP');
    }
    if(tab?.sms){
      arr.push('SMS');
    }
    return arr;
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
  // hasSubMenu(item){
  //   if(item.submenu != undefined && item.submenu != null){
  //     if(item.submenu.length > 0){
  //       return true;
  //     }else{
  //       return false;
  //     }
  //   }else{
  //     return false;
  //   }
  // }

  notificationFunction(e:any,i){
    e.stopPropagation();
    this.AllModuleList[i].notify=this.AllModuleList[i].notify=='notifications_off'? 'notifications_active' : 'notifications_off'
  
    // this.nofifyIcon=this.nofifyIcon=='fa-bell-slash'? 'fa-bell' : 'fa-bell-slash'
  }

  menuNotification(e:any,m,item,ind?){
    item.notification=e.checked;
    this.AllModuleList[ind].notification=item.notification;
    // this.setOnAll(item,item.notification)
  }

  setOnAll(obj,value){
    if(obj.menu_list){
      obj.menu_list.forEach((menu:any)=>{
        // menu.notification=value;
        if(menu.templateTabs){
          this.setEmailOn(menu.templateTabs,value)
        }
        if(menu.submenu){
          menu.submenu.forEach((sub:any)=>{
            if(sub.templateTabs){
              this.setEmailOn(sub.templateTabs,value)
            }
          })
        }
      })
    }else if(obj.templateTabs){
      this.setEmailOn(obj.templateTabs,value)
    }
  }

  setEmailOn(arr,value){
      arr.forEach((ele,i)=>{
        ele.email=value;
      })
  }

  // checkfun(tabs,type){
  //   tabs[type] = !tabs.type;
  // }

  // saveNotification(data){
  //   this.createPayload();
  //   console.log(data);
  // }
}

