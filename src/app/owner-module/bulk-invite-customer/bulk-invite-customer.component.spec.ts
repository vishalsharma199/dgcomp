import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkInviteCustomerComponent } from './bulk-invite-customer.component';

describe('BulkInviteCustomerComponent', () => {
  let component: BulkInviteCustomerComponent;
  let fixture: ComponentFixture<BulkInviteCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkInviteCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkInviteCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
