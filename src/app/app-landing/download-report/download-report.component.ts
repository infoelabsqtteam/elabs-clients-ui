import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { CommonFunctionService, StorageService, ApiService, DataShareService, ApiCallService } from '@core/web-core';
import { ActivatedRoute, Params} from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-download-report',
  templateUrl: './download-report.component.html',
  styleUrls: ['./download-report.component.css']
})
export class DownloadReportComponent implements OnInit {


  public alertData:any = {};
  private element: any;
  tabs:any=[];
  tableFields:any=[];
  tab:any=[];
  selectTabIndex:number=0;
  formName:any='NEW';
   currentMenu:any={};
   formLabel:any='';
   getStaticDataCall:boolean=true;
   editedRowIndex:number=-1;
   selectContact:any = '';
   reportUrlNo:any = '';
   tempDataSubscription:Subscription;
  @Input() public pageName;


  constructor(
    private apiService:ApiService,
    private storageService: StorageService,
    private commonFunctionService:CommonFunctionService, 
    private el: ElementRef, 
    private dataShareService: DataShareService,
    private activatedRoute: ActivatedRoute,
    private apiCallService:ApiCallService
    ) {
      
      this.activatedRoute.queryParams.subscribe((params: Params) => {
        let reportNo = params["report"];
        this.reportUrlNo = atob(reportNo)
      });
    this.element = el.nativeElement;
    this.storageService.setAppId('PUB');
    const menu = {     
      "description" : "Franchises", 
      "label" : "Franchises", 
      "name" : "manual_report_download", 
      "status" : "A", 
      "createdBy" : "System Admin"
    }
    this.storageService.SetActiveMenu(menu);
    this.tempDataSubscription = this.dataShareService.tempData.subscribe( temp => {
      if(this.reportUrlNo && this.reportUrlNo != ""){
        let object = {
          "report_no": this.reportUrlNo
        }
        this.dataShareService.shareGridRunningData({data: object});
      }
    })
    this.currentMenu = this.storageService.GetActiveMenu();
    if (this.currentMenu != null && this.currentMenu != undefined && this.currentMenu.name && this.currentMenu.name != '') {
      const payload = this.apiCallService.getTemData(this.currentMenu.name); 
      this.apiService.GetTempData(payload);     
    }

   }

  ngOnInit(): void {
  }

  ngOnDistroy(){

  }

  getTabData(index,formName) {
    this.tab = this.tabs[index]
    if(this.tab != undefined){
      if(this.tab.tab_name && this.tab.tab_name != null && this.tab.tab_name != undefined && this.tab.tab_name != ''){
        this.currentMenu.name = this.tab.tab_name;
      }  
      
      if(this.tab.forms && this.tab.forms != undefined && this.tab.forms != null){
        let form = this.commonFunctionService.getForm(this.tab.forms,formName,this.tab.grid.action_buttons);        
        if(form['tableFields'] && form['tableFields'] != undefined && form['tableFields'] != null){
          this.tableFields = form['tableFields'];
        }else{
          this.tableFields = [];
        }
        this.formLabel=form.label;     
      }else{
        this.tableFields = [];
      }        
      const staticModalGroup = this.apiCallService.commanApiPayload([],this.tableFields,[]);     
      
      if (staticModalGroup.length > 0 && this.getStaticDataCall) {
        // this.store.dispatch(
        //   new CusTemGenAction.GetStaticData(staticModalGroup)
        // )
        this.apiService.getStatiData(staticModalGroup);
        this.getStaticDataCall = false;
      }            
     

    }
  }


  formResponce(e){}



}
