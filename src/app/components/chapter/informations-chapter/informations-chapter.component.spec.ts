import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationsChapterComponent } from './informations-chapter.component';

describe('InformationsChapterComponent', () => {
  let component: InformationsChapterComponent;
  let fixture: ComponentFixture<InformationsChapterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationsChapterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationsChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
