import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekInformationComponent } from './seek-information.component';

describe('SeekInformationComponent', () => {
  let component: SeekInformationComponent;
  let fixture: ComponentFixture<SeekInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeekInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeekInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
