import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DatePipe, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { StorageService } from '../../services/storage/storage.service';
import { CoreFunctionService } from '../common-utils/core-function/core-function.service';

import { CustomvalidationService } from '../customvalidation/customvalidation.service';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { isArray } from 'util';
import { NotificationService } from '../notify/notification.service';
import { ApiService } from '../api/api.service';
import { ModelService } from '../model/model.service';
import { EnvService } from '../env/env.service';
import { I } from '@angular/cdk/keycodes';
import { Common } from 'src/app/shared/enums/common.enum';


@Injectable({
  providedIn: 'root'
})
export class CommonFunctionService {
  userInfo: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  pageNumber: number = Common.PAGE_NO;
  itemNumOfGrid: any = Common.ITEM_NUM_OF_GRID;

  constructor(
    private formBuilder: FormBuilder, 
    private storageService: StorageService, 
    private modalService: ModelService, 
    private datePipe: DatePipe, 
    private CurrencyPipe: CurrencyPipe, 
    private _snackBar: MatSnackBar, 
    private titlecasePipe: TitleCasePipe,
    private customvalidationService:CustomvalidationService,
    private http: HttpClient,
    private notificationService:NotificationService,
    private apiService:ApiService,
    private coreFunctionService:CoreFunctionService,
    private envService:EnvService
    ) {
    this.userInfo = this.storageService.GetUserInfo();
  }

  getRefcode() {
    this.userInfo = this.storageService.GetUserInfo();
    if (this.userInfo != null && this.userInfo != undefined && this.userInfo.refCode) {
      return this.userInfo.refCode;
    } else {
      return null;
    }
  }
  getAppId() {
    this.userInfo = this.storageService.GetUserInfo();
    if (this.userInfo != null && this.userInfo != undefined && this.userInfo.appId) {
      return this.userInfo.appId;
    } else {
      return null;
    }
  }
  createFormControl(forControl, field, object, type) {
    let disabled = field.is_disabled ? true : ((field.disable_if != undefined && field.disable_if != '') ? true : false);
    switch (type) {
      case "list":
        forControl[field.field_name] = this.formBuilder.array(object, this.validator(field))
        break;
        case 'checkbox':
          forControl[field.field_name] = new FormControl({ value: object, disabled: disabled }, this.validator(field))
          break;
      case "text":
        switch (field.type) {
          case "gst_number":
            forControl[field.field_name] = new FormControl({ value: object, disabled: disabled },this.validator(field),this.customvalidationService.isValidGSTNumber.bind(this.customvalidationService))
            break;
          case "api":
            switch (field.api_call_name) {
              case "gst_number":
                forControl[field.field_name] = new FormControl({ value: object, disabled: disabled },this.validator(field),this.customvalidationService.isValidGSTNumber.bind(this.customvalidationService))
                break;            
              default:
                forControl[field.field_name] = new FormControl({ value: object, disabled: disabled }, this.validator(field))
                break;
            }
              forControl[field.field_name] = new FormControl({ value: object, disabled: disabled },this.validator(field),this.customvalidationService.isValidGSTNumber.bind(this.customvalidationService))
              break;
          case "typeahead":
            switch (field.datatype) {
              case 'object':
                forControl[field.field_name] = new FormControl({ value: object, disabled: disabled },this.validator(field),this.customvalidationService.isValidData.bind(this.customvalidationService))
                break;            
              default:
                forControl[field.field_name] = new FormControl({ value: object, disabled: disabled }, this.validator(field))
                break;
            }
            break;       
          default:
            forControl[field.field_name] = new FormControl({ value: object, disabled: disabled }, this.validator(field))
            break;
        }
        break;
      case "group":
        forControl[field.field_name] = this.formBuilder.group(object)
        break;
      default:
        break;
    }
  }
  validator(field) {
    const validator = []
    if (field.is_mandatory != undefined && field.is_mandatory) {
      switch (field.type) {
        case "grid_selection":
        case "list_of_string":
          break;
        case "typeahead":
          if (field.datatype != 'list_of_object' && field.datatype != 'chips') {
            validator.push(Validators.required)
          }
          break;
        case 'checkbox':
          validator.push(Validators.requiredTrue)
          break;
        case "email":
          validator.push(Validators.required)
          validator.push(Validators.email);
          break;
        default:
          validator.push(Validators.required)
          break;
      }
    }else{
      switch (field.type){
        case "email":
          validator.push(Validators.email);
          break;
        default:
          break; 
      }
    }    
    if (field.min_length != undefined && field.min_length != null && field.min_length != '' && Number(field.min_length) && field.min_length > 0) {
      validator.push(Validators.minLength(field.min_length))
    }
    if(field.max_length != undefined && field.max_length != null && field.max_length != '' && Number(field.max_length) && field.max_length > 0){
      validator.push(Validators.maxLength(field.max_length))
    }       
    return validator;
  }

  getPaylodWithCriteria(params, callback, criteria, object,data_template?) {
    const tabName =  this.storageService.GetActiveMenu();
    let tab = '';
    if(tabName && tabName.name && tabName.name != ''){
      tab = tabName.name;
    }
    let staticModal = {
      "key": this.getRefcode(),
      "key2": this.storageService.getAppId(),
      "value": params,
      "log": this.storageService.getUserLog(),
      "crList": [],
      "module": this.storageService.getModule(),
      "tab": tab
    }
    if(data_template){
      staticModal['data_template'] = data_template;
    }
    if(callback && callback != ''){
      staticModal['key3'] = callback;
    }
    if(params.indexOf("FORM_GROUP") >= 0 || params.indexOf("QTMP") >= 0){
      staticModal["data"]=object;
    }
    if (criteria && criteria.length > 0) {
      const crList = this.getCriteriaList(criteria,object);
      if(crList && crList.length > 0){
        crList.forEach(element => {
          staticModal.crList.push(element);
        });
      }      
    }    
    return staticModal;
  }
  getTabsCountPyload(tabs){
    let payloads = [];
    if(tabs && tabs.length >= 1 ){      
      tabs.forEach(element => {
        let grid_api_params_criteria = [];
        if(this.isGridFieldExist(element,"api_params_criteria")){
          grid_api_params_criteria = element.grid.api_params_criteria;
        }
        const payload = this.getPaylodWithCriteria(element.tab_name,element.tab_name+"_"+element.name,grid_api_params_criteria,{});
        payload['countOnly'] = true;
        payloads.push(payload);
      }); 
    }
    if(payloads && payloads.length > 0){
      this.apiService.getGridCountData(payloads);
    } 
  }
  getCriteriaList(criteria,object){
    const crList = [];    
    criteria.forEach(element => {
      const criteria = element.split(";");
      const fValue = criteria[2]
      let fvalue ='';
      if(criteria[3] && criteria[3] == 'STATIC'){
        fvalue = fValue;
      }else{
        fvalue = this.getObjectValue(fValue, object)
      }
      const list = {
        "fName": criteria[0],
        "fValue": fvalue,
        "operator": criteria[1]
      }
      crList.push(list);
    });
    return crList;
  }

  getObjectValue(field, object) {
    let result = object;
    if (field && field != null && field != '' && field != " ") {

      let list = field.split(".")
      for (let index = 0; index < list.length; index++) {
        result = result[list[index]]
        if (result === null || result === undefined) {
          return result;
        }
      }
      return result;
    }
    return "";
  }

  getddnDisplayVal(val) {
    if (val && val.name) {
      return val.name;
    } else if (val && val.label) {
      return val.label;
    } else if (val && val.field_name) {
      return val.field_name;
    } else {
      return val;
    }
  }

  showIf(field, formValue) {
    if (field.show_if && field.show_if != null && field.show_if != '') {
      const showIf = field.show_if.split(';')
      let checkIf = true;
      for (let index = 0; index < showIf.length; index++) {
        checkIf = this.checkIfConditionForArrayListValue(showIf[index], formValue);
        if (!checkIf) {
          return;
        }
      }
      if (checkIf) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
  checkIfConditionForArrayListValue(data, formValue){
    let condition = []
    condition = data.split('#');
    if (condition.length == 4 && condition[3] != 'dynamic' && condition[3] != 'STATIC') {
      let check = "";
      let checkList = [];      
      let setValue = formValue ? this.getObjectValue(condition[0], formValue) : "";
      if(setValue && setValue.length > 0){
        for (let index = 0; index < setValue.length; index++) {
          const element = setValue[index];
          let value = this.getObjectValue(condition[3],element);
          if(value && value != ''){
            check = check + value + "#";
            for (let index = 0; index < condition.length; index++) {
              const conditons = condition[index];
              if(index == 1){
                check = check + conditons + '#';
              }else if(index == 2){
                check = check + conditons + '#STATIC';
              }        
            }
            checkList.push(check);
            check = "";
          }else{
            return false;
          }
        }        
      }else{
        return false;
      }
      if(checkList && checkList.length > 0){
        for (let index = 0; index < checkList.length; index++) {
          const condition = checkList[index];
          let result = this.checkIfCondition(condition,formValue);
          if(result){
            return true;
          }
        }
        return false;
      }else{
        return false;
      }
    }else{
      return this.checkIfCondition(data,formValue);
    }

  }
    calculateAdditionalCost(obj){
    
    let list = obj['additional_cost'];
    let sum = 0;
    let net_amt = obj['net_amount'];
    if(list != null && list.length > 0){
      list.forEach(element => {
        sum += +(element.amount);
      });
    }
    

    let final_amt = sum+net_amt;
    obj['sampling_charge'] = sum;
    obj['final_amount'] = final_amt;
    
   return obj;

  }


  isDisable(tableField, updateMode, formValue) {
    if (tableField.is_disabled) {
      return true;
    } else {
      if (tableField.disable_if && tableField.disable_if != '') {
        return this.checkIfCondition(tableField.disable_if, formValue)
      }
     
      if (updateMode) {
        if (tableField.disable_on_update != undefined && tableField.disable_on_update) {
          return this.checkAddUpdateIf(tableField,'can_update_if');
        } else {
          return false;
        }
      } else {
        if (tableField.disable_on_add != undefined && tableField.disable_on_add) {
          return this.checkAddUpdateIf(tableField,'can_add_if');
        }else{
          return false;
        }
      }
    }
  }
  is_check_role(id) {
    const userInfo = this.storageService.GetUserInfo();
    let check = 0;
    if (userInfo.roles && userInfo.roles != null && userInfo.roles != "" && Array.isArray(userInfo.roles) && userInfo.roles.length > 0) {
      for (let index = 0; index < userInfo.roles.length; index++) {
        const element = userInfo.roles[index];
        if (element._id == id) {
          check = 1;
          break;
        } else {
          check = 0;
        }
      }
    } else {
      check = 0;
    }
    if(check == 1){
      return true;
    }else{
      return false;
    }
  }
  isMendetory(tableField, formValue) {
    if (tableField.is_mandatory) {
      return true;
    } else {
      if (tableField.mandatory_if && tableField.mandatory_if != '') {
        return this.checkIfCondition(tableField.mandatory_if, formValue)
      }else {
        return false;
      }
    }
  }

  checkIfCondition(data, formValue) {
    let condition = []
    condition = data.split('#')
    if (condition.length >= 2) {
      if(condition[3] != null && condition[3] != "" && condition[3] == 'dynamic'){
        condition[2] = this.getObjectValue(condition[2], formValue)+"";
      }
      let setValue = "";
      if(condition.length > 3 && condition[3] == 'STATIC'){
        setValue = condition[0];
      }else{
        setValue = formValue ? this.getObjectValue(condition[0], formValue) : "";
      }      
      if (setValue === undefined || setValue === "") {
        setValue = "";
      } else {
        setValue = setValue + "";
      }
      switch (condition[1]) {
        case 'eq':
        case 'equal':
          if (condition.length > 2) {
            //console.log('setValue');
            return setValue === condition[2];
          } else {
            return JSON.parse(setValue);
          }
        case 'in':
          if ((condition[2].split(":")).includes(setValue)) {
            return true;
          } else {
            return false;
          }
          case 'nin':
            if (!(condition[2].split(":")).includes(setValue)) {
              return true;
            } else {
              return false;
            }
      
       
        case 'gte':
          return parseFloat(setValue) >= parseFloat(condition[2]);
        case 'lte':
          return parseFloat(setValue) <= parseFloat(condition[2]);
        case 'exists':
          if (setValue != null && setValue != undefined && setValue != '' && setValue != 'null') {
            return true;
          } else {
            return false;
          }
        case 'notexist':
          if (setValue == null || setValue == undefined || setValue == '' || setValue == 'null') {
            return true;
          } else {
            return false;
          }
        case "neq":
        case "notequal":
          if (condition.length > 2) {
            //console.log('setValue');
            return !(setValue === condition[2]);
          } else {
            return !JSON.parse(setValue);
          }
        default:
          return false;
      }
    } else {
      return true;
    }
  }

  checkAddUpdateIf(tableField,fieldName){
    let fieldValue = tableField[fieldName];
    if (fieldValue != undefined && fieldValue.has_role != null && fieldValue.has_role != undefined && Array.isArray(fieldValue.has_role) && fieldValue.has_role.length > 0) {
      let check = 0;
      for (let index = 0; index < fieldValue.has_role.length; index++) {
        const element = fieldValue.has_role[index];
        if (this.is_check_role(element._id)) {
          check = 1;
          break;
        } else {
          check = 0;
        }
      }
      if(check == 1){
        return false;
      }else{
        return true;
      }
    } else {
      return true;
    }
  }

  openTreeModal(fieldLabel, ddnField, modalName) {
    const alertData = {
      "event": true,
      "fieldName": fieldLabel,
      "ddnFieldName": ddnField
    }
    this.modalService.open(modalName, alertData);
  }

  getfilterCrlist(headElements,formValue) {
    const filterList = []
    if(formValue != undefined){
      const criteria = [];
      headElements.forEach(element => {        
        switch (element.type.toLowerCase()) {
          case "text":
          case "tree_view_selection":
          case "dropdown":
            if(formValue && formValue[element.field_name] && formValue[element.field_name] != ''){              
              if(isArray(element.api_params_criteria) && element.api_params_criteria.length > 0 && element.type != 'dropdown'){
                element.api_params_criteria.forEach(cri => {
                  criteria.push(cri)
                });
              }else if (element.multi_select && element.datatype == "object"){
               let fvalue = '';
               const value = formValue[element.field_name];
               if(value && value.length > 0){
                 value.forEach((vl,i) => {
                   if((value.length - 1) == i){
                      fvalue = fvalue + vl;
                   }else{
                      fvalue = fvalue + vl + ":";
                   }
                 });
               }
               filterList.push(
                {
                    "fName": element.field_name,
                    "fValue": fvalue,
                    "operator": "in"
                  }
                )
              }
              else{
                filterList.push(
                  {
                    "fName": element.field_name,
                    "fValue": this.getddnDisplayVal(formValue[element.field_name]),
                    "operator": "stwic"
                  }
                )
              }
            }
            break;
          case "number":
              if(formValue && formValue[element.field_name] && formValue[element.field_name] != ''){              
                if(isArray(element.api_params_criteria) && element.api_params_criteria.length > 0){
                  element.api_params_criteria.forEach(cri => {
                    criteria.push(cri)
                  });
                }else{
                  filterList.push(
                    {
                      "fName": element.field_name,
                      "fValue": this.getddnDisplayVal(formValue[element.field_name]),
                      "operator": "eq"
                    }
                  )
                }
              }
              break;
          case "typeahead":
            if(formValue && formValue[element.field_name] && formValue[element.field_name] != ''){ 
              if(isArray(element.dataFilterCriteria) && element.dataFilterCriteria.length > 0){
                element.dataFilterCriteria.forEach(cri => {
                  criteria.push(cri)
                });
              }else{
                filterList.push(
                  {
                    "fName": element.field_name,
                    "fValue": this.getddnDisplayVal(formValue[element.field_name]),
                    "operator": "stwic"
                  }
                )
              }
            }
            break;
          case "info":
            if(formValue && formValue[element.field_name] && formValue[element.field_name] != ''){              
              if(isArray(element.api_params_criteria) && element.api_params_criteria.length > 0){
                element.api_params_criteria.forEach(cri => {
                  criteria.push(cri)
                });
              }else{
                filterList.push(
                  {
                    "fName": element.field_name,
                    "fValue": this.getddnDisplayVal(formValue[element.field_name]),
                    "operator": "stwic"
                  }
                )
              }
            }
            break;
            case "reference_names":
            case "chips":
            if(formValue && formValue[element.field_name] && formValue[element.field_name] != ''){              
              if(isArray(element.api_params_criteria) && element.api_params_criteria.length > 0){
                element.api_params_criteria.forEach(cri => {
                  criteria.push(cri)
                });
              }else{
                filterList.push(
                  {
                    "fName": element.field_name+".name",
                    "fValue": this.getddnDisplayVal(formValue[element.field_name]),
                    "operator": "stwic"
                  }
                )
              }
            }
            break;
          case "date":
          case "datetime":
            if(formValue && formValue[element.field_name] && formValue[element.field_name] != ''){
              if(isArray(element.api_params_criteria) && element.api_params_criteria.length > 0){
                element.api_params_criteria.forEach(cri => {
                  criteria.push(cri)
                });
              }else{
                filterList.push(
                  {
                    "fName": element.field_name,
                    "fValue": this.dateFormat(formValue[element.field_name]),
                    "operator": "eq"
                  }
                )
              }
            }
            break;
          case "daterange":
            if(formValue && formValue[element.field_name] && formValue[element.field_name].start != '' && formValue[element.field_name].end != null){              
              if(isArray(element.api_params_criteria) && element.api_params_criteria.length > 0){
                element.api_params_criteria.forEach(cri => {
                  criteria.push(cri)
                });
              }else{
                filterList.push(
                  {
                    "fName": element.field_name,
                    "fValue": this.dateFormat(formValue[element.field_name].start),
                    "operator": "gte"
                  }
                ) 
              }          
            }
            if(formValue && formValue[element.field_name] && formValue[element.field_name].end != '' && formValue[element.field_name].end != null){
              if(isArray(element.api_params_criteria) && element.api_params_criteria.length > 0){
                element.api_params_criteria.forEach(cri => {
                  criteria.push(cri)
                });
              }else{
                filterList.push(
                  {
                    "fName": element.field_name,
                    "fValue": this.dateFormat(formValue[element.field_name].end),
                    "operator": "lte"
                  }
                )
              }
            }
            break;
          default:
            break;
        }
      });
      if(criteria && criteria.length > 0){
        const crList = this.getCriteriaList(criteria,formValue);
        if(crList && crList.length > 0){
          crList.forEach(element => {
            filterList.push(element);
          });
        }
      }
    }
    return filterList;
  }
  dateFormat(value) {
    return this.datePipe.transform(value, 'dd/MM/yyyy')

  }

  commanApiPayload(headElement,tableField,actionButton,object?){
    const staticModalGroup = [];
    let staticModal = {};
    if(headElement.length > 0){
      headElement.forEach(element => {
        if (element.api_params && element.api_params != '') {
          let call_back_field =  '';
          let criteria = [];
          if(element.call_back_field && element.call_back_field != ''){
            call_back_field =  element.call_back_field;
          }
          if(element.api_params_criteria && element.api_params_criteria != ''){
            criteria =  element.api_params_criteria;
          }
          staticModal = this.getPaylodWithCriteria(element.api_params,call_back_field,criteria,object?object:{});  
          if(element.adkey && element.adkey != '' && element.adkey != null){
            staticModal['adkeys'] = element.adkey;
            staticModalGroup.push(staticModal);
          }else{
            staticModalGroup.push(staticModal);
          }      
          
        }
        
      });
    }

    if(actionButton.length > 0){
      actionButton.forEach(element => {
        if (element.api_params && element.api_params != '') {
          let call_back_field =  '';
          let criteria = [];
          if(element.call_back_field && element.call_back_field != ''){
            call_back_field =  element.call_back_field;
          }
          if(element.api_params_criteria && element.api_params_criteria != ''){
            criteria =  element.api_params_criteria;
          }
          const staticModal = this.getPaylodWithCriteria(element.api_params,call_back_field,criteria,object?object:{});        
          
          staticModalGroup.push(staticModal);
        }
      });
    }

    if(tableField.length > 0){
      
      tableField.forEach(element => {
        let call_back_field =  '';
        let criteria = [];
        if (element.api_params && element.api_params != '' && element.type != "typeahead") {          
          if(element.call_back_field && element.call_back_field != ''){
            call_back_field =  element.call_back_field;
          }
          if(element.api_params_criteria && element.api_params_criteria != ''){
            criteria =  element.api_params_criteria;
          }
          const staticModal = this.getPaylodWithCriteria(element.api_params,call_back_field,criteria,object?object:{},element.data_template);
          if(element.api_params.indexOf("html_view") >= 0){
            staticModal["data"]=object;
          }
          staticModalGroup.push(staticModal);
        }
        switch (element.type) {            
          case "list_of_fields":
          case "group_of_fields":
            if (element.list_of_fields.length > 0) {
              element.list_of_fields.forEach((data) => {
                let call_back_field =  '';
                let criteria = [];
                if (data.api_params && data.api_params != '' && data.type != "typeahead") {

                  if(data.call_back_field && data.call_back_field != ''){
                    call_back_field =  data.call_back_field;
                  }
                  if(data.api_params_criteria && data.api_params_criteria != ''){
                    criteria =  data.api_params_criteria;
                  }
                  const staticModalListOfFields = this.getPaylodWithCriteria(data.api_params,call_back_field,criteria,object?object:{},element.data_template);
                  if(data.api_params.indexOf("html_view") >= 0){
                    staticModalListOfFields["data"]=object;
                  }
                  staticModalGroup.push(staticModalListOfFields);
                }
              });
            }
            break;
            case "stepper":
            if (element.list_of_fields.length > 0) {
              element.list_of_fields.forEach((step) => {
                step.list_of_fields.forEach((data) => {
                  let call_back_field =  '';
                  let criteria = [];
                  if (data.api_params && data.api_params != '' && data.type != "typeahead") {

                    if(data.call_back_field && data.call_back_field != ''){
                      call_back_field =  data.call_back_field;
                    }
                    if(data.api_params_criteria && data.api_params_criteria != ''){
                      criteria =  data.api_params_criteria;
                    }
                    const staticModalListOfFields = this.getPaylodWithCriteria(data.api_params,call_back_field,criteria,object?object:{},element.data_template);
                    if(data.api_params.indexOf("html_view") >= 0){
                      staticModalListOfFields["data"]=object;
                    }
                    staticModalGroup.push(staticModalListOfFields);
                  }
                });
              });
            }
            break;
          default:
            break;
        }
      });
    }
    return staticModalGroup;
  }
  getDivClass(field,fieldsLangth){
    const fields = {...field}
    if (!fields.type) {
      fields.type = "text";
    }
    if(fields.field_class && field.field_class != ''){
      return fields.field_class;
    }    
    switch (fields.type) {
      case "list_of_checkbox":        
      case "list_of_fields":
      case "html":
      case "label":
      case "grid_selection":
      case "tabular_data_selector":
      case "group_of_fields":
        return "col-lg-12";
      default: 
        if(fieldsLangth <= 5){
          return "col-lg-12";
        }else if(fieldsLangth <= 10){
          return "col-lg-6";
        }else{       
          return "col-lg-3";
        }
    }
  }

  getFixedDivClass(field,fieldsLangth){
    const fields = {...field}
    if (!fields.type) {
      fields.type = "text";
    }
    if(fields.field_class && field.field_class != ''){
      return fields.field_class;
    }
  }

  getButtonDivClass(field){
    const fields = {...field}    
    if(fields.field_class && field.field_class != ''){
      return fields.field_class;
    }
    return;

  }

  getConvertedString(ja, incomingTemplate){
    let template = "" + incomingTemplate;
    let reg = new RegExp("(\\[)(.*?)(\\])");

    let matcher = template.match(reg);
    let group = reg.exec(template);
    console.log(matcher.groups);

    let listMatches = [];
    // while(matcher.find){
      listMatches.push(matcher[2]);
    // }
   
    listMatches.forEach(element => {
      let valueObj = null;
      let details = matcher[2];
      let valueString = this.getStringValue(details, ja);
      template = template.replace("[" + matcher[2] + "]", valueString);
    });
   
    return template;
  }

  getStringValue(details,ja){
    //ja -> object
    //deatils -> pattern
    let valueConfig = details.split(",");
    return this.getObjectValue(valueConfig[0], ja)
  }


  getValueForGrid(field, object) {
    let value = '';
    if (field && field.field_name != undefined && field.field_name != null && field.field_name != '') {
      value = this.getObjectValue(field.field_name, object)
    }
    if (!field.type) field.type = "Text";
    switch (field.type.toLowerCase()) {
      case 'datetime': return this.datePipe.transform(value, 'dd/MM/yyyy h:mm a');
      case 'date': return this.datePipe.transform(value, 'dd/MM/yyyy');
      case 'time': return this.datePipe.transform(value, 'h:mm a');
      case "boolean": return value ? "Yes" : "No";
      case "currency": return this.CurrencyPipe.transform(value, 'INR');
  	  case "dropdown": return this.getddnDisplayVal(value);
      case "info":
        if (value && value != '') {
          return '<i class="fa fa-eye"></i>';
        } else {
          return '-';
        }
      case "file":
        if (value && value != '') {
          return '<span class="material-icons cursor-pointer">text_snippet</span>';
        } else {
          return '-';
        }
      case "template":
        if (value && value != '') {
          return '<i class="fa fa-file cursor-pointer" aria-hidden="true"></i>';
        } else {
          return '-';
        }
      case "image":
        return '<img src="data:image/jpg;base64,' + value + '" />';
      case "icon":
        return '<span class="material-icons cursor-pointer">' + field.field_class + '</span>';
      case "download_file":
        if (value && value != '') {
          return '<span class="material-icons cursor-pointer">' + field.field_class + '</span>';
        }else{
          return '-';
        }
      case "trim_of_string":
        if(value != undefined && value != null && value != ''){
          if(typeof value == 'string'){
            let stringObject = value.split('/');
            if(stringObject.length > 0){
              return stringObject[0]
            }else{
              return value;
            } 
          }else{
            return value;
          }
        }else{
          return value;
        }

      case "color":
        break;

      case "pattern":
        if(object != null){
          return this.getConvertedString(object,field.field_name);
        }

      case "chips":
        if(this.coreFunctionService.isNotBlank(value) && Array.isArray(value)){
          let name = "";
          for(let i=0 ;i<value.length; i++){
            if(this.coreFunctionService.isNotBlank(value[i]['name'])){
              name = name+', '+value[i]['name'];
            }else{
              name = name+', '+value[i];
            }
          }
          return name.substring(2);;
        }
        return "-";
      case "reference_names":
        if(this.coreFunctionService.isNotBlank(value) && Array.isArray(value)){
          let name = '';
          for(let i=0 ;i<value.length; i++){
            if(this.coreFunctionService.isNotBlank(value[i]['name'])){
              name = name+', '+value[i]['name'];
            }
          }
          if(name.length > 1){
            name = name.substring(2);
          }
          return name;
        }else{
          return "-";
        }
          


      default: return value;
    }
  }
  getValueForGridTooltip(field, object) {
    let value = '';
    if (field.field_name != undefined && field.field_name != null && field.field_name != '') {
      value = this.getObjectValue(field.field_name, object)
    }
    if (!field.type) field.type = "Text";
    switch (field.type.toLowerCase()) {
      case 'datetime': return this.datePipe.transform(value, 'dd/MM/yyyy h:mm a');
      case 'date': return this.datePipe.transform(value, 'dd/MM/yyyy');
      case 'time': return this.datePipe.transform(value, 'h:mm a');
      case "boolean": return value ? "Yes" : "No";
      case "currency": return this.CurrencyPipe.transform(value, 'INR');
      case "info":        
          return '';
      case "file":
          return '';
      case "template":
          return '';
      case "image":
          return '';
      case "icon":
          return '';
      default: return value;
    }
  }
  getTemData(tempName) {
    const params = "form_template";
    const criteria = ["name;eq;"+tempName+";STATIC"];
    const payload = this.getPaylodWithCriteria(params,'',criteria,{});
    // const getTemplates = {
    //   crList: [{
    //     "fName": "name",
    //     "fValue": tempName,
    //     "operator": "eq"
    //   }],
    //   key2: this.storageService.getAppId(),
    //   refCode: this.getRefcode(),
    //   log: this.storageService.getUserLog(),
    //   value: "form_template"
    // }
    return payload;
  }
  sanitizeObject(tableFields, formValue, validatField,formValueWithCust?) {
    for (let index = 0; index < tableFields.length; index++) {
      const element = tableFields[index];  
      if(element.type != 'list_of_fields' && element.type != 'group_of_fields'){  
        switch (element.datatype) {
          case "list_of_object":
          case "chips":
          case "chips_with_mask":
            if(validatField){            
              if(formValue[element.field_name] != "" && formValue[element.field_name] != null &&  !Array.isArray(formValue[element.field_name])){
                return {'msg':'Entered value for '+element.label+' is not valid. !!!'}
              }else if(this.applicableForValidation(element) && !Array.isArray(formValueWithCust[element.field_name]) && formValueWithCust[element.field_name].length <= 0){
                return {'msg':'Please Enter '+ element.label + '. !!!'}
              }
            }else if (formValue[element.field_name] == "" && !Array.isArray(formValue[element.field_name])) {     
              formValue[element.field_name] = null;
            }
            break;
          case "object":
            if(validatField){
              if(formValue[element.field_name] != "" && formValue[element.field_name] != null && typeof formValue[element.field_name] != 'object'){
                return {'msg':'Entered value for '+element.label+' is not valid. !!!'}
              }else if(this.applicableForValidation(element) && typeof formValue[element.field_name] != 'object'){
                return {'msg':'Please Enter '+ element.label + '. !!!'}
              }
            }else if (formValue[element.field_name] == "" && typeof formValue[element.field_name] != 'object') {
              formValue[element.field_name] = null;
            }
            break;
          case "number":
            if (!Number(formValue[element.field_name])) {
              formValue[element.field_name] = 0;
            }
            if(this.applicableForValidation(element) && formValue[element.field_name]<=0){
              return {'msg':' ' +element.label + ' should be greater than 0. !!!'}
            }
            break
          default:
            break;
        }
      }
      switch (element.type) {
        case "list_of_string":
          if(validatField){
            if(formValue[element.field_name] != "" && formValue[element.field_name] != null){
              return {'msg':'Entered value for '+element.label+' is not valid. !!!'}
            }else if(this.applicableForValidation(element) && !Array.isArray(formValueWithCust[element.field_name]) && formValueWithCust[element.field_name].length > 0){
              return {'msg':'Please Enter '+ element.label + '. !!!'}
            }
          }else if (formValue[element.field_name] == "" && !Array.isArray(formValue[element.field_name])) {
            formValue[element.field_name] = null;
          }
          break;
        case "file":
          if (formValue[element.field_name] == "") {
            formValue[element.field_name] = null;
          }
          break;
        case "list_of_fields":
          if(validatField){
            if(this.applicableForValidation(element)){
              if(element.datatype != 'key_value'){
                if(formValueWithCust[element.field_name] == null || !Array.isArray(formValueWithCust[element.field_name]) || formValueWithCust[element.field_name].length <= 0){
                  return {'msg': element.label + ' is required.'}
                }
              }else if(element.datatype == 'key_value'){
                if(typeof formValueWithCust[element.field_name] != 'object' || Object.keys(formValueWithCust[element.field_name]).length <= 0){
                  return {'msg': element.label + ' is required.'}
                }
              }             
            }
          }else{
            if (!Array.isArray(formValue[element.field_name]) || formValue[element.field_name].length <= 0) {
              if (formValue[element.field_name] != null) {
                if (element.datatype == 'key_value' && typeof formValue[element.field_name] == 'object') {
                  const object = formValue[element.field_name]
                  const len = Object.keys(object).length;
                  if (len == 0) {
                    formValue[element.field_name] = null;
                  } else if (object.key != undefined) {
                    if (object.key == '') {
                      formValue[element.field_name] = null;
                    }
                  }
                }
                if (element.datatype != 'key_value') {
                  formValue[element.field_name] = null;
                }
              }
            } else {
              for (let j = 0; j < element.list_of_fields.length; j++) {
                const data = element.list_of_fields[j];
                switch (data.datatype) {
                  case "list_of_object":
                  case "chips":
                  case "chips_with_mask":
                    if (formValue[element.field_name] && formValue[element.field_name].length > 0) {
                      formValue[element.field_name].forEach(fiedlList => {
                        if (fiedlList[data.field_name] == "" && !Array.isArray(fiedlList[data.field_name])) {
                          fiedlList[data.field_name] = null;
                        }
                      });
                    }
                    break;
                  case "object":
                    if (formValue[element.field_name] && formValue[element.field_name].length > 0) {
                      formValue[element.field_name].forEach(fiedlList => {
                        if (fiedlList[data.field_name] == "" && typeof fiedlList[data.field_name] != 'object') {
                          fiedlList[data.field_name] = null;
                        }
                      });
                    }
                    break;
                  case "number":
                    if (formValue[element.field_name] && formValue[element.field_name].length > 0) {
                      formValue[element.field_name].forEach(fiedlList => {
                        if (!Number(fiedlList[data.field_name])) {
                          fiedlList[data.field_name] = 0;
                        }

                      });
                    }
                    break;
                  default:
                    break;
                }
                switch (data.type) {
                  case "list_of_string":
                    if (formValue[element.field_name] && formValue[element.field_name].length > 0) {
                      formValue[element.field_name].forEach(fiedlList => {
                        if (fiedlList[data.field_name] == "" && !Array.isArray(fiedlList[data.field_name])) {
                          fiedlList[data.field_name] = null;
                        }
                      });
                    }
                    break;

                  default:
                    break;
                }
              }
            }
          }
          break;
        case "group_of_fields":
          for (let j = 0; j < element.list_of_fields.length; j++) {
          const data = element.list_of_fields[j];
            switch (data.datatype) {
              case "list_of_object":   
              case "chips":
              case "chips_with_mask":             
                if(validatField){
                  if(formValue[element.field_name][data.field_name] != "" && formValue[element.field_name][data.field_name] != null){
                    return {'msg':'Entered value for '+data.label+' is not valid. !!!'}
                  }else if(this.applicableForValidation(data) && !Array.isArray(formValueWithCust[data.field_name]) && formValueWithCust[data.field_name].length > 0){
                    return {'msg':'Please Enter '+ data.label + '. !!!'}
                  }
                }else if (formValue[element.field_name][data.field_name] == "" && !Array.isArray(formValue[element.field_name][data.field_name])) {
                    formValue[element.field_name][data.field_name] = null;
                  }                
                break;
              case "object":                
                if(validatField){
                  if(formValue[element.field_name][data.field_name] != "" && formValue[element.field_name][data.field_name] != null){
                    return {'msg':'Entered value for '+data.label+' is not valid. !!!'}
                  }else if(this.applicableForValidation(data) && typeof formValue[element.field_name][data.field_name] != 'object'){
                    return {'msg':'Please Enter '+ data.label + '. !!!'}
                  }
                }else if (formValue[element.field_name][data.field_name] == "" && typeof formValue[element.field_name][data.field_name] != 'object') {
                  formValue[element.field_name][data.field_name] = null;
                }
                break;
              case "number":
                if (!Number(formValue[element.field_name][data.field_name])) {
                  formValue[element.field_name][data.field_name] = 0;
                }
                break;
              default:
                break;
            }
            switch (data.type) {
              case "list_of_string":
                if(validatField){
                  if(formValue[element.field_name][data.field_name] != "" && formValue[element.field_name][data.field_name] != null){
                    return {'msg':'Entered value for '+data.label+' is not valid. !!!'}
                  }else if(this.applicableForValidation(data) && !Array.isArray(formValueWithCust[data.field_name]) && formValueWithCust[data.field_name].length > 0){
                    return {'msg':'Please Enter '+ data.label + '. !!!'}
                  }
                }else if (formValue[element.field_name][data.field_name] == "" && !Array.isArray(formValue[element.field_name][data.field_name])) {
                  formValue[element.field_name][data.field_name] = null;
                }
                break;

              default:
                break;
            }
          }
          break;
        case "stepper":
          for (let j = 0; j < element.list_of_fields.length; j++) {
            const step = element.list_of_fields[j];
            if(step.list_of_fields && step.list_of_fields != null && step.list_of_fields.length > 0){
              for (let k = 0; k < step.list_of_fields.length; k++) {
                const data = step.list_of_fields[k];              
                switch (data.datatype) {
                  case "list_of_object":  
                  case "chips":
                  case "chips_with_mask":                  
                    if(validatField){
                      if(formValue[data.field_name] != "" && formValue[data.field_name] != null){
                        return {'msg':'Entered value for '+data.label+' is not valid. !!!'}
                      }else if(this.applicableForValidation(data) && !Array.isArray(formValueWithCust[data.field_name]) && formValueWithCust[data.field_name].length > 0){
                        return {'msg':'Please Enter '+ data.label + '. !!!'}
                      }
                    }else if (formValue[data.field_name] == "" && !Array.isArray(formValue[data.field_name])) {
                      formValue[data.field_name] = null;
                    }
                    break;
                  case "object": 
                    if(validatField){
                      if(formValue[data.field_name] != "" && formValue[data.field_name] != null){
                        return {'msg':'Entered value for '+data.label+' is not valid. !!!'}
                      }else if(this.applicableForValidation(data) && typeof formValue[data.field_name] != 'object'){
                        return {'msg':'Please Enter '+ data.label + '. !!!'}
                      }
                    }else if (formValue[data.field_name] == "" && typeof formValue[data.field_name] != 'object') {
                      formValue[data.field_name] = null;
                    }                    
                    break;
                  case "number":
                    if (!Number(formValue[data.field_name])) {
                      formValue[data.field_name] = 0;
                    }
                    break;
                  default:
                    break;
                }
                switch (data.type) {
                  case "list_of_string":
                    if(validatField){
                      if(formValue[data.field_name] != "" && formValue[data.field_name] != null){
                        return {'msg':'Entered value for '+data.label+' is not valid. !!!'}
                      }else if(this.applicableForValidation(data) && !Array.isArray(formValueWithCust[data.field_name]) && formValueWithCust[data.field_name].length > 0){
                        return {'msg':'Please Enter '+ data.label + '. !!!'}
                      }
                    }else if (formValue[data.field_name] == "" && !Array.isArray(formValue[data.field_name])) {
                      formValue[data.field_name] = null;
                    }
                    break;

                  default:
                    break;
                }
              }
            }
          }
          break;
        default:
          break;
      }
    }
    if(validatField){
      return true;
    }else{
      return formValue;
    }    
  }

  applicableForValidation(field){
    if(field.is_mandatory){
      if(field.show_if != '' && field.show_if != null){
        if(field['display']){
          return true;
        }else{
          return false;
        }
      }else{
        return true;
      }
    }else{
      return false;
    }
  }
  calculateInvoiceOrderAmount(templateForm: FormGroup, field: any) {
    var net_amount = 0;
    var discount_amount = 0;
    var igst_amount = 0;
    var sgst_amount = 0;
    var cgst_amount = 0;
    var netPayable = 0;
    var surcharge = 0;
    var sez_amount = 0;
    var total = 0;

    let templateValue = templateForm.getRawValue();
    if (templateValue['items_list'] != '' && templateValue['items_list'].length > 0) {
      templateValue['items_list'].forEach(element => {
        net_amount = net_amount + element.net_amount;
        discount_amount = discount_amount + element.discount_amount;
        surcharge = surcharge + element.surcharge;
        total = total + element.total;
      });
      if (templateValue['tax_type'] != '' && templateValue['tax_type'] == "GST") {
        sgst_amount = (net_amount * templateValue['tax_percentage']) / 200;
        cgst_amount = sgst_amount;

      }
      else if (templateValue['tax_type'] != '' && templateValue['tax_type'] == "IGST") {
        igst_amount = (net_amount * templateValue['tax_percentage']) / 100;
      }
    }

    netPayable = net_amount + igst_amount + sgst_amount + cgst_amount + sez_amount;

    const fieldWithValue = {
      field: 'total_amount', value: [
        { field: 'taxable_amount', value: net_amount },
        { field: 'sgst_amount', value: sgst_amount },
        { field: 'cgst_amount', value: cgst_amount },
        { field: 'igst_amount', value: igst_amount },
        { field: 'net_payble', value: netPayable },
        { field: 'discount_amount', value: discount_amount },
      ]
    }


    return this.setValueInVieldsForChild(templateForm, fieldWithValue);
  }

  quote_amount_via_sample_no(templateValue,listOfParm){    
    let quantity = templateValue.qty;
    let discount = templateValue.discount_percent;
    let updatedParamsList=[];
    listOfParm.forEach(element => {
      const data = JSON.parse(JSON.stringify(element));
      data['discount_percent'] = discount;
      data['qty'] = quantity;
      this.calculateNetAmount(data,"qty", "");
      updatedParamsList.push(data)
    });
    templateValue["quotation_param_methods"] = updatedParamsList;
    return this.calculateQquoteAmount(templateValue, {field_name:"quotation_param_methods"});
  }
  quote_amount_via_discount_percent(listOfParm,templateValue){    
    let discount = templateValue.discount_percent;
    let quantity = templateValue.qty;
    let updatedParamsList = [];
    listOfParm.forEach(element => {
      const data = JSON.parse(JSON.stringify(element));
      data['discount_percent'] = discount;
      data['qty'] = quantity;
      this.calculateNetAmount(data, "discount_percent","");
      updatedParamsList.push(data);
    });
    templateValue["quotation_param_methods"]=updatedParamsList;
    let total=templateValue["total"];
    let discount_amount=this.getDecimalAmount(total * discount/100);
    let net_amount=total-discount_amount;
    
    let final_amount=net_amount + templateValue["sampling_charge"];
    let unit_price = this.getDecimalAmount(net_amount/templateValue['qty']);

    templateValue['total']=total;
    templateValue['discount_amount']=discount_amount;
    templateValue['net_amount']=net_amount;
    templateValue['final_amount']=final_amount;
    templateValue['unit_price']=unit_price;

    

    return templateValue;

  }
  
  samplingAmountAddition(templateValue){    
    let net_amount = templateValue['net_amount'];
    let sampling_charge = templateValue['sampling_charge'];
    let totl = net_amount+sampling_charge;

    templateValue['final_amount'] = totl
    return templateValue;
  }
  calculateParameterLimsSegmentWise(lims_segment, data, fieldName){
    switch(lims_segment){
      case 'standard':
        this.calculateQuotationParameterAmountForLims(data, fieldName)
        break;
      case 'automotive':
      this.calculateQuotationParameterAmountForAutomotiveLims(data,fieldName)
        break
    }

  }

  calculate_quotation(templateValue,lims_segment, field: any) {
    var total = 0;
    let discount_percent = 0;
    let net_amount = 0;
    let sampling_amount = 0;
    let final_amount = 0;
    let discount_amount = 0;
    let quotation_param_methods = [];
    let unit_price = 0;
    let paramArray = [];
    let gross_amount=0;
    let field_name = field.field_name;
    let qty = 0;
    let product_wise_pricing = templateValue['product_wise_pricing'];
    let current_disount = 0;
    if(this.coreFunctionService.isNotBlank(templateValue['discount_percent'])){
      current_disount = templateValue['discount_percent'];
    }

    if(this.coreFunctionService.isNotBlank(templateValue.qty)){
      qty = templateValue.qty;
    }

    if (templateValue['quotation_param_methods'] != '' && templateValue['quotation_param_methods'].length > 0) {
      templateValue['quotation_param_methods'].forEach(element => {
        let data = { ...element};
        paramArray.push(data);
      });
    }



    if (templateValue['sampling_charge'] && templateValue['sampling_charge'] != null) {
      sampling_amount = templateValue['sampling_charge'];
    }
    // if(gross_amount>0){
      if(true){
        switch(field_name){
          case 'parameter_array':
            unit_price = 0;
            if(this.coreFunctionService.isNotBlank(templateValue.unit_price)){
              unit_price = templateValue.unit_price;
            }
            if(product_wise_pricing){
              net_amount = qty*unit_price;
              paramArray.forEach(data => {
                this.calculateParameterLimsSegmentWise(lims_segment, data, "qty");
                gross_amount = gross_amount+data['total'];
              })
              discount_amount=gross_amount-net_amount;
              discount_percent =  this.getDiscountPercentage(current_disount, discount_amount, gross_amount, qty)
              paramArray.forEach(data => {
                data.discount_percent = this.getDecimalAmount(+discount_percent);
                this.calculateParameterLimsSegmentWise(lims_segment, data, "discount_percent");
              })
            
          }else{
            if (paramArray.length > 0) {
              discount_amount=0;
              net_amount=0;
              total=0;
              gross_amount=0;
              if(this.coreFunctionService.isNotBlank(templateValue.qty)){
                qty = templateValue.qty;
              }
              paramArray.forEach(data => {
                if(lims_segment == 'standard'){
                  data['qty'] = qty;
                  this.calculateParameterLimsSegmentWise(lims_segment, data, 'qty');
                }
                gross_amount = gross_amount+data['total'];
                net_amount=net_amount+data['net_amount'];
                discount_amount=discount_amount+data['discount_amount'];
              });
            }
           
            }
            discount_percent =  this.getDiscountPercentage(current_disount, discount_amount, gross_amount, qty)
            templateValue['discount_amount'] = discount_amount ;
            templateValue['net_amount'] = net_amount ;
            templateValue['discount_percent'] = discount_percent ;
          break;

          case 'discount_percent':
            discount_percent = templateValue[field_name];
            paramArray.forEach(data => {
              data.discount_percent = this.getDecimalAmount(+discount_percent);
              this.calculateParameterLimsSegmentWise(lims_segment, data, field_name);
              gross_amount = gross_amount+data['total'];
            })
            discount_amount=gross_amount*discount_percent/100;
            net_amount=gross_amount-discount_amount;
            templateValue['discount_amount'] = discount_amount ;
            templateValue['net_amount'] = net_amount ;
            templateValue['discount_percent'] = discount_percent;
            break;

            case 'discount_amount':
              discount_amount = templateValue[field_name];
               paramArray.forEach(data => {
                data.discount_percent = this.getDecimalAmount(+discount_percent);
                this.calculateParameterLimsSegmentWise(lims_segment, data, "discount_percent");
                gross_amount = gross_amount+data['total'];
              })
              discount_percent =  this.getDiscountPercentage(current_disount, discount_amount, gross_amount, qty)
              net_amount=gross_amount-discount_amount;
              templateValue['discount_amount'] = discount_amount ;
              templateValue['net_amount'] = net_amount ;
              templateValue['discount_percent'] = discount_percent;
              break;


          case 'net_amount':
            discount_percent = 0;
            net_amount=templateValue[field_name];
            paramArray.forEach(data => {
              data.discount_percent = this.getDecimalAmount(+discount_percent);
              this.calculateParameterLimsSegmentWise(lims_segment, data, "qty");
              gross_amount = gross_amount+data['total'];
            })
          
           
            discount_amount=gross_amount-net_amount;
            discount_percent =  this.getDiscountPercentage(current_disount, discount_amount, gross_amount, qty)
            paramArray.forEach(data => {
              data.discount_percent = this.getDecimalAmount(+discount_percent);
              this.calculateParameterLimsSegmentWise(lims_segment, data, "discount_percent");
            })
          
           templateValue["discount_percent"]=discount_percent;
            templateValue["discount_amount"]=discount_amount;
            templateValue['net_amount'] = net_amount ;
            break;

          case 'unit_price':
            unit_price = 0;
            if(this.coreFunctionService.isNotBlank(templateValue.unit_price)){
              unit_price = templateValue.unit_price;
            }
            net_amount=qty*unit_price;
            

            paramArray.forEach(data => {
              data.discount_percent = this.getDecimalAmount(+discount_percent);
              this.calculateParameterLimsSegmentWise(lims_segment, data, "qty");
              gross_amount = gross_amount+data['total'];
            })
            discount_amount = gross_amount-net_amount;
            discount_percent =  this.getDiscountPercentage(current_disount, discount_amount, gross_amount, qty)
            paramArray.forEach(data => {
              data.discount_percent = this.getDecimalAmount(+discount_percent);
              this.calculateParameterLimsSegmentWise(lims_segment, data, "unit_price");
            })
            templateValue['discount_amount'] = discount_amount ;
            templateValue['net_amount'] = net_amount ;
            templateValue['discount_percent'] = discount_percent;
            break;

            default:
              discount_amount=0;
              net_amount=0;
            if (paramArray.length > 0) {
              paramArray.forEach(data => {
                data['qty'] = qty;
                this.calculateParameterLimsSegmentWise(lims_segment, data, field_name);
               gross_amount = gross_amount+data['total'];
                net_amount=net_amount+data['net_amount'];
                discount_amount=discount_amount+data['discount_amount'];
              });
            }
            if(product_wise_pricing){
              unit_price = templateValue["unit_price"];
              net_amount = unit_price*qty;
              discount_amount = gross_amount-net_amount;
              discount_percent =  this.getDiscountPercentage(current_disount, discount_amount, gross_amount, qty)
              if (paramArray.length > 0) {
                paramArray.forEach(data => {
                  data['discount_percent'] = discount_percent;
                  this.calculateParameterLimsSegmentWise(lims_segment, data, "unit_price");
                });
              }
            }
            discount_percent =  this.getDiscountPercentage(current_disount, discount_amount, gross_amount, qty)
              templateValue['discount_amount'] = discount_amount ;
              templateValue['net_amount'] = net_amount ;
              templateValue['discount_percent'] = discount_percent;

          }
        
      }

      final_amount = net_amount + sampling_amount;
        if(templateValue['qty'] > 0){
          unit_price = this.getDecimalAmount(net_amount/templateValue['qty']);
        }else{
          unit_price = templateValue["unit_price"];
        }

        templateValue['total'] = gross_amount;
        templateValue['discount_amount'] = this.getDecimalAmount(discount_amount);
        templateValue['net_amount'] = this.getDecimalAmount(net_amount);
        templateValue['discount_percent'] = this.getDecimalAmount(discount_percent);
        templateValue['final_amount'] = this.getDecimalAmount(final_amount);
        templateValue['unit_price'] =  unit_price;
        if(paramArray.length > 0){
          templateValue['quotation_param_methods'] = paramArray;
        }

      return templateValue;

  }
 
  calculate_lims_invoice(templateValue,lims_segment, calculate_on_field: any) {
   
    if(calculate_on_field == null || calculate_on_field == ''){
      calculate_on_field = 'items_list';
    }
    let	surcharge	=0;
    let	gross_amount	=0;
    let	discount_percent	=0;
    let	discount_amount	=0;
    let	taxable_amount	=0;
    let	net_amount	=0;
   
        if (this.coreFunctionService.isNotBlank(templateValue[calculate_on_field]) && templateValue[calculate_on_field].length > 0) {
          templateValue[calculate_on_field].forEach(element => {
            if(this.coreFunctionService.isNotBlank(element.total)){
              // gross_amount=gross_amount+element.gross_amount
              gross_amount=gross_amount+element.total
            }
            if(this.coreFunctionService.isNotBlank(element.sampling_charge)) {
              // surcharge=surcharge+element.surcharge
              surcharge=surcharge+element.sampling_charge
            }
            if(this.coreFunctionService.isNotBlank(element.discount_amount)){
              discount_amount=discount_amount+element.discount_amount
            }
            if(this.coreFunctionService.isNotBlank(element.net_amount)){
              net_amount=net_amount+element.net_amount
            }else{
              net_amount=net_amount+element.total
            }
              taxable_amount=net_amount+surcharge;
          });
        }
        this.update_invoice_totatl(templateValue,gross_amount,discount_amount,discount_percent,net_amount,surcharge,taxable_amount);
         return templateValue;
      }

getPercent(templateValue,parent,field){
  const calculateValue = {};
  if(field && field.calSourceTarget && field.calSourceTarget.length >= 1){
    let source = field.calSourceTarget[0].source;
    let target = field.calSourceTarget[0].target;
    let sourceValue = this.getObjectValue(source,templateValue);
    if(sourceValue && sourceValue != ''){
      if(typeof sourceValue == 'number'){
        let fileName = field.field_name;
        let percent:any;
        if(parent != ''){
          percent = templateValue[parent.field_name][fileName]
        }else{
          percent = templateValue[fileName]
        }
        if(typeof sourceValue == 'number' && percent && percent >= 1 ){
          let percentValue = sourceValue * percent / 100;
          let targetFields = target.split('.');
          if(targetFields && targetFields.length == 2){
            const parent = targetFields[0];
            const child = targetFields[1];
            calculateValue[parent] = {};
            calculateValue[parent][child] = percentValue
          }else{
            const child = targetFields[0];
            calculateValue[child] = percentValue
          }
        }
      }else{
        this.notificationService.notify('bg-danger', 'Source Value is not a number.')
      }
    }else{
      this.notificationService.notify('bg-danger', 'Source Field is Required.')
    }
  }

  return calculateValue;
}
update_invoice_total_on_custom_field(templateValue,lims_segment, field: any){
    let total =templateValue['total_amount'];
    let	surcharge	=total['surcharge'];
    let	gross_amount	=total['gross_amount'];
    let	discount_percent	=total['discount_percent'];
    let	discount_amount=	total['discount_amount'];
    let	taxable_amount=	total['taxable_amount'];
    let	net_amount	=total['net_amount'];
   
 if(gross_amount){
  switch(field.field_name){
    case 'discount_percent': 
          if(discount_percent!=0){
            discount_amount = gross_amount*discount_percent/100;
          }else{
          discount_amount = 0;
          }
    break;
    case 'surcharge': 
    if(!surcharge){
       surcharge = 0;
    }
break;
    case 'discount_amount': 
          if(discount_amount){   
             discount_percent = discount_amount*100/gross_amount;
          }else{
            discount_percent=0;
          }
    break;
 }
}else{

  discount_percent=0;
  discount_amount=0;
}

  net_amount =gross_amount-discount_amount;
  taxable_amount = gross_amount-discount_amount+surcharge;
  this.update_invoice_totatl(templateValue,gross_amount,discount_amount,discount_percent,net_amount,surcharge,taxable_amount);
       
  return templateValue;
 }


update_invoice_totatl(templateValue,gross_amount,discount_amount,discount_percent,net_amount,surcharge,taxable_amount){
  let	gst_amount	=0;
  let	cgst_amount	=0;
  let	sgst_amount	=0;
  let	igst_amount	=0;
  let	tax_amount	=0;
  let	sez_amount	=0;

  let	net_payble	=0;
  
  let	igst_percent	=0;
  let	gst_percent	=0;
  let	sez_percent	=0;
  let cgst_percent=0;
  let sgst_percent=0;
  let tax_percentage = 0;
  let tax_type = templateValue['tax_type'];
  
  if(this.coreFunctionService.isNotBlank(templateValue.tax_percentage)){
    tax_percentage = templateValue.tax_percentage;
  }
   
  if((tax_type==null || tax_type==undefined || tax_type=='NA') && tax_percentage==0)
  {
    net_payble = taxable_amount;
  }
  else
  {
    switch(tax_type){
      case "GST" :
       gst_amount = taxable_amount * tax_percentage/100;
       gst_percent=tax_percentage;
       cgst_percent = gst_percent/2;
       sgst_percent= gst_percent/2;
       cgst_amount = gst_amount/2;
       sgst_amount = gst_amount/2;
       net_payble = taxable_amount+gst_amount;
       tax_amount=gst_amount;
       igst_amount=0;
       igst_percent=0;

        break;
      case "IGST" :
        igst_amount = taxable_amount * tax_percentage/100;
        igst_percent=tax_percentage;
        net_payble = taxable_amount+igst_amount;
        tax_amount=igst_amount;
        break;
        default :  

  }
  }
    if(gross_amount>0){
      discount_percent = this.getDecimalAmount(100*discount_amount/gross_amount);
    }
    let total ={};
    total['surcharge'] = this.getDecimalAmount(surcharge);
    total['igst_percent'] = this.getDecimalAmount(igst_percent);
    total['gst_percent'] = this.getDecimalAmount(gst_percent);
    total['cgst_percent'] = this.getDecimalAmount(cgst_percent);
    total['sgst_percent'] = this.getDecimalAmount(sgst_percent);
    
    total['sez_percent'] = this.getDecimalAmount(sez_percent);
    total['gross_amount'] = this.getDecimalAmount(gross_amount);
    total['discount_percent'] = this.getDecimalAmount(discount_percent);
    total['discount_amount'] = this.getDecimalAmount(discount_amount);
    total['taxable_amount'] = this.getDecimalAmount(taxable_amount);
    total['gst_amount'] = this.getDecimalAmount(gst_amount);
    total['cgst_amount'] = this.getDecimalAmount(cgst_amount);
    total['sgst_amount'] = this.getDecimalAmount(sgst_amount);
    total['igst_amount'] = this.getDecimalAmount(igst_amount);
    total['tax_amount'] = this.getDecimalAmount(tax_amount);
    total['sez_amount'] = this.getDecimalAmount(sez_amount);
    total['net_amount'] = this.getDecimalAmount(net_amount);
    total['net_payble'] = this.getDecimalAmount(net_payble);

    templateValue['total_amount'] = total;
    return templateValue;
  
}

      calculate_po_row_item(templateValue,lims_segment, calculate_on_field: any){
        var po_items = templateValue['po_items'];

        var qty= po_items['qty'];
        var cost= po_items['cost'];
        if(qty && cost){ 
          po_items['total'] = qty*cost;
        }else{
          po_items['total'] =0;
        }
        po_items['discount_amount'] =0;
        po_items['net_amount'] = po_items['total'];
        templateValue['po_items']=po_items;

      return templateValue;
       
      }


  calculate_lims_invoice_with_po_items(templateValue,lims_segment, calculate_on_field: any){
    return this.calculate_lims_invoice(templateValue,lims_segment, 'po_items')
  }


  getDiscountPercentage(current_disount, discount_amount, gross_amount, quantity){
    if(quantity >0 && gross_amount > 0){
      current_disount = discount_amount*100/gross_amount;
    }
    return current_disount;
  }

  calculateQquoteAmount(templateValue, field: any) {
    var total = 0;
    let discount_percent = 0;
    let net_amount = 0;
    let sampling_amount = 0;
    let final_amount = 0;
    let discount_amount = 0;
    let quotation_param_methods = [];
    let unit_price = 0;
    
    if (templateValue['quotation_param_methods'] != '' && templateValue['quotation_param_methods'].length > 0) {
      templateValue['quotation_param_methods'].forEach(element => {
        total = total + element.quotation_effective_rate;
      });
    }

    if (templateValue['sampling_charge'] && templateValue['sampling_charge'] != null) {
      sampling_amount = templateValue['sampling_charge'];
    }
    if(total>0){
      if (templateValue[field.field_name] != ''){
        if(field.field_name==='discount_percent'){
          discount_percent = templateValue[field.field_name];
          discount_amount=total*discount_percent/100;
          net_amount=total-discount_amount;
          quotation_param_methods = [];
          templateValue['quotation_param_methods'].forEach(element => {
            const new_element = { ...element };
            new_element.discount_percent = this.getDecimalAmount(+discount_percent);
            this.calculateNetAmount(new_element, "qty", "");
            quotation_param_methods.push(new_element);
          })
          templateValue['quotation_param_methods'].setValue(quotation_param_methods);
          this.calculateQquoteAmount(templateValue, {field_name:"quotation_param_methods"});
        }else if(field.field_name==='net_amount'){
          discount_percent = 0;
          net_amount=templateValue[field.field_name];
          discount_amount=total-net_amount;
          discount_percent =this.getDecimalAmount(100*discount_amount/total);  
          templateValue["discount_percent"]=discount_percent;
          let updatedData = this.quote_amount_via_discount_percent(templateValue["quotation_param_methods"],templateValue)
          updatedData[field.field_name] = net_amount
          return updatedData;        
         }else if(field.field_name==='quotation_param_methods'){
            let list=templateValue[field.field_name];
            list.forEach(element => {
              const new_element={...element};
              discount_amount = discount_amount + element.discount_amount
              net_amount = net_amount + element.net_amount;
            });
            discount_percent =100*discount_amount/total;
        }else {
            total = templateValue['total'];
            discount_amount = templateValue['discount_amount'];
            net_amount = templateValue['net_amount'];
            discount_percent = templateValue['discount_percent'];

        }
        final_amount = net_amount + sampling_amount;
        unit_price = this.getDecimalAmount(net_amount/templateValue['qty']);
        quotation_param_methods = [];
        templateValue['quotation_param_methods'].forEach(element => {
          const new_element = { ...element };
          new_element.discount_percent = this.getDecimalAmount(+element.discount_percent);
          new_element.net_amount = this.getDecimalAmount(+(element.quotation_effective_rate * (1 - element.discount_percent / 100)));
          new_element.discount_amount = this.getDecimalAmount(+(element.quotation_effective_rate * element.discount_percent / 100));
          if(new_element.qty>0){
            new_element.per_sample_net_rate = this.getDecimalAmount(+(new_element.net_amount / new_element.qty));
          }
          quotation_param_methods.push(new_element);
        });
        templateValue['total'] = total;
        templateValue['discount_amount'] = this.getDecimalAmount(discount_amount);
        templateValue['net_amount'] = this.getDecimalAmount(net_amount);
        templateValue['discount_percent'] = this.getDecimalAmount(discount_percent);
        templateValue['final_amount'] = this.getDecimalAmount(final_amount);
        templateValue['unit_price'] =  unit_price;
        if(quotation_param_methods.length > 0){
          templateValue['quotation_param_methods'] = quotation_param_methods;
        }        
          
        }
      }
      return templateValue;
    
  }
  calculate_pharma_claim_values(new_element : any){
        if(new_element.claim_dependent && !isNaN(new_element.claim_percent)){
                    if( !isNaN(+new_element.limit_from)){
                      if(this.coreFunctionService.isNotBlank(new_element.claim_percent)){
                          new_element.claim_limit_from = (+new_element.limit_from)*(new_element.claim_percent)/100;
                            if(new_element.claim_unit){
                                new_element.claim_limit_from = new_element.claim_limit_from + " " +new_element.claim_unit;
                            }
                    }else{
                        new_element.claim_limit_from =new_element.limit_from;
                    }
                  }
                    if( !isNaN(+new_element.limit_to)){
                      if(this.coreFunctionService.isNotBlank(new_element.claim_percent)){
                        new_element.claim_limit_to = (+new_element.limit_to)*(new_element.claim_percent)/100;
                         if(new_element.claim_unit){
                            new_element.claim_limit_to = new_element.claim_limit_to + " " +new_element.claim_unit;
                         }
                    }else{
                        new_element.claim_limit_to =new_element.limit_to;
                    }
                  }
        }
  }

  
  

  

  calculateParameterAmtOnInjection(data,rate,quantity){
            let totalInjection = data.no_of_injection;
            if(!this.coreFunctionService.isNotBlank(totalInjection)){
              totalInjection = 0;
            }

            if(!this.coreFunctionService.isNotBlank(rate)){
                rate = 0;
              }
              let rate_per_injection = rate;
              let totalAmount = this.getDecimalAmount(totalInjection*rate_per_injection);
              if(data.no_of_injection2 > 0){
                let no_of_injection2 = data.no_of_injection2;
                if(quantity > 1 && no_of_injection2>0){
                  totalInjection = this.getDecimalAmount(totalInjection + (quantity-1)*no_of_injection2);
                  totalAmount = this.getDecimalAmount(totalInjection * rate_per_injection);
                }
              }else{
                totalAmount = this.getDecimalAmount(quantity*totalInjection * rate_per_injection);
              }
              // data["quotation_effective_rate"]= totalAmount;
              // data["total"] = totalAmount;
              // data["discount_amount"] = this.getDecimalAmount((data.total* data.discount_percent)/100);
              // data["net_amount"] = this.getDecimalAmount(data.total- data.discount_amount);
              data["total_injection"] = totalInjection;
              return totalAmount;
  }

  calculateNetAmount(data, fieldName,grid_cell_function) {
  switch(grid_cell_function){
    case "calculateQuotationParameterAmountForAutomotiveLims":
      this.calculateQuotationParameterAmountForAutomotiveLims(data, fieldName["field_name"]);
      break

    case "calculateQuotationParameterAmountForLims":
      this.calculateQuotationParameterAmountForLims(data, fieldName["field_name"])
        break;

    case "calculate_pharma_claim_values":
      this.calculate_pharma_claim_values(data);
      break;

      case "calculate_invoice_amount_row_wise":
      this.calculate_invoice_amount_row_wise(data,fieldName["field_name"]);
      break;

      default:
      this.legacyQuotationParameterCalculation(data,fieldName["field_name"]);
  }

  }

  calculate_invoice_amount_row_wise(data,fieldName){
    let total = 0;
    let disc_per = 0;
    let disc_amt = 0;
    let final_amt = 0;
    let net_amount=0;
    let surcharge = 0;
    if(this.coreFunctionService.isNotBlank(data.total)){
      total = data.total;
    }
    if(this.coreFunctionService.isNotBlank(data.discount_amount)){
      disc_amt = data.discount_amount;
    }
    if(this.coreFunctionService.isNotBlank(data.sampling_charge)){
      surcharge = data.sampling_charge;
    }
    if(this.coreFunctionService.isNotBlank(data.discount_percent)){
      disc_per = data.discount_percent;
    }
 

    let incoming_field = fieldName;
    switch(incoming_field){
      case "total":
          disc_amt =disc_per*total/100;
          net_amount=total - disc_amt;
          final_amt = surcharge+net_amount;
         // disc_per = (disc_amt/(data.total))*100;
        break;
      case "discount_percent":
        disc_amt =disc_per*total/100;
        net_amount=total - disc_amt;
        final_amt = surcharge+net_amount;
        break;
      case "discount_amount":
        disc_per = (100*disc_amt)/total;
        net_amount=total - disc_amt;
        final_amt = surcharge+net_amount;
        break;
      case "sampling_charge":
        disc_per = (100*disc_amt)/total;
        net_amount=total - disc_amt;
        final_amt = surcharge+net_amount;
        break;
    }

    data["discount_percent"] = disc_per;
    data["discount_amount"] = disc_amt;
    data["final_amount"] = final_amt;
    data["net_amount"] = net_amount;

  }


  calculateQuotationParameterAmountForLims(data, fieldName){
    let quantity = 0;
    let discount_percent = 0;
    let cost_rate = 0;
    let net_amount = 0;
    let discount_amount = 0;
    let param_quantom = 0;
    let Base_quotation_rate = 0;
    let incoming_field = fieldName;
    let sale_rate=data['sale_rate'];
    let gross_amount=0;
    let effectiveTotal=0;
    let dis_amt = 0;
    quantity = data.qty;
    if (!this.coreFunctionService.isNotBlank(quantity)) {
      quantity=0;
    }
    gross_amount=quantity*sale_rate;

    switch(incoming_field){

        case "qty":
            effectiveTotal = (+quantity) * (+data.offer_rate);
            if(data.no_of_injection > 0){
             this.calculatePharamaParameterAmount(data, data.offer_rate, quantity);

            }
            else{
              dis_amt = gross_amount-effectiveTotal;
              if(gross_amount > 0){
                discount_percent =this.getDecimalAmount(100*dis_amt/gross_amount);
              }else{
                discount_percent=0;
              }
              net_amount= effectiveTotal;
            this.populateParameterAmount(data,net_amount,discount_percent,dis_amt,quantity,gross_amount)

            }
            break;
            case "discount_percent":
            discount_percent = data.discount_percent;
            if (!this.coreFunctionService.isNotBlank(discount_percent)) {
              discount_percent=0;
            }
           if(data.no_of_injection > 0){
            let offeringRate=data.rate_per_injection*(1-discount_percent/100);
            this.calculatePharamaParameterAmount(data, offeringRate, quantity);
              }else{
              dis_amt = this.getDecimalAmount(((+gross_amount) * (+discount_percent)) / 100);
              net_amount = this.getDecimalAmount((+gross_amount) - dis_amt);
              this.populateParameterAmount(data,net_amount,discount_percent,dis_amt,quantity,gross_amount)
              }
            break;

            case "unit_price":
              discount_percent = data.discount_percent;
              if (!this.coreFunctionService.isNotBlank(discount_percent)) {
                discount_percent=0;
              }
             if(data.no_of_injection > 0){
               let offeringRate=data.rate_per_injection*(1-discount_percent/100);
              this.calculatePharamaParameterAmount(data, offeringRate, quantity);
                }else{
                dis_amt = this.getDecimalAmount(((+gross_amount) * (+discount_percent)) / 100);
                net_amount = this.getDecimalAmount((+gross_amount) - dis_amt);

                this.populateParameterAmount(data,net_amount,discount_percent,dis_amt,quantity,gross_amount)
                }
              break;

          case "offer_rate"  :
            let offer_rate = data.offer_rate;
            if (!this.coreFunctionService.isNotBlank(offer_rate)) {
              offer_rate=0;
            }
          if(data.no_of_injection > 0){

            this.calculatePharamaParameterAmount(data, offer_rate, quantity);

            }else{
                if(offer_rate){
                  effectiveTotal=quantity*offer_rate;
                  dis_amt=gross_amount-effectiveTotal;
                  if(gross_amount > 0){
                    discount_percent =this.getDecimalAmount(100*dis_amt/gross_amount);
                  }else{
                    discount_percent=0;
                  }
                  net_amount = gross_amount-dis_amt;
                }
              this.populateParameterAmount(data,net_amount,discount_percent,dis_amt,quantity,gross_amount);
              data["offer_rate"] = offer_rate;
           }
             break;
            case "discount_amount"  :
              dis_amt = data.discount_amount;
              if (!this.coreFunctionService.isNotBlank(dis_amt)) {
                dis_amt=0;
              }
              if(data.no_of_injection > 0){
                if(!this.coreFunctionService.isNotBlank(data['rate_per_injection'])){
                  data['rate_per_injection'] = 0;
                }
              let offeringRate=data['rate_per_injection']-dis_amt;
              this.calculatePharamaParameterAmount(data, offeringRate, quantity,incoming_field);
            }else{
              effectiveTotal = gross_amount-dis_amt;
                net_amount =effectiveTotal;
                if(gross_amount>0){
                  discount_percent = this.getDecimalAmount(((+dis_amt) * 100) / (+gross_amount));
              }else{
                discount_percent=0;
              }
              this.populateParameterAmount(data,net_amount,discount_percent,dis_amt,quantity,gross_amount)
            }
            break;

    }


  }
  populateParameterAmount(data,net_amount,discount_percent,discount_amount,quantity,gross_amount){
    data['net_amount'] = this.getDecimalAmount(net_amount);
    if(data['total_injection'] && data['total_injection'] > 0){
      data['per_sample_net_rate'] =   this.getDecimalAmount(data['net_amount'] / data['total_injection']);
      data["offer_rate"] = data["per_sample_net_rate"];
    }
    else if(data['qty']>0){
      data['per_sample_net_rate'] =   this.getDecimalAmount(data['net_amount'] / data['qty']);
      data["offer_rate"] = data["per_sample_net_rate"];
    }else{
      data['per_sample_net_rate'] =0;
    }
    
    data['discount_percent'] = this.getDecimalAmount(discount_percent);
    data['discount_amount'] = this.getDecimalAmount(+discount_amount);
    data['qty'] = quantity;
    data['total'] = this.getDecimalAmount(gross_amount);
    data['quotation_effective_rate'] =  this.getDecimalAmount(gross_amount);
    
  }
  calculateQuotationParameterAmountForAutomotiveLims(data, fieldName){
    let quantity = 0;
    let discount_percent = 0;
    let cost_rate = 0;
    let net_amount = 0;
    let param_quantom = 0;
    let Base_quotation_rate = 0;
    let incoming_field = fieldName;

    let gross_amount=0;
    let dis_amt = 0;
    switch(incoming_field){
       case "parameter_quantum" :
         let parameterQuantum = data.parameter_quantum;
          if (!this.coreFunctionService.isNotBlank(parameterQuantum)) {
            parameterQuantum=0;
          }
            data['quantum_rate'] = (+data.quotation_rate) * (+parameterQuantum);
            data['quotation_effective_rate'] = (+data.qty) * (+data.quantum_rate);
            net_amount = +data.quotation_effective_rate
            if (data.discount_percent) {
              let discount = ((+data.quotation_effective_rate) * (+data.discount_percent)) / 100;
              data['discount_amount'] = discount;
              net_amount = (+data.quotation_effective_rate) - discount;
            }
            data['net_amount'] = net_amount

          break;
        case "qty":
        let quantity = data.qty;
          if (!this.coreFunctionService.isNotBlank(quantity)) {
            quantity=0;
          }

               data['quotation_effective_rate'] = (+quantity) * (+data.quantum_rate);
              if (data.discount_percent) {
                let discount = this.getDecimalAmount((+data.quotation_effective_rate) * (+data.discount_percent)) / 100;
                data['discount_amount'] = discount;
              }
              net_amount = this.getDecimalAmount((+data.quotation_effective_rate) - data['discount_amount']);
              data['net_amount'] = net_amount
              data['total'] = +data.quotation_effective_rate;
              data['qty'] = data.qty

            break;
            case "discount_percent":
            let discount_per = data.discount_percent;
          if (!this.coreFunctionService.isNotBlank(discount_per)) {
            discount_per=0;
          }
              data['quotation_effective_rate'] = (+data.qty) * (+data.quantum_rate);
              net_amount = +data.quotation_effective_rate
              let discount = this.getDecimalAmount(((+data.quotation_effective_rate) * (+discount_per)) / 100);
              data['discount_amount'] = discount;
              net_amount = this.getDecimalAmount((+data.quotation_effective_rate) - discount);
              data['net_amount'] = net_amount
              data['total'] = +data.quotation_effective_rate;
              data['qty'] = data.qty;
              data['discount_percent'] = +discount_per;

            break;

           case "discount_amount"  :
            let discount_amt = data.discount_amount;
            if (!this.coreFunctionService.isNotBlank(discount_amt)) {
              discount_amt=0;
            }

                net_amount = (+data.quotation_effective_rate) - (+discount_amt);
                let discount_perc = this.getDecimalAmount(((+discount_amt) * 100) / (+data.quotation_effective_rate));
                data['net_amount'] = net_amount;
                data['discount_percent'] = discount_perc;
                data['discount_amount'] = +data['discount_amount'];

            break;
            default:

    }
    if(data['qty']>0){
      data['per_sample_net_rate'] =   this.getDecimalAmount(data['net_amount'] / data['qty']);
    }else{
      data['per_sample_net_rate'] = 0;
    }
  this.sanitizeParameterAmount(data);
  }

  calculatePharamaParameterAmount(data, offer_rate, quantity,field_name?){
    let gross_amount =  this.calculateParameterAmtOnInjection(data,data["rate_per_injection"],quantity)
    let effectiveTotal = this.calculateParameterAmtOnInjection(data,offer_rate,quantity)
    let dis_amt = gross_amount-effectiveTotal;
    switch (field_name){
      case 'discount_amount':
      effectiveTotal = gross_amount-data['discount_amount'];
      dis_amt = data['discount_amount'];
      break;
      default:

    }
    let discount_percent = 0;
    if(gross_amount > 0){
      discount_percent = (dis_amt/gross_amount)*100;
    }
    else{
      discount_percent=0;
    }
  this.populateParameterAmount(data,effectiveTotal,discount_percent,dis_amt,quantity,gross_amount)
  }


  sanitizeParameterAmount(data){
    let amountFields = [
      'quotation_effective_rate',
      'discount_amount',
      'discount_percent',
      'net_amount',
      'total',
      'per_sample_net_rate'
    ];
    amountFields.forEach(column => {
      data[column] =   this.getDecimalAmount(data[column]);
      if(typeof(data[column]) != 'number'){
        data[column]=0;
      }
    });
  }

  legacyQuotationParameterCalculation(data, fieldName){
    let quantity = 0;
    let discount_percent = 0;
    let cost_rate = 0;
    let net_amount = 0;
    let param_quantom = 0;
    let Base_quotation_rate = 0;
    let incoming_field = fieldName.field_name;
    
    let gross_amount=0; 
    let dis_amt = 0;
    switch(incoming_field){
       case "claim_unit" :
       case "claim_percent" :
        this.calculate_pharma_claim_values(data);
        break;
       case "parameter_quantum" :
          if (data.parameter_quantum) {
            data['quantum_rate'] = (+data.quotation_rate) * (+data.parameter_quantum);
            data['quotation_effective_rate'] = (+data.qty) * (+data.quantum_rate);
            net_amount = +data.quotation_effective_rate
            if (data.discount_percent) {
              let discount = ((+data.quotation_effective_rate) * (+data.discount_percent)) / 100;
              data['discount_amount'] = discount;
              net_amount = (+data.quotation_effective_rate) - discount;
            }
            data['net_amount'] = net_amount
          }
          break;
        case "qty":  
            if (data.qty) {
              if(data.branch && data.branch.name && data.branch.name==="Pune"){
               data['quotation_effective_rate'] = (+data.qty) * (+data.quantum_rate);
            }else{
              data['quotation_effective_rate'] = (+data.qty) * (+data.offer_rate);
            }


            if(data.no_of_injection > 0){
              // this.calculateParameterAmtOnInjection(data);
            }
            else{
              net_amount = +data.quotation_effective_rate
              if (data.discount_percent) {
                let discount = this.getDecimalAmount((+data.quotation_effective_rate) * (+data.discount_percent)) / 100;
                data['discount_amount'] = discount;
                net_amount = this.getDecimalAmount((+data.quotation_effective_rate) - discount);
              }
              data['net_amount'] = net_amount
              data['total'] = +data.quotation_effective_rate;
              data['qty'] = data.qty
            }
            
            }
            break;
            case "discount_percent":  
            if (!data.discount_percent) {
                data.discount_percent=0;
             }if(data.no_of_injection > 0){
              // this.calculateParameterAmtOnInjection(data);
              }else if(data.branch && data.branch.name && data.branch.name==="Pune"){
              data['quotation_effective_rate'] = (+data.qty) * (+data.quantum_rate);
            }else{
              data['quotation_effective_rate'] = (+data.qty) * (+data.offer_rate);
            }
              net_amount = +data.quotation_effective_rate
              let discount = this.getDecimalAmount(((+data.quotation_effective_rate) * (+data.discount_percent)) / 100);
              data['discount_amount'] = discount;
              net_amount = this.getDecimalAmount((+data.quotation_effective_rate) - discount);
              data['discount_percent'] = data.discount_percent;
              data['net_amount'] = net_amount
              data['total'] = +data.quotation_effective_rate;
              data['qty'] = data.qty;
              data['discount_percent'] = +data['discount_percent'];
            
            break;

          case "offer_rate"  :
          if(data.no_of_injection > 0){
              if(data.offer_rate){
                data["rate_per_injection"] = data.offer_rate;
              }

              // this.calculateParameterAmtOnInjection(data);
            }else{
                if(data.offer_rate){
                   gross_amount = this.getDecimalAmount(data.offer_rate * data.qty);
                  if(data.discount_percent && data.discount_percent>0){
                    dis_amt = this.getDecimalAmount((gross_amount*data.discount_percent)/100);
                  }
                  net_amount = gross_amount-dis_amt;
                }
              data['net_amount'] = net_amount;
              data['discount_amount'] = dis_amt;
              data['total'] = gross_amount;
              data['quotation_effective_rate'] =  gross_amount;
           }
             break;
            case "discount_amount"  :
              if ((data.discount_amount == 0) || (data.discount_amount )) {
                net_amount = (+data.quotation_effective_rate) - (+data.discount_amount);
                let discount_per = this.getDecimalAmount(((+data.discount_amount) * 100) / (+data.quotation_effective_rate));
                data['net_amount'] = net_amount;
                data['discount_percent'] = discount_per;
                data['discount_amount'] = +data['discount_amount'];
              }
            break;          

    }
    if(data['qty']>0){
      data['per_sample_net_rate'] =   this.getDecimalAmount(data['net_amount'] / data['qty']);
    }
    let amountFields = [
      'quotation_effective_rate',
      'discount_amount',
      'discount_percent',
      'net_amount',
      'total',
      'per_sample_net_rate'
    ];
    amountFields.forEach(column => {
      data[column] =   this.getDecimalAmount(data[column]);
    });
  }

  populatefields(value, populate_fields,multipleFormCollection?) {
    let obj = {}
    if(populate_fields && populate_fields.length > 0){
      populate_fields.forEach(el =>{
            value = this.getFormDataInMultiformCollection(multipleFormCollection, value);
        let toList = el.to.split(".");
        if(toList && toList.length > 1){
          const parent = toList[0];
          if (!obj[parent]) obj[parent] = {};
          const child = toList[1];
          obj[parent][child] =this.mergeMultiFieldsValues(el.from, value);  
        }else{
          const field = toList[0];
          obj[field] =this.mergeMultiFieldsValues(el.from, value);
        }
      });
    }
    return obj;
  }

  mergeMultiFieldsValues(field, object){
    let result = ""; 
    if(field && field != null && field != '' && field != " "){
      let list = field.split("+")
      for (let index = 0; index < list.length; index++) {
        if(result != ""){
          let lastIndex = list.length - 1;
          result = result + list[lastIndex] + this.getObjectValue(list[index], object);
        }else{
          result = this.getObjectValue(list[index], object);
        }
      }
    }
    return result;
  }

  populate_fields_for_report(templateForm: FormGroup) {
    // templateForm.controls['reporting_fax'].setValue(templateForm.value['fax']);
    templateForm.controls['reporting_mobile'].setValue(templateForm.value['mobile']);
    templateForm.controls['reporting_tel'].setValue(templateForm.value['phone']);

    templateForm.controls['reporting_city'].setValue(templateForm.value['city']);
    templateForm.controls['reporting_state'].setValue(templateForm.value['state']);
    templateForm.controls['reporting_country'].setValue(templateForm.value['country']);

    // templateForm.controls['reporting_address_line2'].setValue(templateForm.value['address_line2']);
    templateForm.controls['reporting_gst'].setValue(templateForm.value['gst_no']);
    templateForm.controls['reporting_contact_person_email'].setValue(templateForm.value['email']);
    templateForm.controls['reporting_address'].setValue(templateForm.value['address_line1']);
    templateForm.controls['reporting_pincode'].setValue(templateForm.value['pincode']);
    templateForm.controls['reporting_contact_person'].setValue(templateForm.value['first_name']+" "+templateForm.value['last_name']);
    templateForm.controls['reporting_company'].setValue(templateForm.value.account.name);

  }

  


  getDecimalAmount(value) {
    if (typeof(value) == 'number' && value != undefined && value != null) {
      return Number(value.toFixed(2));
    } else {
      return;
    }

  }
  getNetAmountWithPercent(total, percent) {
    let percentAmount = 0;
    let netAmount = 0;
    percentAmount = total * percent / 100;
    netAmount = total - percentAmount;
    return { p_amount: percentAmount, net_amount: netAmount }
  }
  setValueInVields(templateForm: FormGroup, field: any) {
    field.forEach(element => {
      if(templateForm.controls[element.field]!==undefined){
        if(typeof(element.value) == 'string'){
          templateForm.controls[element.field].setValue(element.value);
        }
        else{
          templateForm.controls[element.field].setValue(this.getDecimalAmount(element.value));
        }
      }
    });
    return templateForm;
  }

  

  claimAmountCalculation(field1, field2, field3) {
    let total = 0;
    if (field1 && field1 != "") {
      total = total + field1
    }
    if (field2 && field2 != "") {
      total = total + field2;
    }
    if (field3 && field3 != "") {
      total = total + field3;
    }
    return total;
  }

  array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
  };

  

  openFileUpload(fieldName, modalName, formValue, fileData) {
    const alertData = {
      "field" :fieldName,
      "event": true,
      "fieldName": fieldName.field_name,
      "ddnFieldName": fieldName.ddn_field,
      "files" : fileData
    }
    this.modalService.open(modalName, alertData);
  }
  openAlertModal(id, type, headerMessage, bodyMessage) {
    const alertData = {
      "type": type,
      "bodyMessage": bodyMessage,
      "headerMessage": headerMessage
    }
    this.modalService.open(id, alertData);
  }

  getForm(forms, formName) {
    if (forms[formName] && forms[formName] != undefined && forms[formName] != null && forms[formName] != '') {
      return JSON.parse(JSON.stringify(forms[formName]));
    } else {
      if (forms['default'] && forms['default'] != undefined && forms['default'] != null) {
        return JSON.parse(JSON.stringify(forms['default']));
      } else {
        return {}
      }
    }
  }
  getTitlecase(value) {
    return this.titlecasePipe.transform(value);
  }
  previewModal(gridData, currentMenu, modalId) {
    const getpreviewHtml = {
      _id: gridData._id,
      data: this.getPaylodWithCriteria(currentMenu.name, '', [], '')
    }
    this.apiService.GetPreviewHtml(getpreviewHtml);
    const alertData = {
      gridData: gridData,
      currentPage: currentMenu.name
    }
    this.modalService.open(modalId, alertData);
  }
  preview(gridData, currentMenu, modalId) {
    const getpreviewHtml = {
      _id: gridData._id,
      data: this.getPaylodWithCriteria(currentMenu.name, '', [], '')
    }
    getpreviewHtml.data['data'] = gridData;
    this.apiService.GetPreviewHtml(getpreviewHtml);
  }

  gotoHomePage() {
    const payload = {
      appName: this.envService.getAppName(),
      data: {
        accessToken: this.storageService.GetAccessToken()
      }
    }
    return payload;
  }
  downloadPdf(data, currentMenu) {
    let payloadData = {};
    if (currentMenu != '') {
      payloadData = this.getPaylodWithCriteria(currentMenu, '', [], '')
    }
    const getPdfData = {
      _id: data._id,
      data: payloadData,
      responce: { responseType: "arraybuffer" }
    }
    let fileName = currentMenu;
    fileName = fileName.charAt(0).toUpperCase() + fileName.slice(1)
    const downloadPdfCheck = fileName + '-' + new Date().toLocaleDateString();
    if (getPdfData._id && getPdfData._id != undefined && getPdfData._id != null && getPdfData._id != '') {
      getPdfData.data['data'] = data;
      this.apiService.GetPdfData(getPdfData);
    }
    return downloadPdfCheck;
  }

    getPdf(data,currentMenu) {
      let payloadData = {};
      if(currentMenu != ''){
        payloadData = this.getPaylodWithCriteria(currentMenu, '', [], '')
      }
      const getFileData = {
        _id: data._id,
        data: payloadData,
        responce: { responseType: "arraybuffer" }
      }
      let fileName = currentMenu;
      fileName = fileName.charAt(0).toUpperCase() + fileName.slice(1)
      const downloadPdfCheck = fileName + '-' + new Date().toLocaleDateString();
      if(getFileData._id && getFileData._id != undefined && getFileData._id != null && getFileData._id != ''){
        getFileData.data['data']=data;
        this.apiService.GetFileData(getFileData);
      }
      return  downloadPdfCheck;
    }

    download_file(payload){
      this.apiService.GetFileData(payload);
    }

    getQRCode(data, object){
      console.log(data)
      console.log()
      this.apiService.GetQr(data);
    }

    getAuditHistory(data,object){
      this.apiService.getAuditHistory(data);
    }

    getFormForTds(data,currentMenu, object){
      let payloadData = {};
      if(currentMenu != ''){
        payloadData = this.getPaylodWithCriteria(currentMenu, '', [], '')
        payloadData['data']=object
      }
      const getFormData = {
        _id : data._id,
        data: payloadData
      }
      return getFormData;
    }

  downloadFile(file) {
    const payload = {
      path: 'download',
      data: file
    }
    this.apiService.DownloadFile(payload);
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  viewModal(id, object, field, currentMenu, editemode) {
    const alertData = {
      "field": field,
      "data": object,
      "menu_name": currentMenu.name,
      'editemode': editemode
    }
    this.modalService.open(id, alertData);
  }

  calculation_of_script_for_tds(object, field: any) {
    const staticModal = []
    staticModal.push(this.getPaylodWithCriteria('QTMP:CALCULATION_SCRIPT', field.onchange_call_back_field, field.onchange_api_params_criteria, object));
    staticModal[0]['data'] = object;
    return staticModal;
  }

  checkCustmizedValuValidation(fields, value) {
    let validate = [];
    fields.forEach(element => {
      switch (element.type) {
        case "grid_selection":
        case "list_of_string":
          if (element.is_mandatory) {
            if (value[element.field_name] === undefined || value[element.field_name] === '' || value[element.field_name] === null || !isArray(value[element.field_name])) {
              validate.push(element);
            } else if (isArray(value[element.field_name])) {
              if (value[element.field_name].length <= 0) {
                validate.push(element);
              }
            }
          }
        default:
          validate = validate;
      }
    });
    if (validate.length > 0) {
      let fieldName = '';
      validate.forEach(element => {
        if (fieldName == '') {
          fieldName += element.label
        } else {
          fieldName += ', ' + element.label
        }

      });
      this.notificationService.notify('bg-danger', fieldName + ' Required.')
      return false;
    } else {
      return true;
    }


}

formSize(evt,fieldLangth){
  if(evt && evt.class && evt.class!= ''){
    return evt.class;
  }else if(fieldLangth <= 5){
    return '';
  }else if(fieldLangth <= 10){
    return 'modal-lg';
  }
  else{
    return 'modal-dialog-full-width';
  }
}

create_professional_email(templateForm){
  let templateValue = templateForm.getRawValue();
  let name = templateValue.name;
  let prof_email = "";
  let strt = name.substring(0, 2);
  let last = name.slice(-2);
  prof_email = strt+last+"@gmail.com";
  const fieldWithValue = [
    { field: 'prof_email', value: prof_email },
  ]

  this.setValueInVields(templateForm, fieldWithValue);
}

price_after_disc_health_test(templateForm){
  let templateValue = templateForm.getRawValue();
  let discount = 0;
  discount = templateValue.discount;
}

autopopulateFields(templateForm){
  let templateValue = templateForm.getRawValue();
  let product = templateValue.product.name;
  const fieldWithValue = [
    { field: 'sample_name', value: product },
  ]

  this.setValueInVields(templateForm, fieldWithValue);
}
getDataForGrid(page,tab,currentMenu,headElements,filterForm,selectContact){
  let grid_api_params_criteria = [];
  if(tab.grid && tab.grid.grid_page_size && tab.grid.grid_page_size != null && tab.grid.grid_page_size != ''){
    this.itemNumOfGrid = tab.grid.grid_page_size;
  }
  if(this.isGridFieldExist(tab,"api_params_criteria")){
    grid_api_params_criteria = tab.grid.api_params_criteria;
  }
  const data = this.setPageNoAndSize(this.getPaylodWithCriteria(currentMenu.name,'',grid_api_params_criteria,''),page);     
  this.getfilterCrlist(headElements,filterForm).forEach(element => {
    data.crList.push(element);
  });
  if(selectContact != ''){
    const tabFilterCrlist = {        
      "fName": 'account._id',
      "fValue": selectContact,
      "operator": 'eq'
    }
    data.crList.push(tabFilterCrlist);
  }
  const getFilterData = {
    data: data,
    path: null
  }
  return getFilterData;
}
setPageNoAndSize(payload,page){
  payload['pageNo'] = page - 1;
  payload['pageSize'] = this.itemNumOfGrid; 
  return payload;
}
setPageNumverAndSize(payload,page,){
  payload['pageNo'] = page - 1;
  payload['pageSize'] = this.itemNumOfGrid; 
  return payload;
}
getPage(page: number,tab,currentMenu,headElements,filterForm,selectContact) {  
 return this.getDataForGrid(page,tab,currentMenu,headElements,filterForm,selectContact);
}
isGridFieldExist(tab,fieldName){
  if(tab.grid && tab.grid[fieldName] && tab.grid[fieldName] != undefined && tab.grid[fieldName] != null && tab.grid[fieldName] != ''){
   return true;
  }
  return false;
}

getIndexInArrayById(array,id,key?){
  let index = -1;
  if(array && array.length > 0){
    array.forEach((element,i) => {
      if(element._id && element._id == id){
        index = i;
      }else if(element[key] && element[key] == id){
        index = i;
      }
    });
  }
  return index;
}

openModal(id, data){
 this.modalService.open(id, data);
}
calculate_next_calibration_due_date(templateForm: FormGroup){
      const objectValue = templateForm.getRawValue();
      let calibration_date =objectValue['calibration_date']
      let calibration_frequency =objectValue['calibration_frequency']
      if(calibration_date!=null && calibration_date!==undefined && calibration_frequency!=null && calibration_frequency!==undefined && calibration_date!=="" && calibration_frequency!=="" ) {
        let date = new Date();
        date.setDate(calibration_date.getDate() + calibration_frequency );
        templateForm.controls['next_date'].setValue(date);
      }
  }
  calculateAutoEffRate(data){
    data.forEach(element => {
      element["per_sample_net_rate"] = element["no_of_samples"]*element["quotation_effective_rate"];
    });
    return data;
  }

  checkDataAlreadyAddedInListOrNot(primary_key,incomingData,alreadyDataAddedlist){
    if(alreadyDataAddedlist == undefined){
      alreadyDataAddedlist = [];
    }
    let alreadyExist = "false";
    if(typeof incomingData == 'object'){
      alreadyDataAddedlist.forEach(element => {
        if(element._id && element._id == incomingData._id){
          alreadyExist =  "true";
        }else if(element[primary_key] && element[primary_key] == incomingData){
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


  getOperatorSymbol(operator){
    switch (operator) {
      case 'eq':
        return '=';
      default:
        return '=';
    }
  }

  checkDisableRowIf(field,formValue){
    let check = false;
    if(this.checkIfCondition(field,formValue)){
      check = true;
    }else{
      check = false;
    }
    return check;
  }


  getFormDataInMultiformCollection(multiformCollection:any,formValue,  index?){
    let data = {};
      if(index>=0 && multiformCollection && multiformCollection.length >= 1 && multiformCollection[index] && multiformCollection[index]['data']){
         data = multiformCollection[index]['data'];
      }else{
        let dummyData = {};
        if(multiformCollection && multiformCollection.length > 0){
            multiformCollection.forEach((element,index) => {
              let currentData ={};
              if(element.data){
                currentData = element.data;
              }
              if(index == 0){
                dummyData = currentData;
              }else{
                Object.keys(currentData).forEach(key => {
                  dummyData[key] = currentData[key];
                });
              }
             
            });
        }
        if(Object.keys(formValue).length > 0){
          Object.keys(formValue).forEach(key => {
            dummyData[key] = formValue[key];
          });
        }
        data = dummyData;
      }
      return data;
  }

  convertListOfStringToListObject(list_of_populated_fields,keysList,seprator){
    let listOfObjects = [];
    list_of_populated_fields.forEach(element => {
    let object = {}
    let source_targetList = element.split(seprator);
    keysList.forEach((key,i) => {
      object[key] = source_targetList[i];
    });
    
    listOfObjects.push(object);
  });
   return listOfObjects;
  }

  getUserPrefrerence(user) {
    let criteria = "userId._id;eq;"+user._id+";STATIC";
    let myData = this.setPageNoAndSize(this.getPaylodWithCriteria("user_preference", "", [criteria], {}),1);
    const payloadData = {
      path: null,
      data : myData
    }
    this.apiService.getFavouriteData(payloadData);
  }
  updateUserPreference(data,fieldName,parent?){
    let payloadData = this.getUserPreferenceObj(data,fieldName,parent);
    let payload = {
      "curTemp" : "user_preference",
      "data" : payloadData
    }
    this.apiService.SaveFormData(payload);
  }
  getUserPreferenceByFieldName(fieldName){
    let data = [];
    let userPreference = this.storageService.getUserPreference();
    if(userPreference && userPreference[fieldName]){
      data = userPreference[fieldName];
    }
    return data;
  }

  getUserPreferenceObj(data,fieldName,parent?){
    let refObj:any = this.getReferenceObject(data);
    if(parent != ''){
      refObj = parent;
    }
    if(fieldName == "favoriteMenus"){
      refObj = data;
    }
    let uRef = {};
    let userPreference = this.storageService.getUserPreference();
    if(userPreference && userPreference._id && userPreference._id != null && userPreference._id != ''){
      let fieldData = userPreference[fieldName];
      if(fieldData && fieldData.length > 0){
        let matchIndex = -1;
        for (let index = 0; index < fieldData.length; index++) {
          const element = fieldData[index];
          if(element._id == refObj._id){
            matchIndex = index;
            break;
          }         
        }
        if(matchIndex  > -1){
          if(parent != ''){
            let submenu = fieldData[matchIndex].submenu;
            let submenuMatchIndex = -1;
            if(submenu && submenu.length > 0){
              for (let j = 0; j < submenu.length; j++) {
                const subMenu = submenu[j];
                if(subMenu._id == data._id){
                  submenuMatchIndex = j;
                  break;
                }         
              }
            }
            if(submenuMatchIndex > -1){
              submenu.splice(submenuMatchIndex);
              if(fieldData[matchIndex].submenu.length == 0){
                fieldData.splice(matchIndex);
              }else{
                fieldData[matchIndex].submenu = submenu;
              }
            }else{
              if(submenu.length > 0){
                fieldData[matchIndex].submenu.push(data);
              }else{
                fieldData[matchIndex].submenu = []
                fieldData[matchIndex].submenu.push(data);
              }
            }
          }else{
            fieldData.splice(matchIndex);
          }
        }else{
          if(parent != ''){
            refObj['submenu'] = [];
            refObj['submenu'].push(data);
            fieldData.push(refObj);
          }else{
            fieldData.push(refObj);
          }
        }        
      }else{
        fieldData = [];
        fieldData.push(refObj);
      }
      userPreference[fieldName] = fieldData;
      uRef = userPreference;
    }else{
      let user = this.storageService.GetUserInfo();
      let userRef = this.getReferenceObject(user);
      let dataList = [];
      dataList.push(refObj);
      uRef['userId'] = userRef;
      uRef[fieldName] = dataList;
    }    
    return uRef
  }
  getReferenceObject(obj){
    let ref = {}
    ref["_id"]=obj._id;
    ref["code"] = obj.code;
    ref["name"] = obj.name;
    if(obj.version != null){
      ref["version"] = obj.version
    }
    return ref;
  }
  moduleIndex(moduleId){
    let moduleList = this.storageService.GetModules();
    return this.getIndexInArrayById(moduleList,moduleId);    
  }
  getMenuName(module,menuId,submenuId){
    let menuList = module.menu_list;
    let menuIndex = this.getIndexInArrayById(menuList,menuId);
    let menu = menuList[menuIndex];
    let menuName = "";
    if(submenuId != ""){
      if(menu.submenu){
        let subMenuList = menu.submenu;
        if(subMenuList && subMenuList.length > 0){
            let subMenuIndex = this.getIndexInArrayById(subMenuList,submenuId);
            let submenu = subMenuList[subMenuIndex];
            menuName = submenu.name;
        }
      }
    }else{
      menuName = menu.name;
    }
    return menuName;
  }
  dateDiff(dateSent){
    let obj={};
    let currentDate = new Date();
    dateSent = new Date(dateSent);
    // let diff = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate());
    let diff = currentDate.getTime() - dateSent.getTime();
    let days = Math.floor(diff / (60 * 60 * 24 * 1000));
    let hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
    let minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
    let seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
    obj['days'] = days;
    obj['hours'] = hours;
    obj['minutes'] = minutes;
    obj['seconds'] = seconds;
 
     return obj;
   }
  getUserNotification(pageNo){
    let user = this.storageService.GetUserInfo();
    const userId = user._id;
    if(userId && userId != null && userId != ''){
      const criteria = "userId._id;eq;"+userId+";STATIC";
      const payload = this.setPageNoAndSize(this.getPaylodWithCriteria('user_notification','',[criteria],{}),pageNo);
      const callPayload = {
        "path" : null,
        "data": payload
      }
      this.apiService.getUserNotification(callPayload);
    }
  }
  updateFieldInList(fieldName,list){
    let modifyList = [];
    if(list && list.length > 0){
      list.forEach(element => {
        let value = JSON.parse(JSON.stringify(element));
        value[fieldName] = true;
        modifyList.push(value);        
      });
    }
    return modifyList;
  }
  getApplicationAllSettings() {
    const payload1 = this.setPageNoAndSize(this.getPaylodWithCriteria("application_setting", "", [], {}), 1);
    this.apiService.getAplicationsSetting(payload1);
    const payload = this.setPageNoAndSize(this.getPaylodWithCriteria("application_theme_setting", "", [], {}), 1);
    this.apiService.getAplicationsThemeSetting(payload);
  }

  buggetForcastCalc(templateForm: FormGroup){
    let templateValue = templateForm.getRawValue();
    let actualCurYr = templateValue.actual_current;
    let actualLastYr = templateValue.actuals;
    let budget = templateValue.this_year;
    let growthpers = {};
    let budgetpers = {};
    let value = [];
    let value1 = [];
    Object.keys(actualCurYr).forEach(key => {
      let growthper=0;
      let budgetper=0;
      let actualCurYrMonth = actualCurYr[key];
      let actualLastYrMonth = actualLastYr[key];
      if(actualLastYrMonth != 0){
        growthper = actualCurYrMonth/actualLastYrMonth;
      }

      let budgetcurYrMonth = budget[key];
      if(budgetcurYrMonth != 0){
        budgetper = actualCurYrMonth/budgetcurYrMonth;
      }

        growthpers[key] = growthper;
        let obj = {
          field: key, value: growthpers[key] 
        }
        value.push(obj)

        budgetpers[key] = budgetper;
        let obj1 = {
          field: key, value: budgetpers[key] 
        }
        value1.push(obj1)
    })
    const fieldWithValueforgrowth = {
      field: 'growth_per', value: value
    }
    fieldWithValueforgrowth.value.forEach(element => {
        (<FormGroup>templateForm.controls[fieldWithValueforgrowth.field]).controls[element.field].patchValue(element.value);
    })

    const fieldWithValueforBudget = {
      field: 'budget_per', value: value1
    }
    fieldWithValueforBudget.value.forEach(element => {
        (<FormGroup>templateForm.controls[fieldWithValueforBudget.field]).controls[element.field].patchValue(element.value);
    })
  }
  manufactured_as_customer(templateForm: FormGroup) {
    (<FormGroup>templateForm.controls["sample_details"]).controls["mfg_by"].patchValue(templateForm.value.account.name);
  }

  supplied_as_customer(templateForm: FormGroup) {
    (<FormGroup>templateForm.controls["sample_details"]).controls["supplied_by"].patchValue(templateForm.value.account.name);
  }
  setValueInVieldsForChild(templateForm: FormGroup, field: any) {
    (<FormGroup>templateForm.controls['total_amount']).addControl('discount_amount', new FormControl(''))
    field.value.forEach(element => {
      (<FormGroup>templateForm.controls[field.field]).controls[element.field].patchValue(element.value);
    });
    return templateForm;
  }

  calculateTotalFair(value){
    let totalFair = 0;
    let claimSheet = value.claimSheet;
    let travelFair = claimSheet.travelFare;
    let localTa = claimSheet.localTa;
    let dailyAllowance = claimSheet.dailyAllowance;
    let foodHotel = claimSheet.foodHotel;
    let miscellaneous = claimSheet.miscellaneous;

    totalFair = travelFair+localTa+dailyAllowance+foodHotel+miscellaneous;

    let obj1 = {
      totalForTheDay:totalFair
    }

    let obj = {
      claimSheet:obj1
    }

    return obj;

  }

  calculateTotalAmount(formValue){
    let list = formValue['claimSheet'];
    let total = 0;
    for(let i=0; i<list.length;i++){
      total +=  list[i]['totalForTheDay']
    }

    let obj = {
      totalAmountOfTravelCliam:total
    }
    return obj;
  }

  
}