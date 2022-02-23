import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import { AuthInterceptor } from '../shared/auth.interceptor';
import { LoggingInterceptor } from '../shared/logging.interceptor';

import { MDBBootstrapModule  } from 'angular-bootstrap-md';

import { HeaderLandingPageComponent } from './header-landing-page/header-landing-page.component';
import { SigninModalComponent } from '../auth/modal/signin-modal/signin-modal.component';
import { SignupModalComponent } from '../auth/modal/signup-modal/signup-modal.component';
import { ForgotpwdModalComponent } from '../auth/modal/forgotpwd-modal/forgotpwd-modal.component';

import { AngularCommonModule } from '../m-core/angular-common/angular-common.module';
import { AngularMaterialModule } from '../m-core/angular-material-module/angular-material.module';
import { FormModelModule } from '../m-core/modals/form-model.module';
import { ModelModule } from '../m-core/modals/model.module';
import { PageNotFoundComponent } from './error/page-not-found.component';
import { VerifyFailedComponent } from './error/verify-failed.component';
import { ReportFormComponent } from './report-form/report-form.component';


@NgModule({
    declarations : [
        HeaderComponent,
        HomeComponent,
        FooterComponent,
        HeaderLandingPageComponent,
        SigninModalComponent,
        SignupModalComponent,
        ForgotpwdModalComponent,
        PageNotFoundComponent,
        VerifyFailedComponent,
        ReportFormComponent,
        ],
        imports :[
            AppRoutingModule,
            MDBBootstrapModule.forRoot(),
            AngularMaterialModule,
            AngularCommonModule,
            FormModelModule,
            ModelModule
            ],
        exports :[
            AppRoutingModule,
            HeaderComponent,
            HomeComponent,
            FooterComponent,
            HeaderLandingPageComponent,
            ReportFormComponent        
            ],
        providers:[
        { provide : HTTP_INTERCEPTORS,useClass : AuthInterceptor, multi: true},
        { provide : HTTP_INTERCEPTORS,useClass : LoggingInterceptor, multi: true}
        
        ]
})
export class CoreModule{
    
}