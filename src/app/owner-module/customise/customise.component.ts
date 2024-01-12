import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { PATH } from 'src/app/app.constant';
import { HttpService } from './../../services/http.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-customise',
  templateUrl: './customise.component.html',
  styleUrls: ['./customise.component.scss']
})
export class CustomiseComponent implements OnInit {
  checked:boolean=true;
  formSubmitAttempt: boolean = false;
  uploaded: boolean;
  companyInfo:any;
  errorMsg;
  @Output('getCompanyInfo') callParent: EventEmitter<any> = new EventEmitter();

  constructor(private formBuilder: UntypedFormBuilder,private httpService:HttpService, private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,) {}

  infoForm = this.formBuilder.group({
    annualRevenueInUsd:[false],
    companyName: [true],
    organizationId: [],
    addressApproval: [false],
    certificateOfIncorporation: [false],
    financialStatementsLast3Years: [false],
    insuranceCertificate: [false],
    memorandumArticlesOfAssociation: [false],
    tradingLicense: [false],
    checkboxes: [false],
    vatRegistrationNumber: [true],
    companyLogo: [true],
    websiteUrl: [true],
    phoneNumber: [true],
    productOrService: [true],
    category: [true],
    companyRegistrationNumber: [true],
    contactPerson: [true],
    dateOfIncorporation: [true],
    dunsNumber: [false],
    emailAddress: [true],
    formerName: [false],
    legalStatus: [true],
    parentCompany:this.formBuilder.group({
      countryOfDomicile:[false],
      name:[false]
   }),
    countryOfDomicile: [false],
    uploadDocument:[false],
    privacyPolicy:[false],
    termsConditions:[false],
    registeredAddress: this.formBuilder.group({
      addresses: [true],
      city: [true],
      country: [true],
      postalCode: [true],
    }),
    operationalAddress: this.formBuilder.group({
      addresses: [true],
      city: [true],
      country: [true],
      postalCode: [true],
    }),
    previousAddress: this.formBuilder.group({
      addresses: [false],
      city: [false],
      country: [false],
      postalCode: [false],
    }),
    boardOfDirectors:this.formBuilder.group({
      fullName: [true],
      nationality: [true],
      address: [true],
      postalCode: [true],
      countryOfResidence: [true],
      addressProof: [false],
      passport: [false],
      identificationNumber: [false],
    }),
    shareHolders:this.formBuilder.group({
      type: [true],
      ownedPercentage: [true],
      postalCode: [true],
      identificationNumber: [true],
      addressProof: [false],
      address: [true],
      personalIdentification: [false],
      companyName: [true],
      countryOfIncorporation: [true],
    }),
    branchInOtherCountry:this.formBuilder.group({
      branch:[false],
    }),
    bankDetails: this.formBuilder.group({
      bankName: [false],
      accountNumber: [false],
      beneficiaryName: [false],
      swiftCode: [false],
      iban: [false],
      // consent: [true],
    }),
    contractInformation: this.formBuilder.group({
      annualValue: [false],
      contractDocument: [false],
      contractName: [false],
      contractOwner: [false],
      currency: [false],
      email: [false],
      endDate: [false],
      renewalDate: [false],
      startDate: [false],
    }),
  })

  ngOnInit(): void {
    this.getVendorCompanyInfo()
  }

  handleChange(e){
  }

  getVendorCompanyInfo(){
    this.spinnerService.show();
    this.httpService.getData(PATH.VENDOR_SETTINGS).subscribe((res)=>{
      this.companyInfo=res;
      this.spinnerService.hide();
      if(this.companyInfo){
        this.infoForm.patchValue(this.companyInfo);
      }
    },(err)=>{
      this.spinnerService.hide();
    })
  }

  postData(){
    this.formSubmitAttempt=true;
    if(this.infoForm.invalid){
      return;
    }else{
      this.spinnerService.show();
      this.httpService.updateData(PATH.VENDOR_SETTINGS,this.infoForm.value).subscribe((res)=>{
        this.companyInfo=res;
        this.toastrService.success('Customize Vendor Onboarding Updated Successfully!');
        this.getVendorCompanyInfo();
        this.spinnerService.hide();
      },(err) => {
        this.spinnerService.hide();
        this.errorMsg = err.message.message;
        this.toastrService.error(this.errorMsg);
      })
      this.formSubmitAttempt=false;
      this.infoForm.reset()
    }
  }
  
  onClear(){
    // this.infoForm.reset();
    // this.formSubmitAttempt=false
    this.callParent.emit({
     index:2
    });
    this.ngOnInit();
  }

}
