import { SharedService } from './../../services/shared.service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PATH } from 'src/app/app.constant';
import { AppCookieService } from 'src/app/services/cookieService';
import { HttpService } from 'src/app/services/http.service';
import { email, noExtraWhiteSpace } from 'src/app/services/custom.validations';
import { ValidatorsServiceService } from 'src/app/services/validators-service.service';
import { LocationStrategy } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { ChooseProfileComponent } from 'src/app/components/choose-profile/choose-profile.component';
import { resourceLimits } from 'worker_threads';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  errorMsg: string = '';
  formSubmitAttempt: boolean = false;
  password='password';
  show = false;
  loginTest='null';
  assocations:any;
  isVendor:boolean=false;
  isOwner:boolean=false;
  userData:any={};
  iconShow:boolean = true;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private httpService: HttpService,
    private toastrService: ToastrService,
    private spinnerService: NgxSpinnerService,
    private appCookieService: AppCookieService,
    private sharedService: SharedService,
    private router: Router,
    public validators:ValidatorsServiceService,
    private locationStrategy: LocationStrategy,
    public dialogService: DialogService,
  ) {}

  public loginForm = this.formBuilder.group({
    username: ['', [Validators.required,noExtraWhiteSpace,Validators.maxLength(80),email]],
    password: ['', [Validators.required,noExtraWhiteSpace,Validators.minLength(8),Validators.maxLength(15)]],
    rememberMe: [true],
  });
 
  ngOnInit(): void {
    if (localStorage.getItem('userData')) {
      this.loginForm.patchValue(JSON.parse(localStorage.getItem('userData')));
    }
    this.password = 'password';
    this.preventBackButton();
  }

  preventBackButton() {
    history.pushState(null, null, window.location.href);  
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, window.location.href);
    });  
  }

  login() {
    this.formSubmitAttempt = true;
    if(this.formSubmitAttempt){
      this.iconShow= false;
    }
    if (this.loginForm.invalid) {
      return;
    }
    this.spinnerService.show();
    let payload = this.loginForm.value;
    if (this.loginForm.get('rememberMe').value) {
      let data = {
        password:'',
        rememberMe:payload.rememberMe,
        username:payload.username
      };
      localStorage.setItem('userData', JSON.stringify(data));
     
    }
    payload.username=payload.username.toLowerCase();
    payload.username=payload.username.trim();
    this.httpService.postData(PATH.LOGIN,payload).subscribe((res) => {
      this.spinnerService.hide();
      this.appCookieService.set('digiToken', res.token);
      this.userData.token=res.token;
      this.userData.username=res.username;
      // this.appCookieService.set('digiUser', JSON.stringify(res));
      // this.appCookieService.set('digiLogo', JSON.stringify(res.payload.companyLogo));
      this.sharedService.loggedIn(res);
      let type = res.type;
      if (type == 'ADMIN') {
        this.userData.entityId="";
        this.userData.entityType="ADMIN";
        this.userData.eroles=['ROLE_ADMIN'];
        this.appCookieService.set('digiUser', JSON.stringify(this.userData));
        this.toastrService.success('Login Successful');
        this.router.navigate(['/admin', 'dashboard']);
      }
      if(type == 'NONADMIN'){
          this.userAssocation(res.username);
      }
    },(err) => {
          this.spinnerService.hide();
          console.log(err);
          this.iconShow = true;
          if(err.code==401){
            this.errorMsg = "Incorrect Password / Unauthorized";
          }else if(err.code==400){
            this.errorMsg = "User not active.  Please contact support@digicompplus.com for assistance.";
          }else if(err.code==404){
          this.errorMsg = "Not found";
        }else{
            this.errorMsg = "Please try again after sometime. If issue persists, please contact support@digicompplus.com for assistance.";
          }
          this.toastrService.error(this.errorMsg);
        }
      );
  }

  get f() {
    return this.loginForm.controls;
  }

  // getCompanyInfo(user) {
  //   this.spinnerService.show();
  //   this.httpService.getData(PATH.COMPANY_INFORMATION).subscribe((res: any) => {
  //         if (!res) {
  //           this.router.navigate(['/vendor', 'vendor-info']);

  //           this.spinnerService.hide();
  //           return;
  //         }
  //         this.spinnerService.hide();
  //         switch (res.step) {
  //           case 1:
  //             this.router.navigate(['vendor', 'vendor-info', 'company-info']);
  //             break;
  //           case 2:
  //             this.router.navigate(['vendor', 'vendor-info', 'upload-docs']);
  //             break;
  //           case 4:
  //             this.router.navigate(['vendor', 'vendor-info', 'questionnaire']);
  //             break;
  //           case 5:
  //             this.router.navigate(['vendor', 'vendor-info', 'esg']);
  //             break;
  //           case 6:
  //             this.router.navigate(['vendor', 'vendor-info', 'regulations']);
  //             break;
  //           default:
  //             this.router.navigate(['vendor', 'dashboard']);
  //             break;
  //         }
  //       },
  //       (error) => {
  //         this.spinnerService.hide();
  //       }
  //     );
  // }

  rePassword(val){
    if(val.target.value.length>0){
    this.formSubmitAttempt = false;
    this.iconShow = true;
    }

  }
  onClick() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }


  userAssocation(username){
    this.httpService.getData(PATH.GET_ASSOCIATION).subscribe((res:any)=>{
      console.log(res);
      this.assocations=res;
      this.userData.entityId=res[0].entityId;
      this.userData.entityType=res[0].entityType;
      this.userData.eroles=res[0].eroles;
      this.appCookieService.set('digiUser', JSON.stringify(this.userData));
      for(var i=0;i<res.length;i++){
        if(res[i]['eroles']=='ROLE_VENDOR'){
          this.isVendor=true;
        }
        if(res[i]['eroles']=='ROLE_OWNER'){
          this.isOwner=true;
        }
      }
      if(this.isOwner && this.isVendor){
        if(this.assocations.length>0){
          for(var i=0;i<res.length;i++){
                    if(res[i]['eroles']=='ROLE_OWNER'){
                      this.userData.entityId=res[0].entityId;
                      this.userData.entityType=res[0].entityType;
                      this.userData.eroles=res[0].eroles;
                     
                    }
          }
          this.appCookieService.set('digiUser', JSON.stringify(this.userData));
          this.router.navigate(['/customer/dashboard']);
          this.toastrService.success('Login Successful');
        //   const ref = this.dialogService.open(ChooseProfileComponent, {
        //     header: 'Choose Profile',
        //     width: '35%',
        // });
        // ref.onClose.subscribe((type)=>{
        //   if(type=='OWNER'){
        //       for(var i=0;i<res.length;i++){
        //         if(res[i]['eroles']=='ROLE_OWNER'){
        //           this.userData.entityId=res[i].entityId;
        //           this.userData.entityType=res[i].entityType;
        //           this.userData.eroles=res[i].eroles;
        //           this.appCookieService.set('digiUser', JSON.stringify(this.userData));
        //         }
        //       }
        //   }
        //   if(type=='VENDOR'){
        //       for(var i=0;i<res.length;i++){
        //         if(res[i]['eroles']=='ROLE_VENDOR'){
        //           this.userData.entityId=res[i].entityId;
        //           this.userData.entityType=res[i].entityType;
        //           this.userData.eroles=res[i].eroles;
        //           this.appCookieService.set('digiUser', JSON.stringify(this.userData));
        //         }
        //       }
        //   }
        // })
        }
      }
      else{
        if(this.isOwner){
          this.toastrService.success('Login Successful');
          this.router.navigate(['/customer/dashboard']);
        }
        if(this.isVendor){
          this.toastrService.success('Login Successful');
          this.router.navigate(['/vendor', 'vendor-info']);
        }
      }
     
   
  
    })
  }
 

}
