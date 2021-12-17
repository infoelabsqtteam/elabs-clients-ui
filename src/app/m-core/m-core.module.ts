import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { McoreRoutingModule } from './m-core-routing.module';
import { CoreModule } from '../core/core.module';
import { DocumentModule } from './document/document.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { GoogleMapsModule } from "@angular/google-maps";

import { McoreComponent } from './m-core.component';
import { HomeComponent } from './home/home.component';
import { BuilderComponent } from './builder/builder.component';
import { SortTestComponent } from './sort-test/sort-test.component';
import { ModalsComponent } from './modals/modals.component'
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NavigationComponent } from './navigation/navigation.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { QuoteComponent } from './quote/quote.component';
import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component';
import { FormModalComponent } from './modals/form-modal/form-modal.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { AdminComponent } from './admin/admin.component';
import { TreeViewComponent } from './builder/tree-view/tree-view.component';
import { TreeViewModalComponent } from './modals/tree-view-modal/tree-view-modal.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { PreviewModalComponent } from './modals/preview-modal/preview-modal.component';
import { GridSelectionModalComponent } from './modals/grid-selection-modal/grid-selection-modal.component'
import {NgxPrintModule} from 'ngx-print';
import { NgxTimerModule } from 'ngx-timer';
import { SchedulingDashboardComponent } from './scheduling-dashboard/scheduling-dashboard.component';
import { AddOrderModalComponent } from './modals/add-order-modal/add-order-modal.component';
import { BisFormComponent } from './report-form/bis-form/bis-form.component';
import { PharmaFormComponent } from './report-form/pharma-form/pharma-form.component';
import { AyurvedicFormComponent } from './report-form/ayurvedic-form/ayurvedic-form.component';
import { EnvironmentFormComponent } from './report-form/environment-form/environment-form.component';
import { ApedaFormatComponent } from './report-form/apeda-format/apeda-format.component';
import { EicFormatComponent } from './report-form/eic-format/eic-format.component';
import { TemplateModalComponent } from './modals/template-modal/template-modal.component';
import { GridTableViewComponent } from './builder/grid-table-view/grid-table-view.component';
import { GridCardViewComponent } from './builder/grid-card-view/grid-card-view.component';
import { FileUploadModalComponent } from './modals/file-upload-modal/file-upload-modal.component';

import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PdfViewerModalComponent } from './modals/pdf-viewer-modal/pdf-viewer-modal.component';
import { ChartViewComponent } from './builder/chart-view/chart-view.component';
import { MultiDownloadModalComponent } from './modals/multi-download-modal/multi-download-modal.component';
import { FormComponent } from './builder/form/form.component';
import { InlineFormViewComponent } from './builder/inline-form-view/inline-form-view.component';
import { FileViewsModalComponent } from './modals/file-views-modal/file-views-modal.component';
import { SharedModule } from './shared/shared.module';

import { SortingPipePipe } from '../pipes/sorting-pipe.pipe'

import { VerticalComponent } from './vertical/vertical.component';
import { HorizontalComponent } from './horizontal/horizontal.component';

import { MomentDateModule } from '@angular/material-moment-adapter';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SidebarSearchComponent } from './builder/sidebar-search/sidebar-search.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ChatViewComponent } from './builder/chat-view/chat-view.component';
import { SortPipe }  from '../pipes/sort.pipe';
import { CommunicationDataModalComponent } from './modals/communication-data-modal/communication-data-modal.component';
import { GmapViewComponent } from './builder/gmap-view/gmap-view.component';
import { DiffHtmlComponent } from './diff-html/diff-html.component';
import { AngularMaterialModule } from './angular-material-module/angular-material.module';
import { DirectiveModuleModule } from './directive-module/directive-module.module';

 
export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;
const maskConfig: Partial<IConfig> = {
    validation: false,
  };

@NgModule({
    declarations: [
        SortPipe,
	    SortingPipePipe,
        McoreComponent,
        HomeComponent,
        BuilderComponent,
        SortTestComponent,
        NavigationComponent,
        PermissionsComponent,
        QuoteComponent,
        SortTestComponent,
        ModalsComponent,
        ConfirmModalComponent,
        FormModalComponent,
        AdminComponent,
        TreeViewComponent,
        TreeViewModalComponent,
        PreviewModalComponent,
        GridSelectionModalComponent,
        SchedulingDashboardComponent,
        AddOrderModalComponent,
        BisFormComponent,
        PharmaFormComponent,
        AyurvedicFormComponent,
        EnvironmentFormComponent,
        ApedaFormatComponent,
        EicFormatComponent,
        TemplateModalComponent,
        GridTableViewComponent,
        GridCardViewComponent,
        FileUploadModalComponent,        
        PdfViewerModalComponent,
        ChartViewComponent,
        MultiDownloadModalComponent,
        FormComponent,
        InlineFormViewComponent,
        FileViewsModalComponent,
        VerticalComponent, 
        HorizontalComponent, 
        AdminDashboardComponent, 
        SidebarSearchComponent, 
        ChatViewComponent, 
        CommunicationDataModalComponent, 
        GmapViewComponent, 
        DiffHtmlComponent 
    ],
    exports:[
        FormComponent,
        CommonModule,
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        GoogleMapsModule,
        SortPipe,
        FormModalComponent,
        NgApexchartsModule,
        Ng2SearchPipeModule,
        AngularMaterialModule,
        DirectiveModuleModule
    ],
    imports: [
        ReactiveFormsModule,
        FormsModule,
        BrowserModule,
        CommonModule,
        AngularEditorModule,        
        McoreRoutingModule,        
        NgxPaginationModule,
        NgxPrintModule,        
        MDBBootstrapModule.forRoot(),
        NgxMaterialTimepickerModule,
        NgxTimerModule,        
        NgxExtendedPdfViewerModule,        
        NgxMaskModule.forRoot(maskConfig),
        CoreModule,
        SharedModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyA--cLc1-rZJvuV18t0jxlzIbzxahuH-EQ',
            libraries: ['places']
        }),
        AgmDirectionModule,
        NgApexchartsModule,
        Ng2SearchPipeModule,
        MomentDateModule,
        DocumentModule,
        AngularMaterialModule,
        DirectiveModuleModule        
    ]

})
export class McoreModule {

}