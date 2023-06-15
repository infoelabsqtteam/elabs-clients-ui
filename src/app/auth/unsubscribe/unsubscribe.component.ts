import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute} from '@angular/router';
import { AuthService, EnvService, StorageService} from '@core/service-lib';


@Component({
  selector: 'app-unsubscribe',
  template: `
    <p>
      unsubscribe
    </p>
  `,
  styles: [
  ]
})
export class UnsubscribeComponent implements OnInit {

  username: string;
  verifyForm: FormGroup;
  emailVarify:boolean = true;
  
  constructor(
    private routers: ActivatedRoute,
    private authServie:AuthService,
    private envService:EnvService,
    private storageService:StorageService
  ) {
  }

  ngOnInit() {
    //console.log(this.route.snapshot.queryParamMap.get("username"));
    //this.username=this.route.snapshot.queryParamMap.get("username");
    this.routers.paramMap.subscribe(params => {
      let email = '';
      let list = '';
      email = params.get('email');
      list = params.get('list');  
      if(email && list){
        let payload = {
          "email":email,
          "list":list
        }
        this.emailVarify = false;
        // this.authServie.userVarify(payload);
        console.log('email :' + email);
        console.log('list:' + list)
      }    
    });
    if(this.emailVarify){
      this.initForm();
    }    
  }

  onVerify(){
    const username = this.verifyForm.value.username;
    const verifycode = this.verifyForm.value.verifycode;
    this.authServie.TryVerify({username:username,verifycode:verifycode})
  }
  
  private initForm(){
    this.verifyForm = new FormGroup({
      'username' : new FormControl(this.username, Validators.required),
      'verifycode':new FormControl('',Validators.required)
    });
    //console.log(this.verifyForm);
  }

}
