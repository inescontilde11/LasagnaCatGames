import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThisUserPageComponent } from './this-user-page.component';

describe('ThisUserPageComponent', () => {
  let component: ThisUserPageComponent;
  let fixture: ComponentFixture<ThisUserPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThisUserPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThisUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
