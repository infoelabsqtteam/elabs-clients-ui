import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModalComponent } from './form-modal/form-modal.component';
import { FranchiseComponent } from './franchise/franchise.component';
import { AllPackageModule } from '../all-package/all-package.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ChartModalComponent } from './chart-modal/chart-modal.component';
import { CommonFormComponentModule } from '../common-form-component/common-form-component.module';

const models = [
  FormModalComponent,
  FranchiseComponent,
  
];

@NgModule({
  imports: [
    CommonModule,
    CommonFormComponentModule,
    MDBBootstrapModule.forRoot()
  ],
  exports: models,
  declarations: models
})
export class FormModelModule { }
