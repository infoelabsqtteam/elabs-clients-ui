import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiCallService, CoreFunctionService, NotificationService } from '@core/web-core';

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
  @Input() getGridPayloadData:(load)=>void;
  @Input() tab:any;
  @Input() currentMenu:any;
  @Input() adFilterForm: FormGroup;
  @Input() crList:any[] = [];

  @Output() isAdFilter = new EventEmitter<boolean>();
  @Output() setCrList = new EventEmitter<any>();

  selectedFilterType = "cnts";
  searchField = ""
  
  filterTypeNumber: any;
  filterTypeString: any;
  filterTypeDate: any;

  adFilterApplied = false;

  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(
    private apiCallService:ApiCallService,
    private coreFunctionService:CoreFunctionService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.getOperatorsList();
  }

  getOperatorsList(){
    this.filterTypeNumber = this.coreFunctionService.getOperators('number');
    this.filterTypeString = this.coreFunctionService.getOperators('string');
    this.filterTypeDate = this.coreFunctionService.getOperators('date');
  }

  applyAdFilter(fieldNameToUpdate?: string, type?: string) {
    const formData = this.adFilterForm.getRawValue();
    const payload = [];
  
    Object.keys(formData).forEach(key => {
      const value = formData[key];
      if (value) {
        let fieldValue = value;
        if (type && ['date', 'datetime', 'daterange'].includes(type.toLowerCase())) {
          fieldValue = this.formatDate(value);
        }
  
        const existingPayload = this.crList.find(obj => obj.fName === key);
        if (existingPayload) {
          existingPayload.fValue = fieldValue;
        } else {
          payload.push({ fName: key, fValue: fieldValue, fieldType: type, operator: this.selectedFilterType });
        }
        this.head["isAdFiltered"] = true;
      }
    });
  
    if (fieldNameToUpdate) {
      const payloadToUpdate = this.crList.find(obj => obj.fName === fieldNameToUpdate);
      if (payloadToUpdate) {
        payloadToUpdate.operator = this.selectedFilterType;
      }
    }
  
    this.crList = this.crList.concat(payload);

    if(this.crList && this.crList.length>0){
      this.setCrList.emit(this.crList);
      this.adFilterApplied = this.crList.length > 0;
      this.isAdFilter.emit(this.adFilterApplied);
      this.notificationService.notify('bg-success',"Filter Applied Successfully");
    }  
  
    this.pageNumber = 1;
    const pagePayload = this.apiCallService.getDataForGridAdvanceFilter(this.pageNumber, this.tab, this.currentMenu, this.crList);
    pagePayload.data.pageSize = this.itemNumOfGrid;
    this.getGridPayloadData(pagePayload);
  }

  clearAdFilter(){
    this.selectedFilterType = "cnts";
    this.adFilterForm.reset();
    this.crList = [];
    this.applyAdFilter();
    this.adFilterApplied = false;
    this.notificationService.notify('bg-info',"Filter Cleared Successfully");
    //Emiting to parant
    this.setCrList.emit(this.crList);
    this.isAdFilter.emit(this.adFilterApplied);
    this.clearIsFiltered(this.headElements);
  }

  clearIsFiltered(headElements: any) {
    if (headElements && headElements.length > 0) {
      headElements.forEach(head => {
        if (head.isAdFiltered) {
          head.isAdFiltered = false;
        }
      });
    }
  }

  clearInput(input:any){
    if(input!=''){
      input = '';
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
