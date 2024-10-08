import { Component, Input, OnChanges, OnInit, SimpleChanges, OnDestroy } from '@angular/core';
import { ApiService, CommonFunctionService, DataShareService, StorageService, ApiCallService } from '@core/web-core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit, OnChanges, OnDestroy {
  @Input() isShowGrid: boolean;
  pageNumber: number = 1;
  itemNumOfGrid: any = 50;
  gridDataSubscription: Subscription;
  tempDataSubscription: Subscription;
  sqsNotificationsData: any[] = [];
  gridColumns: any[] = [];
  currentMenu: any = {};
  fixedcolwidth: number = 150;

  constructor(
    private apiService: ApiService,
    private dataShareService: DataShareService,
    private apiCallService: ApiCallService
  ) {
    this.gridDataSubscription = this.dataShareService.gridData.subscribe(data => {
      // Add a check for null or undefined
      if (data && data.data) {
        this.sqsNotificationsData = data.data;
      }
    });
    

    this.tempDataSubscription = this.dataShareService.tempData.subscribe(data => {
      this.getGridFields(data);
    });
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.isShowGrid){
      this.getTemplate();
      this.getDataForGrid();
    }
  }

  ngOnDestroy(): void {
    if (this.gridDataSubscription) {
      this.gridDataSubscription.unsubscribe();
    }

    if (this.tempDataSubscription) {
      this.tempDataSubscription.unsubscribe();
    }
  }

  getDataForGrid() {
    const grid_api_params_criteria = [];
    const data = this.apiCallService.getPaylodWithCriteria('sqs_notifications', '', grid_api_params_criteria, '');
    const getFilterData = {
      data: data,
      path: null
    };
    this.apiService.getGridData(getFilterData);
  }

  getTemplate() {
    this.currentMenu = "sqs_notifications";
    const payload = this.apiCallService.getTemData(this.currentMenu);
    this.apiService.GetTempData(payload);

  }

  getGridFields(data){
    if(data && data.length>0){
      let template = data[0];
      let templateTabs = template['templateTabs'];
      if(templateTabs.length>0){
        let grid = templateTabs[0]['grid'];
        if(grid != null && grid != undefined){
          this.gridColumns = grid['fields'];
        }
      }
    }
  }
}
