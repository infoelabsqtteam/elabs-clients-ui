import { Component, OnInit } from '@angular/core';
import { solution } from '../../../core/header-landing-page/menu';

@Component({
  selector: 'app-solution-menu-mobile',
  templateUrl: './solution-menu-mobile.component.html',
  styleUrls: ['./solution-menu-mobile.component.css','../../../../assets/css/app-landing.css']
})
export class SolutionMenuMobileComponent implements OnInit {

  solutions = [];
  constructor() { 
    this.solutions = solution;
  }

  ngOnInit() {
  }

}
