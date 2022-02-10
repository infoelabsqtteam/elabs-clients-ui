import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { McoreComponent } from './m-core.component'

import { HomeComponent } from './home/home.component';
import { BuilderComponent } from './builder/builder.component';
import { SortTestComponent } from './sort-test/sort-test.component';
import { NavigationComponent } from './navigation/navigation.component';
import { PermissionsComponent } from './permissions/permissions.component'
import { QuoteComponent } from './quote/quote.component';
import { AdminComponent } from './admin/admin.component';
import { SchedulingDashboardComponent } from './scheduling-dashboard/scheduling-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DiffHtmlComponent } from './diff-html/diff-html.component';
import { DriveHomeComponent } from './document/drive-home/drive-home.component';
import { PageNotFoundComponent } from '../core/error/page-not-found.component';


const elabsRoutes : Routes = [
        {path: '', component: McoreComponent, children:[
                { path : 'template', component:BuilderComponent } ,
                { path : 'pbl/:action/:key1/:key2/:key3', component:BuilderComponent },
                { path : 'sort', component: SortTestComponent },
                { path : 'Navigation', component: NavigationComponent },
                { path : 'permissions', component: PermissionsComponent },
                { path : 'quote', component: QuoteComponent },
                { path : 'user-admin', component: AdminComponent },
                { path : 'scheduling-dashboard', component:SchedulingDashboardComponent},
                { path : 'home', component:HomeComponent},
                { path : 'dashboard', component:AdminDashboardComponent},
                { path : 'diff_html', component:DiffHtmlComponent},
                { path : 'vdr', component: DriveHomeComponent },
                { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
            ],
            runGuardsAndResolvers: 'always'
        },
    ];

@NgModule({
    imports : [
        RouterModule.forChild(elabsRoutes)
        ],
    exports:[
        RouterModule
        ]
    
})
export class McoreRoutingModule{
    
}