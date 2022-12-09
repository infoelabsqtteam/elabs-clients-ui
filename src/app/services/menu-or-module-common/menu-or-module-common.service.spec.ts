/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MenuOrModuleCommonService } from './menu-or-module-common.service';

describe('Service: MenuOrModuleCommon', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MenuOrModuleCommonService]
    });
  });

  it('should ...', inject([MenuOrModuleCommonService], (service: MenuOrModuleCommonService) => {
    expect(service).toBeTruthy();
  }));
});
