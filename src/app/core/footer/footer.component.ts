import { Component, OnInit } from '@angular/core';
import { DataShareService } from '../../services/data-share/data-share.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  currentPage:boolean = false;
  menuBoxHome:boolean = false;
  subscription:any;

  constructor(
    private dataShareService:DataShareService
  ) { 
    this.setpage(this.dataShareService.getCurrentPage());
    this.subscription = this.dataShareService.currentPage.subscribe(
        (data: any) => {
            this.setpage(data);
        },
        error => {
            console.log(error)
        },
        () => console.log('test')
    );
  }

  ngOnInit(): void {
    
  }
  setpage(res){
    switch(res){
      case "HOME":
          this.currentPage = true;  
          this.menuBoxHome = true;
          break;
      case "EXAMTEST":
          this.currentPage = true;  
          this.menuBoxHome = false;
          break;
      case "DASHBOARD":
          this.currentPage = true;      
          this.menuBoxHome = false; 
          break;
      case "MODULE":
          this.currentPage = true;      
          this.menuBoxHome = false; 
          break;
      default :
          this.currentPage = true;   
          this.menuBoxHome = false;
          break;
          
    }
  }

}
