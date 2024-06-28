import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { ApiCallService, CommonFunctionService, CoreFunctionService, StorageService, OperatorKey, OperatorType } from '@core/web-core';

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
  @Input() getGridPayloadData:(payLoad:any)=>void;
  @Input() adFilterMenuTrigger!:MatMenuTrigger;
  @Input() tab:any;
  @Input() currentMenu:any;
  @Input() adFilterForm: FormGroup;
  @Input() crList:any[] = [];

  @Output() isAdFilter = new EventEmitter<boolean>();
  @Output() setCrList = new EventEmitter<any>();
  // @Output() adFiltermenuOpened = new EventEmitter<void>();

  defaultOperator = "";
  selectedFilterType = "";
  searchField = "";
  dateField = "";
  isSearchFieldEmpty = false;
  isDateFieldEmpty = false;
  
  filterTypeNumber: any;
  filterTypeString: any;
  filterTypeDate: any;

  adFilterApplied = false;

  // @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('startDate') startDateInput: ElementRef;
  @ViewChild('endDate') endDateInput: ElementRef;

  constructor(
    private apiCallService:ApiCallService,
    private coreFunctionService:CoreFunctionService,
    private commonFunctionService: CommonFunctionService,
    private storageService : StorageService
  ) { 
    this.getOperatorsList();    
  }

  ngOnInit(): void { 
// Change default operator for 'date', 'datetime', 'daterange' to EQUAL
    this.selectedFilterType = this.getDefaultOperatorForAdFilter();
  }

// Getting operator List for adfilter
  getOperatorsList(){
    this.filterTypeNumber = this.removeOrAddKeys(this.coreFunctionService.getOperators(OperatorType.NUMBER,OperatorKey.SHORTNAME),["in", "cntsic", "gte", "lte"]);
    this.filterTypeString = this.removeOrAddKeys(this.coreFunctionService.getOperators(OperatorType.STRING,OperatorKey.SHORTNAME),["in","gte", "lte"]);
    this.filterTypeDate = this.removeOrAddKeys(this.coreFunctionService.getOperators(OperatorType.DATE,OperatorKey.SHORTNAME),["in","lt","gt","cntsic","cnts"],[{"drng":"Date Range"}]);
  }

// Apply Advance filter payload preparation
  applyAdFilter(fieldNameToUpdate?: string, type?: string) {
    
    let payload = [];

    switch (this.selectedFilterType) {

      case 'drng': {
          let startDate =  this.startDateInput.nativeElement.value;
          let endDate =  this.endDateInput.nativeElement.value;

            if(startDate && endDate){
              let crList = [
                ...this.prepareCrList(fieldNameToUpdate,startDate,type,"gte"),
                ...this.prepareCrList(fieldNameToUpdate,endDate,type,"lte")
              ]

              if (fieldNameToUpdate) {
                const prevPayload = this.crList.filter(obj => obj.fName != fieldNameToUpdate);
                const payloadToUpdate = this.crList.filter(obj => obj.fName === fieldNameToUpdate);
                this.head["isAdFiltered"] = true;

                if(payloadToUpdate.length > 0){
                  
                  if (payloadToUpdate.length == 2) {
  
                    payloadToUpdate[0].fValue = startDate;
                    payloadToUpdate[1].fValue = endDate;

                    payload = this.getPayloadObj(prevPayload,payloadToUpdate);  
                  } else {
                    payload = this.getPayloadObj(prevPayload,crList);
                  }
                } else {
                  payload = this.getPayloadObj(prevPayload,crList);
                }
                
              }
              
              this.head["isAdFiltered"] = true;
              this.crList = payload;
            }
        }

        break;

      default:  {

        const formData = this.adFilterForm.getRawValue();
        const prevPayload = this.crList.filter(obj => obj.fName != fieldNameToUpdate);
      
        Object.keys(formData).forEach(key => {
          const value = formData[key];
          if (value) {
            let fieldValue = value;
            if (type && ['date', 'datetime', 'daterange'].includes(type.toLowerCase()) && key == fieldNameToUpdate) {
              fieldValue = this.commonFunctionService.dateFormat(value);
              this.isDateFieldEmpty = false;
            }

            const existingPayload = this.crList.filter(obj => obj.fName === key);
            const remainingPayload = this.crList.filter(obj => obj.fName != key);

            if (existingPayload?.length == 1) {
              existingPayload[0].fValue = fieldValue;
            } else {
              let updatedObj = this.prepareCrList(key,fieldValue,type,this.selectedFilterType);
            
              payload = this.getPayloadObj(remainingPayload,updatedObj);
            }
            this.head["isAdFiltered"] = true;
          }
        });

        if (type && !['date', 'datetime', 'daterange'].includes(type.toLowerCase()) && !this.searchField ){
          this.isSearchFieldEmpty = true;
        }
        if (type && ['date', 'datetime', 'daterange'].includes(type.toLowerCase()) && !formData[fieldNameToUpdate]){
          this.isDateFieldEmpty = true;
        }
      
        if (fieldNameToUpdate) {
          const payloadToUpdate = this.crList.filter(obj => obj.fName === fieldNameToUpdate);
          if (payloadToUpdate.length) {
            payloadToUpdate[0].operator = this.selectedFilterType;
            payload =  this.getPayloadObj(prevPayload,payloadToUpdate);
          } 
        }
        this.crList = [...payload];
      }
        
      break;
    }
      

    if ( this.crList && this.crList.length>0 ) {
      this.setCrList.emit(this.crList);
      this.adFilterApplied = this.crList.length > 0;
      this.isAdFilter.emit(this.adFilterApplied);
      // this.notificationService.notify('bg-success',"Filter Applied Successfully");
      this.closeAdFilterMenu();
    }  
    // calling apply filter function
    this.applyFilter(this.crList);
  }

// Prepare crList [] through function
  getPayloadObj(prevPayload: any[], currentPayload: any[]): any[] {
    let payload: any[] = [];

    if (prevPayload.length > 0 && currentPayload.length > 0) {
        payload = [...currentPayload, ...prevPayload];
    } else if (prevPayload.length > 0) {
        payload = [...prevPayload];
    } else if (currentPayload.length > 0) {
        payload = [...currentPayload];
    }

    return payload;
  }

// prepare filter Object
  prepareCrList(fName: string, fValue: any, fieldType: string, operator: string): any[] {
    let list: any[] = [];
    let obj = {
        fName: fName,
        fValue: fValue,
        fieldType: fieldType,
        operator: operator
      };
    list.push(obj);
    return list;
  }

// Clear Advance filter function.
  clearAdFilter(fieldName?: string) {
    if (fieldName && fieldName !== "") {
      // Removing current filter from payload.
      this.crList = this.crList.filter(obj => obj.fName !== fieldName);
      if(this.crList){
        this.head.isAdFiltered = false;
      }
    } else {
      // Removing All filter from payload
      this.crList = [];
      this.clearIsFiltered(this.headElements);
    }
  
    this.adFilterApplied = this.crList.length > 0;
    this.isAdFilter.emit(this.adFilterApplied);
  
    this.selectedFilterType = this.getDefaultOperatorForAdFilter();
    this.adFilterForm.reset();
    this.isSearchFieldEmpty = false;
    this.isDateFieldEmpty = false;
  
    this.setCrList.emit(this.crList);
    this.applyFilter(this.crList);
  
    // this.closeAdFilterMenu();
  }

// Apply filter function
  applyFilter(crList:any){
    this.pageNumber = 1;
    const pagePayload = this.apiCallService.getDataForGridFilter(this.pageNumber, this.tab, this.currentMenu,crList);
    pagePayload.data.pageSize = this.itemNumOfGrid;
    this.getGridPayloadData(pagePayload);
  }

// Removing isAdfilter boolean frim all column headers
  clearIsFiltered (headElements: any) {
    if (headElements && headElements.length > 0) {
      headElements.forEach((head:any) => {
        if (head.isAdFiltered) {
          head.isAdFiltered = false;
        }
      });
    }
  }

// Clear input function
  clearInput (input:any) {
    if(input!=''){
      input = '';
    }
  }

  // onAdFilterMenuOpened () {
  //   this.adFiltermenuOpened.emit();
  // }

// Close menu function after 200 ms 
  closeAdFilterMenu () {
    if(this.adFilterMenuTrigger){
      setTimeout(()=>{
        this.adFilterMenuTrigger.closeMenu();
      },200)
    }
  }

  // focusOnSearchField() {
  //   if (this.searchInput) {
  //     this.searchInput.nativeElement.focus();
  //   }
  // }

// Remove unwanted operators using romoveKeys function.
  removeOrAddKeys(obj:Object, keysToRemove:string[],keysToAdd?: { [key: string]: any }[]) {
    if(obj && keysToRemove.length>0 ){
      keysToRemove.forEach(key => {
          delete obj[key];
      });
    }

    if (keysToAdd && keysToAdd.length > 0) {
      keysToAdd.forEach(keysObj => {
        Object.assign(obj, keysObj);
      });
    }
    return this.coreFunctionService.sortOperators(obj);
}

// Change default operator for 'number' , 'date', 'datetime', 'daterange' to EQUAL
  getDefaultOperatorForAdFilter(){
    if (this.head && ['number', 'date', 'datetime', 'daterange'].includes(this.head?.type.toLowerCase())) {
      this.defaultOperator = "eq";
    } else {
      this.defaultOperator = JSON.parse(JSON.stringify(this.storageService.getDefaultSearchOperator()));
    }
    return this.defaultOperator;
  }


}
