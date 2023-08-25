import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSuggestionComponent } from './map-suggestion.component';

describe('MapSuggestionComponent', () => {
  let component: MapSuggestionComponent;
  let fixture: ComponentFixture<MapSuggestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MapSuggestionComponent]
    });
    fixture = TestBed.createComponent(MapSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
