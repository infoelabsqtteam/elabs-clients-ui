import { Component, OnInit } from '@angular/core';
import { LAYOUT_VERTICAL, LAYOUT_HORIZONTAL } from './m-core.model';
import { StorageService } from '../services/storage/storage.service';
import { DataShareService } from '../services/data-share/data-share.service';

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
    private dataShareService:DataShareService
    ) {
    this.dataShareService.sendCurrentPage('DASHBOARD')
   }

  ngOnInit() {
    // default settings
    const menuType =  this.storageService.GetMenuType();
    if(menuType == 'Horizontal'){
      this.layoutType = LAYOUT_HORIZONTAL; 
      //this.layoutType = LAYOUT_VERTICAL;
    }else{
      this.layoutType = LAYOUT_VERTICAL; 
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
  

}
