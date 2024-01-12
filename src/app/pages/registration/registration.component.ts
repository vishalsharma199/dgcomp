import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PATH } from 'src/app/app.constant';
import { SuccessDialogComponent } from 'src/app/components';
import { businessEmail, email,  noSpecialCharAllow, noWhitespace, numberOnly, onlyCharacters, phoneNumberOnly, regNumber } from 'src/app/services/custom.validations';
import { HttpService } from 'src/app/services/http.service';
import { ValidatorsServiceService } from 'src/app/services/validators-service.service';
import { noExtraWhiteSpace } from 'src/app/services/custom.validations';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html'
})
export class RegistrationComponent implements OnInit {

  codes: any=[
    "Customer",
    "Vendor",
  ];

  // selectedCity: City;
  state:any;
  @ViewChild('phone') input: ElementRef;
  // public countries = Country.getAllCountries();
  countries:any;
  error:boolean=false;
  errorMsg:string="";
  formSubmitAttempt:boolean=false;
  verificationCode:string;
  userDetails:any;
  companyNameVerificationCode:string;
  companyNameDetails:any;
  customerNameVerificationCode:string;
  customerNameDetails:any;
  countryCode='in';
  hasError: boolean = false;
  inputOptions = {initialCountry:this.countryCode,separateDialCode:true};

  constructor(
              private formBuilder:UntypedFormBuilder,
              private httpService:HttpService,
              private toastrService:ToastrService,
              private spinnerService:NgxSpinnerService,
              private modalService:NgbModal,
              private validators:ValidatorsServiceService) { }

  public registerForm=this.formBuilder.group({
    country:[[],[Validators.required]],
    emailId:["",[Validators.required,email,noExtraWhiteSpace,Validators.maxLength(80)]],
    firstName:["",[Validators.required,noSpecialCharAllow,Validators.minLength(2),Validators.maxLength(20),onlyCharacters,noExtraWhiteSpace]],
    lastName:["",[Validators.required,noSpecialCharAllow,Validators.minLength(2),Validators.maxLength(20),onlyCharacters,noExtraWhiteSpace]],
    companyName:["",[Validators.required,noExtraWhiteSpace,Validators.minLength(2),Validators.maxLength(50)]],
    phoneNumber:['',[Validators.required,noSpecialCharAllow,phoneNumberOnly]],
    identificationType:[],
    identificationNumber:['',[Validators.required,noExtraWhiteSpace,regNumber]],    
  })

  ngOnInit(): void {
    this.grtCountriesList();
  }

  signup(){
    this.formSubmitAttempt=true
    this.error=false;
    if(this.registerForm.invalid){
      return
    }
    if(!this.hasError){
      this.toastrService.error('Phone number is not valid');
      return
    }
    
    let payload = this.registerForm.getRawValue();
    payload.emailId=payload.emailId.toLowerCase();
    payload.type = payload.country.documentTypeCode;
    payload.country = payload.country.countryName;
    payload.countryCode=this.countryCode
    this.spinnerService.show();
    this.httpService.postData(PATH.OWNER_SELF_REGISTRATION+'/register',payload).subscribe((res)=>{
          this.spinnerService.hide();
          this.registerForm.reset();
          this.formSubmitAttempt = false;
          this.openSuccessModel();
        },(err) => {
          this.spinnerService.hide();
          this.error = true;
          if(err.message.message){
            this.errorMsg = err.message.message;
          }else{
            let error = err.message.errors;
            error = error.map(el=> {return el.field+': '+el.message})
            this.errorMsg = error.join(", ");
          }
          this.toastrService.error(this.errorMsg);
        }
      )
  }

  get f(){
    return this.registerForm.controls;
  }

  
  onCountryChange(obj){
    this.countryCode = obj.iso2
  }
  onError(obj) {
    this.hasError = obj;
  }


  openSuccessModel(){
    let modelRef=this.modalService.open(SuccessDialogComponent,{
      ariaLabelledBy: "modal-basic-title",
      windowClass: "center",
    })
    modelRef.componentInstance.type = 'register';
    // modelRef.componentInstance.newCategory.subscribe((res)=>{
    //   this.modalService.close()
    // })
  }
 
  grtCountriesList(){
    this.spinnerService.show();
    this.httpService.getData(PATH.GET_ALL_COUNTRIES+'?page=1&size=1000').subscribe((res)=>{
      let countryList = res['content'];
      this.countries = countryList.map((elm)=> {return {name:elm.countryName,code:elm}})
      this.spinnerService.hide();
    })
  }
  
  changeCountry(ev){
    this.inputOptions = null;
    let data:any = ev.value;
    this.registerForm.patchValue({
      identificationType:data.documentType
    })
    this.registerForm.controls['identificationType'].disable();
    // this.countryCode = data.countryCode;
    this.inputOptions = {initialCountry:this.countryCode,separateDialCode:true};
  }

  // code for remove whitespace
  space(event:any){
    this.validators.space(event);
  }

  numberOnly(event:any){  
    const regexpNumber = /[0-9]/;
    let inputCharacter = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !regexpNumber.test(inputCharacter)) {
      event.preventDefault();
    }
  }

  characterOnly(event:any){  
    const regexpNumber = /^([a-zA-Z]*)$/;
    let inputCharacter = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !regexpNumber.test(inputCharacter)) {
      event.preventDefault();
    }
  }


}
