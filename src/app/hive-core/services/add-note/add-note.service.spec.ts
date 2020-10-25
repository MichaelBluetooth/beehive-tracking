import { TestBed } from '@angular/core/testing';

import { AddNoteService } from './add-note.service';

xdescribe('AddNoteService', () => {
  let service: AddNoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddNoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
