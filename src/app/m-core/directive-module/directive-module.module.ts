import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectiveModuleComponent } from './directive-module.component';
import { DndDirective } from '../../directives/dnd.directive';
import { NumberOnly } from '../../directives/NumberOnly.directive';
import { IsDecimalDirective } from 'src/app/directives/IsDecimalDirective.directive';
import { StickyTableDirective } from 'src/app/directives/sticky-table/StickyTable.directive';
import { StickyDirective } from 'src/app/directives/sticky/sticky.directive';

const directives = [
  DirectiveModuleComponent,
    DndDirective,
    NumberOnly,
    IsDecimalDirective,
    StickyTableDirective,
    StickyDirective
]

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: directives,
  exports : directives

})
export class DirectiveModuleModule { }
