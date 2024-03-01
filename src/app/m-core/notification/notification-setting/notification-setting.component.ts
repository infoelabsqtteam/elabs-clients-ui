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
        console.log(this.notificationSetting);
        if(this.notificationSetting.modules){
          this.AllModuleList=this.notificationSetting.modules;
        }
        // this.dataShareService.shareUserNotificationSetting('g');
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
    let obj={}
    this.AllModuleList.forEach((module:any)=>{
      if(module && module.name && module.notification && module.keyName){
        let name=module.keyName;
        let mod={
            reference:{
              name:module.name,
              _id:module._id
            },
            menus:this.getMenuDetails(module?.menu_list),
            notification:module.notification
        }
        obj[name]=mod
      }
    })
    // console.log("payload",obj);
    this.updateUserNotification(obj,"user_notification")
  }

  updateUserNotification(data: object, fieldName: string){
    // return new Promise(async (resolve) => {
      let userRef = this.commonFunctionService.getReferenceObject(
        this.storageService.GetUserInfo()
      );

      let payloadData={
        notifications : data,
        userId: userRef
      }
      try {    
        const payload = {
          curTemp: 'user_notification',
          data: payloadData,
        };
        this.apiService.SaveFormData(payload);
        console.log("payload>>",payload);
        // resolve({ success: true });
      } catch (error) {
        // resolve({ success: false });
      }
    // }
  // );
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
    console.log(item);
    console.log(m);
    // this.modalService.open('form-modal',item)
    // this.currentData=item;
    // console.log(this.currentData);
    // e.stopPropagation();
    // console.log("e>>",e);
    console.log("e>>",e.checked);
    item.notification=e.checked;
    this.AllModuleList[ind].notification=item.notification;
    // this.setOnAll(item,item.notification)
    console.log(item);
    console.log(this.AllModuleList);
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

  checkfun(tabs,type){
    console.log(tabs);
    tabs[type] = !tabs.type;
    console.log(tabs);
  }

  // saveNotification(data){
  //   this.createPayload();
  //   console.log(data);
  // }
}

