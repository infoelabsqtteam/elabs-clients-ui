import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationSettingComponent } from './notification-setting/notification-setting.component';
import { NotificationListComponent } from './notification-list/notification-list.component';

let components = [
  NotificationSettingComponent,
  NotificationListComponent
]
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: components,
  exports : components
})
export class NotificationModule { }
