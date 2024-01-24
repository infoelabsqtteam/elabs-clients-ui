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
  loading=false;
  responseData=undefined


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

  createReferenceObject(obj:any){
    let ref:any = {}
    ref["_id"]=obj._id;
    ref["name"] = obj.name;
    if(obj.version != null){
      ref["version"] = obj.version
    }
    return ref;
  }

  checkHeadExists(head:any){
    let preferenceData=localStorage.getItem("preference");
    if(!preferenceData){
      return false;
    }
    else{
      preferenceData=JSON.parse(localStorage.getItem("preference"))
      if(preferenceData.length>0){
        return preferenceData.includes(head._id)
      }
    }
  }

  createPayload(columns: any[]){
    let data={
      columns,
      form:this.form,
      formTable:this.formTable
    }
   this.updateUserPreference(data,"preference")
  }

  async updateUserPreference(data,field){
    let response = await this.userPrefrenceService.updateUserPreference(data,field);
    if (response?.success) {
      // this.isPageLoading = false;
      this.notificationService.notify('bg-success', 'Column Field updated successfully!');
    } else {
      // this.isPageLoading = false;
      this.notificationService.notify('bg-warning', 'Failed to save data.');
    }
  }
}


