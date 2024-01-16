import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgForm,FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, EnvService, StorageService, DataShareService, AuthDataShareService, NotificationService } from '@core/web-core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit,OnDestroy {
  hide = true;
  loading = false;
  @Input() public pageName;
  appName: string;
  signInForm:FormGroup;
  checkShowPassword = false;
  template:string = "temp1";
  logoPath = '';
  title = "";
  applicationSettingSubscription:Subscription;
  loginInfoSubscribe:Subscription;
  sessionSubscribe:Subscription
  constructor(
    private router: Router,
    private authService:AuthService,
    private envService:EnvService,
    private storageService:StorageService,
    private dataShareService:DataShareService,
    private authDataShareService: AuthDataShareService,
    private notificationService: NotificationService
    ) {
      this.pageloded();
      this.applicationSettingSubscription = this.dataShareService.applicationSettings.subscribe(setting =>{
        if(setting == 'setting'){
          this.pageloded();
        }
      })
      this.loginInfoSubscribe = this.authDataShareService.signinResponse.subscribe(res =>{
        if(res && res.message && res.message == 'reset'){
          this.notificationService.notify('bg-info', 'Password expired !!!');
          this.router.navigate(['createpwd']);
        }else if(res && res.msg && res.msg == 'two_factor'){
          let userId = this.signInForm.getRawValue().userId;
          console.log(userId);
          let url = 'authenticate/'+userId;
          this.router.navigate([url]);
        }else if(res && res.message && res.message == 'notify'){
          if(res.msg != '') {
            this.notificationService.notify(res.class, res.msg);
            this.loading = false;
          }
          if(res.status == 'success') {
            this.authService.GetUserInfoFromToken(this.storageService.GetIdToken());
          }
        }else{        
          if(res.msg != '') {
            this.notificationService.notify(res.class, res.msg);            
          }
          if(res.status == 'success') {
            this.authService.GetUserInfoFromToken(this.storageService.GetIdToken());
          }else{
            this.loading = false;
          }
        }
      })
      this.sessionSubscribe = this.authDataShareService.sessionexpired.subscribe(res =>{ 
        if(res && res.msg && res.status == 'success'){
          this.notificationService.notify(res.class, res.msg);
        }
      });
  }

  ngOnDestroy(): void {
    this.loading = false;
    this.signInForm.reset();
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
    this.loading = true;
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
