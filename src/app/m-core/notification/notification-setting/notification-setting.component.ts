import { Component, OnInit,OnDestroy } from '@angular/core';
import { StorageService,DataShareService,ApiCallService,NotificationService,CoreFunctionService ,ModelService,CommonFunctionService,ApiService} from '@core/web-core';
// import {MatButtonToggleModule} from '@angular/material/button-toggle';
// import {MatListModule} from '@angular/material/list';
import {
  MatDialog
} from '@angular/material/dialog';
import { NotificationModelComponent } from '../notification-model/notification-model.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-setting',
  templateUrl: './notification-setting.component.html',
  styleUrls: ['./notification-setting_styles.css'],
})
export class NotificationSettingComponent implements OnInit,OnDestroy {

  AllModuleList:any=[];
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
    this.unsubscribe(this.userNotificationSubsription);
    this.unsubscribe(this.saveResponceSubscription);
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

  menuNotification(e:any,m,item,ind?){
    item.notification=e.checked;
    this.AllModuleList[ind].notification=item.notification;
    // this.setOnAll(item,item.notification)
  }
}

