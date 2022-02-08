import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import {MatExpansionModule} from '@angular/material/expansion';
import { CoreModule } from '../../core/core.module';
import { MDBBootstrapModule  } from 'angular-bootstrap-md'
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { Ng2SearchPipeModule } from 'ng2-search-filter';



import { TopbarComponent } from './topbar/topbar.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { StatComponent } from './stat/stat.component';
import { AngularMaterialModule } from '../../m-core/angular-material-module/angular-material.module';



@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [TopbarComponent, FooterComponent, SidebarComponent, StatComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PerfectScrollbarModule,
    NgbDropdownModule,
    RouterModule,
    MatExpansionModule,
    CoreModule,
    MDBBootstrapModule.forRoot(),
    LeafletModule,
    Ng2SearchPipeModule,
    AngularMaterialModule
  ],
  exports: [TopbarComponent, FooterComponent, SidebarComponent,StatComponent,PerfectScrollbarModule,LeafletModule,Ng2SearchPipeModule,NgbDropdownModule],
  providers: []
})
export class SharedModule { }
