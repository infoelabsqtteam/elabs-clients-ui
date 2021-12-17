import { Component, Input, OnInit, ViewChild, ElementRef,Renderer2 } from '@angular/core';
import { StorageService } from '../../services/storage/storage.service';
import { map, take } from 'rxjs/operators';
import { ModalService } from '../../m-core/modals/modal.service';
import { Router } from '@angular/router';

import { OwlOptions } from 'ngx-owl-carousel-o';
import { DataShareService } from '../../services/data-share/data-share.service';
import { solution } from '../../core/header-landing-page/menu';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css','../../../assets/css/style.css']
})
export class HomePageComponent implements OnInit {
  solution:any ={
    'title':'Platform',
    'description':'The previous student design project was the To Do List application product factory, The counter examples are the result of the efforts of the students and their teamwork in the first course.',
    'list':[
      'Experience teamwork in a real product team and a collaborative effort for a common goal.',
      'Survey real users and needs assessment and find the most suitable solution to their problems.',
      'Design experience from notebooks to user interface design software.'
    ]
  };
  solutions=[];
      
  @Input() public pageName;
  @ViewChild('automation', { static: false }) automation: ElementRef;
  @ViewChild('business', { static: false }) business: ElementRef;
  @ViewChild('customization', { static: false }) customization: ElementRef;
  @ViewChild('information', { static: false }) information: ElementRef;
  
  constructor(
    private router: Router,
    private storageService: StorageService, 
    private modalService: ModalService,
    private dataShareService:DataShareService,
    private renderer: Renderer2
  ) { 
    this.dataShareService.sharedData.subscribe(
      (data: any) => {
        this.scrollToElement(data)
      },
      error => {
          console.log(error)
      },
      () => console.log()
  );
  this.solutions = solution
  }

  ngOnInit(): void {
  }

  openFunctionModal(index){
    const obj = {index:index};
    this.modalService.openLandingFunctionsModal("landing-functions-modal", obj);
  }

  gotoStaticMenu(menu){
      
  
  this.router.navigate([menu])
  }

  scrollToElement(responce){
    // const element = document.querySelector('#'+responce);
    // element.scrollIntoView();
    // let el = document.getElementById(responce);
    // let pos = window.pageYOffset;
    // window.scrollTo(120, pos - 20);
    //el.scrollIntoView();
    const element = this.renderer.selectRootElement(`#${responce}`, true); // true to indicate that you will preserve the content

      element.scrollIntoView({ behavior: 'smooth' }); 
  } 
    
  onChangeSolution(solution:string){
    this.router.navigate([solution])
    // this.solution = solutionList[solution]
  }



  usersay: OwlOptions = {
    loop: true,
    dots: false,
    margin: 10,
    navSpeed: 700,
    navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 3
      }
    },
    nav: true
  }
  slider: OwlOptions = {
    loop: true,
    dots: true,
    margin: 10,
    navSpeed: 700,
    dotsSpeed:700,
    autoplay:true,
    autoplayHoverPause:true,
    animateIn:"fadeIn",
    animateOut: 'fadeOut',
    navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  }



  blogpost: OwlOptions = {
    loop: true,
    nav: false,
    margin: 40,
    navSpeed: 700,
    navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 3
      }
    }
  }

  
}
