import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerUserPageComponent } from './player-user-page.component';

describe('PlayerUserPageComponent', () => {
  let component: PlayerUserPageComponent;
  let fixture: ComponentFixture<PlayerUserPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerUserPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayerUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
