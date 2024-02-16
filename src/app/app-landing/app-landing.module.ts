import { NgModule } from '@angular/core';
import { MDBBootstrapModule  } from 'angular-bootstrap-md';

import { AppLandingRoutingModule } from './app-landing-routing.module';
import { CoreModule } from '../core/core.module';
import { FormModelModule } from '../m-core/modals/form-model.module';
import { CommonComponentModule } from '../m-core/common-component/common-component.module';
import { ModelModule } from '../m-core/modals/model.module';
import { AllPackageModule } from '../m-core/all-package/all-package.module';
import { AngularMaterialModule } from '../m-core/angular-material-module/angular-material.module';
import { AngularCommonModule } from '../m-core/angular-common/angular-common.module';

import { DownloadReportComponent } from './download-report/download-report.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { AppLandingComponent } from './app-landing.component';




@NgModule({
    declarations: [
        AppLandingComponent,
        DownloadReportComponent,
        PrivacyPolicyComponent
    ],
    imports: [ 
        AppLandingRoutingModule,
        MDBBootstrapModule.forRoot(), 
        CoreModule,
        FormModelModule,
        CommonComponentModule,
        ModelModule,
        AllPackageModule,
        FormModelModule,
        AngularMaterialModule,
        AngularCommonModule
    ]

})
export class AppLandingModule {

}