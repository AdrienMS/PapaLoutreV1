import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotLoggedHeaderComponent } from './not-logged-header.component';

describe('NotLoggedHeaderComponent', () => {
  let component: NotLoggedHeaderComponent;
  let fixture: ComponentFixture<NotLoggedHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotLoggedHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotLoggedHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
