import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTimelinePeriodPage } from './add-timeline-period.page';

describe('AddTimelinePeriodPage', () => {
  let component: AddTimelinePeriodPage;
  let fixture: ComponentFixture<AddTimelinePeriodPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTimelinePeriodPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTimelinePeriodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
