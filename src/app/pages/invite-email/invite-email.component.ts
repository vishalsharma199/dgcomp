import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Country } from 'country-state-city';
import { NgxSpinnerService } from 'ngx-spinner';
import { PATH } from 'src/app/app.constant';
import { SuccessDialogComponent } from 'src/app/components';
import { AppCookieService } from 'src/app/services/cookieService';
import { HttpService } from 'src/app/services/http.service';
import { ConfirmedValidator, noSpecialCharAllow, noWhitespace, passwordValidator } from 'src/app/services/custom.validations';
import { ToastrService } from 'ngx-toastr';
import { ValidatorsServiceService } from 'src/app/services/validators-service.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-invite-email',
  templateUrl: './invite-email.component.html',
  styleUrls: ['./invite-email.component.scss']
})
export class InviteEmailComponent implements OnInit {

  state:any;
  @ViewChild('file') fileInput: ElementRef;
  public countries = Country.getAllCountries();
  error:boolean=false;
  errorMsg:string="";
  formSubmitAttempt:boolean=false;
  verificationCode:string;
  userDetails:any;
  companyNameVerificationCode:string;
  companyNameDetails:any;
  customerNameVerificationCode:string;
  customerNameDetails:any;
  password='password';
  show:boolean = false;
  reTypepassword='password';
  showReType:boolean = false;
  type;
  vendorDefaultSetting;

  notMatch:boolean = false;
  length:boolean = false;
  UpperChar:boolean = false;
  LowerChar:boolean = false;
  Numeric:boolean = false;
  SpecialChar:boolean = false;
  passwordPopUP:boolean = false;
  isValidLength:boolean=false;
  iconShow:boolean = false;
  constructor(private route: ActivatedRoute,
              private formBuilder:UntypedFormBuilder,
              private httpService:HttpService,
              private toastrService:ToastrService,
              private spinnerService:NgxSpinnerService,
              private modalService:NgbModal,
              private httpClient: HttpClient,
              private appCookieService:AppCookieService,
              public validators:ValidatorsServiceService,) { }

  public registerForm=this.formBuilder.group({
      referredBy:[""],
      emailId:["",Validators.maxLength(80)],
      phoneNumber:[""],
      firstName:[""],
      lastName:[""],
      name:[""],
      password:["",[Validators.required,noWhitespace,passwordValidator]],
      retypePassword:["",[Validators.required,noWhitespace]]
    },{
      validator:ConfirmedValidator('password','retypePassword')
    }
  )

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
        this.verificationCode = params.code;
        this.appCookieService.set('digiToken', this.verificationCode);
      }
    );

    this.route.params.subscribe((res) => {
      this.type = res.type;      
    });

    this.getUserDetails();

  }

  getUserDetails(){
    this.spinnerService.show();
    this.httpService.getData(PATH.GET_LOGGEDIN_USER).subscribe((res:any)=>{
      this.registerForm.controls['emailId'].disable();
      this.registerForm.patchValue({
        emailId:res.emailId
      })
      this.spinnerService.hide();
    },(err)=>{
      this.spinnerService.hide();
      this.error=true;
      // this.errorMsg=err.error.message;
      // this.toastrService.error(this.errorMsg);
    })
  }

  activateUser(){
    this.formSubmitAttempt=true;
    if(this.formSubmitAttempt){
      this.iconShow= false;
    }
    if(this.registerForm.invalid){
      return
    }
    let formVal = this.registerForm.getRawValue();
    let payload = {
      password:formVal.password,
      retypePassword:formVal.retypePassword,
    }
    
    this.spinnerService.show();
    this.httpService.patchData(PATH.USER_SET_PASSWORD,payload)
        .subscribe((res)=>{
          this.spinnerService.hide();
          this.openSuccessModel();
          if(this.type=='Customer'){
            this.getDefaultSetting(res);
            this.registerCustomer();
          }
        },
        (err)=>{
          this.spinnerService.hide();
          this.error=true;
          this.errorMsg=err.message.message;
          this.toastrService.error(this.errorMsg);
        })
  }

  get f(){
    return this.registerForm.controls;
  }

  registerCustomer(){
    let user=this.registerForm.get('emailId').value;
    this.httpService.getData(PATH.APPROVE_COMPANY_STATUS+'?userName='+user).subscribe((res:any)=>{
      this.spinnerService.hide();
    })
  }
  openSuccessModel(){
    let modelRef=this.modalService.open(SuccessDialogComponent,{
      ariaLabelledBy: "modal-basic-title",
      windowClass: "center",
    })
    modelRef.componentInstance.type = 'email';
    // modelRef.componentInstance.newCategory.subscribe((res)=>{
    //   // this.modalService.close()
    // })
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

  getReferCompany(id){
    this.httpService.getData(PATH.GET_COMPANY_BY_ID + id).subscribe((res:any)=>{
      this.registerForm.patchValue({
        referredBy: 'Referred by - ' + (res.name).toUpperCase()
      })
      this.spinnerService.hide();
    })
  }

  saveSettings(comapny){
    let payload = this.vendorDefaultSetting;
    payload.id = comapny.id,
    payload.organizationId = comapny.organizationId,
    this.httpService.updateData(PATH.VENDOR_SETTINGS,this.vendorDefaultSetting).subscribe((res)=>{
      sessionStorage.removeItem('digiToken');
      this.spinnerService.hide();
    })
  }

  getDefaultSetting(comapny){
    this.httpClient.get('assets/vendor-setting.json').subscribe((res)=>{
      this.vendorDefaultSetting = res;
      this.saveSettings(comapny);
      this.spinnerService.hide();
    })
  }
  characterOnly(event:any){  
    const regexpNumber = /^([a-zA-Z]*)$/;
    let inputCharacter = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !regexpNumber.test(inputCharacter)) {
      event.preventDefault();
    }
  }

  rePassword(val){
    if(val.target.value.length>0){
    this.formSubmitAttempt = false;
    this.iconShow = true;
    }

  }
  getValue(val){
    if(val.target.value.length>0){
      this.formSubmitAttempt = false;
      this.iconShow = true;
      }
    this.passwordPopUP = true ;
        if(val.target.value.length >=8){  
          this.length = true; 
          this.isValidLength=true;
         }
        else{  this.length = false;
          this.isValidLength=false; }
       
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
      


}
