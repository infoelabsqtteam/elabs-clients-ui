import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DataShareService, CommonApiService } from '@core/web-core';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent implements OnInit,OnDestroy {
  
  public roles:any = [];
  public modules:any = [];
  public menuData:any;
  public getPermissionData:any;
  menuDataSubscription:any;
  permissionDataSubscription;

  constructor(
    private router: Router,
    private dataShareService:DataShareService,
    private commonApiService:CommonApiService
  ) {

    this.menuDataSubscription = this.dataShareService.menu.subscribe(menu =>{
        this.setMenuData(menu);
    })
    this.permissionDataSubscription = this.dataShareService.permissionData.subscribe(data =>{
      this.setPermission(data);
    })
    this.roles = [
      {roleLabel : 'Administrator', roleValue: 'administrator'},
      {roleLabel : 'Approval(QA)', roleValue: 'approval'},
      {roleLabel : 'CRM', roleValue: 'crm'},
      {roleLabel : 'Dispatcher', roleValue: 'dispatcher'},
      {roleLabel : 'Employer', roleValue: 'employer'},
      {roleLabel : 'Finalizer', roleValue: 'finalizer'},
      {roleLabel : 'Invoicer', roleValue: 'invoicer'},
      {roleLabel : 'Master Creater', roleValue: 'master_creater'},
      {roleLabel : 'Micro-biologist', roleValue: 'micro_biologist'},
      {roleLabel : 'Order Booker', roleValue: 'order_booker'},
      {roleLabel : 'Reviewer', roleValue: 'reviewer'},
      {roleLabel : 'Sample Receiver', roleValue: 'sample_receiver'},
      {roleLabel : 'Scheduler', roleValue: 'scheduler'},
      {roleLabel : 'Section-Incharge', roleValue: 'section_incharge'},
      {roleLabel : 'Tester', roleValue: 'tester'},
      
    ]

     this.modules = [
    {moduleLabel : 'Dashboard', moduleValue: 'dashboard'},
    {moduleLabel : 'System-Setting', moduleValue: 'system_setting'},
    {moduleLabel : 'Master', moduleValue: 'master'},
    {moduleLabel : 'Inventory', moduleValue: 'inventory'},
    {moduleLabel : 'Inquiry', moduleValue: 'inquiry'},
    {moduleLabel : 'Sales', moduleValue: 'sales'},
    {moduleLabel : 'Welcome', moduleValue: 'welcome'},
    {moduleLabel : 'Payments', moduleValue: 'payments'},
    {moduleLabel : 'Scheduling', moduleValue: 'scheduling'},
    {moduleLabel : 'MIS', moduleValue: 'mis'},
  ]
    this.commonApiService.GetPermission({value: 'permissions'})

   }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.menuDataSubscription){
        this.menuDataSubscription.unsubscribe();
    }
  }
  ngOnInit(){
  }

  setMenuData(menuData){
    if (menuData.length > 0) {
        this.menuData = menuData;
    }
  }
  setPermission(data){
    if (data.getPermissionData) {
      this.getPermissionData = data.getPermissionData;
    }
  }

  public selectedRoleName:any;
  public selectedRoleLabel:any;
  public selectedIRolesList:any;
  changeRoles(e){
    this.selectedRoleName = e.value.roleValue;
    this.selectedRoleLabel = e.value.roleLabel
    this.selectedIRolesList = this.getPermissionData.filter((value, index) => {
      return value.role_label == e.value.roleLabel;
    });
   //console.log(e)
  }

  public selectedModuleName:any;
  public selectedModuleLabel:any;
  public submenu:any;
  public selectedIModuleList:any;
  changeModule(e){
    this.selectedModuleName = e.value.moduleValue;
    this.selectedModuleLabel = e.value.moduleLabel;
    var found = true;
      this.menuData.forEach(element => {
        if(element.label == e.value.moduleLabel){
            this.submenu = element.submenu;
            found = false;
        }
      });
      if(found){
        this.submenu = [];
      }

      this.selectedIModuleList = this.selectedIRolesList.filter((value, index) => {
        return value.module_label == e.value.moduleLabel;
      });
  }

  public selectedSubModuleName:any;
  public selectedSubModuleLabel:any;
  public subModuleSubmenu:any;
  public selectedISubModuleList:any;
  public savedPermissionList:any;
  changeSubModule(e){
    this.selectedSubModuleName = e.value.name;
    this.selectedSubModuleLabel = e.value.label;

    this.selectedISubModuleList = this.selectedIModuleList.filter((value, index) => {
      return value.submodule_label == e.value.label;
    });
    if(this.selectedISubModuleList.length > 0){
    this.savedPermissionList = this.selectedISubModuleList[0].permissionList
    }


    this.submenu.forEach(element => {
      if(element.label == e.value.label && this.savedPermissionList){
          this.subModuleSubmenu = element.submenu;
          this.subModuleSubmenu .forEach(element => {
            var label = element.label;
            const found = this.savedPermissionList.some(el => el.label === label);
            if(!found){
              var ob = {
                label:element.label,
                name: element.name,
              }
              this.savedPermissionList.push(ob)
            }
          });
    this.subModuleSubmenu = this.savedPermissionList

      }
      if(element.label == e.value.label && this.savedPermissionList == undefined){
        this.subModuleSubmenu = element.submenu;
      }

    });


  }

  public checkedModuleList:any = {};
  changeSelectionModule(event){
    //console.log(event);
    this.checkedModuleList[event.source.value] = event.checked
  }

  submit(){
    if(this.selectedISubModuleList.length > 0){
      this.commonApiService.SavePermission(this.selectedISubModuleList[0]);
    }
    else{
      var obj = {
        role_label: this.selectedRoleLabel,
        role_value: this.selectedRoleName,
        module_label: this.selectedModuleLabel,
        module_value: this.selectedModuleName,
        submodule_label: this.selectedSubModuleLabel,
        submodule_value: this.selectedSubModuleName,
        permissionList: [...this.permissionList]
      }
      this.commonApiService.SavePermission(obj);
    }
   
    this.router.navigate(['/admin']);
   
  }

  onCancel(){
    this.router.navigate(['/admin']);
  }

  public permissionList:any=[];
  onPermissionChange(e){
    var obj = {
      label:e.source.value.label,
      name:e.source.value.name,
      add: false,
      edit: false,
      view: false,
      delete: false
    }
    obj[e.source.name] = e.checked;
    const found = this.permissionList.some(el => el.name === e.source.value.name);
    const index = this.permissionList.findIndex(el => el.name === e.source.value.name);
    if(this.savedPermissionList){
      const foundInSaved = this.savedPermissionList.some(el => el.name === e.source.value.name);
      const savedindex = this.savedPermissionList.findIndex(el => el.name === e.source.value.name);
      if(foundInSaved){
        var selectedobj1 = this.savedPermissionList[savedindex];
        selectedobj1[e.source.name] =  e.checked ;
      }
    }
  
   
    if(found){
      var selectedObj = this.permissionList[index];
      selectedObj[e.source.name] = e.checked;
    }
    else{
      this.permissionList.push(obj)
    }

    
    //console.log(e)
  }
  




 

}
