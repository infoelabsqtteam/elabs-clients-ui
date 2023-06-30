import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators,FormBuilder, EmailValidator } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, DataShareService, EnvService, StorageService, CustomvalidationService} from '@core/web-core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  hide = true;
  signUpForm: FormGroup;
  appName: string;
  appNameSubscription;
  title = "";
  template:string = "temp1";
  showpasswrd = false;
  logoPath = ''

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb:FormBuilder,
    private authService:AuthService,
    private dataShareService:DataShareService,
    private envService:EnvService,
    private customValidationService: CustomvalidationService,
    private storageService:StorageService
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

    const email = this.signUpForm.value.email;
    const password = this.signUpForm.value.password;
    const confirmPassword = this.signUpForm.value.password;
    const name = this.signUpForm.value.name;
    const mobile = this.signUpForm.value.mobile;
    const hostName = this.envService.getHostName('origin');
    const domain = hostName + "/#/verify";
    let userId = "";
    if(this.storageService.getVerifyType() == "mobile"){
      userId = mobile;
    }else{
      userId = email;
    }
    const payload = {email: email, password: password, name: name, mobileNumber: mobile, domain:domain,userId:userId }
    this.authService.Signup(payload);
  }

  initForm() {
    this.signUpForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$')]),
      'mobile': new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'confirmPassword': new FormControl("", Validators.required),
      'name': new FormControl('', Validators.required),
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
    this.title = this.envService.getHostKeyValue('title');
  }
  showpassword() {
    this.showpasswrd = !this.showpasswrd;
  }
}
