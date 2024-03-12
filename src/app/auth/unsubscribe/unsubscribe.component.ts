import { Component, OnInit } from '@angular/core';
import { Validators, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute} from '@angular/router';
import { AuthService, EnvService, StorageService} from '@core/web-core';


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
  verifyForm: UntypedFormGroup;
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
    this.verifyForm = new UntypedFormGroup({
      'username' : new UntypedFormControl(this.username, Validators.required),
      'verifycode':new UntypedFormControl('',Validators.required)
    });
    //console.log(this.verifyForm);
  }

}
