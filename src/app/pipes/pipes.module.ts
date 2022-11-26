import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortingPipePipe } from './sorting-pipe.pipe';
import { SortPipe }  from './sort.pipe';
import { Ng2SearchPipe } from './ng2-filter.pipe';
import { TrimPipe } from './trim.pipe';
const pipes = [
  SortingPipePipe,
  SortPipe,
  Ng2SearchPipe,
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
