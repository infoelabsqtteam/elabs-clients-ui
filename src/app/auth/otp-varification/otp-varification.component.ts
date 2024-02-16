import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthDataShareService, AuthService, EnvService, NotificationService, StorageService } from '@core/web-core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-otp-varification',
  templateUrl: './otp-varification.component.html',
  styleUrls: ['./otp-varification.component.css']
})
export class OtpVarificationComponent implements OnInit {

  loading = false;
  OtpVarify: UntypedFormGroup;
  isVerify:boolean = false;

  title = "";
  template:string = "temp1";

  logoPath = '';
  otpVerifySubscriptioin: Subscription;

  constructor( 
    private routers: ActivatedRoute,
    private authService:AuthService,
    private envService:EnvService,
    private storageService:StorageService,
    private authDataShareService: AuthDataShareService,
    private notificationService: NotificationService
    ) { 
      this.otpVerifySubscriptioin = this.authDataShareService.otpResponse.subscribe(res =>{
        this.loading = false;
        this.OtpVarify.reset();
        if(res.msg != '') {
          this.notificationService.notify(res.class, res.msg);
        }
        if(res.status == 'success') {
          this.authService.redirectToSignPage();
        }
      })
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
    this.OtpVarify = new UntypedFormGroup({
      'username': new UntypedFormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$')]),
      'verif_code': new UntypedFormControl('', [Validators.required])
    });
    if(this.storageService.getVerifyType() == "mobile"){
      this.isVerify = true;
    }else{
      this.isVerify = false;
    }
  }
  onVerifyAccWithOtp() { 
    this.loading = true;
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
