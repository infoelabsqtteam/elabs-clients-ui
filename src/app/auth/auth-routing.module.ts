import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { VerifyComponent } from './verify/verify.component';
import { ForgotPwdComponent } from './forgotpwd/forgotpwd.component';
import {AdminComponent} from './admin/admin.component';
import {ResetpwdComponent} from './resetpwd/resetpwd.component';
import { OtpVarificationComponent } from './otp-varification/otp-varification.component';
import { CreatepwdComponent } from './createpwd/createpwd.component';
import { UnsubscribeComponent } from './unsubscribe/unsubscribe.component';

const authRoutes : Routes = [
    {path:'signup',component:SignupComponent, children:[]},
    {path:'signin',component:SigninComponent},
    {path:'fpwd',component:ForgotPwdComponent},
    {path:'verify/:code/:user',component:VerifyComponent},
    {path:'admin',component:AdminComponent},
    {path:'resetpwd/:username',component:ResetpwdComponent},
    {path:'otp_varify/:username',component:OtpVarificationComponent},
    {path:'createpwd',component:CreatepwdComponent},
    {path:'unsubscribe/:email/:list',component:UnsubscribeComponent}
];



@NgModule({
    imports : [
        RouterModule.forChild(authRoutes)
        ],
    exports:[
        RouterModule
        ]
    
})
export class AuthRoutingModule{
    
}