import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfInvitedOwnerListComponent } from './self-invited-owner-list.component';

describe('SelfInvitedOwnerListComponent', () => {
  let component: SelfInvitedOwnerListComponent;
  let fixture: ComponentFixture<SelfInvitedOwnerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfInvitedOwnerListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfInvitedOwnerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
