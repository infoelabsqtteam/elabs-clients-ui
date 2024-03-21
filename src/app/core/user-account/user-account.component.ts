import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit,OnDestroy, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthService,MenuOrModuleCommonService, StorageService,CommonFunctionService ,ApiCallService,ApiService,DataShareService} from '@core/web-core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit,OnDestroy {

  @Input() rightsidenav: MatSidenav;
  roleList:any=[];
  activeRole:any="";
  filterdata:any;
  showsearchmenu = false;
  AllModuleList: any = [];
  userNotificationSubscription:Subscription;
  saveResponceSubscription:Subscription;
  noOfNotification:any=0;
  notificationlist=[];
  @ViewChild('notifyMenuTrigger') notifyMenuTrigger:MatMenuTrigger;
  constructor(    
    // @Inject(DOCUMENT) private document: Document,
    private storageService:StorageService,    
    private authApiService:AuthService,
    private menuOrModuleCommounService:MenuOrModuleCommonService,
    private apiCallService:ApiCallService,
    private dataShareService:DataShareService,
    private apiService:ApiService,
    private commonFunctionService:CommonFunctionService,
    private router:Router
  ) { 
    this.pageload();
    this.apiCallService.getUserNotification(1);
    this.userNotificationSubscription = this.dataShareService.userNotification.subscribe(data => {
        if (data && data.data && data.data.length > 0) {
            this.notificationlist=data.data.slice(0,5);
            this.noOfNotification=data.data.filter((ele)=>ele.notificationStatus== "UNREAD").length;
        }
        else{
          this.notificationlist=[];
          this.noOfNotification=0;
        }
    });
  }

  ngOnInit() {
  }
  ngOnDestroy(): void {
    this.unsubscribe(this.userNotificationSubscription);
    this.unsubscribe(this.saveResponceSubscription);
  }
  pageload(){
    this.AllModuleList = this.storageService.GetModules();
    let roleList = this.storageService.GetRoleList();  
    let activeRole = this.storageService.getActiveRole();  
    if(roleList && roleList.length == 1){
      this.roleList = roleList;
      if(activeRole && typeof activeRole == 'object' && activeRole?.name){
        this.activeRole = activeRole.name;
      }else{
        this.activeRole = this.roleList[0].name;
        this.storageService.setActiveRole(this.roleList[0]);
      }            
    }else if(roleList && roleList.length > 1){     
      this.roleList = [];      
      this.roleList.push({name:'All'});
      roleList.forEach(role => {
        this.roleList.push(role);
      }); 
      if(activeRole && typeof activeRole == 'object' && activeRole?.name){
        this.activeRole = activeRole.name;
      }else{
        this.activeRole = 'All';
        this.storageService.setActiveRole({});
      }     
    }
  }
  setRole(role){
    // let mydocument:any = this.document;
    // this.storageService.setRedirectUrl(mydocument.location['pathname']);
    if(this.roleList && this.roleList.length > 1){
      this.dataShareService.setModuleIndex(-1);
      if(role.name != 'All'){
        this.storageService.setActiveRole(role);
        let payload = {
          token : this.storageService.GetIdToken(),
          roleName : role.name
        }
        this.authApiService.GetUserInfoFromToken(payload);
      }else{
        this.storageService.setActiveRole({});
        this.authApiService.GetUserInfoFromToken(this.storageService.GetIdToken());
      }
      this.activeRole = role.name;
    }
  }

  getNotification(){
    this.apiCallService.getUserNotification(1);
  }

  searchmodel(data:string) {
    this.filterdata = data;
    this.showsearchmenu = true;
    if(data != ''){
        this.showsearchmenu = true;
    }else {
        this.showsearchmenu = false;
    }
  }
  GoToSelectedModule(module){
    this.menuOrModuleCommounService.GoToSelectedModule(module);
  }
  getTemplateData(module,menu,event){
        if(event.ctrlKey){
            const rout = 'browse/'+module.name+'/'+menu.name;
            this.storageService.setChildWindowUrl(rout);
            window.open(rout, '_blank');
        }else{
            this.menuOrModuleCommounService.getTemplateData(module,menu)
        }
    }
  showMore(){
      if(this.notifyMenuTrigger?.menuOpen){
        this.notifyMenuTrigger.closeMenu();
      }
      this.router.navigate(["browse/NOTIFY/notification_settings/user_notification_master"]);  
  }
  readNotification(data:any){
      if (this.notifyMenuTrigger?.menuOpen) {
         this.notifyMenuTrigger.closeMenu();
       }
      if (data.notificationStatus === 'UNREAD') {
          data.notificationStatus = 'READ';
          const payload = {
              curTemp: 'user_notification_master',
              data: data
          };
          this.apiService.SaveFormData(payload);
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
    let createdDate = data.createdDate;
    if(createdDate){
      let obj = this.commonFunctionService.dateDiff(createdDate);
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

  unsubscribe(variable){
    if(variable){
      variable.unsubscribe();
    }
  }

}
