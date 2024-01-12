import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyInformationFormComponent } from './company-information-form.component';

describe('CompanyInformationFormComponent', () => {
  let component: CompanyInformationFormComponent;
  let fixture: ComponentFixture<CompanyInformationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyInformationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyInformationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
