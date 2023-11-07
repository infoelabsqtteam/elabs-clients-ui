import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators,FormBuilder, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { StorageService, AuthService, NotificationService, EnvService, AuthDataShareService, CustomvalidationService } from '@core/web-core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-createpwd',
  templateUrl: './createpwd.component.html',
  styleUrls: ['./createpwd.component.css']
})

export class CreatepwdComponent implements OnInit 
{
  
  hide = true;
  resetPsswordForm: UntypedFormGroup;
  checkShowPassword = false;
  checkOldPassword = false;
  appName: string;
  newpwd: any;
  confirmpwd: any;
  oldpwd: string;
  template:string = "temp1";
  logoPath = '';
  title = ""; 
  changePasswordSubscribe: Subscription;
  resetStorAgeList :any =['ID_TOKEN','EXPIRY_IN','ID_TOKEN_EXPIRY_TIME'];
  constructor(
    private router: Router,
    private storageService:StorageService,
    private authService:AuthService,
    private notificationService:NotificationService,
    private envService:EnvService,
    private location: Location,
    private authDataShareService: AuthDataShareService,
    private customValidationService:CustomvalidationService
  ) {
    this.pageloded();
    this.changePasswordSubscribe = this.authDataShareService.createPwd.subscribe(res =>{
      if(res.msg != '') {
        this.notificationService.notify(res.class, res.msg);
      }
      if(res.status == 'success') {
        if(this.resetStorAgeList && this.resetStorAgeList.length > 0){
          this.resetStorAgeList.forEach(key => {
            this.storageService.removeKeyFromStorage(key);
          });
        }        
        this.authService.redirectToSignPage();
      }
    })
  }
  ngOnInit(): void {
   this.initForm();
  }
  initForm() {
    this.resetPsswordForm = new UntypedFormGroup({
      'oldpwd': new UntypedFormControl('', [Validators.required]),
      'password': new UntypedFormControl('', [Validators.required, this.customValidationService.patternValidator()]),
      'confirmPassword': new UntypedFormControl("", Validators.required),
    },{ validators: this.customValidationService.MatchPassword('password','confirmPassword') }
    );
  }

  
  onChangePwd(){
    let value = this.resetPsswordForm.getRawValue();
     const oldpwd = value.oldpwd;
     const newpwd = value.password;
     const confirmpwd=value.confirmPassword;     
      this.authService.changePassword({currentPassword: oldpwd,newPassword:newpwd,confirmNewPassword:confirmpwd })
      
   
  }

  onBack() {
    this.location.back()
  }

    pageloded(){
      this.logoPath = this.storageService.getLogoPath() + "logo-signin.png";
      this.template = this.storageService.getTemplateName();
      this.title = this.envService.getHostKeyValue('title');
    }
    showPassword() {
      this.checkShowPassword = !this.checkShowPassword;
    }
    showOldPassword() {
      this.checkOldPassword = !this.checkOldPassword;
    }

  }