import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StorageService } from '@core/web-core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  customMessage:any;
  constructor(private storageService:StorageService) {
   }

  ngOnInit(): void {
    let AllModuleList = this.storageService.GetModules();
    let selectedModule = this.storageService.getAppId();
    for(var i=0; i < AllModuleList.length;i++){
      let module = AllModuleList[i];
      if(module.name == selectedModule){
        if(module && module.description){
          this.customMessage = module.description
        }
      }
    }
  }

}
