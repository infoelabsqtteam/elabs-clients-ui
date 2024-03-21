import { Component, OnInit,OnDestroy } from '@angular/core';
import { StorageService,DataShareService,ApiCallService,NotificationService,FormValueService,CoreFunctionService ,ModelService,CommonFunctionService,ApiService,MenuOrModuleCommonService} from '@core/web-core';
import {
  MatDialog
} from '@angular/material/dialog';
import { NotificationModelComponent } from '../notification-model/notification-model.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-setting',
  templateUrl: './notification-setting.component.html',
  styles: [
  ]
})
export class NotificationSettingComponent implements OnInit,OnDestroy {

  AllModuleList:any=[];
  userNotificationSettingSubsription:Subscription;
  saveResponceSubscription:Subscription;
  isPageLoading=false;
  constructor(
    private storageService:StorageService,
    private dataShareService:DataShareService,
    private commonFunctionService: CommonFunctionService,
    private apiService: ApiService,
    private notificationService: NotificationService,
    private menuOrModuleCommonService: MenuOrModuleCommonService,
    private formValueService: FormValueService,
    public dialog: MatDialog
  )
  { 
    this.userNotificationSettingSubsription=this.dataShareService.userNotificationSetting.subscribe((res)=>{
      if(res){
        this.AllModuleList =this.menuOrModuleCommonService.getModulesFromObject(res);
      }   
  })
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
  ngOnDestroy(): void {
    this.unsubscribe(this.userNotificationSettingSubsription);
    this.unsubscribe(this.saveResponceSubscription);
  }

  openDialog(menu:any,module:any) {
    let data={menu,module}
    let dialogRef=this.dialog.open(NotificationModelComponent,{data});
  }

  saveNotification(){
    let data=this.formValueService.transformArrayToObject(this.AllModuleList);
    this.updateUserNotification(data,"user_notification")
  }

  updateUserNotification(data: object, fieldName: string){
      this.isPageLoading=true;
      let userRef = this.commonFunctionService.getReferenceObject(this.storageService.GetUserInfo());
      let payloadData={notifications : data,userId: userRef}
      const payload = {
          curTemp: 'user_notification',
          data: payloadData,
      };
      this.apiService.SaveFormData(payload);
      this.saveCallSubscribe();
  } 

  saveCallSubscribe(){
    this.saveResponceSubscription = this.dataShareService.saveResponceData.subscribe(responce =>{
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

  menuNotification(e:any,m,item,ind?){
    item.notification=e.checked;
    this.AllModuleList[ind].notification=item.notification;
    // this.setOnAll(item,item.notification)
  }
}

