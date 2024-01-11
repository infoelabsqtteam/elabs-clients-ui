import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextFieldComponent } from './text-field/text-field.component';
import { AngularMaterialModule } from '../angular-material-module/angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ListOfStringComponent } from './list-of-string/list-of-string.component';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

const components = [
  TextFieldComponent,
  ListOfStringComponent
];

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    NgxMaskModule.forRoot(maskConfig)
  ],
  exports:components,
  declarations: components
})
export class FormFieldsModule { }
