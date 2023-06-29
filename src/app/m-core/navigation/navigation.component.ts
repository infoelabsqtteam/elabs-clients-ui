import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonApiService, DataShareService } from '@core/web-core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {
  public roles:any = [];
  public modules:any = [];
  public menuData:any;
  public getNavigationData:any;
  menuDataSubscription;
  navigationDataSubscription;

  constructor( 
    private router: Router,
    private dataShareService:DataShareService,
    private commonApiService:CommonApiService
  ) {
    this.menuDataSubscription = this.dataShareService.menu.subscribe(menu =>{
      this.setMenuData(menu);
    })
    this.navigationDataSubscription = this.dataShareService.navigationData.subscribe(data =>{
      this.setNavigationData(data);
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
      
    ];
    const payload = {
      value: 'navigation',
    };
    this.commonApiService.GetNavigation(payload)
   }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.menuDataSubscription){
      this.menuDataSubscription.unsubscribe();
    }
    if(this.navigationDataSubscription){
      this.navigationDataSubscription.unsubscribe();
    }
    
  }
  ngOnInit(){
  }

  setMenuData(menuData){
    if (menuData.length > 0) {
      this.menuData = menuData;
    }
  }
  setNavigationData(data){
    if (data.getNavigationData) {
      this.getNavigationData = data.getNavigationData;
    }
  }

  public selectedRoleLabel:any;
  public selectedRoleValue:any;
  public selectedIRolesList:any;
  changeRoles(e){
    this.selectedRoleValue = e.value.roleValue;
    this.selectedRoleLabel = e.value.roleLabel;
    this.selectedIRolesList = this.getNavigationData.filter((value, index) => {
      return value.role_label == e.value.roleLabel;
    });
   //console.log(e)
  }

  public selectedModuleLabel:any;
  public selectedModuleValue:any;
  public submenu:any;
  public selectedIModuleList:any;
  public savedNavigationList:any;
  changeModule(e){
    this.selectedModuleLabel = e.value.label;
    this.selectedModuleValue = e.value.name;
    var found = true;

    this.selectedIModuleList = this.selectedIRolesList.filter((value, index) => {
      return value.module_label == e.value.label;
    });
    if(this.selectedIModuleList.length > 0){
      this.savedNavigationList = this.selectedIModuleList[0].navigation
      }
      this.menuData.forEach(element => {
        if(element.label == e.value.label){
            this.submenu = element.submenu;
            found = false;
        }
      });
      if(found){
        this.submenu = [];
      }

      this.submenu.forEach(element => {
        var name = element.name;
        if(this.selectedIModuleList.length>0){
            var check = this.savedNavigationList.hasOwnProperty(name)
        }
        if(check){
          var bool = Boolean(JSON.parse(this.savedNavigationList[name]))
          element.checked = bool;
        }
        else{
          element.checked = false;
        }
      });

      this.submenu.forEach(element => {
          if(element.submenu){
            element.submenu.forEach(data => {
                var name = data.name;
                if(this.selectedIModuleList.length>0){
                var check = this.savedNavigationList.hasOwnProperty(name);
                }
                if(check){
                  var bool = Boolean(JSON.parse(this.savedNavigationList[name]))
                  data.checked = bool;
                }
                else{
                  data.checked = false;
                }
            });
          }
      });





   
    

  }

  public checkedModuleList:any = {};
  changeSelectionModule(event){
    if(this.selectedIModuleList.length>0){
      this.savedNavigationList[event.source.value]= event.checked
    }
    else{
      this.checkedModuleList[event.source.value] = event.checked
    }
 
  }

  submit(){
    if(this.selectedIModuleList.length>0){
      this.commonApiService.SaveNavigation(this.selectedIModuleList[0])
    }
    else{
      var obj = {
        role_label : this.selectedRoleLabel,
        role_value :   this.selectedRoleValue,
        module_label :  this.selectedModuleLabel,
        module_value :  this.selectedModuleValue,
        navigation: {...this.checkedModuleList}
      }
      this.commonApiService.SaveNavigation(obj);
    }

    
    this.router.navigate(['/admin']);

  }

  onCancel(){    
    this.router.navigate(['/admin']);
  }
  




 

}
