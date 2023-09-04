import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, DataShareService, StorageService, EnvService, AuthDataShareService, NotificationService, CustomvalidationService} from '@core/web-core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forgotpwd',
  templateUrl: './forgotpwd.component.html',
  styleUrls: ['./forgotpwd.component.css']
})
export class ForgotPwdComponent implements OnInit {
  hide = true;
  fForm: FormGroup;
  vForm: FormGroup;
  username: string;
  resetPwd: boolean = true;
  appName: string;
  appNameSubscription:Subscription;
  title = "";
  template:string = "temp1";
  logoPath = '';
  forGotSubscription:Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService:AuthService,
    private dataShareService:DataShareService,
    private envService:EnvService,
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
    this.authService.TryForgotPassword(this.username);
  }

  initForm() {
    this.username = "";
    this.fForm = new FormGroup({
      'userId': new FormControl('', [Validators.required]),
    });
    this.vForm = new FormGroup({
      'verifyCode': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required,this.customvalidationService.patternValidator()]),
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
  }
}
