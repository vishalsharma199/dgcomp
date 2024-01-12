import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorListByOwnerComponent } from './vendor-list-by-owner.component';

describe('VendorListByOwnerComponent', () => {
  let component: VendorListByOwnerComponent;
  let fixture: ComponentFixture<VendorListByOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorListByOwnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorListByOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('testing title',()=>{
    expect(component.filterType).toBe('all');
  })

  it('testing html element',()=>{
    const data=fixture.nativeElement;
    expect(data.querySelector('.left').testContent).toBe('Listing Page');
  })
});
