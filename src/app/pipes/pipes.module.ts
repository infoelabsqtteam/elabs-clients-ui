import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortingPipePipe } from './sorting-pipe.pipe';
import { SortPipe }  from './sort.pipe';
import { FilterPipe } from './filter.pipe';
import { TrimPipe } from './trim.pipe';
const pipes = [
  SortingPipePipe,
  SortPipe,
  FilterPipe,
  TrimPipe
]

@NgModule({
  declarations: pipes,
  imports: [
    CommonModule
  ],
  exports:pipes
})
export class PipesModule {
  static forRoot() {
    return {
        ngModule: PipesModule,
        providers: [],
    };
 }
}
