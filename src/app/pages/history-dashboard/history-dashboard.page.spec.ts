import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryDashboardPage } from './history-dashboard.page';

describe('HistoryDashboardPage', () => {
  let component: HistoryDashboardPage;
  let fixture: ComponentFixture<HistoryDashboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryDashboardPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
