import { Component, OnInit, OnChanges, Input, Output, SimpleChanges, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import { CommonFunctionService } from 'src/app/services/common-utils/common-function.service';
import { DataShareService } from 'src/app/services/data-share/data-share.service';
import { EnvService } from 'src/app/services/env/env.service';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnDestroy, OnChanges {

  @Input() isShow: string;

  public chartType:any = {};
  public chartDatasets:any = {};
  public chartLabels:any = {};
  public chartColors:any = {};
  public chartOptions:any = {};
  public chartLegend:any = {};
  public chartTitle:any = {};

  dashboardFilter:FormGroup;

  checkGetDashletData:boolean=true;
  dashletData:any={};
  copyDashletData:any={};
  pageNumber:any=1;
  itemNumOfGrid: any = 100;
  elements:any=[];
  staticData: any = {};
  copyStaticData:any={};

  gridDataSubscription;
  staticDataSubscription;
  dashletDataSubscription;

  constructor(
    public formBuilder: FormBuilder,
    private commonFunctionService:CommonFunctionService,
    private apiService:ApiService,
    private dataShareService:DataShareService,
    private envService:EnvService
  ) { 

    if(this.envService.getRequestType() == 'PUBLIC'){
      this.envService.setRequestType('PRIVATE');
    }
    this.gridDataSubscription = this.dataShareService.dashletMaster.subscribe(data =>{
      this.setGridData(data);
    })
    this.staticDataSubscription = this.dataShareService.staticData.subscribe(data =>{
      this.setStaticData(data);
    })
    this.dashletDataSubscription = this.dataShareService.dashletData.subscribe(data =>{
      this.setDashLetData(data);
    })
    this.getPage(1)   

  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.isShow){
      this.getPage(1)
      this.checkGetDashletData = true;
    }
  }
  ngOnDestroy(){
    this.checkGetDashletData = false;
    if(this.gridDataSubscription){
      this.gridDataSubscription.unsubscribe();
    }
    if(this.staticDataSubscription){
      this.staticDataSubscription.unsubscribe();
    }
    if(this.dashletDataSubscription){
      this.dashletDataSubscription.unsubscribe();
    }
  }

  ngOnInit() {
  }
  setDashLetData(dashletData:any){
    if (dashletData) {
      this.dashletData = dashletData;
      Object.keys(this.dashletData).forEach(key => {                    
        this.chartDatasets[key] = JSON.parse(JSON.stringify(this.dashletData[key]['dataSets']));  
        this.chartLabels[key] = JSON.parse(JSON.stringify(this.dashletData[key]['label']));
        this.chartType[key]=JSON.parse(JSON.stringify(this.dashletData[key]['type']));
        this.chartColors[key]=JSON.parse(JSON.stringify(this.dashletData[key]['colors']));
        this.chartLegend[key]=JSON.parse(JSON.stringify(this.dashletData[key]['legend']));
        this.chartOptions[key]=JSON.parse(JSON.stringify(this.dashletData[key]['options']));
        if(this.dashletData[key]['title']){
          this.chartTitle[key]=JSON.parse(JSON.stringify(this.dashletData[key]['title']));
        }        
      })
    }
  }

  setGridData(gridData){
    if (gridData.data && gridData.data.length > 0) {
      this.elements = JSON.parse(JSON.stringify(gridData.data));
      if(this.checkGetDashletData && this.elements.length > 0){
        this.checkGetDashletData = false;
        let forControl = {};
        let formField = [];
        if(this.elements.length > 0){
          this.elements.forEach(dashlet => {
            if(dashlet.list_of_fields && dashlet.list_of_fields.length > 0){
              dashlet.list_of_fields.forEach(field => {                    
                    formField.push(field);
                    switch(field.type){
                      case "group_of_fields":
                        const list_of_fields = {};
                        const groupField = {
                          "field_name":dashlet.name
                        }
                        if (field.list_of_fields.length > 0) {
                          field.list_of_fields.forEach((data) => {
                            let modifyData = JSON.parse(JSON.stringify(data));
                            modifyData.parent = field.field_name;
                            //show if handling
                                                
                            if(field.type == 'list_of_fields'){
                              modifyData.is_mandatory=false;
                            }
                            this.commonFunctionService.createFormControl(list_of_fields, modifyData, '', "text")
                          });
                        }
                        this.commonFunctionService.createFormControl(forControl, groupField, list_of_fields, "group")
                                         
                        break;
                    }
                  
                
              });
            }               
            
          });
          if(formField.length > 0){
            let staticModalGroup = this.commonFunctionService.commanApiPayload([],formField,[]);
            if(staticModalGroup.length > 0){      
              // this.store.dispatch(
              //   new CusTemGenAction.GetStaticData(staticModalGroup)
              // )
              this.apiService.getStatiData(staticModalGroup);
            }
          }
          if (forControl) {
            this.dashboardFilter = this.formBuilder.group(forControl);              
          }
          this.elements.forEach(element => {
            this.apiService.GetDashletData(element);
          });
        }            
      }          
    } else {
      this.elements = [];
    }
  }
  setStaticData(staticData){
    if (staticData) {
      this.staticData = staticData;
      Object.keys(this.staticData).forEach(key => {        
        this.copyStaticData[key] = JSON.parse(JSON.stringify(this.staticData[key]));
      }) 
    }
  }
  getDataForGrid(){    
    const data = this.commonFunctionService.getPaylodWithCriteria('dashlet_master','',[],'');
    data['pageNo'] = this.pageNumber - 1;
    data['pageSize'] = this.itemNumOfGrid; 
    const getFilterData = {
      data: data,
      path: null
    }
    //this.store.dispatch(new CusTemGenAction.GetGridData(getFilterData))
    this.apiService.getDashletMster(getFilterData)
  }
  getPage(page: number) {
    this.pageNumber = page;
    this.getDataForGrid();
  }
  dashletFilter(index){
    const ele = JSON.parse(JSON.stringify(this.elements[index]));
    let value = this.dashboardFilter.getRawValue();
    const filterData = value[ele.name];
    ele[ele.name] = filterData;
    this.apiService.GetDashletData(ele);
  }

   getddnDisplayVal(val) {
    return this.commonFunctionService.getddnDisplayVal(val);    
  }

    getDivClass(field) {
    // if(!this.commonFunctionService.showIf(field,this.templateForm.getRawValue())){
    //   return "d-none"
    // }
    return this.commonFunctionService.getDivClass(field);
  }
  chartHover(e){}
  chartClicked(e){}
  compareObjects(o1: any, o2: any): boolean {
    return o1._id === o2._id;
  }

}
