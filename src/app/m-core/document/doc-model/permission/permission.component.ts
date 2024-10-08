import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';
import { ApiService, DocApiService, CommonFunctionService, DataShareService, NotificationService, ModelService, FormCreationService, ApiCallService, GridCommonFunctionService, CheckIfService } from '@core/web-core';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styles: [
  ]
})
export class PermissionComponent implements OnInit {

  @Input() id: string;
  @Output() permissionResponce = new EventEmitter();
  @ViewChild('permissionModal') public permissionModal: ModalDirective;
  @Input() pathList;
  @Input() folder: any;

  permissionForm: UntypedFormGroup;
  typeaheadDataSubscription;
  typeAheadData: string[] = [];
  elements: any = [];
  updateAddNew: boolean = false;
  gridDataSubscription;
  pageNumber = 1;
  pageSize = 25;

  listOfPermission: any = [];
  viewpermissiondata: boolean = false;
  addeduser;
  updateMode = false;


  colums = [
    { 'label': 'User', 'field_name': 'user.name', 'type': 'text' },
    { 'label': 'Authorize', 'field_name': 'authoriser', 'type': 'text' },
    { 'label': 'Read', 'field_name': 'viewer', 'type': 'text' },
    { 'label': 'Write', 'field_name': 'creator', 'type': 'text' },
    { 'label': 'Download', 'field_name': 'downloader', 'type': 'text' }
  ]
  fields = [
    { 'label': 'User', 'field_name': 'user', 'type': 'dropdown' },
    { 'label': 'Authorize', 'field_name': 'authoriser', 'type': 'checkbox' },
    { 'label': 'Read', 'field_name': 'viewer', 'type': 'checkbox' },
    { 'label': 'Write', 'field_name': 'creator', 'type': 'checkbox' },
    { 'label': 'Download', 'field_name': 'downloader', 'type': 'checkbox' }
  ]


  constructor(
    private modelService: ModelService,
    private formBuilder: UntypedFormBuilder,
    private commonFunctionService: CommonFunctionService,
    private apiService: ApiService,
    private dataShareService: DataShareService,
    private notificationService: NotificationService,
    private docApiService: DocApiService,
    private formCreationService:FormCreationService,
    private apiCallService:ApiCallService,
    private gridCommonFunctionService:GridCommonFunctionService,
    private checkIfService:CheckIfService
  ) {
    this.typeaheadDataSubscription = this.dataShareService.typeAheadData.subscribe(data => {
      this.setTypeaheadData(data);
    })
    this.gridDataSubscription = this.dataShareService.gridData.subscribe(data => {
      this.setGridData(data);
    })
    this.dataShareService.saveResponceData.subscribe( data =>{
      console.log(data);
      this.permissionData();
      this.updateMode = false;
      this.selectedRow = {};
      this.permissionForm?.reset();
    })
  }

  ngOnInit(): void {
    let modal = this;
    if (!this.id) {
      console.error('modal must have an id');
      return;
    }
    this.modelService.remove(this.id);
    this.modelService.add(this);
    this.initForm();
  }
  initForm() {
    const forControl = {};
    if(this.fields && this.fields.length>0 ) {
      this.fields.forEach(element => {
        switch (element.type) {
          case "dropdown":
            this.formCreationService.createFormControl(forControl, element, null, "text");
            break;
          case "checkbox":
            this.formCreationService.createFormControl(forControl, element, false, "checkbox")
            break;
          default:
            this.formCreationService.createFormControl(forControl, element, '', "text");
            break;
        }
        
      });
      if (forControl) {
        this.permissionForm = this.formBuilder.group(forControl);
      }
    }
  }


  setTypeaheadData(typeAheadData) {
    if (typeAheadData && typeAheadData.length > 0) {
      this.typeAheadData = typeAheadData;
    } else {
      this.typeAheadData = [];
    }
  }


  setGridData(gridData) {
    if (gridData) {
      if (gridData.data && gridData.data.length > 0) {
        this.elements = gridData.data
      } else {
        this.elements = []
      }
    }
    
  }



  showModal(object) {
    this.permissionModal.show()
  }
  close() {
    this.resetForm();
    this.permissionModal.hide();
    this.viewpermissiondata = false;
    this.addeduser = false;
  }

  savePermission() {
    const folder = this.folder;
    if (this.listOfPermission.length > 0) {
      folder['permission'] = this.listOfPermission
      this.docApiService.SetDocPermission(folder);      
      this.close();
    }
    this.viewpermissiondata = false;
    this.addeduser = false;
  }



  updateData(event) {
    if (event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 13 || event.keyCode == 27 || event.keyCode == 9) {
      return false;
    }
    let keyValue = event.target.value;
    let criteria = "altname;stwic;" + keyValue + ";STATIC";
    let field = {
      'api_params': 'user',
      'api_params_criteria': [criteria]
    }
    let objectValue = this.permissionForm.getRawValue();
    this.callTypeaheadData(field, objectValue);
  }

  callTypeaheadData(field, objectValue) {
    this.clearTypeaheadData();
    const payload = [];
    const params = field.api_params;
    const criteria = field.api_params_criteria;
    payload.push(this.apiCallService.getPaylodWithCriteria(params, '', criteria, objectValue, field.data_template));
    this.apiService.GetTypeaheadData(payload);
  }

  clearTypeaheadData() {
    this.apiService.clearTypeaheadData();
  }


  getOptionText(option) {
    if (option && option.name) {
      return option.name;
    } else {
      return option;
    }
  }



  getddnDisplayVal(val) {
    return this.commonFunctionService.getddnDisplayVal(val);
  }

  addPermission() {
    let value = this.permissionForm.getRawValue();
    if(this.updateMode){
      this.updatePermission();
    }
    else {
      let primary_key_field_name = 'user._id';
      let primary_key_field_value = value['user']['_id'];
      let list = this.listOfPermission;
      let alreadyAdded = this.checkIfService.checkDataAlreadyAddedInListOrNot({"field_name":primary_key_field_name}, primary_key_field_value, list);
      if (alreadyAdded.status) {
        this.notificationService.notify('bg-danger', 'Entered value for user is already added. !!!');
        return;
      }
      this.listOfPermission.push(value);
      this.resetForm();
      this.viewpermissiondata = false;
      this.addeduser = true;
    }
    
  }
  updatePermission(){
    if(this.fields && this.fields.length > 0){
      let formValue = this.permissionForm.getRawValue();
      this.fields.forEach(element => {
        this.selectedRow[element.field_name] = formValue[element.field_name];
      });
    }
    const saveFromData = {
      curTemp: 'document_permission',
      data: this.selectedRow
    }
    this.apiService.SaveFormData(saveFromData);
  }

  getValueForGrid(field, object) {
    return this.gridCommonFunctionService.getValueForGrid(field, object);
  }

  checkValidator() {
    return !this.permissionForm.valid;
  }
  resetForm() {
    this.permissionForm.reset();
    this.colums.forEach(element => {
      if (element.field_name != 'user.name') {
        this.permissionForm.get(element.field_name).setValue(false);
      }
    })
    this.viewpermissiondata = false;
  }
  viewpermission() {
    this.viewpermissiondata = !this.viewpermissiondata;
    this.addeduser = false;
    this.permissionData();
  }
  permissionData(){
    let currentFolderId = this.folder?._id;
    let criteria = []
    if(currentFolderId && currentFolderId != ''){
      const cr = "folderId;eq;"+ currentFolderId + ";STATIC";
      criteria.push(cr);
    }
    const data = this.apiCallService.getPaylodWithCriteria('document_permission', '', criteria, {});
    data['pageNo'] = this.pageNumber-1;
		data['pageSize'] = this.pageSize;
		const getFilterData = {
		  data: data,
		  path: null
		}
    this.apiService.getGridData(getFilterData);
  }
  selectedRow = {};
  editpermission(index) {
    this.updateMode = true;
    this.selectedRow = this.elements[index];
    this.editRowData(this.selectedRow);
  }
  editRowData(object){
    if(this.fields && this.fields.length>0 ) {
      this.fields.forEach(element => {
        const fieldName = element.field_name;
        const value = this.commonFunctionService.getObjectValue(fieldName,object);
        switch (element.type) {
          default:
            this.permissionForm.get(element.field_name).setValue(value);
            break;
        }        
      });
    }
  }

}
