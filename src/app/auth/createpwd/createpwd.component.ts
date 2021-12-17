import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators,FormBuilder, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../services/storage/storage.service';
import { AuthService } from 'src/app/services/api/auth/auth.service';
import { NotificationService } from 'src/app/services/notify/notification.service';

@Component({
  selector: 'app-createpwd',
  templateUrl: './createpwd.component.html',
  styleUrls: ['./createpwd.component.css']
})

export class CreatepwdComponent implements OnInit 
{
  form:FormGroup;
 
  appName: string;
  newpwd: any;
  confirmpwd: any;
  oldpwd: string;
    

  constructor(
    private router: Router,
    private storageService:StorageService,
    private authService:AuthService,
    private notificationService:NotificationService
  ) {
    
  }
  ngOnInit(): void {
   
  }

  // onChangePwd(form: NgForm) {
  //   console.log(1);
  //   const email = form.value.email;
  //   const oldpwd = form.value.oldpwd;
  //   const newpwd = form.value.newpwd;
  //   //const confirmpwd=form.value.confirmpwd;
  //     if(oldpwd==newpwd)
  //       {
  //         this.store.dispatch(new AuthActions.ChangePassword({ username: email, password: oldpwd,appName: appConstant.appName,newpassword:newpwd }))
  //         console.log(2);
  //       }
  //       else
  //       {
  //         console.warn("Old Password does not match New Password");
  //       }
  // }


  //R & D by Gaurav
  
  // oldpwd="";
  // newpwd="";
  // confirmpwd="";
  
  onChangePwd(form:NgForm)
  {
     const oldpwd = form.value.oldpwd;
     const newpwd = form.value.newpwd;
     const confirmpwd=form.value.confpwd;

    // console.warn(val1);
    // this.oldpwd=val1;

    // console.warn(val2);
    // this.newpwd=val2;

    // console.warn(val3);
    // this.confirmpwd=val3;
    if(newpwd==confirmpwd)
    {  
      this.authService.changePassword({password: oldpwd,new_password:newpwd,accessToken: this.storageService.GetAccessToken() });
      // this.store.dispatch(new AuthActions.ChangePassword({password: oldpwd,new_password:newpwd,accessToken: this.storageService.GetAccessToken() }))
    }
    else
    {
       console.log('New password and confirm password does not match');
        this.notificationService.notify("bg-danger", "New password and confirm password does not match");
       //alert("New password and confirm password does not match");
    }
  }

      onBack()                                              //Added for backButton on change Password
         {
             this.router.navigate(['/home']);             //changed- to user dashboard
          }

  }