import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceLinkComponent } from './place-link.component';

describe('PlaceLinkComponent', () => {
  let component: PlaceLinkComponent;
  let fixture: ComponentFixture<PlaceLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
