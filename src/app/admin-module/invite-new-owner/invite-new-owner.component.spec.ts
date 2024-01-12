import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteNewOwnerComponent } from './invite-new-owner.component';

describe('InviteNewCustomerComponent', () => {
  let component: InviteNewOwnerComponent;
  let fixture: ComponentFixture<InviteNewOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteNewOwnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteNewOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
