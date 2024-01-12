import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private status$ = new BehaviorSubject<any>('');
  selectedStatus$ = this.status$.asObservable();

  private ownerStatus$ = new BehaviorSubject<any>('');
  selectedOwnerStatus$ = this.ownerStatus$.asObservable();

  private customSubject = new Subject<any>();
  customObservable = this.customSubject.asObservable();

  private callSidenav$ = new Subject<any>();
  sidenav = this.callSidenav$.asObservable();


  constructor() {}

  setCustomerStatus(status: any) {
    this.status$.next(status);
  }

  setOwnerStatus(status: any) {
    this.ownerStatus$.next(status);
  }

  callComponentMethod(value:any) {
    this.customSubject.next(value);
  }

  callSidenav(value:any) {
    this.callSidenav$.next(value);
  }
}
