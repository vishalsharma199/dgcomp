import { Component, OnInit,OnDestroy } from '@angular/core';
import { UntypedFormBuilder, Validators, } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { PATH } from 'src/app/app.constant';
import { HttpService } from 'src/app/services/http.service';
import { SuccessDialogComponent } from 'src/app/components';
import { ActivatedRoute, Router } from '@angular/router';
import { AppCookieService } from 'src/app/services/cookieService';
import { businessEmail, email, noExtraWhiteSpace,noSpecialCharAllow, noWhitespace, onlyCharacters, phoneNumberOnly, regNumber } from 'src/app/services/custom.validations';
import { ToastrService } from 'ngx-toastr';
import { ValidatorsServiceService } from 'src/app/services/validators-service.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
@Component({
  selector: 'app-invite-new-customer',
  templateUrl: './invite-new-owner.component.html',
  styleUrls: ['./invite-new-owner.component.scss']
})
export class InviteNewOwnerComponent implements OnInit,OnDestroy {
  errorMsg;
  formSubmitAttempt:boolean=false;
  companyDetails;
  customerId;
  user;
  requestType;
  error;
  countryCode='in';
  hasError: boolean = false ;
  inputOptions = {initialCountry:this.countryCode,separateDialCode:true};
  countries:any;
  title:string="Invite Owner";
  filterType:any;

  constructor(private formbuilder: UntypedFormBuilder, 
    private httpService:HttpService,
    private spinnerService:NgxSpinnerService, 
    private modalService:NgbModal,
    private toastrService:ToastrService,
    private activateRoute : ActivatedRoute,
    private appCookieService:AppCookieService,
    public validators:ValidatorsServiceService,
    private sharedDataService:SharedDataService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(this.appCookieService.get('digiUser'));
    this.grtCountriesList();
    this.activateRoute.params.subscribe((res) => {
      this.requestType = res.type;
      this.customerId = res.id;
      this.filterType=res.filtertype
      if(this.requestType=='view'){
        this.title = 'Self Registered Owner Details';
      }
    });
  }

  public inviteCustomerForm = this.formbuilder.group({
    country:[[],[Validators.required]],
    emailId:["",[Validators.required,email,noExtraWhiteSpace,Validators.maxLength(80)]],
    firstName:["",[Validators.required,noSpecialCharAllow,Validators.minLength(2),Validators.maxLength(20),onlyCharacters,noExtraWhiteSpace]],
    lastName:["",[Validators.required,noSpecialCharAllow,Validators.minLength(2),Validators.maxLength(20),onlyCharacters,noExtraWhiteSpace]],
    companyName:["",[Validators.required,noExtraWhiteSpace,Validators.minLength(2),Validators.maxLength(50)]],
    phoneNumber:['',[Validators.required,noSpecialCharAllow,phoneNumberOnly]],
    identificationType:[],
    identificationNumber:['',[Validators.required,noExtraWhiteSpace,regNumber]],
  })

  get f(){
    return this.inviteCustomerForm.controls
  }


  joinDigicomp(){
    this.formSubmitAttempt=true;
    if(this.inviteCustomerForm.invalid || !this.hasError){
      return;
    }else{
      let payload:any = this.inviteCustomerForm.getRawValue();
      payload.type = payload.country.documentTypeCode;
      payload.country = payload.country.countryName;
      payload.countryCode = this.countryCode;
      payload.emailId=payload.emailId.toLowerCase();
      this.spinnerService.show();
      if(!this.customerId){
        this.httpService.postData(PATH.OWNER,payload).subscribe((res)=>{
          this.spinnerService.hide();
          this.openSuccessModel();
          this.formSubmitAttempt=false;
        },(err)=>{
          this.spinnerService.hide();
          this.error=true;
          if(err.code==409){
            this.errorMsg = "Entity Already Exists";
          }else{
            this.errorMsg = "Please try again after sometime. If issue persists, please contact support@digicompplus.com for assistance.";
          }
          this.toastrService.error(this.errorMsg);
        })
      }else{
        this.httpService.postData(PATH.APPROVE_PENDING_USER+this.companyDetails.companyId,{}).subscribe((res)=>{
          this.openSuccessModel();
          this.spinnerService.hide();
        },(err)=>{
          this.spinnerService.hide();
          this.error=true;
          if(err.message.message){
            this.errorMsg = err.message.message;
          }else{
            let error = err.message.errors;
            error = error.map(el=> {return el.field+': '+el.message})
            this.errorMsg = error.join(", ");
          }
          this.toastrService.error(this.errorMsg);
        })
      }
    }
  }
  
  onClear(){
    this.inviteCustomerForm.reset()
    this.formSubmitAttempt=false;
  }

  getCustomerByID(){
    this.spinnerService.show();
    let payload:any={};
    payload.id=this.customerId;
    this.httpService.postData(PATH.OWNER_SELF_REGISTRATION+'/id/'+this.customerId,payload).subscribe((res:any)=>{
      let resData:any = res;
      this.companyDetails = res;
      // this.inputOptions = {initialCountry:res.countryCode,separateDialCode:true};
      this.spinnerService.hide();
      // this.inviteCustomerForm.patchValue(resData)
      this.inviteCustomerForm.disable();
      this.hasError = true;
      this.countryCode=resData.countryCode;
      this.inviteCustomerForm.patchValue({
        country:this.filterCountry(resData.country),
        emailId:resData.emailId,
        firstName:resData.firstName,
        identificationNumber:resData.identificationNumber,
        lastName:resData.lastName,
        companyName:resData.companyName,
        phoneNumber:resData.phoneNumber,
        identificationType:resData.identificationType
      })
      this.inputOptions = {initialCountry:resData.countryCode,separateDialCode:true};
    }),(err)=>{
      this.spinnerService.hide();
      this.error=true;
      this.errorMsg=err.message.message;
      this.toastrService.error(this.errorMsg);
    }
  }

  grtCountriesList(){
    this.spinnerService.show();
    this.httpService.getData(PATH.GET_ALL_COUNTRIES+'?page=1&size=1000').subscribe((res)=>{
      let countryList = res['content'];
      this.countries = countryList.map((elm)=> {return {name:elm.countryName,code:elm}})
      if(this.customerId){
        this.getCustomerByID();
      }
      this.spinnerService.hide();
    }),(err)=>{
      this.spinnerService.hide();
      this.error=true;
      this.errorMsg=err.message.message;
      this.toastrService.error(this.errorMsg);
    }
  }
  
  changeCountry(ev){
    let data:any = ev.value;
    this.inviteCustomerForm.patchValue({
      identificationType:data.documentType
    })
    this.inviteCustomerForm.controls['identificationType'].disable();
  }

  filterCountry(country){
    let countryCode = this.countries.filter((elm)=> elm.name==='India');
    return countryCode[0].code
  }

  openSuccessModel(){
    let modelRef=this.modalService.open(SuccessDialogComponent,{
      ariaLabelledBy: "modal-basic-title",
      windowClass: "center",
    })
    modelRef.componentInstance.type = 'activate';
  }

  onCountryChange(obj){
    this.countryCode = obj.iso2
  }

  onError(obj) {
    this.hasError = obj;
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

  submit(type){
    this.spinnerService.show();
    let payload:any={};
    payload.ownerId=this.customerId;
    payload.status=type

      this.httpService.postData(PATH.OWNER_SELF_REGISTRATION+'/approve-reject',payload).subscribe((res)=>{
        this.spinnerService.hide();
        if(type=='APPROVED'){
          this.toastrService.success('User Approved Successfully');
        }
        if(type=='REJECTED'){
          this.toastrService.success('User Rejected Successfully');
        }
        this.router.navigate(['/admin/self-invited-owners']);
      },
      (err)=>{
        this.spinnerService.hide();
        this.error=true;
        if(err.code==401){
          this.errorMsg = "Incorrect Password / Unauthorized";
        }else if(err.code==400){
          this.errorMsg = "User not active.  Please contact support@digicompplus.com for assistance.";
        }else if(err.code==404){
        this.errorMsg = "Not found";
        }else if(err.code==409){
        this.errorMsg = "Entity Already Exists";
        }
        else{
          this.errorMsg = "Please try again after sometime. If issue persists, please contact support@digicompplus.com for assistance.";
        }
        this.toastrService.error(this.errorMsg);
      })
  }

  back(){
    
    if(this.requestType=='view'){
      this.router.navigate(['admin/self-invited-owners']);
    }
    else{
      this.router.navigate(['admin/owner-list']);
    }
    
  }

  ngOnDestroy(): void {
    if(this.filterType){
      this.sharedDataService.setOwnerStatus(this.filterType);
    }
  }


}
