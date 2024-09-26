import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
// import { GoogleChartsModule } from 'angular-google-charts';
import { GoogleMapsModule } from "@angular/google-maps";
import {NgxPaginationModule} from 'ngx-pagination';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { EditorModule } from '@tinymce/tinymce-angular';
import { PipesModule } from '../../pipes/pipes.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
// import { AngJsoneditorModule } from '@maaxgr/ang-jsoneditor';

const packages = [
  CommonModule,
  NgxMaterialTimepickerModule,
  AngularEditorModule,
  NgxExtendedPdfViewerModule,
  PipesModule,
  // GoogleChartsModule,
  GoogleMapsModule,
  NgxPaginationModule,
  MomentDateModule,
  EditorModule,
  CarouselModule,
  NgScrollbarModule,
  // AngJsoneditorModule
]

@NgModule({
  imports: packages,
  exports: packages,
  declarations: []
})
export class AllPackageModule { }
