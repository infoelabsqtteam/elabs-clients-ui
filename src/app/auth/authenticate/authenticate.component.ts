import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthDataShareService, AuthService, EnvService, NotificationService, StorageService } from '@core/web-core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lib-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit,OnDestroy {

  loading = false;
  authenticateUser: FormGroup;
  isVerify:boolean = false;
  otpType:String='email';

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
    this.otpVerifySubscriptioin = this.authDataShareService.authResponce.subscribe(res =>{
      
      if(res.msg != '') {
        this.notificationService.notify(res.class, res.msg);
      }
      if(res.status == 'success') {
        this.authService.GetUserInfoFromToken(this.storageService.GetIdToken());
      }else{
        this.loading = false;
        this.authenticateUser.reset();
      }
    })
    this.pageloded();
  }

  ngOnDestroy(): void {
    this.loading = false;
    if(this.authenticateUser){
      this.authenticateUser.reset();
    }    
  }

  ngOnInit(): void {
    this.initForm();
    this.pageloded();
    this.routers.paramMap.subscribe(params => {
      let username = '';
      username = params.get('username'); 
      if(username != undefined && username != ''){
        this.authenticateUser.get('username').setValue(username);         
      }    
    });
  }
  initForm() {
    this.authenticateUser = new FormGroup({
      'username': new FormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$')]),
      'verif_code': new FormControl('', [Validators.required])
    });
    if(this.storageService.getVerifyType() == "mobile"){
      this.isVerify = true;
    }else{
      this.isVerify = false;
    }
  }
  onAuthenticateWithOtp() { 
    this.loading = true;
    const value  = this.authenticateUser.getRawValue(); 
    const user = value['username'];
    const code = value['verif_code'];  
    const payload = {"userId":user,"code":code};
    this.authService.authenticateUser(payload);
  }
 
  pageloded(){
    this.logoPath = this.storageService.getLogoPath() + "logo-signin.png";
    this.template = this.storageService.getTemplateName();
    this.title = this.storageService.getPageTitle();
  }

}
