import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineChapterComponent } from './timeline-chapter.component';

describe('TimelineChapterComponent', () => {
  let component: TimelineChapterComponent;
  let fixture: ComponentFixture<TimelineChapterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineChapterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
