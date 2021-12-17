/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CommonApiService } from './common-api.service';

describe('Service: CommonApi', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommonApiService]
    });
  });

  it('should ...', inject([CommonApiService], (service: CommonApiService) => {
    expect(service).toBeTruthy();
  }));
});
