import { Component,Input ,OnInit } from '@angular/core';
import { Form, UntypedFormGroup, NgForm,UntypedFormBuilder,UntypedFormControl, Validators } from '@angular/forms';
import { HostListener } from '@angular/core';
import { Router,ActivatedRoute   } from '@angular/router';
import { StorageService, AuthService, EnvService, CustomvalidationService } from '@core/web-core';


@Component({
  selector: 'app-resetpwd',
  templateUrl: './resetpwd.component.html',
  styleUrls: ['./resetpwd.component.css']
})
export class ResetpwdComponent implements OnInit {
  loading = false;
  hide = true;
  @Input() public pageName;
  appName: string;
  userName: string = '';
  resetForm:UntypedFormGroup;

  constructor(
    private activeRouter :ActivatedRoute,
    private storageService: StorageService,
    private formBuilder: UntypedFormBuilder,
    private authService:AuthService,
    private envService:EnvService,
    private customvalidationService:CustomvalidationService 
  ) {
    
  }


  ngOnInit() {
    this.activeRouter.paramMap.subscribe(params => {     
      
    this.userName = params.get('username');
      
    });
    this.initForm();
      
  }
  initForm(){
    this.resetForm =this.formBuilder.group(
      {
        'password' : new UntypedFormControl('',[Validators.required,this.customvalidationService.patternValidator()])
      }
    )
  }

  resetNewpass() {
    this.loading = true;
    const userName = this.userName;
    const password = this.resetForm.value.password;
    const session = this.storageService.getResetNewPasswordSession();
    const payload = {
      appId:this.envService.getAppId(),
      data :{ username: userName, password: password, idToken: session }
    }
    this.authService.ResetPass(payload);
    setTimeout(()=>{
      this.loading = false;
      this.resetForm.reset();
    },2000)    
  }

}