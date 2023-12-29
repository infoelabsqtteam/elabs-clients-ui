import { NgModule } from '@angular/core';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { AuthRoutingModule } from './auth-routing.module';
import { VerifyComponent } from './verify/verify.component';
import { ForgotPwdComponent } from './forgotpwd/forgotpwd.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AdminComponent } from './admin/admin.component';
import { ResetpwdComponent } from './resetpwd/resetpwd.component';
import { OtpVarificationComponent } from './otp-varification/otp-varification.component';
import { CreatepwdComponent } from './createpwd/createpwd.component';
import { AngularMaterialModule } from '../m-core/angular-material-module/angular-material.module';
import { AngularCommonModule } from '../m-core/angular-common/angular-common.module';
import { UnsubscribeComponent } from './unsubscribe/unsubscribe.component';
import { AuthenticateComponent } from './authenticate/authenticate.component';


@NgModule({
    declarations: [
        SigninComponent,
        SignupComponent,
        VerifyComponent,
        ForgotPwdComponent,
        AdminComponent,
        ResetpwdComponent,
        OtpVarificationComponent,
        CreatepwdComponent,
        UnsubscribeComponent,
        AuthenticateComponent
    ],
    imports: [
        AuthRoutingModule,
        MDBBootstrapModule.forRoot(),
        AngularMaterialModule,
        AngularCommonModule
    ],
    exports: [
        CreatepwdComponent
    ]

})
export class AuthModule {

}