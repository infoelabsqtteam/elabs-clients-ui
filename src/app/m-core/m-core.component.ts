import { Component, OnInit } from '@angular/core';
import { LAYOUT_VERTICAL, LAYOUT_HORIZONTAL } from './m-core.model';
import { StorageService } from '../services/storage/storage.service';
import { DataShareService } from '../services/data-share/data-share.service';
import { EnvService } from 'src/app/services/env/env.service';

@Component({
  selector: 'app-mcore',
  templateUrl: './m-core.component.html',
  styleUrls: ['./m-core.component.css']
})
export class McoreComponent implements OnInit {
  // layout related config
  layoutType: string;

  constructor(
    private storageService:StorageService,
    private dataShareService:DataShareService,
    private envService:EnvService
    ) {
    this.dataShareService.sendCurrentPage('DASHBOARD')
   }

  ngOnInit() {
    // default settings
    const menuType =  this.storageService.GetMenuType();
    if(this.envService.getRequestType() == 'PUBLIC'){
      this.layoutType = LAYOUT_HORIZONTAL; 
    }
    else{
      if(menuType == 'Horizontal'){
        this.layoutType = LAYOUT_HORIZONTAL; 
       // this.layoutType = LAYOUT_VERTICAL;
      }else{
        this.layoutType = LAYOUT_VERTICAL; 
      } 
    }
       
  }

  /**
   * Check if the vertical layout is requested
   */
  isVerticalLayoutRequested() {
    return this.layoutType === LAYOUT_VERTICAL;
  }

  /**
   * Check if the horizontal layout is requested
   */
  isHorizontalLayoutRequested() {
    return this.layoutType === LAYOUT_HORIZONTAL;
  }
  
  shortcutinfoResponce(responce){
    // console.log(responce);
  }
  chartModalResponce(responce){
    // console.log(responce);
  }
  gitModalResponce(responce){
    // console.log(responce);
  }
 

}
