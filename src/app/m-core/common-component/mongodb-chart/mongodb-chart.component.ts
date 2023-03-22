import { Component, OnInit,AfterViewInit,Input, SimpleChanges } from '@angular/core';
import { DataShareService } from 'src/app/services/data-share/data-share.service';
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-mongodb-chart',
  templateUrl: './mongodb-chart.component.html',
  styleUrls: ['./mongodb-chart.component.css']
})
export class MongodbChartComponent implements OnInit,AfterViewInit {

  chartIdList:any = [
    "641ad8da-e448-463c-85ce-db32fce5ad00",
    "63fe85ff-8729-439c-83f5-2c1affec9e69",
    "641ad820-0cee-430c-81c4-0582713b8db9"
  ];
  accessToken:string="";
  mongoChartUrl:string="https://charts.mongodb.com/charts-nonproduction-cgurq";
  @Input() showMongoChart:boolean;

  constructor(
    private dataShareService:DataShareService,
    private storageService:StorageService
  ) {
    this.accessToken = this.storageService.GetIdToken();
   }

  ngOnInit() {
  }
  ngAfterViewInit(){
     //this.populateMongodbChart();
     setTimeout(() => {
      this.populateMongodbChart();
    }, 100);
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(this.showMongoChart){
      setTimeout(() => {
        this.populateMongodbChart();
      }, 100);
      
    }
  }
  populateMongodbChart(){
    if(this.accessToken != "" && this.accessToken != null){
      const sdk = new ChartsEmbedSDK({
        baseUrl: this.mongoChartUrl, // Optional: ~REPLACE~ with the Base URL from your Embed Chart dialog
        getUserToken: () => this.accessToken
      });
      if(this.chartIdList && this.chartIdList.length > 0){
        for (let i = 0; i < this.chartIdList.length; i++) {
          const id = this.chartIdList[i];
          const idRef = document.getElementById(id);
          if(idRef){
            sdk.createChart({
              chartId: id, // Optional: ~REPLACE~ with the Chart ID from your Embed Chart dialog
              height: "350px"
            })
            .render(idRef)
            .catch(() => window.alert('Chart failed to initialise'));
          }
        }
        
      }
    }
  }

}
