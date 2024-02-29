import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService,DataShareService,MenuOrModuleCommonService, StorageService } from '@core/web-core';
// import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit {

  @Input() rightsidenav: MatSidenav;
  roleList:any=[];
  activeRole:any="";
  filterdata:any;
  showsearchmenu = false;
  AllModuleList: any = [];

  constructor(    
    // @Inject(DOCUMENT) private document: Document,
    private storageService:StorageService,    
    private authApiService:AuthService,
    private dataShareService:DataShareService,
    private menuOrModuleCommounService:MenuOrModuleCommonService,
  ) { 
    this.pageload();
  }

  ngOnInit() {
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

}
