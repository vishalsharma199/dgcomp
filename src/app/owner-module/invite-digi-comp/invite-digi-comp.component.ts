import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { FormGroup, FormControl, UntypedFormBuilder, Validators, UntypedFormArray, ValidationErrors, } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { PATH } from 'src/app/app.constant';
import { AppCookieService } from 'src/app/services/cookieService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { SuccessDialogComponent } from 'src/app/components/success-dialog/success-dialog.component';
import { Country} from 'country-state-city';
import { ICity } from 'country-state-city/dist/lib/interface';
import * as _ from 'lodash';
import { email, noExtraWhiteSpace, noWhitespace, onlyCharacters, phoneNumberOnly, regNumber } from 'src/app/services/custom.validations';
import { ToastrService } from 'ngx-toastr';
import { ValidatorsServiceService } from 'src/app/services/validators-service.service';
import { noSpecialCharAllow } from 'src/app/services/custom.validations';
import { ConfirmationService } from 'primeng/api';
import { element } from 'protractor';
@Component({
  selector: 'app-invite-digi-comp',
  templateUrl: './invite-digi-comp.component.html',
  styleUrls: ['./invite-digi-comp.component.scss']
})
export class InviteDigiCompComponent implements OnInit {
  user: any;
  error: boolean = false;
  errorMsg: string = '';
  countryCode='in';
  hasError: boolean=false;
  inputOptions = {initialCountry:this.countryCode,separateDialCode:true};
  permissionTasks:UntypedFormArray;
  duplicates = [];
  formSubmitAttempt: boolean = false;
  countries:any;
  public oprationalCities: Array<ICity> = [];
  public registeredCities: Array<ICity> = [];

  constructor(private httpService: HttpService, 
    private appCookieService: AppCookieService, 
    private modalService:NgbModal,
    private toastService:ToastrService,
    private spinnerService:NgxSpinnerService,
    private formBuilder: UntypedFormBuilder,
    public validators:ValidatorsServiceService,
    private confirmationService:ConfirmationService,) { }

  public vendorForm=this.formBuilder.group({
    country: ['',[Validators.required]],
    emailId: ['',[Validators.required,email,noExtraWhiteSpace,Validators.maxLength(80)]],
    firstName: ['',[Validators.required,noSpecialCharAllow,Validators.minLength(2),Validators.maxLength(20),onlyCharacters,noExtraWhiteSpace]],
    identificationNumber: ['',[Validators.required,noExtraWhiteSpace,regNumber]],
    lastName: ['',[Validators.required,noSpecialCharAllow,Validators.minLength(2),Validators.maxLength(20),onlyCharacters,noExtraWhiteSpace]],
    companyName: ['',[Validators.required,noExtraWhiteSpace,Validators.minLength(2),Validators.maxLength(50)]],
    phoneNumber: ['',[Validators.required,noSpecialCharAllow,phoneNumberOnly]],
    identificationType: [''],
    vendorType: ['',[Validators.required]],
    // financialInformationFlag:['']    
  })


  ngOnInit(): void {
    this.user = JSON.parse(this.appCookieService.get('digiUser'));
    if (localStorage.getItem('userData')) {
      this.vendorForm.patchValue(JSON.parse(localStorage.getItem('userData')));
    }

    this.grtCountriesList();
    this.vendorForm.controls['identificationType'].disable();
  }


  createVendor(){
    let payload = this.vendorForm.value;
    this.vendorForm.markAllAsTouched();
    if(!this.hasError){
      return;  
    }
    if (this.vendorForm.invalid) {
      return;
    }
    else{      
        this.spinnerService.show();
        let payload = this.vendorForm.getRawValue();
        payload.emailId=payload.emailId.toLowerCase();
        payload.type = payload.country.documentTypeCode;
        payload.country = payload.country.countryName;
        payload.countryCode=this.countryCode
        this.httpService.postData(PATH.VENDOR,payload).subscribe((res)=>{
        this.spinnerService.hide();
        this.openSuccessModel();
        this.vendorForm.reset();
        this.formSubmitAttempt=false;
      },(err)=>{
        this.spinnerService.hide();
        this.error=true;
        if(err.code==409){
          this.errorMsg = "Entity Already Exists";
        }else{
          this.errorMsg = "Please try again after sometime. If issue persists, please contact support@digicompplus.com for assistance.";
        }
        this.toastService.error(this.errorMsg);
      })

    }
  }

  get f() {
    return this.vendorForm.controls;
  }
  
  openSuccessModel(){
    let modelRef=this.modalService.open(SuccessDialogComponent,{
      ariaLabelledBy: "modal-basic-title",
      windowClass: "center",
    })
    modelRef.componentInstance.type = 'invite-owner';
  }

  onCountryChange(obj){
    this.countryCode = obj.iso2;
  }

  onError(obj) {
    this.hasError = obj;
  }

  space(event:any){
    this.validators.space(event);
  }
  
  characterOnly(event:any){  
    const regexpNumber = /^([a-zA-Z]*)$/;
    let inputCharacter = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !regexpNumber.test(inputCharacter)) {
      event.preventDefault();
    }
  }

  cancelClick(){
    this.vendorForm.reset();
    this.hasError=true;
     
  }

  changeCountry(ev){
    this.inputOptions = null;
    let data:any = ev.value;
    this.vendorForm.patchValue({
      identificationType:data.documentType
    })
    this.vendorForm.controls['identificationType'].disable();
    // this.countryCode = data.countryCode;
    this.inputOptions = {initialCountry:this.countryCode,separateDialCode:true};
  }
  numberOnly(event:any){  
    const regexpNumber = /[0-9]/;
    let inputCharacter = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !regexpNumber.test(inputCharacter)) {
      event.preventDefault();
    }
  }

  grtCountriesList(){
    this.spinnerService.show();
    this.httpService.getData(PATH.GET_ALL_COUNTRIES+'?page=1&size=1000').subscribe((res)=>{
      let countryList = res['content'];
      this.countries = countryList.map((elm)=> {return {name:elm.countryName,code:elm}})
      this.spinnerService.hide();
    })
  }
  

}
