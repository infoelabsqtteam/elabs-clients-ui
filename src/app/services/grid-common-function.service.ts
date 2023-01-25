import { Injectable } from '@angular/core';
import { CommonFunctionService } from './common-utils/common-function.service';
import { CoreFunctionService } from './common-utils/core-function/core-function.service';

@Injectable({
  providedIn: 'root'
})
export class GridCommonFunctionService {

constructor(
  private CommonFunctionService:CommonFunctionService,
  private coreFunctionService:CoreFunctionService
) { }
  modifyGridData(gridData,gridColumns,field){
    let modifiedData = [];
    if(gridColumns.length > 0){      
      for (let i = 0; i < gridData.length; i++) {
        const row = gridData[i];
        let modifyRow = JSON.parse(JSON.stringify(row));
        for (let j = 0; j < gridColumns.length; j++) {
          const column = gridColumns[j];          
          modifyRow[column.field_name] = this.CommonFunctionService.getValueForGrid(column,row);
          modifyRow["tooltip"] = this.CommonFunctionService.getValueForGridTooltip(column,row);
          modifyRow["disabled"] = this.checkRowIf(row,field);
        }
        modifiedData.push(modifyRow);
      }
    }
    return modifiedData;
  }
  checkRowIf(data,field){
    let check = false;
    if(data.selected){
      let condition = '';
      if(field.disableRowIf && field.disableRowIf != ''){
        condition = field.disableRowIf;
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
  getListByKeyValueToList(list,key,value){
    let getlist = [];
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      if(element && element[key] == value){
        getlist.push(element);
      }
    }
    return getlist;
  }
  modifyGridColumns(gridColumns,parentObject){
    let modifyGridColumns = [];
    if(gridColumns && gridColumns.length > 0){
      modifyGridColumns = this.CommonFunctionService.updateFieldInList('display',gridColumns);
      for (let i = 0; i < modifyGridColumns.length; i++) {
        const field = modifyGridColumns[i];
        if (this.coreFunctionService.isNotBlank(field.show_if)) {
          if (!this.CommonFunctionService.showIf(field, parentObject)) {
            field['display'] = false;
          } else {
            field['display'] = true;
          }
        } else {
          field['display'] = true;
        }
        if(field['field_class']){
          field['field_class'] = field['field_class'].trim();
        }
        field['width'] = this.getGridColumnWidth(field,gridColumns);
      };
    }
    return modifyGridColumns;
  }
  getGridColumnWidth(column,listOfGridFieldName) {
    if (column.width && column.width != '0') {
      return column.width;
    } else {
      if (listOfGridFieldName.length > 8) {
        return '150px';
      } else {
        return '';
      }
    }
  }
  updateGridDataToModifiedData(grid_row_selection,gridData,modifiedGridData,editableGridColumns){  
    let gridSelectedData = []; 
    let modifiedSelectedData = [];
    if (grid_row_selection == false) {
      gridSelectedData = [...gridData];
      modifiedSelectedData = [...modifiedGridData];
    }
    else {
      gridSelectedData = this.getListByKeyValueToList(gridData,"selected",true); 
      modifiedSelectedData = this.getListByKeyValueToList(modifiedGridData,"selected",true);
    } 
    if(editableGridColumns.length > 0){  
      gridSelectedData.forEach((data,i) => {
        editableGridColumns.forEach(column => {
          gridSelectedData[i][column.field_name] = modifiedSelectedData[i][column.field_name];
        });
      });
    }  
    return gridSelectedData;  
  }
  getCorrectIndex(data, indx,field,gridData,filterValue){
    let index;
    if (field.matching_fields_for_grid_selection && field.matching_fields_for_grid_selection.length > 0) {
      gridData.forEach((row, i) => {
        var validity = true;
        field.matching_fields_for_grid_selection.forEach(matchcriteria => {
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
    }else if (data._id != undefined) {
      index = this.CommonFunctionService.getIndexInArrayById(gridData, data._id);
    } else {
      index = indx;
    } 
    if(index && index != indx && filterValue == ''){
      index = indx;
    }
    return index;
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
  // fieldButtonLabel(field){
  //   if(field && field.grid_selection_button_label != null && field.grid_selection_button_label != ''){
  //     return field.grid_selection_button_label;
  //   }else{
  //     return field.label;
  //   }
  // }

}
