import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { NotificationService,CommonFunctionService ,ApiCallService,ApiService,DataShareService} from '@core/web-core';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-notification-menu',
  templateUrl: './notification-menu.component.html',
  styleUrls: ['./notification-menu.component.css']
})
export class NotificationMenuComponent implements OnInit,OnDestroy {

  @Input() notifyMenuTrigger:MatMenuTrigger;
  saveResponceSubscription:Subscription;
  @Input() notificationlist;
  constructor(
    private apiCallService:ApiCallService,
    private dataShareService:DataShareService,
    private apiService:ApiService,
    private commonFunctionService:CommonFunctionService,
    private notificationService:NotificationService,
    private router:Router
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe(this.saveResponceSubscription);
  }

  readNotification(data:any){
    if (this.notifyMenuTrigger?.menuOpen) {
       this.notifyMenuTrigger.closeMenu();
    }
    if (data.notificationStatus === 'UNREAD') {
      this.notificationService.markUsRead(data);
      this.saveCallSubscribe();
    }
    if(data && data.url){
      this.router.navigate([data.url])
    }      
  }

  saveCallSubscribe(){
    this.saveResponceSubscription = this.dataShareService.saveResponceData.subscribe(responce => {
      this.setSaveResponce(responce);
    })
  }

  setSaveResponce(saveFromDataRsponce){
    if (saveFromDataRsponce && saveFromDataRsponce.success != '') {
      if (saveFromDataRsponce.success == 'success') {
        this.apiCallService.getUserNotification(1);
      }
    }
    this.unsubscribe(this.saveResponceSubscription);
  }

  getDay(data){
    return this.commonFunctionService.getDay(data);
  }

  unsubscribe(variable){
    if(variable){
      variable.unsubscribe();
    }
  }

  showMore(){
    if(this.notifyMenuTrigger?.menuOpen){
      this.notifyMenuTrigger.closeMenu();
    }
    this.router.navigate(["browse/NOTIFY/notification_settings/user_notification_master"]);  
  }
}
