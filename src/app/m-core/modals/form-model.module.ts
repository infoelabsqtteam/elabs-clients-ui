import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModalComponent } from './form-modal/form-modal.component';
import { FranchiseComponent } from './franchise/franchise.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { CommonFormComponentModule } from '../common-form-component/common-form-component.module';
import { GridModalComponent } from './grid-modal/grid-modal.component';

const models = [
  FormModalComponent,
  FranchiseComponent,
  GridModalComponent
  
];
const exportModels = [
  models,
  CommonFormComponentModule
]

@NgModule({
  imports: [
    CommonModule,
    CommonFormComponentModule,
    MDBBootstrapModule.forRoot()
  ],
  exports: exportModels,
  declarations: models
})
export class FormModelModule { }
