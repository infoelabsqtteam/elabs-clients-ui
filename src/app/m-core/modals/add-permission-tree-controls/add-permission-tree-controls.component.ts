import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonFunctionService, ModelService } from '@core/web-core';
import { ModalDirective } from 'angular-bootstrap-md';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-add-permission-tree-controls',
  templateUrl: './add-permission-tree-controls.component.html',
  styleUrls: ['./add-permission-tree-controls.component.css']
})
export class AddPermissionTreeControlsComponent implements OnInit {

  @Input() id: string;
  @Output() treeViewComponentResponce = new EventEmitter();
  @ViewChild('permissionTreeView') public treeView: ModalDirective; 

  fieldName:string='';
  custmizedFormValue:any={};

   //mat chips variables
   separatorKeysCodes: number[] = [ENTER, COMMA];
   //visible = true;
   selectable = true;
   removable = true;
   addOnBlur = true; 
  
  constructor(
    private modalService:ModelService,
    private commonFunctionService:CommonFunctionService
  ) { }

  ngOnInit() {
    let modal = this;
    if (!this.id) {
        console.error('modal must have an id');
        return;
    }
    this.modalService.remove(this.id);
    this.modalService.add(this);
  }
  showModal(alert){  
    this.treeView.show();
  } 

  closeModal(){    
    this.close();
  }
  close(){
    this.treeView.hide();
  }
  selectGridData(){

  }
  deleteIndex:number=-1;
  openModal(id, index, parent,child, data, alertType) {
    this.deleteIndex = index;
    // if(parent != ''){
    //   this.deletefieldName['parent'] = parent;
    //   this.deletefieldName['child'] = child;
    // }else{
    //   this.deletefieldName['child'] = child;
    // }
    this.commonFunctionService.openAlertModal(id,alertType,'Are You Sure ?','Delete This record.');
  }
  setValue(parentfield,field, add,event?){
    // const value = this.coreFunctionService.removeSpaceFromString(formValue[field.field_name]);
    // const checkDublic = this.checkIfService.checkDataAlreadyAddedInListOrNot(field,value,this.custmizedFormValue[field.field_name]);
    // if(this.custmizedFormValue[field.field_name] && checkDublic.status){
    //   this.notificationService.notify('bg-danger','Entered value for '+field.label+' is already added. !!!');
    // }else{
    //   if (!this.custmizedFormValue[field.field_name]) this.custmizedFormValue[field.field_name] = [];
    //   const custmizedFormValue = Object.assign([],this.custmizedFormValue[field.field_name]);
    //   if(value != '' && value != null){
    //     let index = -1;
    //     if(this.addOrUpdateIconShowHideList && this.addOrUpdateIconShowHideList[field.field_name+'_index']>=0){
    //       index = this.addOrUpdateIconShowHideList[field.field_name+'_index']
    //     }
    //     let updateCustomizedValueResponse = this.formControlService.updateCustomizedValue(custmizedFormValue, index, value); 
    //     this.custmizedFormValue[field.field_name] = updateCustomizedValueResponse.custmizedFormValue;
    //     this.addOrUpdateIconShowHideList = {};
    //   }
    //   if(event){
    //     event.value = '';
    //   }
    //   this.templateForm.controls[field.field_name].setValue("");
    //   this.tempVal[field.field_name + "_add_button"] = true;
    // }
  }
  typeaheadDragDrop(event: CdkDragDrop<string[]>,parent,chield) {  
      
    if(this.commonFunctionService.checkStorageValue(this.custmizedFormValue,'',chield)){
      moveItemInArray(this.custmizedFormValue[chield.field_name], event.previousIndex, event.currentIndex);
    }  
    
  }

}
