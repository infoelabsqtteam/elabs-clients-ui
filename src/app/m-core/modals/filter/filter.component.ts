import { Component, OnInit, Input, OnDestroy, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService, ChartService, CommonFunctionService, DataShareService } from '@core/web-core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit,OnDestroy {

  @Input() dashbord:any;
  @Output() filterData = new EventEmitter();
  filterGroup:FormGroup;

  checkGetDashletData:boolean=true;
  staticData: any = {};
  typeAheadData:any=[];
  term:any={};

  staticDataSubscription;
  typeaheadDataSubscription;
  resetFilterSubscription;
  

  minDate: Date;
  maxDate: Date;

  constructor(
    public formBuilder: FormBuilder,
    private commonFunctionService:CommonFunctionService,
    private apiService:ApiService,
    private dataShareService:DataShareService,
    private chartService:ChartService
  ) { 
    this.staticDataSubscription = this.dataShareService.staticData.subscribe(data =>{
      this.setStaticData(data);
    })
    this.typeaheadDataSubscription = this.dataShareService.typeAheadData.subscribe(data =>{
      this.setTypeaheadData(data);
    })
    this.resetFilterSubscription = this.chartService.filterRest.subscribe(val =>{
      if(val){
        this.filterGroup.reset();
      }
    })
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 100, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31); 
    if(this.dashbord && this.dashbord.fields && this.dashbord.fields.length > 0){

    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(this.dashbord && this.dashbord.fields && this.dashbord.fields.length > 0){
      this.checkGetDashletData = true;
      this.setFilterForm(this.dashbord);
    }
  }

  ngOnInit() {
  }
  ngOnDestroy(){
    if(this.staticDataSubscription){
      this.staticDataSubscription.unsubscribe();
    }
    if(this.typeaheadDataSubscription){
      this.typeaheadDataSubscription.unsubscribe();
    }
  }
  compareObjects(o1: any, o2: any): boolean {
    return o1._id === o2._id;
  }
  getOptionText(option) {
    if (option && option.name) {
      return option.name;
    }else{
      return option;
    }
  }
  updateData(event, field) {
    if(event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 13 || event.keyCode == 27 || event.keyCode == 9){
      return false;
    }   
    this.callTypeaheadData(field,this.filterGroup.getRawValue()); 
  }
  callTypeaheadData(field,objectValue){
    this.clearTypeaheadData();  
    const field_name = field.field_name;
    const value = this.commonFunctionService.getObjectValue(field_name,objectValue);
    if(value && value != ''){
      const payload = [];
      const params = field.api_params;
      const criteria = field.api_params_criteria;
      payload.push(this.commonFunctionService.getPaylodWithCriteria(params, '', criteria, objectValue,field.data_template));
      this.apiService.GetTypeaheadData(payload);  
    }  
  }
  clearTypeaheadData() {
    this.apiService.clearTypeaheadData();
  }

  setFilterForm(dashlet){    
    if(this.checkGetDashletData && dashlet._id && dashlet._id != ''){
      this.checkGetDashletData = false;
      let forControl = {};
      let formField = [];      
      if(dashlet.fields && dashlet.fields.length > 0){
        dashlet.fields.forEach(field => {                    
          formField.push(field);
          switch(field.type){ 
            case "date":
              field['minDate'] = this.minDate
              field['maxDate'] = this.maxDate;
              this.commonFunctionService.createFormControl(forControl, field, '', "text")
                break; 
            case "daterange":
              const date_range = {};
              let list_of_dates = [
                {field_name : 'start'},
                {field_name : 'end'}
              ]
              if (list_of_dates.length > 0) {
                list_of_dates.forEach((data) => {                  
                  this.commonFunctionService.createFormControl(date_range, data, '', "text")
                });
              }
              this.commonFunctionService.createFormControl(forControl, field, date_range, "group")                                    
              break; 
                                      
            default:
              this.commonFunctionService.createFormControl(forControl, field, '', "text");
              break;
          }   
        });
      } 
      if(formField.length > 0){
        let staticModalGroup = this.commonFunctionService.commanApiPayload([],formField,[]);
        if(staticModalGroup.length > 0){  
          this.apiService.getStatiData(staticModalGroup);
        }
      }
      if (forControl) {
        this.filterGroup = this.formBuilder.group(forControl);    
        this.filterGroup.reset();          
      }
    } 
  }
  setStaticData(staticDatas){
    if(staticDatas && Object.keys(staticDatas).length > 0) {
      Object.keys(staticDatas).forEach(key => {  
        let staticData = {};
        staticData[key] = staticDatas[key];  
        if(key && key != 'null' && key != 'FORM_GROUP' && key != 'CHILD_OBJECT' && key != 'COMPLETE_OBJECT' && key != 'FORM_GROUP_FIELDS'){
          if(staticData[key]) { 
            this.staticData[key] = JSON.parse(JSON.stringify(staticData[key]));
          }
        } 
      });
    }
  }

  setTypeaheadData(typeAheadData){
    if (typeAheadData && typeAheadData.length > 0) {
      this.typeAheadData = typeAheadData;
    } else {
      this.typeAheadData = [];
    }
  }

  setValue(parentfield,field, add,event?) {   
    this.term = {};
    if (field.type == 'typeahead') {
      this.clearTypeaheadData();
    }
    if (field.onchange_api_params && field.onchange_call_back_field) {
      let formValue = this.filterGroup.getRawValue();
      this.onChange(field, formValue,field.onchange_data_template);
    }
  }  
  filter(){
    let filterData = {};
    if(this.dashbord && this.dashbord.package_name && (this.dashbord.package_name == "mongodb_chart" || this.dashbord.package_name == "mongodb_dashboard")){
      filterData = this.chartService.getFilterData(this.dashbord,this.filterGroup.getRawValue());
    }else{
      filterData = this.filterGroup.getRawValue();
    }    
    let object={};
    object['item'] = this.dashbord;
    object['data'] = filterData;
    this.filterData.emit(object);
    //this.filterGroup.reset();
  }
  
  clearFilter() {
    this.filterGroup.reset();
    let object={};
    object['item'] = this.dashbord;
    object['data'] = {};
    this.filterData.emit(object);
  }
  onChange(field, object,data_template) {    
    const payloads = []      
    payloads.push(this.commonFunctionService.getPaylodWithCriteria(field.onchange_api_params, field.onchange_call_back_field, field.onchange_api_params_criteria, object,data_template));
    this.apiService.getStatiData(payloads);   
  }

}
