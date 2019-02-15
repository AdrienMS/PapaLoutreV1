import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisterPage } from './logister.page';

describe('LogisterPage', () => {
  let component: LogisterPage;
  let fixture: ComponentFixture<LogisterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogisterPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
