import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DatePipe,CurrencyPipe,TitleCasePipe } from '@angular/common'
import { HttpClientModule,HttpClientXsrfModule,HttpClient } from '@angular/common/http';
import { HashLocationStrategy, Location, LocationStrategy } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { StoreRouterConnectingModule } from '@ngrx/router-store';
// import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MDBBootstrapModule } from 'angular-bootstrap-md';


import { AuthModule } from './auth/auth.module';
import { McoreModule } from './m-core/m-core.module';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { AppLandingModule } from './app-landing/app-landing.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';


import { ModalService } from './m-core/modals/modal.service';
import { StorageService } from './services/storage/storage.service';
import { PermissionService } from './services/permission/permission.service';
import { CommonFunctionService } from './services/common-utils/common-function.service';
import { DataShareService } from './services/data-share/data-share.service';
import { SortPipe } from './pipes/sort.pipe';
import { SettingModalComponent } from './m-core/modals/setting-modal/setting-modal.component';




@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    SettingModalComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),    
    HttpClientModule,    
    AuthModule,
    McoreModule,
    AppLandingModule,
    SharedModule,
    CoreModule,    
    MatSnackBarModule,
    //StoreRouterConnectingModule.forRoot(),
    //!environment.production ? StoreDevtoolsModule.instrument() : [],
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    HttpClientXsrfModule.withOptions({cookieName: 'XSRF-TOKEN'}),
    

    
  ],
  providers: [
    SortPipe,
    StorageService,
    PermissionService,
    ModalService,
    CommonFunctionService,
    DataShareService,DatePipe,
    CurrencyPipe,
    TitleCasePipe, 
    Location , 
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
 
  
})
export class AppModule { }
