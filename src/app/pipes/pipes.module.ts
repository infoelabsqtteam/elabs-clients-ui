import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortingPipePipe } from './sorting-pipe.pipe';
import { SortPipe }  from './sort.pipe';
import { Ng2SearchPipe } from './ng2-filter.pipe';
const pipes = [
  SortingPipePipe,
  SortPipe,
  Ng2SearchPipe
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
