import { NgModule } from '@angular/core';
import { McoreRoutingModule } from './m-core-routing.module';
import { CoreModule } from '../core/core.module';
import { SharedModule } from './shared/shared.module';
import { DocumentModule } from './document/document.module';
import { AngularMaterialModule } from './angular-material-module/angular-material.module';
import { DirectiveModuleModule } from './directive-module/directive-module.module';
import { ModelModule } from './modals/model.module';
import { CommonComponentModule } from './common-component/common-component.module';
import { FormModelModule } from './modals/form-model.module';
import { AllPackageModule } from './all-package/all-package.module';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { AgmCoreModule } from '@agm/core';

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
import { TreeViewComponent } from './builder/tree-view/tree-view.component';

import { SortTestComponent } from './sort-test/sort-test.component';
import { NavigationComponent } from './navigation/navigation.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { QuoteComponent } from './quote/quote.component';
import { AdminComponent } from './admin/admin.component';
import { DiffHtmlComponent } from './diff-html/diff-html.component';

import { SchedulingDashboardComponent } from './scheduling-dashboard/scheduling-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

import { VerticalComponent } from './vertical/vertical.component';
import { HorizontalComponent } from './horizontal/horizontal.component';
import { PipesModule } from '../pipes/pipes.module';
import { AngularCommonModule } from './angular-common/angular-common.module';






 
export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;
const maskConfig: Partial<IConfig> = {
    validation: false,
  };

@NgModule({
    declarations: [
        McoreComponent,
        HomeComponent,
        BuilderComponent,
        SortTestComponent,
        NavigationComponent,
        PermissionsComponent,
        QuoteComponent,
        SortTestComponent,        
        AdminComponent,
        TreeViewComponent,        
        SchedulingDashboardComponent,     
        GridTableViewComponent,
        GridCardViewComponent,        
        ChartViewComponent, 
        InlineFormViewComponent,        
        VerticalComponent, 
        HorizontalComponent, 
        AdminDashboardComponent, 
        SidebarSearchComponent, 
        ChatViewComponent,          
        GmapViewComponent, 
        DiffHtmlComponent 
    ],
    imports: [      
        McoreRoutingModule,        
        MDBBootstrapModule.forRoot(),         
        NgxMaskModule.forRoot(maskConfig),
        CoreModule,
        SharedModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyA--cLc1-rZJvuV18t0jxlzIbzxahuH-EQ',
            libraries: ['places']
        }),    
        DocumentModule,
        AngularMaterialModule,
        DirectiveModuleModule,
        ModelModule,
        CommonComponentModule,
        FormModelModule,
        AllPackageModule,
        PipesModule,
        AngularCommonModule      
    ]

})
export class McoreModule {

}