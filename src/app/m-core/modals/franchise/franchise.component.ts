import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { CommonFunctionService, StorageService, ApiService, ModelService } from '@core/web-core';


@Component({
  selector: 'app-franchise',
  templateUrl: './franchise.component.html',
  styleUrls: ['./franchise.component.css']
})
export class FranchiseComponent implements OnInit {

 
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

  @Input() id: string;
  @Output() alertResponce = new EventEmitter();
  @ViewChild('franchiseModal') public franchiseModal: ModalDirective; 
  @Input() public pageName;


  constructor(
    private storageService: StorageService,
    private commonFunctionService:CommonFunctionService,
    private modalService: ModelService, 
    private el: ElementRef, 
    private apiService:ApiService
  ) {
    this.element = el.nativeElement;
    this.storageService.setAppId('PUB');
    const menu = {     
      "description" : "Franchise", 
      "label" : "Franchise", 
      "name" : "franchise", 
      "status" : "A", 
      "createdBy" : "System Admin"
    }
    this.storageService.SetActiveMenu(menu);
    
    this.currentMenu = this.storageService.GetActiveMenu();
    if (this.currentMenu != null && this.currentMenu != undefined && this.currentMenu.name && this.currentMenu.name != '') {
      const payload = this.commonFunctionService.getTemData(this.currentMenu.name); 
      this.apiService.GetTempData(payload);     
    }
   }

  ngOnInit(): void {
      let modal = this;
      if (!this.id) {
          console.error('modal must have an id');
          return;
      }
      this.modalService.remove(this.id);
      this.modalService.add(this);
  }

  setTempData(tempData){
    if (tempData && tempData.length > 0) {
      if(tempData[0].templateTabs){
        this.tabs = tempData[0].templateTabs;
      }
      this.getTabData(this.selectTabIndex,this.formName);
    } else {
      this.tableFields=[];
    }
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
      const staticModalGroup = this.commonFunctionService.commanApiPayload([],this.tableFields,[]);     
      
      if (staticModalGroup.length > 0 && this.getStaticDataCall) {
        // this.store.dispatch(
        //   new CusTemGenAction.GetStaticData(staticModalGroup)
        // )
        this.apiService.getStatiData(staticModalGroup);
        this.getStaticDataCall = false;
      }            
     

    }
  }

  showModal(alert){
    this.franchiseModal.show()
    this.alertData = alert.data;
      
  }

  ok(){
    this.franchiseModal.hide();
    this.alertResponce.emit(true);
  }

  closeModal(){
    this.franchiseModal.hide();
    this.alertResponce.emit(false);
  }

  formResponce(e){}

}
