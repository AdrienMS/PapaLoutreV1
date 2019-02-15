import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterActionPopoverComponent } from './chapter-action-popover.component';

describe('ChapterActionPopoverComponent', () => {
  let component: ChapterActionPopoverComponent;
  let fixture: ComponentFixture<ChapterActionPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChapterActionPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChapterActionPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
