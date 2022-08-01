import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material-module/angular-material.module';
import { DirectiveModuleModule } from '../directive-module/directive-module.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

import { ModalsComponent } from './modals.component'
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { TreeViewModalComponent } from './tree-view-modal/tree-view-modal.component';
import { PreviewModalComponent } from './preview-modal/preview-modal.component';
import { GridSelectionModalComponent } from './grid-selection-modal/grid-selection-modal.component';
import { AddOrderModalComponent } from './add-order-modal/add-order-modal.component';
import { TemplateModalComponent } from './template-modal/template-modal.component';
import { FileUploadModalComponent } from './file-upload-modal/file-upload-modal.component';
import { PdfViewerModalComponent } from './pdf-viewer-modal/pdf-viewer-modal.component';
import { MultiDownloadModalComponent } from './multi-download-modal/multi-download-modal.component';
import { FileViewsModalComponent } from './file-views-modal/file-views-modal.component';
import { CommunicationDataModalComponent } from './communication-data-modal/communication-data-modal.component';
import { SettingModalComponent } from './setting-modal/setting-modal.component';
import { ShortcutinfoComponent } from './shortcutinfo/shortcutinfo.component';
import { LandingFunctionsModalComponent } from './landing-functions-modal/landing-functions-modal.component';

import { BisFormComponent } from '../report-form/bis-form/bis-form.component';
import { PharmaFormComponent } from '../report-form/pharma-form/pharma-form.component';
import { AyurvedicFormComponent } from '../report-form/ayurvedic-form/ayurvedic-form.component';
import { EnvironmentFormComponent } from '../report-form/environment-form/environment-form.component';
import { ApedaFormatComponent } from '../report-form/apeda-format/apeda-format.component';
import { EicFormatComponent } from '../report-form/eic-format/eic-format.component';
import { AllPackageModule } from '../all-package/all-package.module';
import { GitVersionComponent } from './git-version/git-version.component';
import { ChartFilterComponent } from './chart-filter/chart-filter.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { DownloadProgressComponent } from './download-progress/download-progress.component';
import { AuditHistoryComponent } from './audit-history/audit-history.component';


const models = [
  ModalsComponent,
  ConfirmModalComponent,
  TreeViewModalComponent,
  PreviewModalComponent,
  GridSelectionModalComponent,
  AddOrderModalComponent,
  TemplateModalComponent,
  FileUploadModalComponent,        
  PdfViewerModalComponent,
  MultiDownloadModalComponent,
  FileViewsModalComponent,
  CommunicationDataModalComponent,
  BisFormComponent,
  PharmaFormComponent,
  AyurvedicFormComponent,
  EnvironmentFormComponent,
  ApedaFormatComponent,
  EicFormatComponent,
  SettingModalComponent,
  LandingFunctionsModalComponent,
  ShortcutinfoComponent,
  GitVersionComponent,
  ChartFilterComponent,
  FeedbackComponent,
  DownloadProgressComponent,
  AuditHistoryComponent,
]

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    MDBBootstrapModule.forRoot(),
    DirectiveModuleModule,
    ReactiveFormsModule,
    FormsModule,
    AllPackageModule
  ],
  declarations: models,
  exports : models
})
export class ModelModule { }
