import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppCookieService } from 'src/app/services/cookieService';
@Component({
  selector: 'app-choose-profile',
  templateUrl: './choose-profile.component.html',
  styleUrls: ['./choose-profile.component.scss']
})
export class ChooseProfileComponent implements OnInit {

  type:any;
  userData:any={};
  constructor(   private router: Router,
    private ref: DynamicDialogRef,
    private appCookieService: AppCookieService,) { }

  ngOnInit(): void {
  }

  submit(){
    if(this.type){
      this.userData=JSON.parse(this.appCookieService.get("digiUser"));
      if(this.type=='OWNER'){
        this.router.navigate(['/customer', 'dashboard']);
        this.ref.close('OWNER');
      }
      else{
        this.router.navigate(['/vendor', 'vendor-info']);
        this.ref.close('VENDOR');
      }
    }
  }
}
