import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterPopoverComponent } from './character-popover.component';

describe('CharacterPopoverComponent', () => {
  let component: CharacterPopoverComponent;
  let fixture: ComponentFixture<CharacterPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
