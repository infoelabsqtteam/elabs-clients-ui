/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DocDataShareService } from './doc-data-share.service';

describe('Service: DocDataShare', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DocDataShareService]
    });
  });

  it('should ...', inject([DocDataShareService], (service: DocDataShareService) => {
    expect(service).toBeTruthy();
  }));
});
