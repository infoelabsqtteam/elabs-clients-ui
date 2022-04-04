import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DocumentRoutingModule } from './document-routing.module';
import { DocumentComponent } from './document.component';
import { DriveHomeComponent } from './drive-home/drive-home.component';
import { ContextMenuModule } from 'ngx-contextmenu';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AuditListComponent } from './drive-home/audit-list/audit-list.component';
import { DocModelModule } from './doc-model/doc-model.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AngularMaterialModule } from '../angular-material-module/angular-material.module';
import { DirectiveModuleModule } from '../directive-module/directive-module.module';
import { AllPackageModule } from '../all-package/all-package.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    // DocumentRoutingModule,
    NgxDocViewerModule,
    Ng2SearchPipeModule,
    FormsModule,
    ContextMenuModule.forRoot(),
    MDBBootstrapModule.forRoot(),
    DocModelModule,
    AngularMaterialModule,
    DirectiveModuleModule,
    AllPackageModule   
  ],
  declarations: [
    DocumentComponent,
    DriveHomeComponent,
    AuditListComponent
    
  ]
})
export class DocumentModule { }
