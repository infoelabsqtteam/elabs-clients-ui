import { Component, Input, OnInit } from '@angular/core';
import {DataShareService } from '@core/service-lib';


@Component({
  selector: 'app-landing',
  templateUrl: './app-landing.component.html',
  styleUrls: ['./app-landing.component.css']
})
export class AppLandingComponent implements OnInit {
  @Input() public pageName;
  constructor(private dataShareService:DataShareService) { }

  ngOnInit(): void {
    
    this.dataShareService.sendCurrentPage('HOME')
  }
  

}
