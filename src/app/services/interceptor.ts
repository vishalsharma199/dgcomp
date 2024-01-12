import { Injectable, Inject, Optional } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { tap, finalize, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { AppCookieService } from './cookieService';
import { Router } from '@angular/router';
import { ENETUNREACH } from 'constants';
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable()
export class AppInterceptor implements HttpInterceptor {


  constructor(
    private appCookieService:AppCookieService,
    private router:Router, 
    private spinnerService: NgxSpinnerService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    
    let token = this.appCookieService.get("digiToken");
    let digiUser:any=JSON.parse(this.appCookieService.get("digiUser"));
    // this.spinnerService.show();
    if(digiUser){
      var entityId=digiUser.entityId;
    }
    
    if (token && !entityId) {
      req = req.clone({
        url: req.url,
        setHeaders: {
          Authorization: `${token}`
          // ContextEntityId: `${entityId}`,
          // "Content-Type": "application/json",
        },
      });
    }
    if(token && entityId){
    
      req = req.clone({
        url: req.url,
        setHeaders: {
          Authorization: `${token}`,
          ContextEntityId: `${entityId}`,
          // "Content-Type": "application/json",
        },
      });
    }
    else{
      // this.router.navigate(['login'])
    }
    // this.spinner.show();
    return next.handle(req).pipe(catchError(err => {
      if (err.status === 401) {
        // this.router.navigate(['/login']); 
        // sessionStorage.removeItem('digiToken');
        // sessionStorage.removeItem('digiUser');
      }
      const error = err || err.statusText; return throwError(error);
    }), finalize(() => 
        this.spinnerService.hide()
      ));
  }
}
