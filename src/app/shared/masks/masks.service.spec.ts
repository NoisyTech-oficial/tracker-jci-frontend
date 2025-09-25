import { TestBed } from '@angular/core/testing';

import { MasksService } from './masks.service';

describe('MasksService', () => {
  let service: MasksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
