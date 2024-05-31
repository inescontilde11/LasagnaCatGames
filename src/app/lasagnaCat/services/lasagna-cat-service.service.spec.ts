import { TestBed } from '@angular/core/testing';

import { LasagnaCatServiceService } from './lasagna-cat-service.service';

describe('LasagnaCatServiceService', () => {
  let service: LasagnaCatServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LasagnaCatServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
