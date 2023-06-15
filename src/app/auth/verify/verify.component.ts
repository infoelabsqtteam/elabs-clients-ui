import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute} from '@angular/router';
import { AuthService } from '@core/service-lib';


@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {
  username: string;
  verifyForm: FormGroup;
  emailVarify:boolean = true;
  constructor(
    private routers: ActivatedRoute,
    private authServie:AuthService
  ) { }

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
    this.verifyForm = new FormGroup({
      'username' : new FormControl(this.username, Validators.required),
      'verifycode':new FormControl('',Validators.required)
    });
    //console.log(this.verifyForm);
  }

}

