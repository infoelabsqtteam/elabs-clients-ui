import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/api/auth/auth.service';
import { EnvService } from 'src/app/services/env/env.service';

@Component({
  selector: 'app-otp-varification',
  templateUrl: './otp-varification.component.html',
  styleUrls: ['./otp-varification.component.css']
})
export class OtpVarificationComponent implements OnInit {

  OtpVarify: FormGroup;

  constructor( 
    private routers: ActivatedRoute,
    private authService:AuthService,
    private envService:EnvService
    ) { }

  ngOnInit(): void {
    this.initForm();
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
  }
  onVerifyAccWithOtp() {    
    const payload = { appName: this.envService.getAppName(), data:this.OtpVarify.value };
    this.authService.OtpVarify(payload);
  }
  resendCode(){
    console.log('resend otp!');
  }
}
