import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAdminisComponent } from './login-adminis.component';

describe('LoginAdminisComponent', () => {
  let component: LoginAdminisComponent;
  let fixture: ComponentFixture<LoginAdminisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginAdminisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginAdminisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
