import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css','../../../assets/css/app-landing.css']
})
export class SummaryComponent implements OnInit {

  customOptions: OwlOptions = {
    loop: true,
    margin:10,
    nav: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
    responsive: {
      0: {
        items: 1 
      },
      600: {
        items: 2
      },
      1000: {
        items: 2
      }
    },
    
  }


  constructor() { }

  ngOnInit(): void {
  }

}
