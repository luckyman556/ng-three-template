import { TestBed } from '@angular/core/testing';

import { Objects3dService } from './objects3d.service';

describe('Objects3dService', () => {
  let service: Objects3dService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Objects3dService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
