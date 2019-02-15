import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceSheetComponent } from './place-sheet.component';

describe('PlaceSheetComponent', () => {
  let component: PlaceSheetComponent;
  let fixture: ComponentFixture<PlaceSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
