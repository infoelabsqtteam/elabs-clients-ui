import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationSettingComponent } from './notification-setting/notification-setting.component';
import { AngularMaterialModule } from '../angular-material-module/angular-material.module';
import { AllPackageModule } from '../all-package/all-package.module';
import { NotificationModelComponent } from './notification-model/notification-model.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { GridTableViewComponent } from '../builder/grid-table-view/grid-table-view.component';

let components = [
  NotificationSettingComponent,
  NotificationModelComponent
]
@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    AllPackageModule,
    FormsModule,
    NgxPaginationModule
  ],
  declarations: components,
  exports : components
})
export class NotificationModule { }
