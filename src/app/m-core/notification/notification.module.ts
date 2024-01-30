import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationSettingComponent } from './notification-setting/notification-setting.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { AngularMaterialModule } from '../angular-material-module/angular-material.module';
import { AllPackageModule } from '../all-package/all-package.module';

let components = [
  NotificationSettingComponent,
  NotificationListComponent
]
@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    AllPackageModule
  ],
  declarations: components,
  exports : components
})
export class NotificationModule { }
