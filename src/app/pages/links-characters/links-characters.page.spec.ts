import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinksCharactersPage } from './links-characters.page';

describe('LinksCharactersPage', () => {
  let component: LinksCharactersPage;
  let fixture: ComponentFixture<LinksCharactersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinksCharactersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinksCharactersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
