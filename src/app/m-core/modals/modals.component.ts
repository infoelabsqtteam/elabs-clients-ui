import { Component, OnInit,OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ModalDirective } from 'angular-bootstrap-md';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonFunctionService, ApiService, DataShareService, NotificationService, ModelService, ApiCallService, GridCommonFunctionService } from '@core/web-core';


@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.css']
})
export class ModalsComponent implements OnInit,OnDestroy {
  rateForm: FormGroup;
  public coloumName:any = '';
  public data=[];
  public selectedData:any=[];
  editeMode:boolean=false;
  editedColumne:boolean=false;
  gridColumns:any=[];
  public rateTotal:number=0;
  staticData:any={};
  copyStaticData:any={};
  downloadPdfCheck: any = '';
  currentPage: any = '';
  bulkDownload:boolean=false;
  field:any={};
  multiGridDetails:any = [];

  @Input() id: string;
  private element: any;
  staticDataSubscriber;
  pdfFileSubscription;
  
  @Output() responceData = new EventEmitter();
  @ViewChild('basicTableModal') basicTableModal: ModalDirective;
  
  constructor(
    private modalService: ModelService, 
    private el: ElementRef,
    private formBuilder: FormBuilder,
    private commonFunctionService:CommonFunctionService,
    private apiService:ApiService,
    private dataShareService:DataShareService,
    private notificationService:NotificationService,
    private apiCallService:ApiCallService,
    private gridCommonFunctionService:GridCommonFunctionService
    ) { 
    this.staticDataSubscriber = this.dataShareService.staticData.subscribe(data =>{
      this.setStaticData(data);
    })
    this.pdfFileSubscription = this.dataShareService.downloadPdfData.subscribe(data =>{
      this.setDownloadPdfData(data);
    })
    this.element = el.nativeElement;
  }
  resetFlags(){
    this.field = {};
    this.coloumName = "";
    this.data = [];
    this.currentPage = "";
    this.editeMode=false;
    this.editedColumne=false;
    this.gridColumns=[];
  }

  ngOnInit(): void {
      let modal = this;

      // ensure id attribute exists
      if (!this.id) {
          console.error('modal must have an id');
          return;
      }
      // add self (this modal instance) to the modal service so it's accessible from controllers
      this.modalService.add(this);
      this.rateForm = this.formBuilder.group( {} );     
  }

  // remove self from modal service when directive is destroyed
  ngOnDestroy(): void {
      this.modalService.remove(this.id);
      this.element.remove();
      if(this.staticDataSubscriber){
        this.staticDataSubscriber.unsubscribe();
      }
      if(this.pdfFileSubscription){
        this.pdfFileSubscription.unsubscribe();
      }
  }
  setStaticData(staticData){
    if (staticData) {
      this.staticData = staticData; 
      Object.keys(this.staticData).forEach(key => {    
        if(this.staticData[key]){    
          this.copyStaticData[key] = JSON.parse(JSON.stringify(this.staticData[key]));
        }
      })         
    }
  }
  setDownloadPdfData(downloadPdfData){
    if (downloadPdfData != '' && downloadPdfData != null && this.downloadPdfCheck != '') {
      let link = document.createElement('a');
      link.setAttribute('type', 'hidden');
      const file = new Blob([downloadPdfData.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(file);
      link.href = url;
      link.download = downloadPdfData.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      this.downloadPdfCheck = '';
      this.apiService.ResetPdfData();
    }
  }
 public rateShow:boolean=false;

  showModal(alert){
    this.setGridDetails(alert);   
    this.basicTableModal.show()    
  }
  setGridDetails(alert){
    this.field = alert.field;
    this.coloumName = this.field.label;
    this.data = JSON.parse(JSON.stringify(alert.data.data));
    
    if(alert.menu_name && alert.menu_name != null && alert.menu_name != undefined && alert.menu_name != ''){
      this.currentPage = alert.menu_name;
    }   
    
    //Object.assign([],alert.data.data);
    if(alert.data.gridColumns){
      this.gridColumns = JSON.parse(JSON.stringify(alert.data.gridColumns));
      if(this.gridColumns && this.gridColumns.length > 0){
        if(this.data.length > 0){
          this.gridColumns.forEach(element => {
            element['adkey'] = {'totalRows':this.data.length};
          });          
        }
        const staticModalGroup = this.apiCallService.commanApiPayload(this.gridColumns,[],[]);
        if (staticModalGroup.length > 0) {
          // this.store.dispatch(
          //   new CusTemGenAction.GetStaticData(staticModalGroup)
          // )
          this.apiService.getStatiData(staticModalGroup);
        }
      }      
      //Object.assign([],alert.data.gridColumns);
    }
    if(alert.editemode){
      this.editeMode = true;
    }
    if(alert.data.bulk_download){
      this.bulkDownload=true;
      if(this.data.length > 0){
        this.data['selected'] = false;
      }
    }
    if(alert.menu_name == 'request_qoute' && this.gridColumns.length == 0){
      const forControl = { };       
      this.data.forEach((element,i) => { 
        let mandatory = false;
        this.createFormControl(forControl,i,element.rate,"text",mandatory)     
      });                 
      if(forControl){
        this.rateForm = this.formBuilder.group( forControl );
      }
      this.rateShow=true;
      this.rateTotal=0;
      this.addRates();
    } 
  }
  storeGridDetails(){
    let object = {
      "data" : this.data,
      "gridColumns":this.gridColumns
    }
    const currentDetails = {
      "field": this.field,
      "data": object,
      "menu_name": this.currentPage,
      'editemode': this.editeMode
    }
    this.multiGridDetails.push(currentDetails);
  }
  loadNextGrid(nextGridData){
    this.resetFlags();
    this.setGridDetails(nextGridData);
  }
  loadPreviousGrid(previousGridData){
    this.resetFlags();
    this.setGridDetails(previousGridData);
  }

  createFormControl(forControl,fieldName,object,type,mandatory){
    switch (type) {
      case "text":
        if(mandatory){
          forControl[fieldName] = new FormControl(object, Validators.required)
        }else{
          forControl[fieldName] = new FormControl(object)
        }
      default:
        break;
    }
    
  }
  addRates(){
    this.rateTotal=0;
    this.data.forEach((element,i) => {
      if(this.rateForm.value[i] != null){
        this.rateTotal=this.rateTotal + this.rateForm.value[i];
      }  
      this.data[i].rate =  this.rateForm.value[i]   
    })
  }
  
  save(){
    //console.log(this.data);
    this.responceData.emit(this.data);
    this.closeModal();
  }

  getobjectvalue(field,object){
    return this.commonFunctionService.getObjectValue(field,object);
  }
  editeField(){
    this.editedColumne = true;
  }
  closeModal(){
    let length = this.multiGridDetails.length;
    if(this.multiGridDetails && length >= 1){
      let previousGridIndex = (length - 1);
      let previousGridDetails = this.multiGridDetails[previousGridIndex];
      this.loadPreviousGrid(previousGridDetails);
      this.multiGridDetails.splice(previousGridIndex,1);  
    }else{
      this.basicTableModal.hide()
      this.data=[];
      this.editeMode=false;
      this.editedColumne=false;
      this.gridColumns=[];
    }    
  }
  getddnDisplayVal(val) {
    return this.commonFunctionService.getddnDisplayVal(val);    
  }
  getValueForGrid(field,object){
    return this.gridCommonFunctionService.getValueForGrid(field,object);
  }
  getValueForGridTooltip(field, object) {
    return this.gridCommonFunctionService.getValueForGridTooltip(field, object);
  }
  clickOnGridElement(field, object, i) {
    let value={};
    value['data'] = this.commonFunctionService.getObjectValue(field.field_name, object)
    if(field.gridColumns && field.gridColumns.length > 0){
      value['gridColumns'] = field.gridColumns;
    }else if(field.fields && field.fields.length > 0){
      value['gridColumns'] = field.fields;
    }
    let editemode = false;
    if(field.editable){
      editemode = true;
    }
    if (!field.type) field.type = "Text";
    if(field && field.onclick && field.onclick.action_name){
      const action = field.onclick.action_name.toUpperCase();
      switch (action) {
        case "DOWNLOAD":
          this.downloadPdfCheck = this.apiCallService.downloadPdf(object,this.field.field_name);
          break;        
        default:
        break;
      }
    }
    switch (field.type.toLowerCase()) {
      case "file":
        if (value['data'] && value['data'] != '' && Array.isArray(value['data'])) {
          if(value['data'].length > 0){
            this.commonFunctionService.viewModal('fileview-grid-modal', value, field,this.currentPage,editemode)
          }
        };
        break;
      case "info":
        this.storeGridDetails();
        let currentPage = JSON.parse(JSON.stringify(this.currentPage));
        let nextGridDetails = {
          "field": field,
          "data": value,
          "menu_name": currentPage,
          'editemode': editemode
        }
        this.loadNextGrid(nextGridDetails);
        break;
      default: return;
    }
  }
  
  compareObjects(o1: any, o2: any): boolean {
    return o1._id === o2._id;
  }
  setValue(column,i){
    if(column.onchange_api_params && column.onchange_call_back_field){
      this.changeDropdown(column.onchange_api_params, column.onchange_call_back_field, column.onchange_api_params_criteria, this.data[i],i);
    }
  }
  changeDropdown(params, callback, criteria, object,i) {    
    const paramlist = params.split(";");
    if(paramlist.length>1){
      
    }else{
      const staticModal = []
      const staticModalPayload = this.apiCallService.getPaylodWithCriteria(params, callback, criteria, object);
      staticModalPayload['adkeys'] = {'index':i};
      staticModal.push(staticModalPayload)      
      if(params.indexOf("FORM_GROUP") >= 0 || params.indexOf("QTMP") >= 0){
        staticModal[0]["data"]=object;
      }
      // this.store.dispatch(
      //   new CusTemGenAction.GetStaticData(staticModal)
      // )
      this.apiService.getStatiData(staticModal);
   }
  }


  toggle(index,event: MatCheckboxChange) {
    const data = JSON.parse(JSON.stringify(this.data))
    if (event.checked) {
      data[index].selected=true;
    } else {
      data[index].selected=false;
    }
    this.data = data;
    //console.log(this.selected3);
  }
  // exists(item) {
  //   return this.selectedData.indexOf(item) > -1;
  // };
  isIndeterminate() {
    let check = 0;
    if(this.data.length > 0){
      this.data.forEach(row => {
        if(row.selected){
          check = check + 1;
        }
      });
    }
    return (check > 0 && !this.isChecked());
  };
  isChecked() {
    let check = 0;
    if(this.data.length > 0){
      this.data.forEach(row => {
        if(row.selected){
          check = check + 1;
        }
      });
    }
    return this.data.length === check;
  };
  toggleAll(event: MatCheckboxChange) {
    if ( event.checked ) {
      if(this.data.length > 0){
        this.data.forEach(row => {
          row.selected=true;
        });
      }
    }else{
      if(this.data.length > 0){
        this.data.forEach(row => {
          row.selected=false;
        });
      }
    }
    //console.log(this.selected3);
  }
  checkSelectedData(){
    let length = 0;
    this.data.forEach(element => {
      if(element.selected){
        length = length + 1;
      }
    });
    if(length >= 1){
      return true;
    }else{
      return false;
    }
  }
  multipleDownload(){
    this.selectedData = [];
    this.data.forEach(row => {
      if(row.selected){
        this.selectedData.push(row);
      }
    });
    const alertData={
      field:this.coloumName,
      menu_name:this.field.field_name,
      data:this.selectedData
    }
    this.modalService.open('multiple-download-modal',alertData)
  }
  multiDownloadResponce(event){
    this.data.forEach(element => {
      if(element.selected){
        element.selected = false;
      }
    });
    this.notificationService.notify('bg-success',event.length +' File Downloaded.');
  }
  
  getGridColumnWidth(column){
    if(column.width){
      return column.width;
    }else{
      if(this.gridColumns.length > 8){
        return '150px';
      }else{
        return '';
      }      
    }    
  }
}
