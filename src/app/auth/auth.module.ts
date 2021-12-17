import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { McoreModule } from '../m-core/m-core.module';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { AuthRoutingModule } from './auth-routing.module';
import { VerifyComponent } from './verify/verify.component';
import { ForgotPwdComponent } from './forgotpwd/forgotpwd.component';
import { MDBBootstrapModule  } from 'angular-bootstrap-md';
import { AdminComponent } from './admin/admin.component';
import { ResetpwdComponent } from './resetpwd/resetpwd.component';
import { OtpVarificationComponent } from './otp-varification/otp-varification.component';
import { CreatepwdComponent } from './createpwd/createpwd.component';


@NgModule({
    declarations:[
       SigninComponent,
       SignupComponent,
       VerifyComponent,
       ForgotPwdComponent,
       AdminComponent,
       ResetpwdComponent,
       OtpVarificationComponent,
       CreatepwdComponent
],
    imports:[
    McoreModule,
        FormsModule,
        AuthRoutingModule,
        ReactiveFormsModule,
        MDBBootstrapModule.forRoot(),
        CommonModule,
        ]
    
})
export class AuthModule{
    
}