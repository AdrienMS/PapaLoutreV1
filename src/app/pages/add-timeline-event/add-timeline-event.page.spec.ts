import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTimelineEventPage } from './add-timeline-event.page';

describe('AddTimelineEventPage', () => {
  let component: AddTimelineEventPage;
  let fixture: ComponentFixture<AddTimelineEventPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTimelineEventPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTimelineEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
