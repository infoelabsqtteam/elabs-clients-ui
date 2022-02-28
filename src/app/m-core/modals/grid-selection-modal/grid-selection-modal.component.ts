import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ModalDirective } from 'angular-bootstrap-md';
import { CommonFunctionService } from '../../../services/common-utils/common-function.service';
import { DataShareService } from '../../../services/data-share/data-share.service';
import { NotificationService } from 'src/app/services/notify/notification.service';
import { CoreFunctionService } from 'src/app/services/common-utils/core-function/core-function.service';
import { ModelService } from 'src/app/services/model/model.service';
import { I } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-grid-selection-modal',
  templateUrl: './grid-selection-modal.component.html',
  styleUrls: ['./grid-selection-modal.component.css']
})
export class GridSelectionModalComponent implements OnInit {

  gridData:any=[];
  selectedData:any = [];
  selecteData:any=[];
  listOfGridFieldName:any =[]; 
  field:any={};
  editeMode:boolean=false;
  grid_row_selection:boolean = false;
  grid_row_refresh_icon:boolean = false;
  data:any='';
  staticDataSubscriber;
  parentObject={};
  responseData:any;

  @Input() id: string;
  @Output() gridSelectionResponce = new EventEmitter();
  @ViewChild('gridViewModalSelection') public gridViewModalSelection: ModalDirective;
  

  constructor(
    private modalService: ModelService, 
    private el: ElementRef,
    private CommonFunctionService:CommonFunctionService,
    private dataShareService:DataShareService,
    private notificationService:NotificationService,
    private coreFunctionService:CoreFunctionService
  ) {
    this.staticDataSubscriber = this.dataShareService.staticData.subscribe(data =>{
      if(this.coreFunctionService.isNotBlank(this.field) && this.coreFunctionService.isNotBlank(this.field.ddn_field)  && data[this.field.ddn_field]){
        this.responseData = data[this.field.ddn_field];
      }else{
        this.responseData = [];

      }
      this.setStaticData(data);
    })
     //this.treeViewData.data = TREE_DATA;
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
    if(this.staticDataSubscriber){
      this.staticDataSubscriber.unsubscribe();
    }
  }
  setStaticData(staticData){
    if(staticData){
      this.gridData = [];
      if(this.field.ddn_field && staticData[this.field.ddn_field] && staticData[this.field.ddn_field] != null){
        if(staticData[this.field.ddn_field] && staticData[this.field.ddn_field].length>0){
          staticData[this.field.ddn_field].forEach(element => {
            const gridData = JSON.parse(JSON.stringify(element))
            if(gridData.selected && this.selecteData.length < 0){
              gridData.selected = false;
            }
            this.gridData.push(gridData);
          });
        }
       
        if(this.gridData && this.gridData.length > 0){

          if(this.field.onchange_function && this.field.onchange_function_param != ""){
            switch(this.field.onchange_function_param){
              case "calculateQquoteAmount":
                this.gridData = this.CommonFunctionService.calculateAutoEffRate(this.gridData);
                break;
            }
        }

          this.selecteData.forEach(element => {
            this.gridData.forEach((row, i) => {
              if(this.field.matching_fields_for_grid_selection && this.field.matching_fields_for_grid_selection.length>0){
                var validity = true;
                this.field.matching_fields_for_grid_selection.forEach(matchcriteria => {
                  if(this.CommonFunctionService.getObjectValue(matchcriteria,element) == this.CommonFunctionService.getObjectValue(matchcriteria,row)){
                    validity = validity && true;
                  }
                  else{
                    validity = validity && false;
                  }
                });
                if(validity == true){
                  this.gridData[i]= element
                const grid_data = JSON.parse(JSON.stringify(this.gridData[i]))
                grid_data.selected = true;
                this.gridData[i] = grid_data;
                }
              }
              else{
                 if(this.CommonFunctionService.getObjectValue("_id",element) == this.CommonFunctionService.getObjectValue('_id',row)){
                  this.gridData[i]= element
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

  refreshRowWithMasterData(index){
    let rowData = this.gridData[index];
    if(this.field.matching_fields_for_grid_selection && this.field.matching_fields_for_grid_selection.length>0){
      var validity = true;
      if(Array.isArray(this.responseData)){
        this.responseData.forEach(element => {
          this.field.matching_fields_for_grid_selection.forEach(matchcriteria => {
            if(this.CommonFunctionService.getObjectValue(matchcriteria,rowData) == this.CommonFunctionService.getObjectValue(matchcriteria,element)){
              validity = validity && true;
            }
            else{
              validity = validity && false;
            }
          });
          if(validity == true){
            const grid_data = JSON.parse(JSON.stringify(element))
            grid_data.selected = this.gridData[index]['selected'];
            this.gridData[index] = grid_data;
          }
        });
      }  
     
    }
  }

  showModal(alert){ 
    this.selecteData = [];  
    this.selecteData = alert.selectedData; 
    this.field = alert.field;
    if(alert.object){
      this.parentObject = alert.object;
    }
    if(alert.field.onchange_api_params == "" || alert.field.onchange_api_params == null){
      this.gridData = JSON.parse(JSON.stringify(alert.selectedData));
    }
    else{
      this.gridData = [];
    }
    if(this.field.gridColumns && this.field.gridColumns.length > 0){
      this.field.gridColumns.forEach(field => {
        if(this.coreFunctionService.isNotBlank(field.show_if)){
          if(!this.CommonFunctionService.showIf(field,this.parentObject)){
            field['display'] = false;
          }else{
            field['display'] = true;
          }                
        }else{
          field['display'] = true;
        }
      });
      this.listOfGridFieldName = this.field.gridColumns;    
      this.gridViewModalSelection.show();  
    }else{
      this.notificationService.notify("bg-danger","Grid Columns are not available In This Field.")
    }
    if(this.field && this.field.grid_row_selection){
      this.grid_row_selection = true;
    }else{
      this.grid_row_selection = false;
    }
    if(this.field && this.field.grid_row_refresh_icon){
      this.grid_row_refresh_icon = true;
    }else{
      this.grid_row_refresh_icon = false;
    }
    
  }
  selectGridData(){
    this.selectedData = [];
    if(this.grid_row_selection == false){
      this.selectedData = [...this.gridData];
    }
    else{
      this.gridData.forEach(row => {
        if(row.selected){
          this.selectedData.push(row);
        }
      });
    }
    this.gridSelectionResponce.emit(this.selectedData);
    this.closeModal();
  }

  closeModal(){
    this.gridData=[];
    this.selectedData = [];
    this.selecteData=[];
    this.data = '';
    this.gridViewModalSelection.hide();
  }

  getValueForGrid(field, object) {
    return this.CommonFunctionService.getValueForGrid(field, object);
  }
  getValueForGridTooltip(field, object) {
    return this.CommonFunctionService.getValueForGridTooltip(field, object);
  }
  //SELECT ALL FUNCTIONLITY
  

  toggle(data,event: MatCheckboxChange, indx) {
    let index;
    if(data._id != undefined){
      index = this.CommonFunctionService.getIndexInArrayById(this.gridData,data._id);
    }else if(this.field.matching_fields_for_grid_selection && this.field.matching_fields_for_grid_selection.length>0){
      this.gridData.forEach((row, i) => {        
          var validity = true;
          this.field.matching_fields_for_grid_selection.forEach(matchcriteria => {
            if(this.CommonFunctionService.getObjectValue(matchcriteria,data) == this.CommonFunctionService.getObjectValue(matchcriteria,row)){
              validity = validity && true;
            }
            else{
              validity = validity && false;
            }
          });
          if(validity == true){
            index = i;
          }
      });
    }else {      
      index = indx;
    }
    if (event.checked) {
      this.gridData[index].selected=true;
    } else{
      this.gridData[index].selected=false;
    }
    //console.log(this.selected3);
  }
  // exists(item) {
  //   return this.selectedData.indexOf(item) > -1;
  // };
  isIndeterminate() {
    let check = 0;
    if(this.gridData.length > 0){
      this.gridData.forEach(row => {
        if(row.selected){
          check = check + 1;
        }
      });
    }
    return (check > 0 && !this.isChecked());
  };
  isChecked() {
    let check = 0;
    if(this.gridData.length > 0){
      this.gridData.forEach(row => {
        if(row.selected){
          check = check + 1;
        }
      });
    }
    return this.gridData.length === check;
  };
  toggleAll(event: MatCheckboxChange) {
    if ( event.checked ) {
      if(this.gridData.length > 0){
        this.gridData.forEach(row => {
          row.selected=true;
        });
      }
    }else{
      if(this.gridData.length > 0){
        this.gridData.forEach(row => {
          row.selected=false;
        });
      }
    }
    //console.log(this.selected3);
  }

  calculateNetAmount(data, fieldName, index){

    this.CommonFunctionService.calculateNetAmount(data, fieldName, fieldName["grid_cell_function"]);
  }
  getGridColumnWidth(column){
    if(column.width && column.width!='0'){
      return column.width;
    }else{
      if(this.listOfGridFieldName.length > 8){
        return '150px';
      }else{
        return '';
      }      
    }    
  }
  applyOnGridFilter(field){
    if(field && field.etc_fields && field.etc_fields.on_grid_filter === 'false'){
        return false;
    }
    return true;
  }
  applyOnGridFilterLabel(field){
    if(field && field.etc_fields && field.etc_fields.on_grid_filter_label != ''){
        return field.etc_fields.on_grid_filter_label;
    }
    return "Search Parameter ...";
  }
  
  isDisable(field,object){
      const updateMode = false;
      if(field.is_disabled){
        return true;
      }else if(field.etc_fields && field.etc_fields.disable_if && field.etc_fields.disable_if != ''){
        return this.CommonFunctionService.isDisable(field.etc_fields,updateMode,object);
      }
      return false;
  }
  checkValidator(){
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


}
