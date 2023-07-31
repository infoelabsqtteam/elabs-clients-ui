import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material-module/angular-material.module';
import { DirectiveModuleModule } from '../directive-module/directive-module.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormComponent } from './form/form.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { ModelModule } from '../modals/model.module';
import { AllPackageModule } from '../all-package/all-package.module';
import { ChartComponent } from './chart/chart.component';
import { MongodbChartComponent } from './mongodb-chart/mongodb-chart.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { DashboardChartComponent } from './dashboard-chart/dashboard-chart.component';


const components = [
  FormComponent,
  ChartComponent,
  MongodbChartComponent,
  DashboardChartComponent
];
export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;
const maskConfig: Partial<IConfig> = {
    validation: false,
  };

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    MDBBootstrapModule.forRoot(),
    DirectiveModuleModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskModule.forRoot(maskConfig),
    ModelModule,
    AllPackageModule,
    GoogleMapsModule
  ],
  exports:components,
  declarations: components
})
export class CommonComponentModule { }
