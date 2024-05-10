import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiCallService, ApiService, DataShareService, StorageService } from '@core/web-core';
import { privateDecrypt } from 'crypto';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-count-dashbord',
  templateUrl: './count-dashbord.component.html',
  styleUrls: ['./count-dashbord.component.css']
})
export class CountDashbordComponent implements OnInit {

  tabList:any = [];
  pageNumber:any=1;
  itemNumOfGrid: any = 50;
  total:number;
  modules:any;
  gridCountByTab:any={};
  gridDataCountSubscription:Subscription

  constructor(
    private router: Router, 
    private storageService:StorageService,
    private dataShareService:DataShareService,
    private apiService:ApiService,
    private apiCallService:ApiCallService
  ) { 
    this.modules = this.storageService.GetModules();
    this.prepareTabList(this.modules);
    this.gridDataCountSubscription = this.dataShareService.gridCountData.subscribe(counts =>{
      this.setGridCountData(counts);
    })
  }

  ngOnInit() {
  }

  getPage(page: number,criteria?:any) {
    let Criteria:any = [];
    let cr=["status;eq;Active;STATIC","package_name;eq;mongodb_chart;STATIC"]
    Criteria= cr;
    if(criteria && criteria.length > 0){
      criteria.forEach(data => {
        Criteria.push(data);
      });     
    }
    this.pageNumber = page;
  }
  prepareTabList(modules:any){
    this.tabList = [];
    if(modules && modules.length > 0){
      modules.forEach(module => {
        if(module && module.menu_list && module.menu_list.length > 0){          
          module.menu_list.forEach(menu => {            
            if(menu && menu.submenu && menu.submenu.length > 0){
              const parent = menu.label;
              menu.submenu.forEach(submenu => {                
                this.prepareTab(module,submenu,parent);                
              });
            }else{
              this.prepareTab(module,menu,'');              
            }            
          });          
        }
      });      
    }
    this.apiService.resetGridCountAllData();
    this.getTabsCount(this.tabList);
  }
  getTabsCount(tabs){
    this.apiCallService.getTabsCountPyload(tabs);    
  }
  prepareTab(module,menu,parent){
    if(menu && menu.tabList && menu.tabList.length > 0){
      menu.tabList.forEach(tab => {
        let tabObj:any={};
        let breadCrum = module.title+">"+menu.label+">"+tab;
        if(parent != ''){
          breadCrum = module.title+">"+parent+">"+menu.label+">"+tab;
        }        
        const router = "/browse/"+module.name+"/"+menu.name+"/"+tab
        tabObj['breadCrum'] = breadCrum;
        tabObj['tab_name'] = tab;
        tabObj['name'] = tab;
        tabObj['grid'] = null;
        tabObj['router'] = router;
        this.tabList.push(tabObj);
      });
    }
  }
  redirectToTab(link:any){
    this.router.navigate([link]);
  }
  setGridCountData(counts){
    if(counts && Object.keys(counts).length > 0){
      Object.keys(counts).forEach(key => { 
        if(counts[key]){
          this.gridCountByTab[key] = JSON.parse(JSON.stringify(counts[key]));
        }     
      })
    }
  }

}

