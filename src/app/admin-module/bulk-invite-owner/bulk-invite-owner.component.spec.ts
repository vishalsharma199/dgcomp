import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkInviteOwnerComponent } from './bulk-invite-owner.component';

describe('InvitesheetComponent', () => {
  let component: BulkInviteOwnerComponent;
  let fixture: ComponentFixture<BulkInviteOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkInviteOwnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkInviteOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
