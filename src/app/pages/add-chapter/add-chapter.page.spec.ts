import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChapterPage } from './add-chapter.page';

describe('AddChapterPage', () => {
  let component: AddChapterPage;
  let fixture: ComponentFixture<AddChapterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddChapterPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChapterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
