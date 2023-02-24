/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GridCommonFunctionService } from './grid-common-function.service';

describe('Service: GridCommonFunction', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GridCommonFunctionService]
    });
  });

  it('should ...', inject([GridCommonFunctionService], (service: GridCommonFunctionService) => {
    expect(service).toBeTruthy();
  }));
});
