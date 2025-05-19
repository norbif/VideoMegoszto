import { TestBed } from '@angular/core/testing';

import { NextcloudService } from './nextcloud.service';

describe('NextcloudService', () => {
  let service: NextcloudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NextcloudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
