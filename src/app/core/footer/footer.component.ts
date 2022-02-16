import { Component, OnInit } from '@angular/core';
import { DataShareService } from '../../services/data-share/data-share.service';
import { EnvService } from 'src/app/services/env/env.service';
import { StorageService } from 'src/app/services/storage/storage.service';


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
    private envService:EnvService,
    private storageService:StorageService
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
    this.template = this.storageService.getTemplateName();
    this.title = this.envService.getHostKeyValue('title');
  }
}
