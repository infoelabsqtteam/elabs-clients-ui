import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { McoreComponent } from './m-core.component'

import { HomeComponent } from './home/home.component';
import { BuilderComponent } from './builder/builder.component';
import { NavigationComponent } from './navigation/navigation.component';
import { PermissionsComponent } from './permissions/permissions.component'
import { QuoteComponent } from './quote/quote.component';
import { AdminComponent } from './admin/admin.component';
import { SchedulingDashboardComponent } from './scheduling-dashboard/scheduling-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DiffHtmlComponent } from './diff-html/diff-html.component';
import { DriveHomeComponent } from './document/drive-home/drive-home.component';
import { PageNotFoundComponent } from '../core/error/page-not-found.component';
import { ReportFormComponent } from './report/report-form/report-form.component';
import { NotificationSettingComponent } from './notification/notification-setting/notification-setting.component';
import { NotificationListComponent } from './notification/notification-list/notification-list.component';
import { AuthGuard } from '@core/web-core';
import { SigninComponent } from '../auth/signin/signin.component';

const elabsRoutes : Routes = [
        {path: '', component: McoreComponent, children:[
                { path : '/', component:SigninComponent},
                { path : 'template', component:BuilderComponent} ,//will not in use this time
                { path : 'browse/:moduleId', component:BuilderComponent, canActivate: [AuthGuard] } ,
                { path : 'browse/:moduleId/:menuId', component:BuilderComponent, canActivate: [AuthGuard] } ,
                { path : 'browse/:moduleId/:menuId/:tabid', component:BuilderComponent, canActivate: [AuthGuard] } ,
                { path : 'browse/:moduleId/:menuId/:tabid/:rowId', component:BuilderComponent, canActivate: [AuthGuard] } ,
                { path : 'pbl/:action/:key1/:key2/:key3', component:BuilderComponent },
                { path : 'Navigation', component: NavigationComponent },
                { path : 'permissions', component: PermissionsComponent },
                { path : 'quote', component: QuoteComponent, canActivate: [AuthGuard] },
                { path : 'user-admin', component: AdminComponent, canActivate: [AuthGuard] },
                { path : 'scheduling-dashboard', component:SchedulingDashboardComponent, canActivate: [AuthGuard]},
                { path : 'home', component:HomeComponent, canActivate: [AuthGuard]},
                { path : 'dashboard', component:AdminDashboardComponent, canActivate: [AuthGuard]},
                { path : 'diff_html', component:DiffHtmlComponent, canActivate: [AuthGuard]},
                { path : 'vdr', component: DriveHomeComponent, canActivate: [AuthGuard] },
                { path : 'report', component: ReportFormComponent, canActivate: [AuthGuard] },
                { path : 'notification-setting', component: NotificationSettingComponent, canActivate: [AuthGuard] },
                { path : 'notification-list', component: NotificationListComponent, canActivate: [AuthGuard] },
                { path : 'notification/:moduleId/:menuId/:subMenuId/:tabId/:formName/:recordId', component: BuilderComponent, canActivate: [AuthGuard] },
                { path : '**', pathMatch: 'full', component: PageNotFoundComponent },
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