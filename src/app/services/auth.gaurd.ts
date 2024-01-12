import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { CompanyInformationFormComponent } from '../vendor-module/company-information-form/company-information-form.component';

@Injectable()
export class CanDeactivateTeam 
{
  constructor() {}

  canDeactivate(
    component: CompanyInformationFormComponent
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    return true;
  }
}
