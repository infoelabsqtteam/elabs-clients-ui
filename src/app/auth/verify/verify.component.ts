import { Component, OnInit } from '@angular/core';
import { Validators, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute} from '@angular/router';
import { AuthDataShareService, AuthService, NotificationService } from '@core/web-core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {
  username: string;
  verifyForm: UntypedFormGroup;
  emailVarify:boolean = true;
  verifySubscriptioin: Subscription;
  constructor(
    private routers: ActivatedRoute,
    private authServie:AuthService,
    private authDataShareService: AuthDataShareService,
    private notificationService: NotificationService
  ) {
    this.verifySubscriptioin = this.authDataShareService.otpResponse.subscribe(res =>{
      if(res.msg != '') {
        this.notificationService.notify(res.class, res.msg);
      }
      if(res.status == 'success') {
        this.authServie.redirectToSignPage();
      }
    })
  }

  ngOnInit() {
    //console.log(this.route.snapshot.queryParamMap.get("username"));
    //this.username=this.route.snapshot.queryParamMap.get("username");
    this.routers.paramMap.subscribe(params => {
      let code = '';
      let user = '';
      code = params.get('code'); 
      user = params.get('user');  
      if(code && user){
        let payload = {
          "code":code,
          "user":user
        }
        this.emailVarify = false;
        this.authServie.userVarify(payload);
      }    
    });
    if(this.emailVarify){
      this.initForm();
    }    
  }

  onVerify(){
    const username = this.verifyForm.value.username;
    const verifycode = this.verifyForm.value.verifycode;
    this.authServie.TryVerify({username:username,verifycode:verifycode})
  }
  
  private initForm(){
    this.verifyForm = new UntypedFormGroup({
      'username' : new UntypedFormControl(this.username, Validators.required),
      'verifycode':new UntypedFormControl('',Validators.required)
    });
    //console.log(this.verifyForm);
  }

}

