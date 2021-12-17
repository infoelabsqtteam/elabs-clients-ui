import { Component, OnInit,Input,OnChanges, ViewChild, HostListener, ChangeDetectorRef, OnDestroy, SimpleChanges } from '@angular/core';
import { StorageService} from '../../../services/storage/storage.service';
import { CommonFunctionService } from '../../../services/common-utils/common-function.service';
import { PermissionService } from '../../../services/permission/permission.service';
import { ModalService } from '../../modals/modal.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api/api.service';
import { DataShareService } from '../../../services/data-share/data-share.service';

@Component({
  selector: 'app-inline-form-view',
  templateUrl: './inline-form-view.component.html',
  styleUrls: ['./inline-form-view.component.css']
})
export class InlineFormViewComponent implements OnInit {

  @Input() selectTabIndex:number;

  navigationSubscription;
  formName:any='NEW';
  editedRowIndex:number=-1;
  userInfo: any;
  currentMenu: any;
  pageNumber:number=1;
  itemNumOfGrid: any = 25;
  tabs:any=[];
  tab:any=[];
  tableFields:any=[];
  actionButtons:any=[];
  createFilterFormgroup:boolean=true;
  treeView: boolean = false;
  tempDataSubscription;
  dinamicFormSubscription;

  constructor(
    private cdRef: ChangeDetectorRef, 
    private storageService: StorageService,
    private commonFunctionService:CommonFunctionService, 
    private permissionService: PermissionService, 
    private modalService: ModalService, 
    private formBuilder: FormBuilder, 
    private router: Router, 
    private datePipe: DatePipe,
    private routers:ActivatedRoute,
    private apiService:ApiService,
    private dataShareService:DataShareService
  ) { 
    this.tempDataSubscription = this.dataShareService.tempData.subscribe( temp =>{
      this.setTempData(temp);
    })
    this.dinamicFormSubscription = this.dataShareService.form.subscribe(form =>{
      this.setDinamicForm(form);
    })
    this.userInfo = this.storageService.GetUserInfo();
    this.currentMenu = this.storageService.GetActiveMenu();
    if (this.currentMenu != null && this.currentMenu != undefined && this.currentMenu.name && this.currentMenu.name != '') {
      const payload = this.commonFunctionService.getTemData(this.currentMenu.name);
      this.apiService.GetTempData(payload);
      this.getPage(1);
    }
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
  }

  initialiseInvites() {    
    this.createFilterFormgroup = true;    
    this.formName='NEW';       
    // Set default values and re-fetch any data you need.
    this.currentMenu = this.storageService.GetActiveMenu();
    if (this.currentMenu != null && this.currentMenu != undefined && this.currentMenu.name && this.currentMenu.name != '') {
      const payload = this.commonFunctionService.getTemData(this.currentMenu.name);
      this.apiService.GetTempData(payload);
      this.getPage(1);
    }
    
  }

  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we  
    // don't then we will continue to run our initialiseInvites()   
    // method on every navigationEnd event.
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
    if (this.tempDataSubscription) {
      this.tempDataSubscription.unsubscribe();
    }
    if(this.dinamicFormSubscription){
      this.dinamicFormSubscription.unsubscribe();
    } 
    this.tableFields = [];
    this.actionButtons = [];
    this.editedRowIndex = -1;
  }


  ngOnChanges(changes: SimpleChanges) {    
    this.createFilterFormgroup = true;     
    this.formName='NEW';    
    // Set default values and re-fetch any data you need.
    this.currentMenu = this.storageService.GetActiveMenu();
    if (this.currentMenu && this.currentMenu.name != '') {
      const payload = this.commonFunctionService.getTemData(this.currentMenu.name);
      this.apiService.GetTempData(payload);
      this.getPage(1);
    }
    
  }

  ngOnInit(): void {
  }
  setTempData(tempData){
    if (tempData && tempData.length > 0) {
      this.tabs = tempData[0].templateTabs;
      this.getTabData(this.selectTabIndex,this.formName);
    } 
  }
  setDinamicForm(form){
    if(form && form.DINAMIC_FORM){
      this.formName = "DINAMIC_FORM";       
    }
  }
  getTabData(index,formName) {
    this.tab = this.tabs[index]
    if(this.tab != undefined){
      if(this.tab.tab_name && this.tab.tab_name != null && this.tab.tab_name != undefined && this.tab.tab_name != ''){
        this.currentMenu.name = this.tab.tab_name;
      }  
      
      if(this.tab.forms && this.tab.forms != undefined && this.tab.forms != null){
        let form = this.commonFunctionService.getForm(this.tab.forms,formName);        
        if(form['tableFields'] && form['tableFields'] != undefined && form['tableFields'] != null){
          this.tableFields = form['tableFields'];
        }else{
          this.tableFields = [];
        }
        if(form['tab_list_buttons'] && form['tab_list_buttons'] != undefined && form['tab_list_buttons'] != null){
          this.actionButtons = form['tab_list_buttons'];
        }        
      }else{
        this.tableFields = [];
      }    
      if (this.tab.tree_view && this.tab.tree_view == 'yes') {
        this.treeView = true;
      } else {
        this.treeView = false;
      }
      if (this.createFilterFormgroup) {
        this.createFilterFormgroup = false;      
        // const staticModalGroup = this.commonFunctionService.commanApiPayload([],this.tableFields,this.actionButtons);      
        // if (staticModalGroup.length > 0) {
        //   this.store.dispatch(
        //     new CusTemGenAction.GetStaticData(staticModalGroup)
        //   )
        // }            
        if (this.tabs.length >= 1) {
          this.currentMenu.name = this.tab.tab_name;
          this.getPage(1);
        }

      }
    }


  }
  getPage(page: number) {
    this.pageNumber = page;
    this.getDataForGrid();
  }
  getDataForGrid(){
    let grid_api_params_criteria = [];
    if(this.isGridFieldExist("api_params_criteria")){
      grid_api_params_criteria = this.tab.grid.api_params_criteria;
    }
    const data = this.commonFunctionService.getPaylodWithCriteria(this.currentMenu.name,'',grid_api_params_criteria,'');
    data['pageNo'] = this.pageNumber - 1;
    data['pageSize'] = this.itemNumOfGrid;    
    this.commonFunctionService.getfilterCrlist([],[]).forEach(element => {
      data.crList.push(element);
    });
    const getFilterData = {
      data: data,
      path: null
    }
    //this.store.dispatch(new CusTemGenAction.GetGridData(getFilterData))
    this.apiService.getGridData(getFilterData)
  }
  isGridFieldExist(fieldName){
    if(this.tab.grid && this.tab.grid[fieldName] && this.tab.grid[fieldName] != undefined && this.tab.grid[fieldName] != null && this.tab.grid[fieldName] != ''){
     return true;
    }
    return false;
  }
  formResponce(event){
    console.log(event);
  }

}
