/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CoreFunctionService } from './core-function.service';

describe('Service: CoreFunction', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreFunctionService]
    });
  });

  it('should ...', inject([CoreFunctionService], (service: CoreFunctionService) => {
    expect(service).toBeTruthy();
  }));
});
