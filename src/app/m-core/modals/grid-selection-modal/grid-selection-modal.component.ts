import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ModalDirective } from 'angular-bootstrap-md';
import { COMMA, ENTER, I, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import {Sort} from '@angular/material/sort';
import { CommonFunctionService, DataShareService, NotificationService, CoreFunctionService, ModelService, ApiService, GridCommonFunctionService, LimsCalculationsService, CheckIfService, ApiCallService, minieditorConfig } from '@core/web-core';
import { FilterPipe } from '../../../pipes/filter.pipe';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-grid-selection-modal',
  templateUrl: './grid-selection-modal.component.html',
  styleUrls: ['./grid-selection-modal.component.scss']
})
export class GridSelectionModalComponent implements OnInit {

  gridData: any = [];
  modifiedGridData:any = [];
  filteredData:any = [];
  viewData:any=[];
  pageNo:any=1;
  pageSize:any=25;
  total:any=0;
  selectedData: any = [];
  selecteData: any = [];
  listOfGridFieldName: any = [];
  editableGridColumns:any=[];
  field: any = {};
  editeMode: boolean = false;
  grid_row_selection: boolean = false;
  grid_row_refresh_icon: boolean = false;
  filterData: any = '';
  staticDataSubscriber;
  typeaheadDataSubscription;
  gridSelectionOpenOrNotSubscription
  removable = true;
  parentObject = {};
  responseData: any;
  copyStaticData: [] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  selectable = true;
  term: any={};
  setGridData:boolean=false;
  onlySelected:boolean=false;
  checkSelectedData:boolean = false;
  onlySelectedData:boolean = false;
  editEnable:boolean=false;
  selectedDataLength:number=0;
  buttonlabel:any;

  @Input() id: string;
  @Output() gridSelectionResponce = new EventEmitter();
  @ViewChild('gridViewModalSelection') public gridViewModalSelection: ModalDirective;
  @ViewChild('chipsInput') chipsInput: ElementRef<HTMLInputElement>;

  @ViewChild('typeheadInput') typeheadInput: ElementRef<HTMLInputElement>;
  @ViewChild('typeheadchips') typeheadchips: ElementRef<HTMLInputElement>;


  typeAheadData: any=[];
  addedDataInList: any;
  deleteIndex: any;
  parentObj: any;
  fieldNameForDeletion: any;
  isGridSelectionOpen: boolean = true;
  fileDownloadUrlSubscription:Subscription;
  minieditorConfig: AngularEditorConfig = minieditorConfig as AngularEditorConfig;
  fixedcolwidth = 150;

  constructor(
    private modalService: ModelService,
    private el: ElementRef,
    private CommonFunctionService: CommonFunctionService,
    private dataShareService: DataShareService,
    private notificationService: NotificationService,
    private coreFunctionService: CoreFunctionService,
    private apiservice: ApiService,
    private gridCommonFunctionService:GridCommonFunctionService,
    private limsCalculationsService: LimsCalculationsService,
    private filterPipe:FilterPipe,
    private checkIfService:CheckIfService,
    private apiCallService:ApiCallService
  ) {
    this.gridSelectionOpenOrNotSubscription = this.dataShareService.getIsGridSelectionOpen.subscribe(data => {
      this.isGridSelectionOpen = data;
    })
    this.typeaheadDataSubscription = this.dataShareService.typeAheadData.subscribe(data => {
      this.setTypeaheadData(data);
    })
    this.fileDownloadUrlSubscription = this.dataShareService.fileDownloadUrl.subscribe(data =>{
      this.setFileDownloadUrl(data);
    })
    this.staticDataSubscriber = this.dataShareService.staticData.subscribe(data => {
      if (this.coreFunctionService.isNotBlank(this.field) && this.coreFunctionService.isNotBlank(this.field.ddn_field) && data[this.field.ddn_field]) {
        this.responseData = data[this.field.ddn_field];
      } else {
        this.responseData = [];
      }
      if(data && Object.keys(data).length > 0){
        Object.keys(data).forEach(key => {     
          if(key && key != '' && data[key]){
            if(this.field && this.field.ddn_field && data[this.field.ddn_field] && this.field.ddn_field == key){
              //this.copyStaticData[key] = JSON.parse(JSON.stringify(data[key]));
            }else{
              this.copyStaticData[key] = JSON.parse(JSON.stringify(data[key]));
            }
          }
        })
      }
      if(this.setGridData && this.field.ddn_field && data[this.field.ddn_field] && data[this.field.ddn_field] != null){
        this.setStaticData(data);
        if(this.gridData.length > 0 && this.listOfGridFieldName.length > 0){
          this.modifiedGridData = this.gridCommonFunctionService.modifyGridData(this.gridData,this.listOfGridFieldName,this.field,this.editableGridColumns,[]);
          if(this.modifiedGridData && this.modifiedGridData.length < 50){
            this.editEnable = true;
          }
          this.checkSelectedDataLength();
          //this.getViewData();
        }else{
          this.modifiedGridData = [];
        }        
      }
    })
    //this.treeViewData.data = TREE_DATA;
  }


  getViewData(){
    if (this.modifiedGridData && this.modifiedGridData.length > 0) {
      this.total = this.modifiedGridData.length;
      this.viewData = [];
      let i = 0;
      if(this.pageNo > 1){
        i = this.pageSize * (this.pageNo - 1);
      }
      for (i = 0; i < this.modifiedGridData.length; i++) {
        const element = this.modifiedGridData[i];
        this.viewData.push(element);
        if(this.viewData.length == this.pageSize){
          break;
        }              
      }
    }
  }

  sortData(sort: Sort) {
    const data = this.gridData.slice();
    if (!sort.active || sort.direction === '') {
      this.gridData = data;
      return;
    }
    let fieldname = sort.active;
    const columnIndex = this.CommonFunctionService.getIndexInArrayById(this.listOfGridFieldName,fieldname,'field_name');
    let gridColumns = this.listOfGridFieldName[columnIndex];
    if(gridColumns && gridColumns.field_name && gridColumns.field_name != ''){
      this.gridData = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        const dataA = this.CommonFunctionService.getObjectValue(fieldname, a);
        const dataB = this.CommonFunctionService.getObjectValue(fieldname, b);
        return compare(dataA, dataB, isAsc);
      });
    }else {
      return 0;
    }
  }

  getddnDisplayVal(val) {
    return this.CommonFunctionService.getddnDisplayVal(val);
  }

  setTypeaheadData(typeAheadData) {
    if (typeAheadData && typeAheadData.length > 0) {
      this.typeAheadData = typeAheadData;
    } else {
      this.typeAheadData = [];
    }
  }

  compareObjects(o1: any, o2: any): boolean {
    if (o1 != null && o2 != null) {
      return o1._id === o2._id;
    } else {
      return false;
    }

  }

  // custmizedFormValueData(data, fieldName) {
  //   if (data && data[fieldName.field_name] && data[fieldName.field_name].length > 0) {
  //     return data[fieldName.field_name];
  //   }
  // }

  //Hide Icon Click Function 
  hideColumn(columns,index: number) {
    columns[index].display = !columns[index].display;
}
  add(event: MatChipInputEvent, field, index,chipsInput,data){
    let selectedData = "";
    if(event && event.value){
      selectedData = event.value
    } 
    let indx = this.CommonFunctionService.getCorrectIndex(data,index,this.field,this.gridData,this.filterData);
    if(selectedData != ""){  
      this.setData(selectedData,field, indx,chipsInput) 
    }
  }
  setValue(event:MatChipInputEvent, field, index,chipsInput,data) {
    let selectedData = "";
    if(event && event["option"] && event["option"].value){
      selectedData = event["option"].value
    } 
    let indx = this.CommonFunctionService.getCorrectIndex(data,index,this.field,this.gridData,this.filterData);
    if(selectedData != ""){ 
      this.setData(selectedData,field, indx,chipsInput);  
    }
    this.checkIfService.checkDisableInRow(this.editableGridColumns,data); 
  }

  setData(selectedData, field, index,chipsInput){
    if(field.type != "typeahead"){
      this.checkDataInListOrAdd(field,index,selectedData,chipsInput);
      // if (this.modifiedGridData[index][field.field_name] == null) this.modifiedGridData[index][field.field_name] = [];
      // if(this.gridCommonFunctionService.checkDataAlreadyAddedInListOrNot(field.field_name,selectedData,this.modifiedGridData[index][field.field_name])){
      //   this.notificationService.notify('bg-danger','Entered value for '+field.label+' is already added. !!!');
      // }else{
      //   this.modifiedGridData[index][field.field_name].push(selectedData);
      // }
      // if(this.chipsInput && this.chipsInput.nativeElement && this.chipsInput.nativeElement.value){
      //   this.chipsInput.nativeElement.value = "";
      // }
      // if(this.typeheadchips && this.typeheadchips.nativeElement && this.typeheadchips.nativeElement.value){
      //   this.typeheadchips.nativeElement.value = "";
      // }
      // if(this.typeheadInput && this.typeheadInput.nativeElement && this.typeheadInput.nativeElement.value){
      //   this.typeheadInput.nativeElement.value = "";
      // }
      // chipsInput.value = "";
    } 
    if(field.type == "typeahead"){
      if(field.datatype != 'chips'){
        this.modifiedGridData[index][field.field_name]= selectedData;
      }else if(field.datatype == 'chips'){
        this.checkDataInListOrAdd(field,index,selectedData,chipsInput);
      }
    }   
    this.typeAheadData = [];    
  }
  checkDataInListOrAdd(field,index,selectedData,chipsInput){
    if (this.modifiedGridData[index][field.field_name] == null) this.modifiedGridData[index][field.field_name] = [];
    let duplicacy = this.checkIfService.checkDataAlreadyAddedInListOrNot(field,selectedData,this.modifiedGridData[index][field.field_name]);
    if(duplicacy && duplicacy.status){
      this.notificationService.notify('bg-danger','Entered value for '+field.label+' is already added. !!!');
    }else{
      this.modifiedGridData[index][field.field_name].push(selectedData);
    }
    if(this.chipsInput && this.chipsInput.nativeElement && this.chipsInput.nativeElement.value){
      this.chipsInput.nativeElement.value = "";
    }
    if(this.typeheadchips && this.typeheadchips.nativeElement && this.typeheadchips.nativeElement.value){
      this.typeheadchips.nativeElement.value = "";
    }
    if(this.typeheadInput && this.typeheadInput.nativeElement && this.typeheadInput.nativeElement.value){
      this.typeheadInput.nativeElement.value = "";
    }
    chipsInput.value = "";
  }

  getOptionText(option) {
    if (option && option.name) {
      return option.name;
    } else {
      return option;
    }
  }

  getValueForGrid(column,row){
    return this.gridCommonFunctionService.getValueForGrid(column,row);
  }

  


  typeaheadObjectWithtext;
  searchTypeaheadData(field, currentObject,chipsInputValue) {
    //console.log(chipsInputValue)
    if(chipsInputValue != ''){
      this.typeaheadObjectWithtext = currentObject;

      this.addedDataInList = this.typeaheadObjectWithtext[field.field_name]

      this.typeaheadObjectWithtext[field.field_name] = chipsInputValue;

      let call_back_field = '';
      let criteria = [];
      const staticModal = []
      if (field.call_back_field && field.call_back_field != '') {
        call_back_field = field.call_back_field;
      }
      if(field.api_params_criteria && field.api_params_criteria != ''){
        criteria =  field.api_params_criteria;
      }
      let staticModalGroup = this.apiCallService.getPaylodWithCriteria(field.api_params, call_back_field, criteria, this.typeaheadObjectWithtext ? this.typeaheadObjectWithtext : {});
      staticModal.push(staticModalGroup);
      this.apiservice.GetTypeaheadData(staticModal);

      this.typeaheadObjectWithtext[field.field_name] = this.addedDataInList;
    }else{
      this.typeAheadData = [];
    }
  }


  getStaticDataWithDependentData() {
    const staticModal = []
    let staticModalGroup = this.apiCallService.commanApiPayload([], this.listOfGridFieldName, [], this.typeaheadObjectWithtext);
    if (staticModalGroup.length > 0) {
      staticModalGroup.forEach(element => {
        staticModal.push(element);
      });
    }
    if (staticModal.length > 0) {
      this.apiservice.getStatiData(staticModal);
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
  ngOnDestroy() {
    if (this.staticDataSubscriber) {
      this.staticDataSubscriber.unsubscribe();
    }
  }
  setStaticData(staticData) {
    if (staticData) {
      if (this.field.ddn_field && staticData[this.field.ddn_field] && staticData[this.field.ddn_field] != null) {
        this.gridData = [];
        if (staticData[this.field.ddn_field] && staticData[this.field.ddn_field].length > 0) {
          staticData[this.field.ddn_field].forEach(element => {
            const gridData = JSON.parse(JSON.stringify(element))
            if (gridData.selected && this.selecteData.length < 0) {
              gridData.selected = false;
            }
            this.gridData.push(gridData);
          });
        }

        if (this.gridData && this.gridData.length > 0) {

          if (this.field.onchange_function && this.field.onchange_function_param != "") {
            switch (this.field.onchange_function_param) {
              case "calculateQquoteAmount":
                this.gridData = this.limsCalculationsService.calculateAutoEffRate(this.gridData);
                break;
            }
          }
          if(this.selecteData && this.selecteData.length > 0){
            this.updateSelectedDataInGridData(this.selecteData);            
          }        
          this.setGridData = false;
        }
      }
    }
  }
  
  
  updateSelectedDataInGridData(selecteData){
    if(selecteData && selecteData.length > 0){
      selecteData.forEach(element => {
        for (let i = 0; i < this.gridData.length; i++) {
          const row = this.gridData[i];
          if (this.field.matching_fields_for_grid_selection && this.field.matching_fields_for_grid_selection.length > 0) {
            var validity = true;
            for (let index = 0; index < this.field.matching_fields_for_grid_selection.length; index++) {
              const matchcriteria = this.field.matching_fields_for_grid_selection[index];
              if (this.CommonFunctionService.getObjectValue(matchcriteria, element) == this.CommonFunctionService.getObjectValue(matchcriteria, row)) {
                validity = validity && true;
              }
              else {
                validity = validity && false;
                break;
              }
            };
            if (validity == true) {
              this.updateRowData(element,i);
              break;
            }
          }
          else {
            if (this.CommonFunctionService.getObjectValue("_id", element) == this.CommonFunctionService.getObjectValue('_id', row)) {
              this.updateRowData(element,i);
              break;
            }
          }
        };
      });  
    }
  }
  updateRowData(element,i){
    this.gridData[i] = element
    const grid_data = JSON.parse(JSON.stringify(this.gridData[i]));
    grid_data.selected = true;
    // if(this.editableGridColumns.length > 0){
    //   this.editableGridColumns.forEach(column => {
    //     grid_data[column.field_name] = element[column.field_name];
    //   });
    // }
    this.gridData[i] = grid_data;
  }
  

  refreshRowWithMasterData(index) {
    let rowData = this.gridData[index];
    if (this.field.matching_fields_for_grid_selection && this.field.matching_fields_for_grid_selection.length > 0) {
      var validity = true;
      if (Array.isArray(this.responseData)) {
        this.responseData.forEach(element => {
          this.field.matching_fields_for_grid_selection.forEach(matchcriteria => {
            if (this.CommonFunctionService.getObjectValue(matchcriteria, rowData) == this.CommonFunctionService.getObjectValue(matchcriteria, element)) {
              validity = validity && true;
            }
            else {
              validity = validity && false;
            }
          });
          if (validity == true) {
            const grid_data = JSON.parse(JSON.stringify(element))
            grid_data.selected = this.gridData[index]['selected'];
            this.gridData[index] = grid_data;
          }
        });
      }

    }
  }

  
  showModal(alert) {
    this.selecteData = [];
    this.selecteData = JSON.parse(JSON.stringify(alert.selectedData));
    this.field = alert.field;
    if (alert.object) {
      this.parentObject = alert.object;
    }
    if(this.field && this.field.grid_selection_button_label != null && this.field.grid_selection_button_label != ''){
      this.buttonlabel = this.field.grid_selection_button_label;
    }else {
      this.buttonlabel = this.field.label
    }
    if (this.field && this.field.grid_row_selection) {
      this.grid_row_selection = true;
    } else {
      this.grid_row_selection = false;
      this.checkSelectedData = true;
      this.onlySelectedData = true;
    }
    this.field['isFilter'] = this.gridCommonFunctionService.applyOnGridFilter(this.field);
    this.field['filterLabel'] = this.gridCommonFunctionService.applyOnGridFilterLabel(this.field);
    if (this.field.gridColumns && this.field.gridColumns.length > 0) {      
      this.listOfGridFieldName = this.gridCommonFunctionService.modifyGridColumns(JSON.parse(JSON.stringify(this.field.gridColumns)),this.parentObject);
      this.editableGridColumns = this.gridCommonFunctionService.getListByKeyValueToList(this.listOfGridFieldName,"editable",true);
      this.gridViewModalSelection.show();
    } else {
      this.notificationService.notify("bg-danger", "Grid Columns are not available In This Field.")
    }
    if (alert.field.onchange_api_params == "" || alert.field.onchange_api_params == null) {
      this.gridData = this.selecteData;
      this.modifiedGridData = this.gridCommonFunctionService.modifyGridData(this.selecteData,this.listOfGridFieldName,this.field,this.editableGridColumns,[]);      
      if(this.grid_row_selection && this.modifiedGridData && this.modifiedGridData.length < 50){
        this.editEnable = true;
      }
    }
    else {
      this.setGridData = true;
      this.gridData = [];
      this.modifiedGridData = [];
      if(!this.grid_row_selection){
        this.selecteData = [];
      }
    }
    
    if (this.field && this.field.grid_row_refresh_icon) {
      this.grid_row_refresh_icon = true;
    } else {
      this.grid_row_refresh_icon = false;
    }

    //For dropdown data in grid selection
    this.getStaticDataWithDependentData()

  }
  updateColumnList(columns?){
    if(columns) columns.forEach(column=>column.display =true)
  }
  selectGridData() {    
    this.selectedData = this.gridCommonFunctionService.updateGridDataToModifiedData(this.grid_row_selection,this.gridData,this.modifiedGridData,this.listOfGridFieldName,);
    let check = 0;
    let validation = {
      'msg' : ''
    }
    if(this.field && this.field.mendetory_fields && this.field.mendetory_fields.length > 0){            
      if(this.selectedData && this.selectedData.length > 0){
        this.field.mendetory_fields = this.gridCommonFunctionService.getModifiedGridColumns(this.field.mendetory_fields,this.parentObject)
        this.field.mendetory_fields.forEach(mField => {          
          const fieldName = mField.field_name;
          if(mField.display){
            this.selectedData.forEach((row,i) => {
              let checkDisable = this.checkIfService.isDisableRuntime(mField,row,i,this.gridData,this.field,this.filterData);
              if(row && !checkDisable && (row[fieldName] == undefined || row[fieldName] == '' || row[fieldName] == null)){
                if(validation.msg == ''){
                  const rowNo = i + 1;
                  validation.msg = mField.label+'( '+rowNo+' ) is required.';
                }
                check = 1;
              }
            });
          }
        });        
      }
    }
    if(check != 0){
      this.notificationService.notify('bg-info',validation.msg);
    }else{
      this.gridSelectionResponce.emit(this.selectedData);
      this.closeModal();
      this.filteredData = [];
    }    
  }
  

  closeModal() {
    this.resetFlagsOrVariables();
    this.dataShareService.setIsGridSelectionOpenOrNot(true);
    this.gridViewModalSelection.hide();
  }
  resetFlagsOrVariables(){
    this.gridData = [];
    this.selectedData = [];
    this.selecteData = [];
    this.filterData = '';
    this.onlySelected=false;
    this.checkSelectedData = false;
    this.onlySelectedData = false;
    this.editEnable=false;
    this.modifiedGridData = [];
    this.typeAheadData = [];
    this.editableGridColumns = [];
    this.apiservice.clearTypeaheadData();
  }
  
  //SELECT ALL FUNCTIONLITY  
  onlySelectedRecord(event: MatCheckboxChange){
    if(event.checked){
      this.onlySelected = true;
    }else{
      this.onlySelected = false;
    }
  }
  enableSelectedEdit(event: MatCheckboxChange){
    if(event.checked){
      this.setEditableInSelected(true);
    }else{
      this.setEditableInSelected(false);
    }
  }
  setEditableInSelected(value){
    if(this.modifiedGridData.length > 0){
      for (let i = 0; i < this.modifiedGridData.length; i++) {
        const row = this.modifiedGridData[i];
        if (row.selected) {
          row['column_edit'] = value;
        }
        
      }
    }
  }
  singleRowEdit(data){
    data['column_edit'] = !data['column_edit'];
  }

  toggle(data, event: MatCheckboxChange, indx) {
    let index = this.CommonFunctionService.getCorrectIndex(data,indx,this.field,this.gridData,this.filterData);
    if (event.checked) {
      this.gridData[index].selected = true;
      this.modifiedGridData[index].selected = true;
      if(this.editEnable && this.editableGridColumns && this.editableGridColumns.length > 1){
        this.modifiedGridData[index].column_edit = true;
      }
    } else {
      this.gridData[index].selected = false;
      this.modifiedGridData[index].selected = false;
      if(this.editableGridColumns && this.editableGridColumns.length > 1){
        this.modifiedGridData[index].column_edit = false;
      }
      
    }
    this.checkSelectedDataLength();
  }
  getSelectedDataLength(){
    this.selectedDataLength = 0;
    if(this.modifiedGridData.length > 0){
      let count = 0;
      for (let i = 0; i < this.modifiedGridData.length; i++) {
        const data = this.modifiedGridData[i];        
        if(data.selected){
          count++;
        }
      }
      this.selectedDataLength = count;
    }
  }
  checkSelectedDataLength(){
    if(this.modifiedGridData.length > 0){
      let count = 0;
      for (let i = 0; i < this.modifiedGridData.length; i++) {
        const data = this.modifiedGridData[i];        
        if(data.selected){
          count++;
        }
        if(count >= 2){
          if(this.editableGridColumns && this.editableGridColumns.length > 0){
            this.checkSelectedData = true;
            this.onlySelectedData = true;
          }else{
            this.checkSelectedData = false;
            this.onlySelectedData = true;
          }          
          break;
        }else if(count >= 1){
          this.onlySelectedData = true;
          this.checkSelectedData = false;
        }else{
          this.checkSelectedData = false;
          this.onlySelectedData = false;
        }
        
      }
    }
    this.getSelectedDataLength();
  }
  checkDisableRowIf(index){
    const data = this.gridData[index];
    return this.checkIfService.checkRowIf(data,this.field);
    
  }
  isIndeterminate() {
    let result = this.checkSelected();
    let check = result.check;
    return (check > 0 && !this.isChecked());
  };
  isChecked() {
    let result = this.checkSelected();
    let check = result.check;
    let data = result.data;
    return data.length === check;
  };
  checkSelected(){
    let check = 0;
    let data = [];
    let result = {
      'check':check,
      'data': data
    }    
    if(this.filterData != '' && this.filteredData.length > 0){
      data = this.filteredData;
    }else if(this.gridData.length > 0) {
      data = this.gridData;      
    }
    data.forEach(row => {
      if (row.selected) {
        check = check + 1;
      }
    });
    result.check = check;
    result.data = data;
    return result;
  }
  toggleAll(event: MatCheckboxChange) {
    if (event.checked) {
      if (this.gridData.length > 0) {
        if(this.filterData && this.filterData != '' && this.filteredData && this.filteredData.length > 0){
          this.filteredData.forEach((data,i) => {
            this.toggle(data,event,i);
          });
        }else{          
          this.gridData.forEach((row,i) => {
            if(!this.checkDisableRowIf(i)){
              row.selected = true;
              this.modifiedGridData[i].selected = true;
              if(this.editEnable && this.editableGridColumns && this.editableGridColumns.length > 1){
                this.modifiedGridData[i].column_edit = true;
              }
            }
          });
        }
      }
      this.selectedDataLength = this.modifiedGridData.length;
    } else {
      if (this.gridData.length > 0) {
        if(this.filterData && this.filterData != '' && this.filteredData && this.filteredData.length > 0){
          this.filteredData.forEach((data,i) => {
            this.toggle(data,event,i);
          });
        }else{
          this.gridData.forEach((row,i) => {
            if(!this.checkDisableRowIf(i)){
              row.selected = false;
              this.modifiedGridData[i].selected = false;
              if(this.editableGridColumns && this.editableGridColumns.length > 1){
                this.modifiedGridData[i].column_edit = false;
              }            
            }
          });
        }
      }
      this.selectedDataLength = 0;
    }
    this.checkSelectedDataLength();
    
  }

  calculateNetAmount(fieldName, index) {
    let data = {};
    if(this.filteredData && this.filteredData.length > 0) {
      data = this.filteredData[index];
    }else {
      data = this.modifiedGridData[index];
    }
    if(fieldName["grid_cell_function"] && fieldName["grid_cell_function"] != ''){
      this.limsCalculationsService.calculateNetAmount(data, fieldName, fieldName["grid_cell_function"]);
    }    
    this.checkIfService.checkDisableInRow(this.editableGridColumns,data);
  } 
  checkDisableIf(data){
    this.checkIfService.checkDisableInRow(this.editableGridColumns,data);
  }

  
  checkValidator() {
    // if(this.preSelectedData){
    //   let selectedItem = 0;
    //   this.gridData.forEach(element => {
    //     if(element.selected  && selectedItem == 0){
    //       selectedItem = 1;
    //     }
    //   });
    //   if(selectedItem == 1){
    //     return false;
    //   }else{
    //     return true;
    //   }
    // }
    return false;
  }

  openModal(id, chipIndex, parentObj, fieldName, alertType) {
    this.deleteIndex = chipIndex;
    if (parentObj != '') {
      this.parentObj = parentObj;
      this.fieldNameForDeletion = fieldName;
    }
    this.CommonFunctionService.openAlertModal(id, alertType, 'Are You Sure ?', 'Delete This record.');
  }

  alertResponce1(responce) {
    if (responce) {
      this.deleteitem()
    } else {
      this.cancel();
    }
  }
  bulkUpdate(){
    let object = {};
    let data = {};
    object["editedColumns"] = this.editableGridColumns;
    for (let i = 0; i < this.modifiedGridData.length; i++) {
      const row = this.modifiedGridData[i];
      if(row.selected || !this.grid_row_selection){
        for (let j = 0; j < this.editableGridColumns.length; j++) {
          const column = this.editableGridColumns[j];
          data[column.field_name] = row[column.field_name];            
        }
        break;
      }      
    }
    object["data"] = data;
    object["copyStaticData"] = this.copyStaticData;
    this.modalService.open("bulk-update-modal",object);
  }
  bulkUpdateResponce(responce){
    if(this.modifiedGridData && this.modifiedGridData.length > 0){
      for (let i = 0; i < this.modifiedGridData.length; i++) {
        const data = this.modifiedGridData[i];
        if(data.selected || !this.grid_row_selection){
          for (let j = 0; j < this.editableGridColumns.length; j++) {
            const column = this.editableGridColumns[j];
            data[column.field_name] = responce[column.field_name];
            this.checkIfService.checkDisableInRow(this.editableGridColumns,data);
            if(data && !data[column.field_name+"_disabled"] && responce[column.field_name] && column.display){
              data[column.field_name] = responce[column.field_name];
              switch (column.type.toLowerCase()) {
                case 'text':
                case 'number':
                  if(column["grid_cell_function"] && column["grid_cell_function"] != ''){
                    this.limsCalculationsService.calculateNetAmount(data, column, column["grid_cell_function"]);
                  }
                  break;            
                default:
                  break;
              }               
            }           
          }
        }        
      }
    }
  }
  cancel() {
    this.deleteIndex = -1;
    this.fieldNameForDeletion = {};
  }
  deleteitem() {
    this.parentObj[this.fieldNameForDeletion.field_name].splice(this.deleteIndex, 1)
  }
  showGriddData(index,column){
    let value={};
    let rowData = this.gridData[index];
    let columnData = rowData[column.field_name];
    value['data'] = columnData;
    let editemode = false; 
    switch (column.type) {
      case "info":
        if(column["gridColumns"] && column["gridColumns"].length > 0){
          value['gridColumns']=column.gridColumns;
        }else if(column["fields"] && column["fields"].length > 0){
          value['gridColumns']=column.fields;
        }
        this.CommonFunctionService.viewModal('form_basic-modal', value, column, "",editemode);
        break;
      default:
        break;
    }
  }
  searchfilterData(){
    if(this.filterData != '' && this.filterData.length > 0){
      this.filteredData = this.filterPipe.transform(this.modifiedGridData,this.filterData);
    }else{
      this.filteredData = [];
    }
    
  }

  fileuploadedindex;
  uploadField;
  downloadClick;
  dataSaveInProgress
  uploadModal(fieldName,index,data) {
    this.uploadField = fieldName;
    let selectedData = [];
    if(data && data[this.uploadField.field_name] && this.CommonFunctionService.isArray(data[this.uploadField.field_name]) && data[this.uploadField.field_name].length > 0) {
      selectedData = data[this.uploadField.field_name];
    }
    this.fileuploadedindex = this.CommonFunctionService.getCorrectIndex(data,index,this.field,this.gridData,this.filterData);
    this.CommonFunctionService.openFileUpload(fieldName, 'grid-selection-file-upload', data, selectedData)
  }

    downloadFile(file){
      this.downloadClick = file.rollName;
      this.CommonFunctionService.downloadFile(file);
    }
    setFileDownloadUrl(fileDownloadUrl){
      if (fileDownloadUrl != '' && fileDownloadUrl != null && this.downloadClick != '') {
        let link = document.createElement('a');
        link.setAttribute('type', 'hidden');
        link.href = fileDownloadUrl;
        link.download = this.downloadClick;
        document.body.appendChild(link);
        link.click();
        link.remove();
        this.downloadClick = '';
        this.dataSaveInProgress = true;
        this.apiservice.ResetDownloadUrl();
      }
    }

    fileUploadResponce(response) {
      if(response && response.length > 0) {
        this.modifiedGridData[this.fileuploadedindex][this.uploadField.field_name]= response;
      }
    }
  
}


function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
