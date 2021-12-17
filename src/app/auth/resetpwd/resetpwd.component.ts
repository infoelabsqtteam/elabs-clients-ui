import { Component,Input ,OnInit } from '@angular/core';
import { Form, FormGroup, NgForm,FormBuilder,FormControl, Validators } from '@angular/forms';
import * as appConstant from '../../shared/app.constants';
import { HostListener } from '@angular/core';
import { Router,ActivatedRoute   } from '@angular/router';
import { StorageService} from '../../services/storage/storage.service';
import { AuthService } from 'src/app/services/api/auth/auth.service';

@Component({
  selector: 'app-resetpwd',
  templateUrl: './resetpwd.component.html',
  styleUrls: ['./resetpwd.component.css']
})
export class ResetpwdComponent implements OnInit {
  hide = true;
  @Input() public pageName;
  appName: string;
  userName: string = '';
  resetForm:FormGroup;

  constructor(
    private router: Router,
    private activeRouter :ActivatedRoute,
    private storageService: StorageService,
    private formBuilder: FormBuilder,
    private authService:AuthService 
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
        'password' : new FormControl('',Validators.required)
      }
    )
  }

  resetNewpass() {
    const userName = this.userName;
    const password = this.resetForm.value.password;
    const session = this.storageService.getResetNewPasswordSession();
    const payload = {
      appId:appConstant.appId,
      data :{ username: userName, password: password, idToken: session }
    }
    this.authService.ResetPass(payload);    
  }

}