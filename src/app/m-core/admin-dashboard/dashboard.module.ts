import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardChartComponent } from './dashboard-chart/dashboard-chart.component';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { CommonComponentModule } from '../common-component/common-component.module';



@NgModule({
  imports: [
    CommonModule,
    CommonComponentModule
  ],
  declarations: [
   AdminDashboardComponent,
   DashboardChartComponent
  ]
})
export class DashboardModule { }
