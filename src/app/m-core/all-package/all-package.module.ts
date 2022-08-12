import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { AgmDirectionModule } from 'agm-direction';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgApexchartsModule } from 'ng-apexcharts';
import { GoogleChartsModule } from 'angular-google-charts';
import { GoogleMapsModule } from "@angular/google-maps";
import {NgxPaginationModule} from 'ngx-pagination';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {NgxPrintModule} from 'ngx-print';
import { NgxTimerModule } from 'ngx-timer';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NgxDiff2htmlModule } from 'ngx-diff2html';

const packages = [
  CommonModule,
  NgxMaterialTimepickerModule,
  AngularEditorModule,
  NgxExtendedPdfViewerModule,
  AgmDirectionModule,
  Ng2SearchPipeModule,
  NgApexchartsModule,
  GoogleChartsModule,
  GoogleMapsModule,
  NgxPaginationModule,
  NgxPrintModule,
  NgxTimerModule,
  MomentDateModule,
  EditorModule,
  CarouselModule,
  NgxDiff2htmlModule
]

@NgModule({
  imports: packages,
  exports: packages,
  declarations: []
})
export class AllPackageModule { }
