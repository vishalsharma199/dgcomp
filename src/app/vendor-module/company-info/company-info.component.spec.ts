import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyInfo } from './company-info.component';

describe('CompanyInfo', () => {
  let component: CompanyInfo;
  let fixture: ComponentFixture<CompanyInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyInfo ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
