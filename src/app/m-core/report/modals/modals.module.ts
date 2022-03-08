import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material-module/angular-material.module';


import { ReportSaveQueryComponent } from './report-save-query/report-save-query.component';
import { ReportLoadQueryComponent } from './report-load-query/report-load-query.component';

const modals =[
    ReportSaveQueryComponent, 
    ReportLoadQueryComponent
]

@NgModule({
  declarations: modals,
  exports : modals,
  imports: [
    CommonModule,
    AngularMaterialModule,
    MDBBootstrapModule.forRoot(),
    ReactiveFormsModule,
    FormsModule 
  ]
})
export class ModalsModule { }
