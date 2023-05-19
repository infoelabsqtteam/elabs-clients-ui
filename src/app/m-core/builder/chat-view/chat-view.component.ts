import { Component, OnInit,OnDestroy, OnChanges,SimpleChanges, Input, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonFunctionService } from '../../../services/common-utils/common-function.service';
import { StorageService} from '../../../services/storage/storage.service';
import { PermissionService } from '../../../services/permission/permission.service';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { DatePipe, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { ApiService } from '../../../services/api/api.service';
import { DataShareService } from '../../../services/data-share/data-share.service';
import { NotificationService } from 'src/app/services/notify/notification.service';
import { ModelService } from 'src/app/services/model/model.service';

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrls: ['./chat-view.component.css'],
})
export class ChatViewComponent implements OnInit,OnDestroy, AfterViewChecked {

  elements:any=[];
  userInfo: any;
  currentMenu:any='';
  pageNumber: number = 1;
  @Input() selectTabIndex:number;
  selectedRowIndex: any = -1;
  itemNumOfGrid: any = 50;
  headElements = [];
  form_action_buttons:any=[];
  createFilterFormgroup: boolean = true;
  public selectedViewRowIndex = -1;
  public viewColumnName = '';
  tabs:any=[];
  tab:any=[];
  showNotify:boolean=false;
  deleteIndex:any=-1;
  current_selected_menu:any='';
  tableFields:any=[];
  total: number;
  updateGridData:boolean=false;
  formName:any='NEW';
  createFilterHeadElement:boolean=true;
  action_buttons:any=[];
  filterForm: FormGroup;
  tempDataSubscrption :any;
  chatgridData :any;
   @Input() selectContact:any;
   tab_api_params_criteria:any = {};
   @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  gridDataSubscription;   
  saveResponceSubscription;
  
  constructor(
    private datePipe: DatePipe,
    private ModalService:ModelService,
    private commonFunctionService:CommonFunctionService,
    private storageService: StorageService,
    private permissionService: PermissionService,
    private apiService:ApiService,
    private dataShareService:DataShareService,
    private notificationService:NotificationService
  ) {
    this.gridDataSubscription = this.dataShareService.gridData.subscribe(data =>{
      this.setGridData(data);
    })
    this.tempDataSubscrption = this.dataShareService.tempData.subscribe( temp => {
      this.setTempData(temp);
    })
    this.saveResponceSubscription = this.dataShareService.saveResponceData.subscribe(responce => {
      this.setSaveResponce(responce);
    })
    this.userInfo = this.storageService.GetUserInfo();
    this.currentMenu = this.storageService.GetActiveMenu();
    
   }

   ngOnChanges(changes: SimpleChanges) {    
    this.selectedRowIndex = -1;  
    this.createFilterFormgroup = true;  
    this.createFilterHeadElement = true;
    this.elements=[];
    this.ngOnInit();
    
  }
  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we  
    // don't then we will continue to run our initialiseInvites()   
    // method on every navigationEnd event.
    this.tableFields = [];
    this.elements = [];
    if(this.tempDataSubscrption){
      this.tempDataSubscrption.unsubscribe();
    }
    this.chatgridData.unsubscribe();
    if(this.gridDataSubscription){
      this.gridDataSubscription.unsubscribe();
    }
    if(this.saveResponceSubscription){
      this.saveResponceSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {        
    this.scrollToBottom();        
} 
setTempData(tempData){
  if (tempData && tempData.length > 0) {
    this.tabs = tempData[0].templateTabs;
    this.getTabData(this.selectTabIndex,this.formName);
  }
}
setGridData(gridData){
  if (gridData) {
    if (gridData.data && gridData.data.length > 0) {
      this.elements = JSON.parse(JSON.stringify(gridData.data))
      this.total = gridData.data_size;
    } else {
      this.elements = [];
    }
  }
}
setSaveResponce(saveFromDataRsponce){
  if (saveFromDataRsponce) {
    if (saveFromDataRsponce.success && saveFromDataRsponce.success != '' && this.showNotify) {
        if (saveFromDataRsponce.success == 'success') {
          // this.notificationService.notify("bg-success", " Form Data Save successfull !!!");
          this.showNotify = false;
          this.apiService.ResetSaveResponce();
          this.getPage(1);
        }
      if (saveFromDataRsponce.error && saveFromDataRsponce.error != '' && this.showNotify) {
        this.notificationService.notify("bg-danger", saveFromDataRsponce.error);
        this.showNotify = false;
        this.apiService.ResetSaveResponce();
      }
    }
  }
}

scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
}

  getPage(page: number) {
    this.pageNumber = page;
    const getPage = {
      data: {
        crList: this.tab_api_params_criteria.crList,
        refCode: this.userInfo.refCode,
        key2: this.storageService.getAppId(),
        log: this.storageService.getUserLog(),
        value: this.currentMenu.name,
        pageNo: this.pageNumber - 1,
        pageSize: this.itemNumOfGrid
      },
      path: null
    }
    if(this.selectContact != null && this.selectContact != undefined && this.selectContact != ""){
      //this.store.dispatch(new CusTemGenAction.GetGridData(getPage))
      this.apiService.getGridData(getPage)
    }


  }

  getTabData(index,formName) {
    if(index != undefined){
      this.tab = this.tabs[index]
      if(this.tab && this.tab != undefined){
        if(this.tab.tab_name && this.tab.tab_name != undefined){
          this.currentMenu.name = this.tab.tab_name;
        }
        if(this.tab.api_params_criteria && this.tab.api_params_criteria.length>0){
          this.tab_api_params_criteria = this.commonFunctionService.getPaylodWithCriteria(this.currentMenu.name,'',this.tab.api_params_criteria,this.selectContact);
        }
        if(this.tab.grid && this.tab.grid != undefined){
          if(this.tab.grid.gridColumns){
            if(this.createFilterHeadElement){
              this.headElements = this.tab.grid.gridColumns;
              this.createFilterHeadElement = false;
            }
          }else{
            this.headElements = []
          } 
          if(this.tab.grid.action_buttons && this.tab.grid.action_buttons != null && this.tab.grid.action_buttons != ''){
            this.action_buttons = this.tab.grid.action_buttons;
          }else{
            this.action_buttons = [];
          }
        }else{
          this.headElements = []
          this.action_buttons = [];
        }
        if(this.tab.forms && this.tab.forms != undefined && this.tab.forms != null){
          let form = this.commonFunctionService.getForm(this.tab.forms,formName,this.action_buttons);        
          if(form['tableFields'] && form['tableFields'] != undefined && form['tableFields'] != null){
            this.tableFields = form['tableFields'];
          }else{
            this.tableFields = [];
          } 
          if(form['tab_list_buttons'] && form['tab_list_buttons'] != undefined && form['tab_list_buttons'] != null){
            this.form_action_buttons = form['tab_list_buttons'];
          }       
        }else{
          this.tableFields = [];
        }
        
      }else{
        this.tableFields = [];
        this.headElements = [];
      }
      
      if (this.createFilterFormgroup) {
        this.createFilterFormgroup = false;
        const staticModalGroup = this.commonFunctionService.commanApiPayload(this.headElements,this.tableFields,this.form_action_buttons);      
        if (staticModalGroup.length > 0) {
          this.apiService.getStatiData(staticModalGroup);
        }
        if (this.tabs.length >= 1) {
          this.currentMenu.name = this.tab.tab_name;
          this.getPage(1);
        }
      }
    }
    

  }


  onMessageSend(message: HTMLInputElement){
    if(message && message.value != '' && this.selectContact && this.selectContact.phone != ''){
      let data = {};
      data['log'] = this.storageService.getUserLog();
      data['refCode'] = this.commonFunctionService.getRefcode();
      data['messageBody'] = message.value;
      data['phone'] = this.selectContact.phone;
      const saveFromData = {
        curTemp: this.currentMenu.name,
        data: data
      }
      this.apiService.SaveFormData(saveFromData);
      message.value = null;
      this.showNotify = true;
    }
    
  }

  formateChange(value){
    return this.datePipe.transform(value, 'dd/MM/yyyy h:mm a');
  }

}
