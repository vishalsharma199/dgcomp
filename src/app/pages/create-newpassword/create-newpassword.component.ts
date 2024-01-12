import { Component, OnInit } from '@angular/core';
import {UntypedFormBuilder,Validators,} from '@angular/forms';
import { PATH } from 'src/app/app.constant';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from 'src/app/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AppCookieService } from 'src/app/services/cookieService';
import { ConfirmedValidator,passwordValidator } from 'src/app/services/custom.validations';
import { ValidatorsServiceService } from 'src/app/services/validators-service.service';
@Component({
  selector: 'app-create-newpassword',
  templateUrl: './create-newpassword.component.html',
  styleUrls: ['./create-newpassword.component.scss'],
})
export class CreateNewpasswordComponent implements OnInit {
  formSubmitAttempt: boolean = false;
  password = 'password';
  show: boolean = false;
  error: boolean = false;
  errorMsg: string = '';
  verificationCode;
  reTypepassword = 'password';
  showReType: boolean = false;

  notMatch:boolean = false;
  length:boolean = false;
  UpperChar:boolean = false;
  LowerChar:boolean = false;
  Numeric:boolean = false;
  SpecialChar:boolean = false;
  passwordPopUP:boolean = false;
  isValidLength:boolean = false;
  iconShow:boolean = true
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private appCookieService: AppCookieService,
    private toastrService: ToastrService,
    private httpService: HttpService,
    public validators:ValidatorsServiceService,
    private spinnerService: NgxSpinnerService
  ) {}
  public resetPasswordForm = this.formBuilder.group(
    {
      password: ['',[Validators.required,passwordValidator]],
      retypePassword: ['', Validators.required],
    },
    {
      validator: ConfirmedValidator('password', 'retypePassword'),
    }
  );

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.verificationCode = params.code;
      this.appCookieService.set('digiToken', this.verificationCode);
    });
  }
  get f() {
    return this.resetPasswordForm.controls;
  }

  sendForgot() {
    this.formSubmitAttempt = true;
    if(this.formSubmitAttempt){
      this.iconShow= false;
    }
    if (this.resetPasswordForm.invalid) {
      return;
    } else {
      this.spinnerService.show();
      let payload = this.resetPasswordForm.value;

      this.httpService.patchData(PATH.FORGOT_PASSWORD, payload).subscribe(
        (res) => {
          this.spinnerService.hide();
          this.toastrService.success('Password Reset Successfully!');
          this.router.navigate(['/login']);
          this.formSubmitAttempt = false;
          this.resetPasswordForm.reset();
        },
        (err) => {
          this.spinnerService.hide();
          this.error = true;
           if(err.code==401){
            this.errorMsg = "Incorrect Password / Unauthorized";
          }else if(err.code==400){
            this.errorMsg = "User not active.  Please contact support@digicompplus.com for assistance.";
          }else{
            this.errorMsg = "Please try again after sometime. If issue persists, please contact support@digicompplus.com for assistance.";
          }
          this.toastrService.error(this.errorMsg);
        }
      );
    }
  }

  viewPassword() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }

  viewRePassword() {
    if (this.reTypepassword === 'password') {
      this.reTypepassword = 'text';
      this.showReType = true;
    } else {
      this.reTypepassword = 'password';
      this.showReType = false;
    }
  }

  rePassword(val){
    if(val.target.value.length>0){
      this.formSubmitAttempt = false;
      this.iconShow = true;
      }
  }

  getValue(val){
    this.passwordPopUP = true ;
    if(val.target.value.length>0){
      this.formSubmitAttempt = false;
      this.iconShow = true;
      }
        if(val.target.value.length >=8){  
          this.length = true;
          this.isValidLength=true;
        }
        else{  this.length = false; 
          this.isValidLength=false;}
       
      if( (/[!@#$%*]/).test(val.target.value)){
      this.SpecialChar = true; }
      else{
      this.SpecialChar = false;
      }
    
      if( (/[0-9]/).test(val.target.value)){
      this.Numeric = true; }
      else{
      this.Numeric = false;
      }
    
    if( (/[a-z]/).test(val.target.value)){
      this.LowerChar = true;}
    else{
      this.LowerChar = false;
    }
    
    if( (/[A-Z]/).test(val.target.value)){
      this.UpperChar = true;
    }
    else{
      this.UpperChar = false;
    }
    if(val.target.value.length >15){  
      this.isValidLength = false;  
    }
   

    }


    // passwordValidator(event:any){
    //   this.validators.passwordValidator(event);
    // }
  

}
