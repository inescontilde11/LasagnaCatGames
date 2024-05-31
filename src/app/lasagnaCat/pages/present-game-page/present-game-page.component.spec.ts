import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentGamePageComponent } from './present-game-page.component';

describe('PresentGamePageComponent', () => {
  let component: PresentGamePageComponent;
  let fixture: ComponentFixture<PresentGamePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PresentGamePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PresentGamePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
