/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PublicApiService } from './public-api.service';

describe('Service: PublicApi', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PublicApiService]
    });
  });

  it('should ...', inject([PublicApiService], (service: PublicApiService) => {
    expect(service).toBeTruthy();
  }));
});
