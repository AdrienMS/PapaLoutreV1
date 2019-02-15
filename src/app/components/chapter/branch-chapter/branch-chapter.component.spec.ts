import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchChapterComponent } from './branch-chapter.component';

describe('BranchChapterComponent', () => {
  let component: BranchChapterComponent;
  let fixture: ComponentFixture<BranchChapterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchChapterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchChapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
