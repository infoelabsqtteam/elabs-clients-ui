import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators,FormBuilder, EmailValidator } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, DataShareService, EnvService, StorageService, CustomvalidationService, AuthDataShareService, NotificationService} from '@core/web-core';
import { placements } from '@popperjs/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  hide = true;
  signUpForm: FormGroup;
  appName: string;
  appNameSubscription:Subscription;
  signUpInfoSubscribe:Subscription;
  title = "";
  template:string = "temp1";
  showpasswrd = false;
  logoPath = ''
  adminEmail='';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb:FormBuilder,
    private authService:AuthService,
    private dataShareService:DataShareService,
    private envService:EnvService,
    private customValidationService: CustomvalidationService,
    private storageService:StorageService,
    private authDataShareService: AuthDataShareService,
    private notificationService: NotificationService
    ) {
      this.appNameSubscription = this.dataShareService.appName.subscribe(data =>{
        this.setAppName(data);
      })
      this.signUpInfoSubscribe = this.authDataShareService.signUpResponse.subscribe(res =>{
        if(res.msg != '') {
          this.notificationService.notify(res.class, res.msg);
        }
        if(res.status == 'success') {
          this.authService.redirectToSignPage();
        }
      })
      this.pageloded();
     }
    


  ngOnInit() {
    this.initForm();
    this.pageloded();
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.appNameSubscription){
      this.appNameSubscription.unsubscribe();
    }
  }
  setAppName(data){
    if (data.appName && data.appName.hasOwnProperty("appName")) {
      this.appName = data.appName["appName"]
    }
  }

  onSignUp() {
    const payload = this.signUpForm.getRawValue();
    const hostName = this.envService.getHostName('origin');
    const domain = hostName + "/verify";
    let userId = "";
    if(this.storageService.getVerifyType() == "mobile"){
      userId = payload['mobileNumber'];
    }else{
      userId = payload['email'];
    }    
    delete payload['confirmPassword'];
    payload['domain'] = domain;
    payload['userId'] = userId;
    this.authService.Signup(payload);
  }

  initForm() {
    this.signUpForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$')]),
      'mobileNumber': new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
      'password': new FormControl('', [Validators.required, this.customValidationService.patternValidator()]),
      'confirmPassword': new FormControl("", Validators.required),
      'name': new FormControl('', Validators.required),
      'checkAdmin': new FormControl(false),
    },{ validators: this.customValidationService.MatchPassword('password','confirmPassword') }
    );
  }

  checkValidation(){
    if(this.signUpForm.valid){
      return false;
    }
    else{
      return true;
    }
  }
  pageloded(){
    this.logoPath = this.storageService.getLogoPath() + "logo-signin.png";
    this.template = this.storageService.getTemplateName();
    this.title = this.storageService.getPageTitle();
    this.adminEmail = this.storageService.getAdminEmail();
  }
  showpassword() {
    this.showpasswrd = !this.showpasswrd;
  }
}
