import { TestBed } from '@angular/core/testing';

import { AddPhotoService } from './add-photo.service';

xdescribe('AddPhotoService', () => {
  let service: AddPhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddPhotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
