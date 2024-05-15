import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiCallService, ApiService, DataShareService, StorageService } from '@core/web-core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-count-dashbord',
  templateUrl: './count-dashbord.component.html',
  styleUrls: ['./count-dashbord.component.scss']
})
export class CountDashbordComponent implements OnInit {

  tabList:any = [];
  pageNumber:any=1;
  itemNumOfGrid: any = 50;
  total:number;
  modules:any;
  gridCountByTab:any={};
  gridDataCountSubscription:Subscription;
  moduleWiseTabListMap:any={};
  modal:string="";
  dateRange:any={};

  constructor(
    private router: Router, 
    private storageService:StorageService,
    private dataShareService:DataShareService,
    private apiService:ApiService,
    private apiCallService:ApiCallService
  ) { 
    this.modules = this.storageService.GetModules();
    this.gridCountByTab = this.storageService.GetTabCounts();
    this.prepareTabList(this.modules);
    this.gridDataCountSubscription = this.dataShareService.gridCountData.subscribe(counts =>{
      this.setGridCountData(counts);
    })
    this.dataShareService.dashbordSerchKey.subscribe(key =>{
      this.modal = key;
      console.log(this.modal);
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
    this.moduleWiseTabListMap = {};
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
    // this.addColorCodeInTab(this.moduleWiseTabListMap);
    this.apiService.resetGridCountAllData();
    this.getTabsCount(this.tabList);
  }
  getTabsCount(tabs){
    const tabList = [];
    if(tabs && tabs.length > 0){
      tabs.forEach(tab => {
        const key = tab.tab_name+"_"+tab.name;
        if(!this.gridCountByTab.hasOwnProperty(key)){
          tabList.push(tab);
        }
      });
    }    
    this.apiCallService.getTabsCountPyload(tabList);    
  }
  prepareTab(module,menu,parent){
    if(menu && menu.tabList && menu.tabList.length > 0){
      let list=[];
      menu.tabList.forEach((tab,i) => {
        let field_name = tab?.field_name;
        let label = tab?.label;
        let tabObj:any={};
        let breadCrum = module.title+">"+menu.label+">"+label;
        if(parent != ''){
          breadCrum = module.title+">"+parent+">"+menu.label+">"+label;
        }        
        const router = "/browse/"+module.name+"/"+menu.name+"/"+field_name
        tabObj['breadCrum'] = breadCrum;
        tabObj['tab_name'] = field_name;
        tabObj['name'] = label;
        tabObj['grid'] = tab?.grid;
        tabObj['router'] = router;
        tabObj['module'] = module.title;        
        if(parent != ''){
          tabObj['menu'] = parent;
          tabObj['submenu'] = menu.label;
        }else{
          tabObj['menu'] = menu.label;
          tabObj['submenu'] = null;
        }      
        this.tabList.push(tabObj);
        list.push(tabObj);
      });
      if(this.moduleWiseTabListMap[module.name] && this.moduleWiseTabListMap[module.name].length > 0){
        let existList = this.moduleWiseTabListMap[module.name];
        list.forEach(tab =>{
          existList.push(tab);
        })
        this.moduleWiseTabListMap[module.name] = existList;
      }else{
        this.moduleWiseTabListMap[module.name] = list;
      }       
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
  // colorList = ["#be2596","#2596be","#be4d25","#9925be"];
  colorList = ["#fff"];

  getColorForIndex(index: number): string {
    const colorIndex = Math.floor(index / 6) % this.colorList.length;
    return this.colorList[colorIndex];
  }
  addColorCodeInTab(tabs:any){
    if(tabs && Object.keys(tabs).length > 0){
      Object.keys(tabs).forEach(key => {
        if(tabs[key] && tabs[key].length > 0){
          tabs[key].forEach((tab,i) => {
            tab["bg-color"] = this.getColorForIndex(i);
          });
        }
      });
    }
  }
  refresh(){

  }
  filterchart(){
    console.log(this.dateRange);
  }

}

