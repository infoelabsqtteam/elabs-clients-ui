import { Component, OnInit ,OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ChartType, Stat, Chat, Transaction } from './dashboard.model';
import { statData, revenueChart, salesAnalytics, sparklineEarning, sparklineMonthly, chatData, transactions } from './data';
import { CommonFunctionService, DataShareService, StorageService} from '@core/web-core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit,OnDestroy {

  // term: any;
  // chatData: Chat[];
  // transactions: Transaction[];
  // statData: Stat[];
   userInfo:any = {};
   chartPermission:boolean = false;
   welcometitle:any;

  // bread crumb items
  // breadCrumbItems: Array<{}>;
  // revenueChart: ChartType;
  // salesAnalytics: ChartType;
  // sparklineEarning: ChartType;
  // sparklineMonthly: ChartType;
  // latitude: number;
  // longitude: number;
  // zoom: number;
  // address: string;
  // private geoCoder;
  
  // @ViewChild('search') public searchElementRef: ElementRef;

  // Form submit
  // chatSubmit: boolean;
  isShow:boolean = false;

  // formData: FormGroup;
  mongodbChartShow:boolean = false;
  dashboardMongodbChartShow:boolean = false;
  


  // options = {
  //   layers: [
  //     tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
  //   ],
  //   zoom: 6,
  //   center: latLng(46.879966, -121.726909),
    
  // };
  
  constructor(
    public formBuilder: FormBuilder,
    private commonFunctionService:CommonFunctionService,
    //private mapsAPILoader: MapsAPILoader,
    //private ngZone: NgZone,
    private dataShareService:DataShareService,
    private storageService:StorageService
  ) {
      this.welcometitle = this.storageService.getPageTitle();
      this.mongodbChartShow = true;
      
    }

  ngOnDestroy(){
    this.dataShareService.setChartModelShowHide(true);
  }

  ngOnInit(): void {
    this.dataShareService.setChartModelShowHide(false);
    // this.breadCrumbItems = [{ label: 'Nazox' }, { label: 'Dashboard', active: true }];
    // this.formData = this.formBuilder.group({
    //   message: ['', [Validators.required]],
    // });
    // this._fetchData();
    this.userInfo = this.storageService.GetUserInfo();
    if(this.userInfo && this.userInfo.chart) {
      this.chartPermission = true;
    }else {
      this.chartPermission = false;
    }
    
      
    
  }
  
  getTabIndex(event){
    if(event == 0){
      this.isShow = false;
      this.mongodbChartShow = true;
      this.dashboardMongodbChartShow = false;
    }
    else if (event == 1){
      this.mongodbChartShow = false;
      this.isShow = true;
      this.dashboardMongodbChartShow = false;
    }
    else if (event == 2){
      this.dashboardMongodbChartShow = true;
      this.isShow = false;
      this.mongodbChartShow = false;
    }
    else{
      this.isShow = false;
      this.dashboardMongodbChartShow = false;
      this.mongodbChartShow = true;
    }
  }

  
  // private setCurrentLocation() {
  //   if ('geolocation' in navigator) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       this.latitude = position.coords.latitude;
  //       this.longitude = position.coords.longitude;
  //       this.zoom = 8;
  //       this.getAddress(this.latitude, this.longitude);
  //     });
  //   }
  // }
  
  // getAddress(latitude, longitude) {
  //   this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
  //     if (status === 'OK') {
  //       if (results[0]) {
  //         this.zoom = 12;
  //         this.address = results[0].formatted_address;
  //       } else {
  //         window.alert('No results found');
  //       }
  //     } else {
  //       window.alert('Geocoder failed due to: ' + status);
  //     }
  
  //   });
  // }

  // private _fetchData() {
  //   this.revenueChart = revenueChart;
  //   this.salesAnalytics = salesAnalytics;
  //   this.sparklineEarning = sparklineEarning;
  //   this.sparklineMonthly = sparklineMonthly;
  //   this.chatData = chatData;
  //   this.transactions = transactions;
  //   this.statData = statData;
  // }

  /**
   * Returns form
   */
  // get form() {
  //   return this.formData.controls;
  // }

  /**
   * Save the message in chat
   */
  // messageSave() {
  //   const message = this.formData.get('message').value;
  //   const currentDate = new Date();
  //   if (this.formData.valid && message) {
  //     // Message Push in Chat
  //     this.chatData.push({
  //       align: 'right',
  //       name: 'Ricky Clark',
  //       message,
  //       time: currentDate.getHours() + ':' + currentDate.getMinutes()
  //     });

  //     // Set Form Data Reset
  //     this.formData = this.formBuilder.group({
  //       message: null
  //     });
  //   }

  //   this.chatSubmit = true;
  // }

  

  

  // getTitlecase(value){
  //   return this.commonFunctionService.getTitlecase(value)
  // }

}
