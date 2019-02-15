import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlotPage } from './add-plot.page';

describe('AddPlotPage', () => {
  let component: AddPlotPage;
  let fixture: ComponentFixture<AddPlotPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPlotPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
