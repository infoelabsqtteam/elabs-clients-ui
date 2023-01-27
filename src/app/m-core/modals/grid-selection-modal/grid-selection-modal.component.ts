import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ModalDirective } from 'angular-bootstrap-md';
import { CommonFunctionService } from '../../../services/common-utils/common-function.service';
import { DataShareService } from '../../../services/data-share/data-share.service';
import { NotificationService } from 'src/app/services/notify/notification.service';
import { CoreFunctionService } from 'src/app/services/common-utils/core-function/core-function.service';
import { ModelService } from 'src/app/services/model/model.service';
import { ApiService } from '../../../services/api/api.service';
import { COMMA, ENTER, I, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import {Sort} from '@angular/material/sort';
import { ElementFlags } from 'typescript';
import { GridCommonFunctionService } from 'src/app/services/grid-common-function.service';


@Component({
  selector: 'app-grid-selection-modal',
  templateUrl: './grid-selection-modal.component.html',
  styleUrls: ['./grid-selection-modal.component.css']
})
export class GridSelectionModalComponent implements OnInit {

  gridData: any = [];
  modifiedGridData:any = [];
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

  @Input() id: string;
  @Output() gridSelectionResponce = new EventEmitter();
  @ViewChild('gridViewModalSelection') public gridViewModalSelection: ModalDirective;
  @ViewChild('chipsInput') chipsInput: ElementRef<HTMLInputElement>;

  @ViewChild('typeheadInput') typeheadInput: ElementRef<HTMLInputElement>;
  @ViewChild('typeheadchips') typeheadchips: ElementRef<HTMLInputElement>;


  typeAheadData: any;
  addedDataInList: any;
  deleteIndex: any;
  parentObj: any;
  fieldNameForDeletion: any;
  isGridSelectionOpen: boolean = true;
  minieditorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '100px',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: false,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [],
      ['fontSize',
      'textColor',
      'backgroundColor',
      'customClasses',
      'undo',
      'redo',
      'bold',
      'italic',
      'underline',
      'link',
      'unlink',
      'insertImage',
      'insertVideo',
      'insertHorizontalRule',
      'toggleEditorMode',
      'justifyLeft',
      'justifyCenter',
      'justifyRight',
      'justifyFull',
      'indent',
      'outdent',
      'insertUnorderedList',
      'insertOrderedList',
      'heading',
      'fontName',
      'removeFormat',      
      'strikeThrough']
    ]
  };
  fixedcolwidth = 150;

  constructor(
    private modalService: ModelService,
    private el: ElementRef,
    private CommonFunctionService: CommonFunctionService,
    private dataShareService: DataShareService,
    private notificationService: NotificationService,
    private coreFunctionService: CoreFunctionService,
    private apiservice: ApiService,
    private gridCommonFunctionService:GridCommonFunctionService
  ) {
    this.gridSelectionOpenOrNotSubscription = this.dataShareService.getIsGridSelectionOpen.subscribe(data => {
      this.isGridSelectionOpen = data;
    })
    this.typeaheadDataSubscription = this.dataShareService.typeAheadData.subscribe(data => {
      this.setTypeaheadData(data);
    })
    this.staticDataSubscriber = this.dataShareService.staticData.subscribe(data => {
      if (this.coreFunctionService.isNotBlank(this.field) && this.coreFunctionService.isNotBlank(this.field.ddn_field) && data[this.field.ddn_field]) {
        this.responseData = data[this.field.ddn_field];
      } else {
        this.responseData = [];
      }
      this.copyStaticData = data;
      if(this.setGridData && this.field.ddn_field && data[this.field.ddn_field] && data[this.field.ddn_field] != null){
        this.setStaticData(data);
        if(this.gridData.length > 0 && this.listOfGridFieldName.length > 0){
          this.modifiedGridData = this.gridCommonFunctionService.modifyGridData(this.gridData,this.listOfGridFieldName,this.field);
        }else{
          this.modifiedGridData = [];
        }        
      }
    })
    //this.treeViewData.data = TREE_DATA;
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
    if (typeAheadData.length > 0) {
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

  custmizedFormValueData(data, fieldName) {
    if (data && data[fieldName.field_name] && data[fieldName.field_name].length > 0) {
      return data[fieldName.field_name];
    }
  }

  add(event: MatChipInputEvent, field, index,chipsInput,data){
    let selectedData = "";
    if(event && event.value){
      selectedData = event.value
    } 
    let indx = this.gridCommonFunctionService.getCorrectIndex(data,index,this.field,this.gridData,this.filterData);
    if(selectedData != ""){  
      this.setData(selectedData,field, indx,chipsInput) 
    }
  }
  setValue(event: MatChipInputEvent, field, index,chipsInput,data) {
    let selectedData = "";
    if(event && event["option"] && event["option"].value){
      selectedData = event["option"].value
    }  
    let indx = this.gridCommonFunctionService.getCorrectIndex(data,index,this.field,this.gridData,this.filterData);
    if(selectedData != ""){ 
      this.setData(selectedData,field, indx,chipsInput);  
    }  
  }

  setData(selectedData, field, index,chipsInput){
    if(field.type != "typeahead"){
      if (this.gridData[index][field.field_name] == null) this.gridData[index][field.field_name] = [];
      if(this.gridCommonFunctionService.checkDataAlreadyAddedInListOrNot(field.field_name,selectedData,this.gridData[index][field.field_name])){
        this.notificationService.notify('bg-danger','Entered value for '+field.label+' is already added. !!!');
      }else{
        this.gridData[index][field.field_name].push(selectedData);
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
    this.typeAheadData = [];    
  }

  getOptionText(option) {
    if (option && option.name) {
      return option.name;
    } else {
      return option;
    }
  }

  


  typeaheadObjectWithtext;
  searchTypeaheadData(field, currentObject,chipsInputValue) {
    //console.log(chipsInputValue)
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
    let staticModalGroup = this.CommonFunctionService.getPaylodWithCriteria(field.api_params, call_back_field, criteria, this.typeaheadObjectWithtext ? this.typeaheadObjectWithtext : {});
    staticModal.push(staticModalGroup);
    this.apiservice.GetTypeaheadData(staticModal);

    this.typeaheadObjectWithtext[field.field_name] = this.addedDataInList;
  }


  getStaticDataWithDependentData() {
    const staticModal = []
    let staticModalGroup = this.CommonFunctionService.commanApiPayload([], this.listOfGridFieldName, [], this.typeaheadObjectWithtext);
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
    // this.store.select('staticData').subscribe((state => {
    //   if(state.staticData){
    //     this.gridData = [];
    //     if(this.field.ddn_field && state.staticData[this.field.ddn_field] && state.staticData[this.field.ddn_field] != null){
    //       if(state.staticData[this.field.ddn_field] && state.staticData[this.field.ddn_field].length>0){
    //         state.staticData[this.field.ddn_field].forEach(element => {
    //           const gridData = JSON.parse(JSON.stringify(element))
    //           if(gridData.selected && this.selecteData.length < 0){
    //             gridData.selected = false;
    //           }
    //           this.gridData.push(gridData);
    //         });
    //       }

    //       if(this.gridData && this.gridData.length > 0){
    //         this.selecteData.forEach(element => {
    //           this.gridData.forEach((row, i) => {
    //             if(this.field.matching_fields_for_grid_selection && this.field.matching_fields_for_grid_selection.length>0){
    //               var validity = true;
    //               this.field.matching_fields_for_grid_selection.forEach(matchcriteria => {
    //                 if(this.CommonFunctionService.getObjectValue(matchcriteria,element) == this.CommonFunctionService.getObjectValue(matchcriteria,row)){
    //                   validity = validity && true;
    //                 }
    //                 else{
    //                   validity = validity && false;
    //                 }
    //               });
    //               if(validity == true){
    //                 this.gridData[i]= element
    //               const grid_data = JSON.parse(JSON.stringify(this.gridData[i]))
    //               grid_data.selected = true;
    //               this.gridData[i] = grid_data;
    //               }
    //             }
    //             else{
    //                if(this.CommonFunctionService.getObjectValue("_id",element) == this.CommonFunctionService.getObjectValue('_id',row)){
    //                 this.gridData[i]= element
    //                 const grid_data = JSON.parse(JSON.stringify(this.gridData[i]))
    //                 grid_data.selected = true;
    //                 this.gridData[i] = grid_data;
    //               }
    //             }
    //           });
    //         });          
    //       }
    //     }        
    //   }
    // }))
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
                this.gridData = this.CommonFunctionService.calculateAutoEffRate(this.gridData);
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
    //this.gridData[i] = element
    const grid_data = JSON.parse(JSON.stringify(this.gridData[i]));
    grid_data.selected = true;
    if(this.editableGridColumns.length > 0){
      this.editableGridColumns.forEach(column => {
        grid_data[column.field_name] = element[column.field_name];
      });
    }
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
      this.field.label = this.field.grid_selection_button_label;
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
      this.modifiedGridData = this.gridCommonFunctionService.modifyGridData(this.selecteData,this.listOfGridFieldName,this.field);      
    }
    else {
      this.setGridData = true;
      this.gridData = [];
      this.modifiedGridData = [];
    }
    if (this.field && this.field.grid_row_selection) {
      this.grid_row_selection = true;
    } else {
      this.grid_row_selection = false;
    }
    if (this.field && this.field.grid_row_refresh_icon) {
      this.grid_row_refresh_icon = true;
    } else {
      this.grid_row_refresh_icon = false;
    }

    //For dropdown data in grid selection
    this.getStaticDataWithDependentData()

  }
  updateColumnList(data,index){
    //this.listOfGridFieldName[index].display = data.display;
  }
  selectGridData() {    
    this.selectedData = this.gridCommonFunctionService.updateGridDataToModifiedData(this.grid_row_selection,this.gridData,this.modifiedGridData,this.editableGridColumns);
    let check = 0;
    let validation = {
      'msg' : ''
    }
    if(this.field && this.field.mendetory_fields && this.field.mendetory_fields.length > 0){            
      if(this.selectedData && this.selectedData.length > 0){
        this.field.mendetory_fields = this.CommonFunctionService.modifiedGridColumns(this.field.mendetory_fields,this.parentObject)
        this.field.mendetory_fields.forEach(mField => {          
          const fieldName = mField.field_name;
          if(mField.display){
            this.selectedData.forEach((row,i) => {
              let checkDisable = this.gridCommonFunctionService.isDisableRuntime(mField,row,i,this.gridData,this.field,this.filterData);
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
    this.modifiedGridData = [];
  }
  
  //SELECT ALL FUNCTIONLITY  
  onlySelectedRecord(event: MatCheckboxChange){
    if(event.checked){
      this.onlySelected = true;
    }else{
      this.onlySelected = false;
    }
  }

  toggle(data, event: MatCheckboxChange, indx) {
    let index = this.gridCommonFunctionService.getCorrectIndex(data,indx,this.field,this.gridData,this.filterData);
    if (event.checked) {
      this.gridData[index].selected = true;
      this.modifiedGridData[index].selected = true;
    } else {
      this.gridData[index].selected = false;
      this.modifiedGridData[index].selected = false;
    }
  }
  checkDisableRowIf(index){
    const data = this.gridData[index];
    return this.gridCommonFunctionService.checkRowIf(data,this.field);
    
  }
  isIndeterminate() {
    let check = 0;
    if (this.gridData.length > 0) {
      this.gridData.forEach(row => {
        if (row.selected) {
          check = check + 1;
        }
      });
    }
    return (check > 0 && !this.isChecked());
  };
  isChecked() {
    let check = 0;
    if (this.gridData.length > 0) {
      this.gridData.forEach(row => {
        if (row.selected) {
          check = check + 1;
        }
      });
    }
    return this.gridData.length === check;
  };
  toggleAll(event: MatCheckboxChange) {
    if (event.checked) {
      if (this.gridData.length > 0) {
        this.gridData.forEach((row,i) => {
          if(!this.checkDisableRowIf(i)){
            row.selected = true;
            this.modifiedGridData[i].selected = true;
          }
        });
      }
    } else {
      if (this.gridData.length > 0) {
        this.gridData.forEach((row,i) => {
          if(!this.checkDisableRowIf(i)){
            row.selected = false;
            this.modifiedGridData[i].selected = false;
          }
        });
      }
    }
    //console.log(this.selected3);
  }

  calculateNetAmount(data, fieldName, index) {

    this.CommonFunctionService.calculateNetAmount(data, fieldName, fieldName["grid_cell_function"]);
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
  cancel() {
    this.deleteIndex = -1;
    this.fieldNameForDeletion = {};
  }
  deleteitem() {
    this.parentObj[this.fieldNameForDeletion.field_name].splice(this.deleteIndex, 1)
  }
}


function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
