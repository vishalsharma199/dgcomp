import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerComplianceComponent } from './customer-compliance.component';

describe('CustomerComplianceComponent', () => {
  let component: CustomerComplianceComponent;
  let fixture: ComponentFixture<CustomerComplianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerComplianceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerComplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
