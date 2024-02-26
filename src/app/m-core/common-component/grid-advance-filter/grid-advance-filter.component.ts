import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiCallService, CoreFunctionService, FormCreationService } from '@core/web-core';

@Component({
  selector: 'app-grid-advance-filter',
  templateUrl: './grid-advance-filter.component.html',
  styleUrls: ['./grid-advance-filter.component.css']
})
export class GridAdvanceFilterComponent implements OnInit {


  @Input() head: any;
  @Input() headElements: any;
  @Input() pageNumber:number;
  @Input() itemNumOfGrid:any;
  @Input() getGridPayloadData:(col)=>void;
  @Input() tab:any;
  @Input() currentMenu:any;

  adFilterForm: FormGroup;
  crList: any[] = [];
  selectedFilterType = "cnts";
  filterTypeNumber: any;
  filterTypeString: any;
  filterTypeDate: any;


  constructor(
    private apiCallService:ApiCallService,
    private coreFunctionService:CoreFunctionService,
    private formCreationService:FormCreationService,
    private formBuilder: FormBuilder 
  ) { }

  ngOnInit(): void {
    this.getOperatorsList();
    this.createAdFilterFormgroup();
  }

  getOperatorsList(){
    this.filterTypeNumber = this.coreFunctionService.getOperators('number');
    this.filterTypeString = this.coreFunctionService.getOperators('string');
    this.filterTypeDate = this.coreFunctionService.getOperators('date');
  }


  applyAdFilter(fieldNameToUpdate?: string,type?:string){
    let formData = this.adFilterForm.getRawValue();
    const payload = [];
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        // console.log(formData[key]);
        // Check if the field is already present in existing payloads
        const existingPayload = this.crList.find(obj => obj.fName === key);
        if (existingPayload) {
          existingPayload.fValue = formData[key];
        } else {
          let fValue = formData[key];
          if (type === 'date') {
            fValue = this.formatDate(formData[key]);
          }
          payload.push({
            fName: key,
            fValue: fValue,
            operator: this.selectedFilterType
          });
        }
      }
    });

    const payloadToUpdate = this.crList.find(obj => obj.fName === fieldNameToUpdate);
    if (payloadToUpdate) {
      payloadToUpdate.operator = this.selectedFilterType;
    }

    this.crList = this.crList.concat(payload);
    console.log(this.crList);

    this.pageNumber = 1;
    let pagePayload = this.apiCallService.getDataForGridAdvanceFilter(this.pageNumber,this.tab,this.currentMenu,this.crList);
    pagePayload.data.pageSize = this.itemNumOfGrid;
    this.getGridPayloadData(pagePayload);
  }

  clearAdFilter(){
    this.selectedFilterType = "cnts";
    this.adFilterForm.reset();
    this.crList = [];
    this.applyAdFilter();
  }


  createAdFilterFormgroup(){
    const forControl = {};
        if(this.headElements.length > 0){
          this.headElements.forEach(element => {
            if(element != null && element.type != null){
            switch (element.type.toLowerCase()) {
              case "text":
              case "info":
                case "number":
                case "reference_names":
                case "chips" :
                case "tree_view_selection":
                case "dropdown":
                case "typeahead":
                case "date":
                case "datetime":
                  this.formCreationService.createFormControl(forControl, element, '', "text")
                  break;
                case "daterange":
                  const list_of_fields={}
                  const start={field_name:'start',is_disabled:false,is_mandatory:false}
                  this.formCreationService.createFormControl(list_of_fields, start, '', "text")
                  const end={field_name:'end',is_disabled:false,is_mandatory:false}
                  this.formCreationService.createFormControl(list_of_fields, end, '', "text")
                  this.formCreationService.createFormControl(forControl, element, list_of_fields, "group")
                break;
              default:
                break;
            }      
          }
          });
        }

        if (forControl) {
          this.adFilterForm = this.formBuilder.group(forControl);
        }
  }

  formatDate(fValue: string): string {
    const date = new Date(fValue);
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    
    return `${day}/${month}/${year}`;
  }

}
