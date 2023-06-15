import { Component, OnInit,OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import {MatAccordion} from '@angular/material/expansion';
import { CommonFunctionService, ApiService, DataShareService, ModelService } from '@core/service-lib';


@Component({
  selector: 'app-communication-data-modal',
  templateUrl: './communication-data-modal.component.html',
  styleUrls: ['./communication-data-modal.component.css']
})

export class CommunicationDataModalComponent implements OnInit,OnDestroy {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  private element: any;
  @Input() tabIndex: number;
  @Input() editedRowIndex: number;

  @Input() id: string;
  @Output() alertResponce = new EventEmitter();
  @ViewChild('communicationModal') public communicationModal: ModalDirective; 

  panelOpenState = false;
  tab_api_params_criteria:any = {};
  itemNumOfGrid: any = 50;
  pageNumber: number = 1;
  currentMenu={
    name:"alert"
  }
  gridData:any;
  elements = [];
  total: number;
  @Output() addAndUpdateResponce = new EventEmitter();
  selectedGridData:any;
  gridDataSubscription;


  constructor(
    private modalService: ModelService, 
    private el: ElementRef, 
    private commonFunctionService:CommonFunctionService,
    private apiService:ApiService,
    private dataShareService:DataShareService
  ) {
    this.gridDataSubscription = this.dataShareService.gridData.subscribe(data =>{
      this.setGridData(data);
    })
    this.element = el.nativeElement;
    
   }
  ngOnDestroy() {    
   
    if(this.gridDataSubscription){
      this.gridDataSubscription.unsubscribe();
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

      // this.store.select('gridData').subscribe((state => {
      //   if (state.gridData) {
      //     if (state.gridData.data && state.gridData.data.length > 0) {
      //       this.elements = JSON.parse(JSON.stringify(state.gridData.data));
      //       this.total = state.gridData.data_size;
      //     } else {
      //       this.elements = [];
      //       this.total = 0;
      //     }
      //   }
      // }))
  }
  setGridData(gridData){
    if (gridData) {
      if (gridData.data && gridData.data.length > 0) {
        this.elements = JSON.parse(JSON.stringify(gridData.data));
        this.total = gridData.data_size;
      } else {
        this.elements = [];
        this.total = 0;
      }
    }
  }

  open(data){
    this.communicationModal.show()
    this.selectedGridData = data;
    this.getDataForGrid();
  }

  closeModal(){
    this.communicationModal.hide();
    this.addAndUpdateResponce.emit("cancel");
    this.alertResponce.emit(false);
  }

  getDataForGrid(){
    let grid_api_params_criteria = [];
    // if(this.tab.grid && this.tab.grid.grid_page_size && this.tab.grid.grid_page_size != null && this.tab.grid.grid_page_size != ''){
    //   this.itemNumOfGrid = this.tab.grid.grid_page_size;
    // }
    // if(this.isGridFieldExist("api_params_criteria")){
    //   grid_api_params_criteria = this.tab.grid.api_params_criteria;
    // }
    // if(this.tab.api_params_criteria && this.tab.api_params_criteria.length>0){
    //   this.tab_api_params_criteria = this.commonFunctionService.getPaylodWithCriteria(this.currentMenu.name,'',this.tab.api_params_criteria,this.selectContact);
    //   console.log(this.tab_api_params_criteria);
    // }
    const data = this.commonFunctionService.getPaylodWithCriteria(this.currentMenu.name,'',grid_api_params_criteria,'');
    data['pageNo'] = this.pageNumber - 1;
    data['pageSize'] = this.itemNumOfGrid;
    data['data'] =  this.selectedGridData;   
    // this.commonFunctionService.getfilterCrlist(this.headElements,this.filterForm).forEach(element => {
    //   data.crList.push(element);
    // });
    // if(this.selectContact != '' && this.tab_api_params_criteria && this.tab_api_params_criteria.crList && this.tab_api_params_criteria.crList.length>0){
      // const tabFilterCrlist = {        
      //   "fName": 'account._id',
      //   "fValue": this.selectContact,
      //   "operator": 'eq'
      // }
    //   data.crList = [...this.tab_api_params_criteria.crList];
    // }
    const getFilterData = {
      data: data,
      path: null
    }
    this.tab_api_params_criteria = {};
    //this.store.dispatch(new CusTemGenAction.GetGridData(getFilterData));
    this.apiService.getGridData(getFilterData)

  }

   getValueForGrid(field, object) {
    return this.commonFunctionService.getValueForGrid(field, object);
  }

  typeCheck(el){
    if(el && el.typeList && el.typeList.length > 0){
      return el.typeList[0];
    }
  }

}
