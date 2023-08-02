import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { GoogleChartsModule } from 'angular-google-charts';
import { GoogleMapsModule } from "@angular/google-maps";
import {NgxPaginationModule} from 'ngx-pagination';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxTimerModule } from 'ngx-timer';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NgxDiff2htmlModule } from 'ngx-diff2html';
import { PipesModule } from '../../pipes/pipes.module';

const packages = [
  CommonModule,
  NgxMaterialTimepickerModule,
  AngularEditorModule,
  NgxExtendedPdfViewerModule,
  GoogleChartsModule,
  GoogleMapsModule,
  NgxPaginationModule,
  NgxTimerModule,
  MomentDateModule,
  EditorModule,
  CarouselModule,
  NgxDiff2htmlModule,
  PipesModule
]

@NgModule({
  imports: packages,
  exports: packages,
  declarations: []
})
export class AllPackageModule { }
