import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material-module/angular-material.module';
import { DirectiveModuleModule } from '../directive-module/directive-module.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AllPackageModule } from '../all-package/all-package.module';
import { ChartComponent } from './chart/chart.component';
import { MongodbChartComponent } from './mongodb-chart/mongodb-chart.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { DashboardChartComponent } from './dashboard-chart/dashboard-chart.component';
import { GridFilterMenuComponent } from './grid-filter-menu/grid-filter-menu.component';
import { FilterComponent } from './filter/filter.component';
import { GridColumnActionMenuComponent } from './grid-column-action-menu/grid-column-action-menu.component';

import { GridComponent } from './grid/grid.component';
import { GridAdvanceFilterComponent } from './grid-advance-filter/grid-advance-filter.component';
import { CountDashbordComponent } from './count-dashbord/count-dashbord.component';
// import { CommonGridComponent } from './common-grid/common-grid.component';
import { TreeViewComponent } from '../builder/tree-view/tree-view.component';

const components = [
  ChartComponent,
  MongodbChartComponent,
  DashboardChartComponent,
  GridFilterMenuComponent,
  FilterComponent,
  GridComponent,
  GridColumnActionMenuComponent,
  GridAdvanceFilterComponent,
  CountDashbordComponent,
  // CommonGridComponent,
  TreeViewComponent
];


@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    MDBBootstrapModule.forRoot(),
    DirectiveModuleModule,
    ReactiveFormsModule,
    FormsModule,
    AllPackageModule,
    GoogleMapsModule,
  ],
  exports:components,
  declarations: components
})
export class CommonComponentModule { }
