
import { NgModule } from '@angular/core';
import { AppLandingRoutingModule } from './app-landing-routing.module';
import { AppLandingComponent } from './app-landing.component';
import { MDBBootstrapModule  } from 'angular-bootstrap-md';


import { CoreModule } from '../core/core.module';
import { FormModelModule } from '../m-core/modals/form-model.module';
import { CommonComponentModule } from '../m-core/common-component/common-component.module';
import { ModelModule } from '../m-core/modals/model.module';
import { AllPackageModule } from '../m-core/all-package/all-package.module';
import { AngularMaterialModule } from '../m-core/angular-material-module/angular-material.module';
import { AngularCommonModule } from '../m-core/angular-common/angular-common.module';

import { HomePageComponent } from './home-page/home-page.component';
import { CareerWithUsComponent } from './career-with-us/career-with-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { CustomerPortalComponent } from './solution/customer-portal/customer-portal.component';
import { SalesManagemntComponent } from './solution/sales-managemnt/sales-managemnt.component';
import { MachineInterfaceComponent } from './solution/machine-interface/machine-interface.component';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailsComponent } from './blog/blog-details/blog-details.component';
import { CaseStudyComponent } from './case-study/case-study.component';
import { SummaryComponent } from './summary/summary.component';
import { TestemonialsComponent } from './testemonials/testemonials.component';
import { SolutionMenuComponent } from './solution/solution-menu/solution-menu.component';
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
import { SolutionMenuMobileComponent } from './solution/solution-menu-mobile/solution-menu-mobile.component';
import { AnalyticsComponent } from './services/analytics/analytics.component';
import { CommunicationsComponent } from './services/communications/communications.component';
import { ComplianceComponent } from './services/compliance/compliance.component';
import { IntegrationsComponent } from './services/integrations/integrations.component';
import { SecuredCloudComponent } from './services/secured-cloud/secured-cloud.component';
import { DownloadReportComponent } from './download-report/download-report.component';




@NgModule({
    declarations: [
    	AppLandingComponent,
        HomePageComponent,
        CareerWithUsComponent,
        ContactUsComponent,
        PlatformComponent,
        SecurityComponent,
        CustomerPortalComponent,        
        SalesManagemntComponent,
        MachineInterfaceComponent,
        OperationsManagementComponent,
        TestingProcessAutomationComponent,
        QualityManagementComponent,
        DataLibraryComponent,
        ContractsComponent,
        PayrollManagementComponent,
        HrManagementComponent,
        ProcurementComponent,
        InventoryComponent,
        RemnantSampleComponent,
        IncidentManagementComponent,
        BlogComponent,
        BlogDetailsComponent,
        CaseStudyComponent,
        SummaryComponent,
        TestemonialsComponent,
        SolutionMenuComponent,
        SolutionMenuMobileComponent,
        AnalyticsComponent,
        CommunicationsComponent,
        ComplianceComponent,
        IntegrationsComponent,
        SecuredCloudComponent,
        DownloadReportComponent
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