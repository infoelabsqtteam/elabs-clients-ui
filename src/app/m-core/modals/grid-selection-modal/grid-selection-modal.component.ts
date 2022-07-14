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


@Component({
  selector: 'app-grid-selection-modal',
  templateUrl: './grid-selection-modal.component.html',
  styleUrls: ['./grid-selection-modal.component.css']
})
export class GridSelectionModalComponent implements OnInit {

  gridData: any = [];
  selectedData: any = [];
  selecteData: any = [];
  listOfGridFieldName: any = [];
  field: any = {};
  editeMode: boolean = false;
  grid_row_selection: boolean = false;
  grid_row_refresh_icon: boolean = false;
  data: any = '';
  staticDataSubscriber;
  typeaheadDataSubscription;
  gridSelectionOpenOrNotSubscription
  removable = true;
  parentObject = {};
  responseData: any;
  copyStaticData: [] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  selectable = true;

  @Input() id: string;
  @Output() gridSelectionResponce = new EventEmitter();
  @ViewChild('gridViewModalSelection') public gridViewModalSelection: ModalDirective;
  @ViewChild('chipsInput') chipsInput: ElementRef<HTMLInputElement>;
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

  constructor(
    private modalService: ModelService,
    private el: ElementRef,
    private CommonFunctionService: CommonFunctionService,
    private dataShareService: DataShareService,
    private notificationService: NotificationService,
    private coreFunctionService: CoreFunctionService,
    private apiservice: ApiService
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
      this.setStaticData(data);
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
    let indx = this.getCorrectIndex(data,index);
    if(selectedData != ""){  
      this.setData(selectedData,field, indx,chipsInput) 
    }
  }
  setValue(event: MatChipInputEvent, field, index,chipsInput,data) {
    let selectedData = "";
    if(event && event["option"] && event["option"].value){
      selectedData = event["option"].value
    }  
    let indx = this.getCorrectIndex(data,index);
    if(selectedData != ""){ 
      this.setData(selectedData,field, indx,chipsInput);  
    }  
  }

  setData(selectedData, field, index,chipsInput){
    if (this.gridData[index][field.field_name] == null) this.gridData[index][field.field_name] = [];
    if(this.checkDataAlreadyAddedInListOrNot(field.field_name,selectedData,this.gridData[index][field.field_name])){
      this.notificationService.notify('bg-danger','Entered value for '+field.label+' is already added. !!!');
    }else{
      this.gridData[index][field.field_name].push(selectedData);
    }
    
    this.chipsInput.nativeElement.value = "";
    this.typeAheadData = [];
    chipsInput.value = "";
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
    console.log(chipsInputValue)
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

          this.selecteData.forEach(element => {
            this.gridData.forEach((row, i) => {
              if (this.field.matching_fields_for_grid_selection && this.field.matching_fields_for_grid_selection.length > 0) {
                var validity = true;
                this.field.matching_fields_for_grid_selection.forEach(matchcriteria => {
                  if (this.CommonFunctionService.getObjectValue(matchcriteria, element) == this.CommonFunctionService.getObjectValue(matchcriteria, row)) {
                    validity = validity && true;
                  }
                  else {
                    validity = validity && false;
                  }
                });
                if (validity == true) {
                  this.gridData[i] = element
                  const grid_data = JSON.parse(JSON.stringify(this.gridData[i]))
                  grid_data.selected = true;
                  this.gridData[i] = grid_data;
                }
              }
              else {
                if (this.CommonFunctionService.getObjectValue("_id", element) == this.CommonFunctionService.getObjectValue('_id', row)) {
                  this.gridData[i] = element
                  const grid_data = JSON.parse(JSON.stringify(this.gridData[i]))
                  grid_data.selected = true;
                  this.gridData[i] = grid_data;
                }
              }
            });
          });
        }
      }
    }
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
    this.selecteData = alert.selectedData;
    this.field = alert.field;
    if (alert.object) {
      this.parentObject = alert.object;
    }
    if (alert.field.onchange_api_params == "" || alert.field.onchange_api_params == null) {
      this.gridData = JSON.parse(JSON.stringify(alert.selectedData));
    }
    else {
      this.gridData = [];
    }
    if (this.field.gridColumns && this.field.gridColumns.length > 0) {
      this.field.gridColumns.forEach(field => {
        if (this.coreFunctionService.isNotBlank(field.show_if)) {
          if (!this.CommonFunctionService.showIf(field, this.parentObject)) {
            field['display'] = false;
          } else {
            field['display'] = true;
          }
        } else {
          field['display'] = true;
        }
      });
      this.listOfGridFieldName = this.field.gridColumns;
      this.gridViewModalSelection.show();
    } else {
      this.notificationService.notify("bg-danger", "Grid Columns are not available In This Field.")
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
  selectGridData() {
    this.selectedData = [];
    if (this.grid_row_selection == false) {
      this.selectedData = [...this.gridData];
    }
    else {
      this.gridData.forEach(row => {
        if (row.selected) {
          this.selectedData.push(row);
        }
      });
    }
    let check = 0;
    let validation = {
      'msg' : ''
    }
    if(this.field && this.field.mendetory_fields && this.field.mendetory_fields.length > 0){            
      if(this.selectedData && this.selectedData.length > 0){
        this.field.mendetory_fields.forEach(mField => {
          const fieldName = mField.field_name;
          this.selectedData.forEach((row,i) => {
            let checkDisable = this.isDisable(mField,row);
            if(row && !checkDisable && (row[fieldName] == undefined || row[fieldName] == '' || row[fieldName] == null)){
              if(validation.msg == ''){
                const rowNo = i + 1;
                validation.msg = mField.label+'( '+rowNo+' ) is required.';
              }
              check = 1;
            }
          });
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
    this.gridData = [];
    this.selectedData = [];
    this.selecteData = [];
    this.data = '';
    this.dataShareService.setIsGridSelectionOpenOrNot(true);
    this.gridViewModalSelection.hide();
  }

  getValueForGrid(field, object) {
    return this.CommonFunctionService.getValueForGrid(field, object);
  }
  getValueForGridTooltip(field, object) {
    return this.CommonFunctionService.getValueForGridTooltip(field, object);
  }
  //SELECT ALL FUNCTIONLITY

  getCorrectIndex(data, indx){
    let index;
    if (data._id != undefined) {
      index = this.CommonFunctionService.getIndexInArrayById(this.gridData, data._id);
    } else if (this.field.matching_fields_for_grid_selection && this.field.matching_fields_for_grid_selection.length > 0) {
      this.gridData.forEach((row, i) => {
        var validity = true;
        this.field.matching_fields_for_grid_selection.forEach(matchcriteria => {
          if (this.CommonFunctionService.getObjectValue(matchcriteria, data) == this.CommonFunctionService.getObjectValue(matchcriteria, row)) {
            validity = validity && true;
          }
          else {
            validity = validity && false;
          }
        });
        if (validity == true) {
          index = i;
        }
      });
    } else {
      index = indx;
    } 
    return index;
  }

  toggle(data, event: MatCheckboxChange, indx) {
    let index = this.getCorrectIndex(data,indx);
    if (event.checked) {
      this.gridData[index].selected = true;
    } else {
      this.gridData[index].selected = false;
    }
    //console.log(this.selected3);
  }
  // exists(item) {
  //   return this.selectedData.indexOf(item) > -1;
  // };
  checkDisableRowIf(index){
    const data = this.gridData[index];
    return this.checkRowIf(data);
    
  }
  checkRowIf(data){
    let check = false;
    if(data.selected){
      let condition = '';
      if(this.field.disableRowIf && this.field.disableRowIf != ''){
        condition = this.field.disableRowIf;
      }
      if(condition != ''){
        if(this.CommonFunctionService.checkDisableRowIf(condition,data)){
          check = true;
        }else{
          check = false;
        }
      }
    }
    return check;
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
          }
        });
      }
    } else {
      if (this.gridData.length > 0) {
        this.gridData.forEach((row,i) => {
          if(!this.checkDisableRowIf(i)){
            row.selected = false;
          }
        });
      }
    }
    //console.log(this.selected3);
  }

  calculateNetAmount(data, fieldName, index) {

    this.CommonFunctionService.calculateNetAmount(data, fieldName, fieldName["grid_cell_function"]);
  }
  getGridColumnWidth(column) {
    if (column.width && column.width != '0') {
      return column.width;
    } else {
      if (this.listOfGridFieldName.length > 8) {
        return '150px';
      } else {
        return '';
      }
    }
  }
  applyOnGridFilter(field) {
    if (field && field.etc_fields && field.etc_fields.on_grid_filter === 'false') {
      return false;
    }
    return true;
  }
  applyOnGridFilterLabel(field) {
    if (field && field.etc_fields && field.etc_fields.on_grid_filter_label != '') {
      return field.etc_fields.on_grid_filter_label;
    }
    return "Search Parameter ...";
  }

  isDisable(field, object) {
    const updateMode = false;
    let disabledrow = false;
    if (field.is_disabled) {
      return true;
    } 
    if(this.field.disableRowIf && this.field.disableRowIf != ''){
      disabledrow = this.checkRowIf(object);
    }
    if(disabledrow){
      return true;
    }
    if (field.etc_fields && field.etc_fields.disable_if && field.etc_fields.disable_if != '') {
      return this.CommonFunctionService.isDisable(field.etc_fields, updateMode, object);
    }   
    return false;
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

  checkDataAlreadyAddedInListOrNot(primary_key,incomingData,alreadyDataAddedlist){
    if(alreadyDataAddedlist == undefined){
      alreadyDataAddedlist = [];
    }
    let alreadyExist = "false";
    if(typeof incomingData == 'object'){
      alreadyDataAddedlist.forEach(element => {
        if(element._id == incomingData._id){
          alreadyExist =  "true";
        }
      });
    }
    else if(typeof incomingData == 'string'){
      alreadyDataAddedlist.forEach(element => {
        if(typeof element == 'string'){
          if(element == incomingData){
            alreadyExist =  "true";
          }
        }else{
          if(element[primary_key] == incomingData){
            alreadyExist =  "true";
          }
        }
      
      });
    }else{
      alreadyExist =  "false";
    }
    if(alreadyExist == "true"){
      return true;
    }else{
      return false;
    }
  }
  fieldButtonLabel(field){
    if(field && field.grid_selection_button_label != null && field.grid_selection_button_label != ''){
      return field.grid_selection_button_label;
    }else{
      return field.label;
    }
  }


}


function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
