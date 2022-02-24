import { TestBed } from '@angular/core/testing';

import { CreatePortService } from './create-port.service';

describe('CreatePortService', () => {
  let service: CreatePortService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreatePortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
