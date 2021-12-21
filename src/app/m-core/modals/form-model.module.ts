import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonComponentModule } from '../common-component/common-component.module';
import { FormModalComponent } from './form-modal/form-modal.component';
import { AllPackageModule } from '../all-package/all-package.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

const models = [
  FormModalComponent
];

@NgModule({
  imports: [
    CommonModule,
    CommonComponentModule,
    AllPackageModule,
    MDBBootstrapModule.forRoot()
  ],
  exports: models,
  declarations: models
})
export class FormModelModule { }
