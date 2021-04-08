import { TestBed } from '@angular/core/testing';

import { UserWorkService } from './user-work.service';

describe('UserWorkService', () => {
  let service: UserWorkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserWorkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
