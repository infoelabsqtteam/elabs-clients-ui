import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/api/auth/auth.service';
import { DataShareService } from 'src/app/services/data-share/data-share.service';
import { EnvService } from '../../services/env/env.service';


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
  appNameSubscription;
  title = "";
  template:string = "temp1";
  logoPath = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService:AuthService,
    private dataShareService:DataShareService,
    private envService:EnvService
    ) { 
      this.appNameSubscription = this.dataShareService.appName.subscribe(data =>{
        this.setAppName(data);
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
    this.username = this.fForm.value.email;
    this.authService.TryForgotPassword(this.username );
    this.resetPwd = false;

  }

  initForm() {
    this.username = "";
    this.fForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$')]),
    });
    this.vForm = new FormGroup({
      'verifyCode': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  resendCode() {
    this.resetPwd = true;
  }
  onVerifyPwd() {
    const code = this.vForm.value.verifyCode;
    const password = this.vForm.value.password;
    const payload = { appName: this.appName, data: { username: this.username, verif_code: code, password: password } };
    this.authService.SaveNewPassword(payload);
    this.router.navigate(['/signin']);
  }
  pageloded(){
    this.logoPath = this.envService.getLogoPath() + "logo-signin.png";
    this.template = this.envService.getTemplateName();
    this.title = this.envService.getHostKeyValue('title');
  }
}
