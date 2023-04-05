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
import { PipesModule } from '../../pipes/pipes.module';
import { MongodbChartComponent } from './mongodb-chart/mongodb-chart.component';

const components = [
  FormComponent,
  ChartComponent,
  MongodbChartComponent
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
    PipesModule
  ],
  exports:components,
  declarations: components
})
export class CommonComponentModule { }
