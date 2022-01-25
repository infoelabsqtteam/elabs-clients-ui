import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

const commonModules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  BrowserModule
]

@NgModule({
  imports: commonModules,
  exports : commonModules,
  declarations: [

  ]
})
export class AngularCommonModule { }
