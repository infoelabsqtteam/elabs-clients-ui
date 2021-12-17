/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PublicDataShareService } from './public-data-share.service';

describe('Service: PublicDataShare', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PublicDataShareService]
    });
  });

  it('should ...', inject([PublicDataShareService], (service: PublicDataShareService) => {
    expect(service).toBeTruthy();
  }));
});
