import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppCookieService } from 'src/app/services/cookieService';
import { HttpService } from 'src/app/services/http.service';
import { PATH } from 'src/app/app.constant';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-to-dashboard',
  templateUrl: './add-to-dashboard.component.html',
  styleUrls: ['./add-to-dashboard.component.scss']
})
export class AddToDashboardComponent implements OnInit {

  type:any;
  addToDashboardForm:any={};
  constructor(private dyanmicDialog: DynamicDialogConfig,
              private appCookieService:AppCookieService,
              private httpService :HttpService,
              private toastrService :ToastrService,
              private spinnerService: NgxSpinnerService,
              private router: Router,
              private ref: DynamicDialogRef,) { }

  ngOnInit(): void {
    this.addToDashboardForm=this.dyanmicDialog.data;
  }

  submit(){
    if(this.type){
      this.spinnerService.show();
      this.addToDashboardForm.vendorType=this.type;
      let payload=this.addToDashboardForm
      this.httpService.postData(PATH.SEARCH_CIS+'/dashboard',payload).subscribe((res:any)=>{
        this.toastrService.success('Added Successfully');
        this.spinnerService.hide();
        this.router.navigate(['/customer/dashboard']);
        this.ref.close();
      },(err)=>{
        this.spinnerService.hide();
        this.toastrService.error(err.message.message);
      });
    }
    else{
      this.toastrService.error('Vendor Type is Required');
    }
  }
}
