/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EnvService } from './env.service';

describe('Service: Env', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnvService]
    });
  });

  it('should ...', inject([EnvService], (service: EnvService) => {
    expect(service).toBeTruthy();
  }));
});
