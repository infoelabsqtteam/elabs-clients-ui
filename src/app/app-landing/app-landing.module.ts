import { NgModule } from '@angular/core';
import { MDBBootstrapModule  } from 'angular-bootstrap-md';

import { AppLandingRoutingModule } from './app-landing-routing.module';
import { CoreModule } from '../core/core.module';
import { FormModelModule } from '../m-core/modals/form-model.module';

import { AppLandingComponent } from './app-landing.component';
import { DownloadReportComponent } from './download-report/download-report.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { DownloadComponent } from './download/download.component';

@NgModule({
    declarations: [
    	AppLandingComponent,     
        DownloadReportComponent,
        PrivacyPolicyComponent,
        DownloadComponent
    ],
    imports: [ 
        AppLandingRoutingModule,
        MDBBootstrapModule.forRoot(), 
        CoreModule,
        FormModelModule
    ]

})
export class AppLandingModule {

}