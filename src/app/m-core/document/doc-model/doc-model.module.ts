import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NewFolderCreationComponent } from './new-folder-creation/new-folder-creation.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AllPackageModule } from '../../all-package/all-package.module';
import { MoveFileFolderComponent } from './move-file-folder/move-file-folder.component';
import { DocFileUploadComponent } from './doc-file-upload/doc-file-upload.component';
import { DocViewModelComponent } from './doc-view-model/doc-view-model.component';
import { DocFolderUploadComponent } from './doc-folder-upload/doc-folder-upload.component';
import { AngularMaterialModule } from '../../angular-material-module/angular-material.module';
import { PermissionComponent } from './permission/permission.component';
import { DocFileDownloadComponent } from './doc-file-download/doc-file-download.component';


const models = [
  NewFolderCreationComponent,
  MoveFileFolderComponent,
  DocFileUploadComponent,
  DocViewModelComponent,
  DocFolderUploadComponent,
  PermissionComponent,
  DocFileDownloadComponent
]

@NgModule({
  imports: [
    CommonModule,
    MDBBootstrapModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    AllPackageModule,
    AngularMaterialModule
  ],
  declarations: models,
  exports:models
})
export class DocModelModule { }
