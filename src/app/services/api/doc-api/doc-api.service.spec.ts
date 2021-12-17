/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DocApiService } from './doc-api.service';

describe('Service: DocApi', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DocApiService]
    });
  });

  it('should ...', inject([DocApiService], (service: DocApiService) => {
    expect(service).toBeTruthy();
  }));
});
