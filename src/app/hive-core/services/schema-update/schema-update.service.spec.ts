import { TestBed } from '@angular/core/testing';

import { SchemaUpdateService } from './schema-update.service';

describe('SchemaUpdateService', () => {
  let service: SchemaUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchemaUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
