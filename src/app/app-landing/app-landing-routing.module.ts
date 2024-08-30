import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppLandingComponent } from './app-landing.component';
import { DownloadReportComponent } from './download-report/download-report.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

const appLandingRoutes : Routes = [

        {path: '', component: AppLandingComponent, children:[
            { path: 'privacy-policy', pathMatch: 'full', component: PrivacyPolicyComponent},
            { path: 'download-manual-report', component: DownloadReportComponent },            
            { path : 'pbl/download/:value/:id', component: DownloadReportComponent }            
           ]
         },
    ];

@NgModule({
    imports : [
        RouterModule.forChild(appLandingRoutes)
        ],
    exports:[
        RouterModule
        ]
    
})
export class AppLandingRoutingModule{
    
}