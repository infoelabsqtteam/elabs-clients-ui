import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { AuthService, DataShareService, StorageService, AuthDataShareService, NotificationService, CustomvalidationService} from '@core/web-core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forgotpwd',
  templateUrl: './forgotpwd.component.html',
  styleUrls: ['./forgotpwd.component.css']
})
export class ForgotPwdComponent implements OnInit {
  hide = true;
  fForm: UntypedFormGroup;
  vForm: UntypedFormGroup;
  username: string;
  resetPwd: boolean = true;
  appName: string;
  appNameSubscription:Subscription;
  title = "";
  template:string = "temp1";
  logoPath = '';
  adminEmail='';
  forGotSubscription:Subscription;
  resetPassSubscription:Subscription;

  constructor(
    private authService:AuthService,
    private dataShareService:DataShareService,
    private storageService:StorageService,
    private authDataShareService: AuthDataShareService,
    private notificationService: NotificationService,
    private customvalidationService:CustomvalidationService
    ) { 
      this.appNameSubscription = this.dataShareService.appName.subscribe(data =>{
        this.setAppName(data);
      })
      this.forGotSubscription = this.authDataShareService.forgot.subscribe(data =>{
        if(data.msg != '') {
          this.notificationService.notify(data.class, data.msg);
        }
        if(data.status == 'success') {
          this.resetPwd = false;
        }
      })
      this.resetPassSubscription = this.authDataShareService.resetPass.subscribe(data =>{
        if(data.msg != '') {
          this.notificationService.notify(data.class, data.msg);
        }
        if(data.status == 'success') {
          this.authService.redirectToSignPage();
        }
      })
      this.pageloded();
    }

  ngOnInit() {
    this.initForm();
    this.pageloded();
  }
  setAppName(data){
    if (data.appName && data.appName.hasOwnProperty("appName")) {
      this.appName = data.appName["appName"]
    }
  }

  onResetPwd() {
    this.username = this.fForm.value.userId;
    let admin = this.fForm.value.admin;
    let payload = {userId:this.username,admin:admin};
    this.authService.TryForgotPassword(payload);
  }

  initForm() {
    this.username = "";
    this.fForm = new UntypedFormGroup({
      'userId': new UntypedFormControl('', [Validators.required]),
      "admin":new UntypedFormControl(false)
    });
    this.vForm = new UntypedFormGroup({
      'verifyCode': new UntypedFormControl('', [Validators.required]),
      'password': new UntypedFormControl('', [Validators.required,this.customvalidationService.patternValidator()]),
    });
  }

  resendCode() {
    this.resetPwd = true;
  }
  onVerifyPwd() {
    const code = this.vForm.value.verifyCode;
    const password = this.vForm.value.password;
    const payload = { userId: this.username, code: code, newPassword: password };
    this.authService.SaveNewPassword(payload);
    
  }
  pageloded(){
    this.logoPath = this.storageService.getLogoPath() + "logo-signin.png";
    this.template = this.storageService.getTemplateName();
    this.title = this.storageService.getPageTitle();
    this.adminEmail = this.storageService.getAdminEmail();
  }
}
