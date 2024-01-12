import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToDashboardComponent } from './add-to-dashboard.component';

describe('AddToDashboardComponent', () => {
  let component: AddToDashboardComponent;
  let fixture: ComponentFixture<AddToDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddToDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
