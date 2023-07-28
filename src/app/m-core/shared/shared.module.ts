import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from '../../core/core.module';
import { MDBBootstrapModule  } from 'angular-bootstrap-md';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AllPackageModule } from '../all-package/all-package.module';


import { TopbarComponent } from './topbar/topbar.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { StatComponent } from './stat/stat.component';
import { AngularMaterialModule } from '../../m-core/angular-material-module/angular-material.module';
import { NotificationSettingComponent } from './notification-setting/notification-setting.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { SettingMenuComponent } from './setting-menu/setting-menu.component';



@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [TopbarComponent, FooterComponent, SidebarComponent, StatComponent, NotificationSettingComponent, NotificationListComponent, SettingMenuComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PerfectScrollbarModule,
    NgbDropdownModule,
    RouterModule,
    CoreModule,
    MDBBootstrapModule.forRoot(),
   // Ng2SearchPipeModule,
    AngularMaterialModule,
    AllPackageModule
  ],
  exports: [TopbarComponent, FooterComponent, SidebarComponent,StatComponent,PerfectScrollbarModule,NgbDropdownModule,SettingMenuComponent],
  providers: []
})
export class SharedModule { }
