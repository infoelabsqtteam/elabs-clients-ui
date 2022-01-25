import { Component, OnInit } from '@angular/core';
import { DataShareService } from '../../services/data-share/data-share.service';
import { EnvService } from 'src/app/services/env/env.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  currentPage:boolean = false;
  menuBoxHome:boolean = false;
  subscription:any;
  template:string = "temp1";
  title = "";

  constructor(
    private dataShareService:DataShareService,
    private envService:EnvService
  ) {
    this.pageloded();
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
    this.pageloded();
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
  pageloded(){
    this.template = this.envService.getTemplateName();
    this.title = this.envService.getHostKeyValue('title');
  }
}
