import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyInfoRegulationsComponent } from './company-info-regulations.component';

describe('CompanyInfoRegulationsComponent', () => {
  let component: CompanyInfoRegulationsComponent;
  let fixture: ComponentFixture<CompanyInfoRegulationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyInfoRegulationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyInfoRegulationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
