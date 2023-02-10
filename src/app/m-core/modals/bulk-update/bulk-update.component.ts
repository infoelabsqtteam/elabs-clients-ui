import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { ApiService } from 'src/app/services/api/api.service';
import { CommonFunctionService } from 'src/app/services/common-utils/common-function.service';
import { DataShareService } from 'src/app/services/data-share/data-share.service';
import { ModelService } from 'src/app/services/model/model.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { GridCommonFunctionService } from 'src/app/services/grid-common-function.service';
import { NotificationService } from 'src/app/services/notify/notification.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bulk-update',
  templateUrl: './bulk-update.component.html',
  styleUrls: ['./bulk-update.component.scss']
})
export class BulkUpdateComponent implements OnInit {

  editableGridColumns:any = [];
  data:any={};
  selectable = true;
  deleteIndex: any;
  parentObj: any;
  removable = true;
  fieldNameForDeletion: any;
  isBulkUpdateOpen:boolean=true;
  typeAheadData: any=[];
  addedDataInList: any;
  typeaheadObjectWithtext;
  term: any={};
  copyStaticData: [] = [];
  typeaheadDataSubscription:Subscription;
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

  @Input() id: string;
  @Output() bulkUpdateResponce = new EventEmitter();
  @ViewChild('bulkUpdateModal') public bulkUpdateModal: ModalDirective;
  @ViewChild('chipsInput') chipsInput: ElementRef<HTMLInputElement>;

  @ViewChild('typeheadInput') typeheadInput: ElementRef<HTMLInputElement>;
  @ViewChild('typeheadchips') typeheadchips: ElementRef<HTMLInputElement>;

  constructor(
    private dataShareService:DataShareService,
    private modalService: ModelService,
    private CommonFunctionService:CommonFunctionService,
    private apiservice:ApiService,
    private gridCommonFunctionService:GridCommonFunctionService,
    private notificationService:NotificationService
  ) { 
    this.typeaheadDataSubscription = this.dataShareService.typeAheadData.subscribe(data => {
      this.setTypeaheadData(data);
    })
  }

  ngOnInit() {
    let modal = this;
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }
    this.modalService.remove(this.id);
    this.modalService.add(this);
  }
  showModal(alert) {  
    if(alert.editedColumns && alert.editedColumns.length > 0){
      this.editableGridColumns = alert.editedColumns;
      for (let i = 0; i < this.editableGridColumns.length; i++) {
        const column = this.editableGridColumns[i];
        if (column.is_disabled) {
          column['disabled'] = true;
        }else if(column.etc_fields && column.etc_fields.disable_if && column.etc_fields.disable_if != ''){
          column['disabled'] = true;
        }else{
          column['disabled'] = false;
        }        
      }
      this.data = alert.data;
      this.copyStaticData = alert.copyStaticData;
    }  
    this.bulkUpdateModal.show();
  }
  closeModal() {
    this.dataShareService.setIsGridSelectionOpenOrNot(true);
    this.bulkUpdateModal.hide();
  }
  bulkUpdate(){
    this.bulkUpdateResponce.emit(this.data);
    this.closeModal();
  }
  custmizedFormValueData(fieldName) {
    if (this.data && this.data[fieldName.field_name] && this.data[fieldName.field_name].length > 0) {
      return this.data[fieldName.field_name];
    }
  }
  openModal(id, chipIndex, parentObj, fieldName, alertType) {
    this.deleteIndex = chipIndex;
    if (parentObj != '') {
      this.parentObj = parentObj;
      this.fieldNameForDeletion = fieldName;
    }
    this.CommonFunctionService.openAlertModal(id, alertType, 'Are You Sure ?', 'Delete This record.');
  }
  bulkUpdateAlertResponce(responce) {
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
  getddnDisplayVal(val) {
    return this.CommonFunctionService.getddnDisplayVal(val);
  }
  getOptionText(option) {
    if (option && option.name) {
      return option.name;
    } else {
      return option;
    }
  }
  
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
      let staticModalGroup = this.CommonFunctionService.getPaylodWithCriteria(field.api_params, call_back_field, criteria, this.typeaheadObjectWithtext ? this.typeaheadObjectWithtext : {});
      staticModal.push(staticModalGroup);
      this.apiservice.GetTypeaheadData(staticModal);

      this.typeaheadObjectWithtext[field.field_name] = this.addedDataInList;
    }else{
      this.typeAheadData = [];
    }
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
  add(event: MatChipInputEvent, field, index,chipsInput,data){
    let selectedData = "";
    if(event && event.value){
      selectedData = event.value
    } 
    if(selectedData != ""){  
      this.setData(selectedData,field, chipsInput) 
    }
  }
  setValue(event: MatChipInputEvent, field, index,chipsInput,data) {
    let selectedData = "";
    if(event && event["option"] && event["option"].value){
      selectedData = event["option"].value
    } 
    if(selectedData != ""){ 
      this.setData(selectedData,field,chipsInput);  
    }
  }
  setData(selectedData, field, chipsInput){
    if(field.type != "typeahead"){
      if (this.data[field.field_name] == null) this.data[field.field_name] = [];
      if(this.gridCommonFunctionService.checkDataAlreadyAddedInListOrNot(field.field_name,selectedData,this.data[field.field_name])){
        this.notificationService.notify('bg-danger','Entered value for '+field.label+' is already added. !!!');
      }else{
        this.data[field.field_name].push(selectedData);
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

}
