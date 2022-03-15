import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppLandingComponent } from './app-landing.component';
import { HomePageComponent } from './home-page/home-page.component';
import { CareerWithUsComponent } from './career-with-us/career-with-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

import { CustomerPortalComponent } from './solution/customer-portal/customer-portal.component';
import { SalesManagemntComponent } from './solution/sales-managemnt/sales-managemnt.component';
import { MachineInterfaceComponent } from './solution/machine-interface/machine-interface.component';
import { PlatformComponent } from './solution/platform/platform.component';
import { SecurityComponent } from './solution/security/security.component';
import { OperationsManagementComponent } from './solution/operations-management/operations-management.component';
import { TestingProcessAutomationComponent } from './solution/testing-process-automation/testing-process-automation.component';
import { QualityManagementComponent } from './solution/quality-management/quality-management.component';
import { DataLibraryComponent } from './solution/data-library/data-library.component';
import { PayrollManagementComponent } from './solution/payroll-management/payroll-management.component';
import { HrManagementComponent } from './solution/hr-management/hr-management.component';
import { ContractsComponent } from './solution/contracts/contracts.component';
import { ProcurementComponent } from './solution/procurement/procurement.component';
import { InventoryComponent } from './solution/inventory/inventory.component';
import { RemnantSampleComponent } from './solution/remnant-sample/remnant-sample.component';
import { IncidentManagementComponent } from './solution/incident-management/incident-management.component';

import { BlogComponent } from './blog/blog.component';
import { BlogDetailsComponent } from './blog/blog-details/blog-details.component';
import { CaseStudyComponent } from './case-study/case-study.component';
import { SummaryComponent } from './summary/summary.component';
import { TestemonialsComponent } from './testemonials/testemonials.component';
//import { CaseStudyComponent } from './case-study/case-study.component';
import { DownloadReportComponent } from './download-report/download-report.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

const appLandingRoutes : Routes = [

        {path: '', component: AppLandingComponent, children:[
            { path: 'privacy-policy', pathMatch: 'full', component: PrivacyPolicyComponent},
        //     {path: 'home_page', component: HomePageComponent},
        //     {path: 'career-with-us', component: CareerWithUsComponent},
        //     {path: 'contact-us', component: ContactUsComponent}, 
        //     {path: 'platform', component: PlatformComponent},            
        //     {path: 'security', component: SecurityComponent},
        //     {path: 'customer-portal', component:CustomerPortalComponent},
        //     {path: 'sales-management', component:SalesManagemntComponent},
        //     {path:'machine-interface',component:MachineInterfaceComponent},
        //     {path: 'operations-management', component: OperationsManagementComponent},
        //     {path: 'testing-process-automation', component: TestingProcessAutomationComponent},
        //     {path: 'quality-management', component: QualityManagementComponent},
        //     {path: 'document-library', component: DataLibraryComponent},
        //     {path: 'contracts', component: ContractsComponent},
        //     {path: 'payroll-management', component: PayrollManagementComponent},
        //     {path:'hr-management', component:HrManagementComponent},
        //     {path:'procurement', component:ProcurementComponent},
        //     {path:'inventory',component:InventoryComponent},
        //     {path:'shelf-life-study',component:RemnantSampleComponent},
        //     {path:'incident-management',component:IncidentManagementComponent},            
        //     {path:'blog', component:BlogComponent},
        //     {path:'blog/details/:id', component:BlogDetailsComponent},
        //     {path:'case-study',component:CaseStudyComponent},
        //     {path:'summary',component:SummaryComponent},
        //     {path:'testemonials',component:TestemonialsComponent},
            { path: 'download-manual-report', component: DownloadReportComponent },
            
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