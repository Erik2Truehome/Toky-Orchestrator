import { TestBed } from '@angular/core/testing';

import { PortService } from './port.service';

describe('PortServiceService', () => {
  let service: PortService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
