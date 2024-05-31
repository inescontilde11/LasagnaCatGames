import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadedGamesComponent } from './downloaded-games.component';

describe('DownloadedGamesComponent', () => {
  let component: DownloadedGamesComponent;
  let fixture: ComponentFixture<DownloadedGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DownloadedGamesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DownloadedGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
