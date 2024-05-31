import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevUserPageComponent } from './dev-user-page.component';

describe('DevUserPageComponent', () => {
  let component: DevUserPageComponent;
  let fixture: ComponentFixture<DevUserPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DevUserPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DevUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
