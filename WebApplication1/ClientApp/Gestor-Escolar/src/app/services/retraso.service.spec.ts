import { TestBed } from '@angular/core/testing';

import { RetrasoService } from './retraso.service';

describe('RetrasoService', () => {
  let service: RetrasoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetrasoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
