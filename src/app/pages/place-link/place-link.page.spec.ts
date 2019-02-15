import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceLinkPage } from './place-link.page';

describe('PlaceLinkPage', () => {
  let component: PlaceLinkPage;
  let fixture: ComponentFixture<PlaceLinkPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceLinkPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceLinkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
