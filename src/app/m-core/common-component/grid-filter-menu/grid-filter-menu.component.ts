import { Component, Input , OnInit} from "@angular/core";
import { StorageService, CommonFunctionService, PermissionService, DataShareService, ApiService, NotificationService, EnvService, MenuOrModuleCommonService, ApiCallService, UserPrefrenceService} from '@core/web-core';

@Component({
  selector: 'app-grid-filter-menu',
  templateUrl: './grid-filter-menu.component.html',
  styleUrls: ['./grid-filter-menu.component.css'],
})
export class GridFilterMenuComponent implements OnInit{
  @Input() columns: any;
  @Input() form: any;
  @Input() formTable: any;

  constructor(
    private storageService: StorageService,
    private apiService: ApiService,
    private dataShareService: DataShareService,
    private commonFunctionService: CommonFunctionService,
    private userPrefrenceService: UserPrefrenceService,
    private notificationService: NotificationService,
  ) {}
  showHide(){
  }
  ngOnInit(): void {
  }

  updateColumnList() {
    if (this.columns) {
      this.columns.forEach((column) => (column.display = true));
    }
  }

  saveColumns(columns: any[]){
    const unCheckedFields=columns.filter((col:any)=>col.display==false);
    if(columns && columns.length == unCheckedFields.length){
      this.notificationService.notify('bg-warning', 'Atleast select one field');
      return;
    }
    let data={
      columns,
      form:this.form,
      formTable:this.formTable
    }
    let formId="";
    let formFieldName="";
    if(this.form && this.formTable){
      formId=this.form._id;
      formFieldName=this.formTable.field_name;
    }
    this.updateUserPreference(data,"preference",formId,formFieldName,columns)
  }

  async updateUserPreference(data,field,formId,formFieldName,columns){
    let response = await this.userPrefrenceService.updateUserPreference(data,field);
    if (response?.success) {
      this.userPrefrenceService.addHideKeyInExistingTab(columns,formId,formFieldName);
      this.notificationService.notify('bg-success', 'Column Field updated successfully!');
    } else {
      this.notificationService.notify('bg-warning', 'Failed to save data.');
    }
  }
}


