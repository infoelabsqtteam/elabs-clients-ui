import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortingPipePipe } from './sorting-pipe.pipe';
import { SortPipe }  from './sort.pipe';

const pipes = [
  SortingPipePipe,
  SortPipe
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
