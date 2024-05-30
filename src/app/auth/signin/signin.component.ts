import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgForm, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
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
  signInForm:UntypedFormGroup;
  checkShowPassword = false;
  template:string = "temp1";
  logoPath = '';
  title = "";
  applicationSettingSubscription:Subscription;
  loginInfoSubscribe:Subscription;
  sessionSubscribe:Subscription
  wrongLoginAttempt:number=0;
  applicationWrongLoginAttempt = 0;
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
          
          if(this.applicationWrongLoginAttempt && res && res.wrongLoginAttempt){
            this.wrongLoginAttempt = res.wrongLoginAttempt;
          }else{
            this.wrongLoginAttempt = 0;
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
    if(this.signInForm){
      this.signInForm.reset();
    }
    this.unsubscribeSubscription();
  }

  unsubscribeSubscription(){
    this.unsubscribe(this.applicationSettingSubscription)
    this.unsubscribe(this.loginInfoSubscribe)
    this.unsubscribe(this.sessionSubscribe)
  }

  ngOnInit() {
    this.initForm();
    this.pageloded();
  }
  initForm() {
    this.signInForm = new UntypedFormGroup({
      //'email': new FormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$')]),
      'userId': new UntypedFormControl('', [Validators.required]),
      'password': new UntypedFormControl('', [Validators.required])
    });
  }

  onSignIn() {
    this.wrongLoginAttempt = 0;
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
    this.wrongLoginAttempt = 0;
    this.applicationWrongLoginAttempt = this.storageService.getAuthenticationSetting()?.wrongLoginAttempt;
  }

  showPassword() {
    this.checkShowPassword = !this.checkShowPassword;
  }

  unsubscribe(variable){
    if(variable){
      variable.unsubscribe();
    }
  }

}
