import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationPopoverComponent } from './information-popover.component';

describe('InformationPopoverComponent', () => {
  let component: InformationPopoverComponent;
  let fixture: ComponentFixture<InformationPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
