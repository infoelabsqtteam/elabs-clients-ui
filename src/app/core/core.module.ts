import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import { AuthInterceptor } from '../shared/auth.interceptor';
import { LoggingInterceptor } from '../shared/logging.interceptor';

import { MDBBootstrapModule  } from 'angular-bootstrap-md';
import { HeaderLandingPageComponent } from './header-landing-page/header-landing-page.component';
import { ModelModule } from '../m-core/modals/model.module';
import { PageNotFoundComponent } from './error/page-not-found.component';
import { VerifyFailedComponent } from './error/verify-failed.component';
import { UserAccountComponent } from './user-account/user-account.component';
import { SettingMenuComponent } from './setting-menu/setting-menu.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NotificationMenuComponent } from '../m-core/notification/notification-menu/notification-menu.component';

@NgModule({
    declarations : [
        HeaderComponent,
        HomeComponent,
        FooterComponent,
        HeaderLandingPageComponent,
        PageNotFoundComponent,
        VerifyFailedComponent,
        UserAccountComponent,
        SettingMenuComponent,
        SidebarComponent,
        NotificationMenuComponent
        ],
        imports :[
            MDBBootstrapModule.forRoot(),
            ModelModule
            ],
        exports :[
            HeaderComponent,
            HomeComponent,
            FooterComponent,
            HeaderLandingPageComponent,
            UserAccountComponent,
            SettingMenuComponent,
            SidebarComponent,
            ModelModule,           
            ],
        providers:[
        { provide : HTTP_INTERCEPTORS,useClass : AuthInterceptor, multi: true},
        { provide : HTTP_INTERCEPTORS,useClass : LoggingInterceptor, multi: true}
        
        ]
})
export class CoreModule{
    
}