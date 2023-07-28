import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DatePipe,CurrencyPipe,TitleCasePipe,DecimalPipe,HashLocationStrategy, Location, LocationStrategy, PathLocationStrategy } from '@angular/common'
import { HttpClientModule,HttpClientXsrfModule,HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { FilterPipe } from './pipes/filter.pipe';

import { AuthModule } from './auth/auth.module';
import { McoreModule } from './m-core/m-core.module';
import { CoreModule } from './core/core.module';
import { AppLandingModule } from './app-landing/app-landing.module';
import { AppComponent } from './app.component';
import { ModelModule } from './m-core/modals/model.module';
import { AngularMaterialModule } from './m-core/angular-material-module/angular-material.module';
import { MyLibModule } from '@core/web-core';
import { environment } from '../environments/environment'


@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),    
    HttpClientModule,    
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    HttpClientXsrfModule.withOptions({cookieName: 'XSRF-TOKEN'}),
    AppLandingModule,
    AuthModule,
    CoreModule,
    McoreModule,        
    ModelModule,
    AngularMaterialModule,
    MyLibModule.forRoot(environment),
  ],
  providers: [
    DatePipe,
    CurrencyPipe,
    TitleCasePipe, 
    DecimalPipe,
    Location , 
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    FilterPipe
  ],
})
export class AppModule { }
