import { Component, Input, OnInit } from '@angular/core';
import { NgForm,FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, EnvService, StorageService, DataShareService } from '@core/web-core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  hide = true;
  @Input() public pageName;
  appName: string;
  signInForm:FormGroup;
  checkShowPassword = false;
  template:string = "temp1";
  logoPath = '';
  title = "";
  applicationSettingSubscription:Subscription;
  constructor(
    private router: Router,
    private authService:AuthService,
    private envService:EnvService,
    private storageService:StorageService,
    private dataShareService:DataShareService
    ) {
      this.pageloded();
      this.applicationSettingSubscription = this.dataShareService.applicationSettings.subscribe(setting =>{
        if(setting == 'setting'){
          this.pageloded();
        }
      })
  }


  ngOnInit() {
    this.initForm();
    this.pageloded();
  }
  initForm() {
    this.signInForm = new FormGroup({
      //'email': new FormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$')]),
      'userId': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required])
    });
  }

  onSignIn() {
    const value = this.signInForm.getRawValue();
    let userId = value.userId;
    const password = value.password;
    if(this.storageService.getVerifyType() == "mobile"){
      userId =  value.userId;
    }else{
      userId =  value.userId;
    }
    this.authService.Signin({ userId: userId, password: password })   
  }

  // @HostListener('window:popstate', ['$event'])
  // onPopState(event) {
   
  //   this.router.navigate(['home_page'])
  // }


  pageloded(){
    this.logoPath = this.storageService.getLogoPath() + "logo-signin.png";
    this.template = this.storageService.getTemplateName();
    this.title = this.storageService.getPageTitle();
  }

  showPassword() {
    this.checkShowPassword = !this.checkShowPassword;
  }

}
