import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService, StorageService } from '@core/web-core';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit {

  @Input() rightsidenav: MatSidenav;
  roleList:any=[];
  activeRole:any="";

  constructor(    
    @Inject(DOCUMENT) private document: Document,
    private storageService:StorageService,    
    private authApiService:AuthService
  ) { 
    this.pageload();
  }

  ngOnInit() {
  }
  pageload(){
    let roleList = this.storageService.GetRoleList();  
    let activeRole = this.storageService.getActiveRole();  
    if(this.roleList && this.roleList.length == 1){
      this.roleList = roleList;
      if(activeRole && typeof activeRole == 'object' && activeRole.name){
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
      if(activeRole && typeof activeRole == 'object' && activeRole.name){
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

}
