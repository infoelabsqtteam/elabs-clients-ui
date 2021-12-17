import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SortPipe } from './sort.pipe';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports:[],
})
export class PipesModule {
  static forRoot() {
    return {
        ngModule: PipesModule,
        providers: [],
    };
 }
}
