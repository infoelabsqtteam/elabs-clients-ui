import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule  }   from '@angular/forms';

import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SharedModule } from '../shared/shared.module';
import { AuthInterceptor } from '../shared/auth.interceptor';
import { LoggingInterceptor } from '../shared/logging.interceptor';
import { MDBBootstrapModule  } from 'angular-bootstrap-md';
import { ShortcutinfoComponent } from '../m-core/modals/shortcutinfo/shortcutinfo.component';
import { AngularMaterialModule } from '../m-core/angular-material-module/angular-material.module';
import { HeaderLandingPageComponent } from './header-landing-page/header-landing-page.component';
import { SigninModalComponent } from '../auth/modal/signin-modal/signin-modal.component';
import { SignupModalComponent } from '../auth/modal/signup-modal/signup-modal.component';
import { ForgotpwdModalComponent } from '../auth/modal/forgotpwd-modal/forgotpwd-modal.component';
import { ChartModalComponent } from '../m-core/modals/chart-modal/chart-modal.component';

@NgModule({
    declarations : [
        HeaderComponent,
        HomeComponent,
        FooterComponent,
        HeaderLandingPageComponent,
        SigninModalComponent,
        SignupModalComponent,
        ForgotpwdModalComponent,
        ShortcutinfoComponent,
        ChartModalComponent
        ],
        imports :[
            SharedModule,
            AppRoutingModule,
            MDBBootstrapModule.forRoot(),
            FormsModule,
            ReactiveFormsModule,
            AngularMaterialModule
            
            ],
        exports :[
            AppRoutingModule,
            HeaderComponent,
            HomeComponent,
            FooterComponent,
            HeaderLandingPageComponent          
            ],
        providers:[
        { provide : HTTP_INTERCEPTORS,useClass : AuthInterceptor, multi: true},
        { provide : HTTP_INTERCEPTORS,useClass : LoggingInterceptor, multi: true}
        
        ]
})
export class CoreModule{
    
}