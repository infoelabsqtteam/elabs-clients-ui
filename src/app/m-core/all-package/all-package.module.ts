import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { GoogleChartsModule } from 'angular-google-charts';
import { GoogleMapsModule } from "@angular/google-maps";
import {NgxPaginationModule} from 'ngx-pagination';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {NgxPrintModule} from 'ngx-print';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { EditorModule } from '@tinymce/tinymce-angular';

const packages = [
  CommonModule,
  NgxMaterialTimepickerModule,
  AngularEditorModule,
  NgxExtendedPdfViewerModule,
  Ng2SearchPipeModule,
  GoogleChartsModule,
  GoogleMapsModule,
  NgxPaginationModule,
  NgxPrintModule,
  MomentDateModule,
  EditorModule,
  CarouselModule
]

@NgModule({
  imports: packages,
  exports: packages,
  declarations: []
})
export class AllPackageModule { }
