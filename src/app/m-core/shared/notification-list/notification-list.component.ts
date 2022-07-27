import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonFunctionService } from 'src/app/services/common-utils/common-function.service';
import { DataShareService } from 'src/app/services/data-share/data-share.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Common } from 'src/app/shared/enums/common.enum';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styles: [
  ]
})
export class NotificationListComponent implements OnInit {
  
  notificationlist:any=[];
  userNotificationSubscription:Subscription;
  saveResponceSubscription:Subscription;
  pageNumber = Common.PAGE_NO;
  itemNumOfGrid = Common.ITEM_NUM_OF_GRID;
  total:number;
  field:any;

  constructor(
    private storageService:StorageService,
    private dataShareService:DataShareService,
    private CommonFunctionService:CommonFunctionService,
    private apiService:ApiService
  )
  { 
    this.CommonFunctionService.getUserNotification(this.pageNumber);
    this.userNotificationSubscription = this.dataShareService.userNotification.subscribe(data => {
        if (data && data.data && data.data.length > 0) {
            this.setUserNotification(data.data);
            this.total = data.data_size;
        }else{
          this.notificationlist = [];
          this.total = 0;
        }
    });
    
  }
  saveCallSubscribe(){
    this.saveResponceSubscription = this.dataShareService.saveResponceData.subscribe(responce =>{
      this.setSaveResponce(responce);
    })
  }
  unsubscribe(variable){
    if(variable){
      variable.unsubscribe();
    }
  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.userNotificationSubscription){
      this.userNotificationSubscription.unsubscribe();
    }
  }
  setUserNotification(data){
      this.notificationlist = this.setKeyValueInObjectList(data,'selected',false);
  }
  setKeyValueInObjectList(list,key,value){
    let newList = [];
    list.forEach(element => {
      let obj = JSON.parse(JSON.stringify(element));
      obj[key] = value;
      newList.push(obj);
    });
    return newList;
  }
  setSaveResponce(saveFromDataRsponce){
    if (saveFromDataRsponce) {
        if (saveFromDataRsponce.success && saveFromDataRsponce.success != '') {
            if (saveFromDataRsponce.success == 'success') {
                this.CommonFunctionService.getUserNotification(this.pageNumber);
            }
        }
    }
    this.unsubscribe(this.saveResponceSubscription);
}
  getUserNotification(pageNo){
    this.pageNumber = pageNo;
    this.CommonFunctionService.getUserNotification(pageNo);
  }
  isIndeterminate() {
    let check = 0;
    if (this.notificationlist.length > 0) {
      this.notificationlist.forEach(row => {
        if (row.selected) {
          check = check + 1;
        }
      });
    }
    return (check > 0 && !this.isChecked());
  };
  isChecked() {
    let check = 0;
    if (this.notificationlist.length > 0) {
      this.notificationlist.forEach(row => {
        if (row.selected) {
          check = check + 1;
        }
      });
    }
    return this.notificationlist.length === check;
  };
  toggleAll(event: MatCheckboxChange) {
    if (event.checked) {
      if (this.notificationlist.length > 0) {
        this.notificationlist.forEach((row,i) => {
          if(!this.checkDisableRowIf(i)){
            row.selected = true;
          }
        });
      }
    } else {
      if (this.notificationlist.length > 0) {
        this.notificationlist.forEach((row,i) => {
          if(!this.checkDisableRowIf(i)){
            row.selected = false;
          }
        });
      }
    }
    //console.log(this.selected3);
  }
  toggle(data, event: MatCheckboxChange, indx) {
    let index = this.getCorrectIndex(data,indx);
    if (event.checked) {
      this.notificationlist[index].selected = true;
    } else {
      this.notificationlist[index].selected = false;
    }
    //console.log(this.selected3);
  }
  getCorrectIndex(data, indx){
    let index;
    if (data._id != undefined) {
      index = this.CommonFunctionService.getIndexInArrayById(this.notificationlist, data._id);
    } else if (this.field && this.field.matching_fields_for_grid_selection && this.field.matching_fields_for_grid_selection.length > 0) {
      this.notificationlist.forEach((row, i) => {
        var validity = true;
        this.field.matching_fields_for_grid_selection.forEach(matchcriteria => {
          if (this.CommonFunctionService.getObjectValue(matchcriteria, data) == this.CommonFunctionService.getObjectValue(matchcriteria, row)) {
            validity = validity && true;
          }
          else {
            validity = validity && false;
          }
        });
        if (validity == true) {
          index = i;
        }
      });
    } else {
      index = indx;
    } 
    return index;
  }
  checkDisableRowIf(index){
    const data = this.notificationlist[index];
    return this.checkRowIf(data);
    
  }
  checkRowIf(data){
    let check = false;
    if(data.selected){
      let condition = '';
      if(this.field && this.field.disableRowIf && this.field.disableRowIf != ''){
        condition = this.field.disableRowIf;
      }
      if(condition != ''){
        if(this.CommonFunctionService.checkDisableRowIf(condition,data)){
          check = true;
        }else{
          check = false;
        }
      }
    }
    return check;
  }

  
  readNotification(index){
    let notification = JSON.parse(JSON.stringify(this.notificationlist[index]));
    if(notification.notificationStatus == 'UNREAD'){
        notification['notificationStatus'] = 'READ';
        const payload = {
          'curTemp' : 'user_notification',
          'data' : notification
      }
      this.apiService.SaveFormData(payload);
      this.saveCallSubscribe();
    }    
}

}
