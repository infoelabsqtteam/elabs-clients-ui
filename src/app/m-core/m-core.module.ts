import { NgModule } from '@angular/core';
import { McoreRoutingModule } from './m-core-routing.module';
import { CoreModule } from '../core/core.module';
import { DocumentModule } from './document/document.module';
import { FormModelModule } from './modals/form-model.module';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { IConfig, NgxMaskDirective, provideEnvironmentNgxMask, provideNgxMask, } from 'ngx-mask';

import { McoreComponent } from './m-core.component';
import { HomeComponent } from './home/home.component';
import { BuilderComponent } from './builder/builder.component';
import { GridTableViewComponent } from './builder/grid-table-view/grid-table-view.component';
import { GridCardViewComponent } from './builder/grid-card-view/grid-card-view.component';
import { ChartViewComponent } from './builder/chart-view/chart-view.component';
import { InlineFormViewComponent } from './builder/inline-form-view/inline-form-view.component';
import { SidebarSearchComponent } from './builder/sidebar-search/sidebar-search.component';
import { ChatViewComponent } from './builder/chat-view/chat-view.component';
import { GmapViewComponent } from './builder/gmap-view/gmap-view.component';


import { NavigationComponent } from './navigation/navigation.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { QuoteComponent } from './quote/quote.component';
import { AdminComponent } from './admin/admin.component';
import { DiffHtmlComponent } from './diff-html/diff-html.component';

import { SchedulingDashboardComponent } from './scheduling-dashboard/scheduling-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';


import { ReportModule } from './report/report.module';
import { NotificationModule } from './notification/notification.module';





 
export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;
const maskConfig: Partial<IConfig> = {
    validation: false,
  };

@NgModule({
    declarations: [
        McoreComponent,
        HomeComponent,
        BuilderComponent,
        NavigationComponent,
        PermissionsComponent,
        QuoteComponent,       
        AdminComponent,        
        SchedulingDashboardComponent,     
        GridTableViewComponent,
        GridCardViewComponent,        
        ChartViewComponent, 
        InlineFormViewComponent, 
        AdminDashboardComponent, 
        SidebarSearchComponent, 
        ChatViewComponent,          
        GmapViewComponent, 
        DiffHtmlComponent
    ],
    imports: [      
        McoreRoutingModule,        
        MDBBootstrapModule.forRoot(),  
        NgxMaskDirective,
        CoreModule,           
        DocumentModule,
        FormModelModule,
        ReportModule,
        NotificationModule
    ],
    exports:[
        CoreModule
    ],
    providers: [provideEnvironmentNgxMask(maskConfig),provideNgxMask()]

})
export class McoreModule {

}