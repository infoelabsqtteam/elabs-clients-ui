import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, EnvService, StorageService } from '@core/web-core';


@Component({
  selector: 'app-otp-varification',
  templateUrl: './otp-varification.component.html',
  styleUrls: ['./otp-varification.component.css']
})
export class OtpVarificationComponent implements OnInit {

  OtpVarify: FormGroup;
  isVerify:boolean = false;

  title = "";
  template:string = "temp1";

  logoPath = ''

  constructor( 
    private routers: ActivatedRoute,
    private authService:AuthService,
    private envService:EnvService,
    private storageService:StorageService
    ) { 
      this.pageloded();
    }

  ngOnInit(): void {
    this.initForm();
    this.pageloded();
    this.routers.paramMap.subscribe(params => {
      let username = '';
      username = params.get('username'); 
      if(username != undefined && username != ''){
        this.OtpVarify.get('username').setValue(username);
        if(!this.OtpVarify.get('username').disabled){
          this.OtpVarify.get('username').disable()
        } 
      }    
    });
  }
  initForm() {
    this.OtpVarify = new FormGroup({
      'username': new FormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$')]),
      'verif_code': new FormControl('', [Validators.required])
    });
    if(this.storageService.getVerifyType() == "mobile"){
      this.isVerify = true;
    }else{
      this.isVerify = false;
    }
  }
  onVerifyAccWithOtp() { 
    const value  = this.OtpVarify.getRawValue(); 
    const user = value['username'];
    const code = value['verif_code'];  
    const payload = {"user":user,"code":code};
    //this.authService.OtpVarify(payload);
    this.authService.userVarify(payload);
  }
  resendCode(){
    console.log('resend otp!');
  }
  pageloded(){
    this.logoPath = this.storageService.getLogoPath() + "logo-signin.png";
    this.template = this.storageService.getTemplateName();
    this.title = this.envService.getHostKeyValue('title');
  }
}
