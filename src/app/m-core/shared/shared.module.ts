import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from '../../core/core.module';
import { MDBBootstrapModule  } from 'angular-bootstrap-md';

import { AllPackageModule } from '../all-package/all-package.module';


// import { TopbarComponent } from './topbar/topbar.component';
import { FooterComponent } from './footer/footer.component';
import { StatComponent } from './stat/stat.component';
import { AngularMaterialModule } from '../../m-core/angular-material-module/angular-material.module';



@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [FooterComponent, StatComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PerfectScrollbarModule,
    NgbDropdownModule,
    RouterModule,
    CoreModule,
    MDBBootstrapModule.forRoot(),
   // Ng2SearchPipeModule,
    AngularMaterialModule,
    AllPackageModule
  ],
  exports: [FooterComponent,StatComponent,PerfectScrollbarModule,NgbDropdownModule],
  providers: []
})
export class SharedModule { }
