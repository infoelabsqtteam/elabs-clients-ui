import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material-module/angular-material.module';
import { DirectiveModuleModule } from '../directive-module/directive-module.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { IConfig, NgxMaskDirective, provideEnvironmentNgxMask, provideNgxMask, } from 'ngx-mask';
import { ModelModule } from '../modals/model.module';
import { AllPackageModule } from '../all-package/all-package.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { FormComponent } from './form/form.component';
import { CommonGridComponent } from './common-grid/common-grid.component';

const components = [
  FormComponent,
  CommonGridComponent
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
    // NgxMaskModule.forRoot(maskConfig),
    NgxMaskDirective,
    ModelModule,
    AllPackageModule,
    GoogleMapsModule
  ],
  exports:components,
  declarations: components,
  providers: [provideEnvironmentNgxMask(maskConfig),provideNgxMask()]
})
export class CommonFormComponentModule { }
