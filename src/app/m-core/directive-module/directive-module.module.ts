import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectiveModuleComponent } from './directive-module.component';
import { DndDirective } from '../../directives/dnd.directive';
import { NumberOnly } from '../../directives/NumberOnly.directive';
import { IsDecimalDirective } from 'src/app/directives/IsDecimalDirective.directive';

const directives = [
  DirectiveModuleComponent,
    DndDirective,
    NumberOnly,
    IsDecimalDirective
]

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: directives,
  exports : directives

})
export class DirectiveModuleModule { }
