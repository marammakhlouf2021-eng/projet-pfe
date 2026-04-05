import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreeradminComponent } from './creeradmin.component';

describe('CreeradminComponent', () => {
  let component: CreeradminComponent;
  let fixture: ComponentFixture<CreeradminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreeradminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreeradminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
