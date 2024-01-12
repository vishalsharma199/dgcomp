import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeawayShippingComponent } from './seaway-shipping.component';

describe('SeawayShippingComponent', () => {
  let component: SeawayShippingComponent;
  let fixture: ComponentFixture<SeawayShippingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeawayShippingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeawayShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
