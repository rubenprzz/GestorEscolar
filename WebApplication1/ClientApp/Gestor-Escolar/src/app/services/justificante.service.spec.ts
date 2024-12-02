import { TestBed } from '@angular/core/testing';

import { JustificanteService } from './justificante.service';

describe('JustificanteService', () => {
  let service: JustificanteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JustificanteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
