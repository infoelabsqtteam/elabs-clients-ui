import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit,OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthService,MenuOrModuleCommonService, StorageService ,ApiCallService,DataShareService} from '@core/web-core';
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
  noOfNotification:any=0;
  notificationlist=[];
  @ViewChild('notifyMenuTrigger') notifyMenuTrigger:MatMenuTrigger;
  @ViewChild('notify') notify:MatMenu;
  constructor(    
    @Inject(DOCUMENT) private document: Document,
    private storageService:StorageService,    
    private authApiService:AuthService,
    private menuOrModuleCommounService:MenuOrModuleCommonService,
    private apiCallService:ApiCallService,
    private dataShareService:DataShareService,
    private router:Router,
  ) { 
    this.pageload();
    this.apiCallService.getUserNotification(1);
    this.userNotificationSubscription = this.dataShareService.userNotification.subscribe(data => {
      console.log(data);
        if (data && data.data && data.data.length > 0 && data.type && data.type=="Unread") {
            this.notificationlist=data.data.slice(0,5);
            this.noOfNotification=data.data.filter((ele)=>ele.notificationStatus== "UNREAD").length;
        }
    });
  }

  ngOnInit() {
  }
  ngOnDestroy(): void {
    if(this.userNotificationSubscription){
      this.userNotificationSubscription.unsubscribe();
    }
  }
  pageload(){
    this.AllModuleList = this.storageService.GetModules();
    let roleList = this.storageService.GetRoleList();  
    let activeRole = this.storageService.getActiveRole();  
    if(this.roleList && this.roleList.length == 1){
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
    let mydocument:any = this.document;
    this.storageService.setRedirectUrl(mydocument.location['pathname']);
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
  iconOpen = false;
  getNotification(){
    this.iconOpen = true
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
      this.apiCallService.getUserNotification(1);
      this.router.navigate(["notification-list"]);
  }
  readNotification(data:any){
    // this.notificationComponent.readNotification(data);
  }

}
