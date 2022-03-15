import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material-module/angular-material.module';
import { ModalsModule } from '../report/modals/modals.module';
import { ReportFormComponent } from './report-form/report-form.component';
import { ModelModule } from '../modals/model.module';
import { AllPackageModule } from '../all-package/all-package.module';

@NgModule({
  declarations: [
    ReportFormComponent
  ],
  imports: [
    CommonModule,
    ModalsModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    ModelModule,
    AllPackageModule
  ]
})
export class ReportModule { }
