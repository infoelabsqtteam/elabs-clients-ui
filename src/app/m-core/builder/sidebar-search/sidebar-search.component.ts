import { Component, OnInit,Output, EventEmitter,OnDestroy } from '@angular/core';
import { CommonFunctionService } from '../../../services/common-utils/common-function.service';
import { Router, NavigationEnd } from '@angular/router';
import { DataShareService } from '../../../services/data-share/data-share.service';
import { ApiService } from '../../../services/api/api.service';

@Component({
  selector: 'app-sidebar-search',
  templateUrl: './sidebar-search.component.html',
  styleUrls: ['./sidebar-search.component.css']
})
export class SidebarSearchComponent implements OnInit,OnDestroy {


  @Output() sidebarSearch = new EventEmitter();

  navigationSubscription;
  filterTab:any;
  filterGridColumns:any=[];
  pageNumber:any=1;
  itemNumOfGrid:any=100;
  data:any=[];
  filter:any={
    filterType:'',
    search:''
  };
  selectedContact:any='';
  tempDataSubscription;
  gridFilterDataSubscription;

  constructor(
    private commonFunctionService:CommonFunctionService,
    private router: Router,
    private dataShareService:DataShareService,
    private apiService:ApiService
  ) {
    this.tempDataSubscription = this.dataShareService.tempData.subscribe( temp => {
      this.setTempData(temp);
    })
    this.gridFilterDataSubscription = this.dataShareService.gridFilterData.subscribe(data =>{
      this.setGridFilterData(data);
    })
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
   }
  initialiseInvites() {
    this.selectedContact = {};    
  }
  ngOnDestroy(){
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
    if(this.tempDataSubscription){
      this.tempDataSubscription.unsubscribe();
    }
    if(this.gridFilterDataSubscription){
      this.gridFilterDataSubscription.unsubscribe();
    }  
    this.selectedContact = {};
  }
  ngOnInit(): void { 
  }
  setTempData(tempData){
    if (tempData && tempData.length > 0) {
      this.filterTab = tempData[0].filterTab;
      if(this.filterTab != null){
        this.filterGridColumns = this.filterTab.grid.gridColumns;
        this.filter.filterType = this.filterGridColumns[0].field_name;
        this.searchData();
      }                   
    }
  }
  setGridFilterData(gridFilterData){
    if (gridFilterData) {
      if (gridFilterData.data && gridFilterData.data.length > 0) {
        this.data = JSON.parse(JSON.stringify(gridFilterData.data));          
      } else {
        this.data = [];
      }
    }
  }
  searchData(){    
    const grid_api_params_criteria = []
    if(this.filter.filterType !=undefined && this.filter.search != undefined && this.filter.filterType !='' && this.filter.search != ''){
      const criteria = this.filter.filterType+';stwic;'+this.filter.search+';STATIC';
      grid_api_params_criteria.push(criteria);
    }
    const payload = this.commonFunctionService.getPaylodWithCriteria(this.filterTab.tab_name,'',grid_api_params_criteria,'');
    payload['pageNo'] = this.pageNumber - 1;
    payload['pageSize'] = this.itemNumOfGrid;    
    
    const getFilterData = {
      data: payload,
      path: null
    }
    this.apiService.GetFilterGridData(getFilterData);
  }
  selectContact(selectedContact){    
    this.selectedContact = selectedContact;
    this.sidebarSearch.emit(this.selectedContact);   
  }

}
