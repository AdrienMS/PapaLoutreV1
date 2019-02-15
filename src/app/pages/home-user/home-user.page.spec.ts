import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeUserPage } from './home-user.page';

describe('HomeUserPage', () => {
  let component: HomeUserPage;
  let fixture: ComponentFixture<HomeUserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeUserPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
