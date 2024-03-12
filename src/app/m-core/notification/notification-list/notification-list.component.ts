import { Component, OnInit,ViewChild ,AfterViewInit, Input} from '@angular/core';
import { Subscription } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { CommonFunctionService, DataShareService, StorageService, ApiService, MenuOrModuleCommonService,Common, ApiCallService, CheckIfService } from '@core/web-core';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styles: [
  ]
})
export class NotificationListComponent implements OnInit {
  
  @Input() menuView: any;
  @Input() notifyMenuTrigger: any;
  notificationlist:any=[];
  userNotificationSubscription:Subscription;
  saveResponceSubscription:Subscription;
  pageNumber = 1;
  selectedIndex: number = 0;
  itemNumOfGrid = Common.ITEM_NUM_OF_GRID;
  total:number;
  field:any;
  selectTabIndex:any=0;
  selectContact:any='';
  unreadNotification:any=[]
  isPageLoading=false;
  activeTabIndex=0;
  unReadTabPageno=1;
  allTabPageno=1;
  allTabData=[];
  allData=[];
    

  constructor(
    private storageService:StorageService,
    private dataShareService:DataShareService,
    private CommonFunctionService:CommonFunctionService,
    private apiService:ApiService,
    private router: Router,
    private menuOrModuleCommounService:MenuOrModuleCommonService,
    private apiCallService:ApiCallService,
    private checkIfService:CheckIfService
  )
  { 
    this.userNotificationSubscription = this.dataShareService.userNotification.subscribe(data => {
        if (data && data.data && data.data.length > 0) {
          this.isPageLoading=false;
            if(data.type && data.type=="Unread" ){
              this.selectedIndex = 0;
              this.notificationlist =data.data;
              this.total = data.data_size;
            }else if(this.activeTabIndex==1 && data.type && data.type=="All"){
              this.allTabData=data.data;
              this.total = data.data_size;
            }
              console.log("unread",this.pageNumber);
              console.log("all",this.allTabPageno);
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
  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.activeTabIndex=tabChangeEvent.index;
    this.isPageLoading=true;
    this.pageNumber=1;
    if(this.activeTabIndex==1){
      this.selectedIndex = 1;
      this.apiCallService.getUserNotification(1,"All");
    }
    if(this.activeTabIndex==0){
      this.apiCallService.getUserNotification(1);
    }
  }
  setUserNotification(data){
      this.notificationlist = this.setKeyValueInObjectList(data,'selected',false);
  }
  showMore(){
    if(this.notifyMenuTrigger?.menuOpen){
      this.notifyMenuTrigger.closeMenu();
    }
    this.apiCallService.getUserNotification(1);
    this.router.navigate(["notification-list"]);
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
              if(this.activeTabIndex==0){
                this.apiCallService.getUserNotification(this.pageNumber);
              }else{
                this.apiCallService.getUserNotification(this.pageNumber,"All");
              }
            }
        }
    }
    this.unsubscribe(this.saveResponceSubscription);
}
  getUserNotification(pageNo){
    console.log(pageNo);
    this.pageNumber = pageNo;
    // this.apiCallService.getUserNotification(pageNo);
  }
  onPageChangeUnRead(pageNo){
    console.log("unread page",pageNo);
    this.pageNumber = pageNo;
    // this.apiCallService.getUserNotification(pageNo);
    if(this.activeTabIndex==1){
      this.selectedIndex = 1;
      this.apiCallService.getUserNotification(pageNo,"All");
    }
    if(this.activeTabIndex==0){
      this.apiCallService.getUserNotification(pageNo);
    }
  }

  onPageChangeAllTab(pageNo){
    this.allTabPageno = pageNo;
    console.log("all page",this.allTabPageno);
     this.apiCallService.getUserNotification(pageNo,"All");
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
        if(this.checkIfService.checkDisableRowIf(condition,data)){
          check = true;
        }else{
          check = false;
        }
      }
    }
    return check;
  }

  
  readNotification(data,type?:any){
        if (this.notifyMenuTrigger?.menuOpen) {
            this.notifyMenuTrigger.closeMenu();
        }
        if (!type) {
            if (data.notificationStatus === 'UNREAD') {
                data.notificationStatus = 'READ';
                const payload = {
                    curTemp: 'user_notification_master',
                    data: data
                };
                this.apiService.SaveFormData(payload);
                this.saveCallSubscribe();
            }
        } else {
            data.notificationStatus = type;
            const payload = {
                curTemp: 'user_notification_master',
                data: data
            };
            this.apiService.SaveFormData(payload);
            this.saveCallSubscribe();
        }

        if (data.url && !type) {
            this.router.navigate([data.url]);
        }
      }       
    // let notification = JSON.parse(JSON.stringify(this.notificationlist[index]));
    // if(data.notificationStatus == 'UNREAD'){
    //       data['notificationStatus'] = 'READ';
        //   const payload = {
        //     'curTemp' : 'user_notification',
        //     'data' : notification
        // }
    //   }
    // console.log(this.allData);
    // this.dataShareService.shareUserNotification(this.allData);
    //let rout = "notification/5f8a7df93fead0865fab7356/5f8e8c63efa14277b0ec62e8/605e10135234aa12be92ec4b/5fa51e62eb4a3c2940eb9d1b/default/62e22131b74b6a45e713d14a";
    // let url = notification.url;
    // let rout = "notification/"+url;
    // let list = rout.split("/");
    // let moduleId = list[1];
    // let menuId = list[2];
    // let submenuId = list[3];
    // let moduleIndex = this.menuOrModuleCommounService.getModuleIndexById(moduleId);
    //this.dataShareService.setModuleIndex(moduleIndex);
    // if(moduleIndex != undefined){
    //   let moduleList = this.storageService.GetModules();
    //   let module = moduleList[moduleIndex];
    //   let menuName = this.menuOrModuleCommounService.getMenuNameById(module,menuId,submenuId);
    //   let menu = {
    //     "name" : menuName
    //   }
    //   this.storageService.SetActiveMenu(menu);
    //   this.router.navigate([rout]); 
    // }
    // if(this.notifyMenuTrigger?.menuOpen){
    //   this.notifyMenuTrigger.closeMenu();
    // }
    // console.log(data.url);
    // if(data.notificationStatus == 'UNREAD' && !type){
    //     data['notificationStatus'] = 'READ';
    //     const payload = {
    //       'curTemp' : 'user_notification_master',
    //       'data' : data
    //     }
    //   this.apiService.SaveFormData(payload);
    //   this.saveCallSubscribe();

    // }   
    // if(type){
    //   data['notificationStatus'] = type;
    //     const payload = {
    //       'curTemp' : 'user_notification_master',
    //       'data' : data
    //     }
    //   this.apiService.SaveFormData(payload);
    //   this.saveCallSubscribe();
    // }
    // if(data.url && !type){
    //   this.router.navigate([data.url]);
    // } 
  
  getDay(data){
    // let notification = this.notificationlist[index];
    let createdDate = data.createdDate;
    if(createdDate){
      let obj = this.CommonFunctionService.dateDiff(createdDate);
      if(obj && obj['days'] == 0){
        if(obj['hours'] == 0){
          return obj['minutes']+" Minutes ago";
        }else{        
          return obj['hours'] +" hours "+obj['minutes']+" Minutes ago";
        }      
      }else{
        return obj['days'] +" days ago";
      }
    }
  }

  pageSizes =[25, 50, 75, 100, 200];
  PageSizeChange(event: any): void {
    console.log(event);
    if(event.target.value && event.target.value != "") {

    }}
  

}
