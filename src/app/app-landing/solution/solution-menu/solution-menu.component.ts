import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,NavigationStart,NavigationEnd } from '@angular/router';
import { solution } from '../../../core/header-landing-page/menu';

@Component({
  selector: 'app-solution-menu',
  templateUrl: './solution-menu.component.html',
  styleUrls: ['./solution-menu.component.css','../../../../assets/css/app-landing.css']
})
export class SolutionMenuComponent implements OnInit {
  solutions = [];
  currentPage='';
  constructor(
    private router: Router
  ) { 
    this.solutions = solution;
    this.router.events.subscribe(event =>{
        if (event instanceof NavigationEnd) {
          // if(event.urlAfterRedirects == "/"){
            
          // }
          this.currentPage = event.urlAfterRedirects
          console.log(this.currentPage);
        } 
    });
  }

  ngOnInit() {
    
  }

}
