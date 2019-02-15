import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacePopoverComponent } from './place-popover.component';

describe('PlacePopoverComponent', () => {
  let component: PlacePopoverComponent;
  let fixture: ComponentFixture<PlacePopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlacePopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacePopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
