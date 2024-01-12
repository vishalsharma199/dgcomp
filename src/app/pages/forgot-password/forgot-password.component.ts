import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder, Validators, } from '@angular/forms';
import { PATH } from 'src/app/app.constant';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from 'src/app/services/http.service';
import {email, noExtraWhiteSpace } from 'src/app/services/custom.validations';
import { ToastrService } from 'ngx-toastr';
import { ValidatorsServiceService } from 'src/app/services/validators-service.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  formSubmitAttempt: boolean = false;
  isForgotPass:boolean=false;
  errorMsg: any;

  constructor( private formBuilder: UntypedFormBuilder,private httpService:HttpService, 
    private spinnerService: NgxSpinnerService, public validators:ValidatorsServiceService,
    private toastrService:ToastrService,) { }
    public forgotPassword = this.formBuilder.group({
      userName: ['', [Validators.required,noExtraWhiteSpace,Validators.maxLength(80),email]],
    });

  ngOnInit(): void {
  }
  get f() {
    return this.forgotPassword.controls;
  }
  
  sendForgot(){
    this.formSubmitAttempt=true;
    if(this.forgotPassword.invalid){
      return;
    }else{
      let userName= this.forgotPassword.value
      this.spinnerService.show();
      this.httpService.getData(PATH.GET_USER_FORGOT_PASSWORD + userName.userName ).subscribe((res)=>{
        this.isForgotPass=true;
        this.spinnerService.hide();
      },(err) => {
        this.spinnerService.hide();
        if(err.status==401){
          this.errorMsg = "Incorrect Password / Unauthorized";
        }else if(err.status==400){
          this.errorMsg = "User not active.  Please contact support@digicompplus.com for assistance.";
        }else if(err.status==404){
        this.errorMsg = "User does not exists";
      }else{
          this.errorMsg = "Please try again after sometime. If issue persists, please contact support@digicompplus.com for assistance.";
        }
        this.toastrService.error(this.errorMsg);
        this.spinnerService.hide();
      });
      this.formSubmitAttempt=false;
      // this.forgotPassword.reset()
    }
  }

}
