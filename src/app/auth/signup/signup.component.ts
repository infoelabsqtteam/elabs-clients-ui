import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators,FormBuilder, EmailValidator } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/api/auth/auth.service';
import { DataShareService } from 'src/app/services/data-share/data-share.service';
import { EnvService } from 'src/app/services/env/env.service';

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

  template:string = "temp1";

  logoPath = ''

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb:FormBuilder,
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
    const name = this.signUpForm.value.name;
    const mobile = "+91" + this.signUpForm.value.mobile;
    const payload = { appName: this.appName, data: { username: email, email: email, password: password, name: name, phone_number: mobile } }
    this.authService.TrySignup(payload);
    this.router.navigate(['/signin']);
  }

  initForm() {
    this.signUpForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$')]),
      'mobile': new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'name': new FormControl('', Validators.required),
    });
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
    this.logoPath = this.envService.getLogoPath() + "logo-signin.png";
    this.template = this.envService.getTemplateName();
  }
}
