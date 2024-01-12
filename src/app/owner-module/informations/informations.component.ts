import { HttpService } from './../../services/http.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {  UntypedFormBuilder, Validators, } from '@angular/forms';
import { PATH } from 'src/app/app.constant';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ValidatorsServiceService } from 'src/app/services/validators-service.service';
import { noExtraWhiteSpace, noSpecialCharAllow } from 'src/app/services/custom.validations';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared-data.service';
@Component({
  selector: 'app-informations',
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.scss']
})
export class InformationsComponent implements OnInit {

  formSubmitAttempt:boolean=false;
  companyInfo:any;
  errorMsg;
  fileName;
  imgUrl;
  // toggle = true;
  countryCode='in';
  hasError: boolean=false;
  informationForm:any;
  inputOptions = {initialCountry:this.countryCode,separateDialCode:true};
  @ViewChild('file') fileInput: ElementRef;
  constructor(private formbuilder: UntypedFormBuilder,private httpService:HttpService,
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    public validators:ValidatorsServiceService,
    private router: Router,
    private sharedDataService:SharedDataService) {}

  ngOnInit(): void {
    this.getLoggedInCompany();
    this.getCompanyInfo();
    this.prepareInfoForm();
  }
  
  
  prepareInfoForm(){
     this.informationForm = this.formbuilder.group({
      companyId:[''],
      companyName: [''],
      legalName: ['',[Validators.required,noExtraWhiteSpace]],
      legalAddress: ['',[Validators.required,noExtraWhiteSpace]],
      registrationNumber: ['',[Validators.required,noExtraWhiteSpace]],
      phoneNumber: ['',[Validators.required,noSpecialCharAllow]],
    })
  }

  get f(){
    return this.informationForm.controls;
  }

  saveCompanyBasicDetails(){
    // this.toggle = false;
    this.formSubmitAttempt=true;
    this.informationForm.markAllAsTouched();
    if(this.informationForm.invalid || !this.hasError){
      return;
    }else{  
      this.spinnerService.show();
      let payload=this.informationForm.value
      payload.companyLogo=this.fileName
      this.httpService.updateData(PATH.COMPANY_BASIC_DETAILS,payload).subscribe((res)=>{
        this.spinnerService.hide();
        this.toastrService.success('Company Information Saved Successfully!');
        let imgData={imgUrl:this.imgUrl,companyLogo:this.fileName}
        this.sharedDataService.callComponentMethod(imgData);
      },(err) => {
        this.spinnerService.hide();
        this.errorMsg = err.message.message;
        this.toastrService.error(this.errorMsg);
      });
      this.formSubmitAttempt=false;
      // this.informationForm.reset()
    }
  }
  onClear(){
    this.informationForm.reset();
    this.formSubmitAttempt=false
  }


  // GET_LOGGEDIN_COMPANY

  getLoggedInCompany(){
    this.spinnerService.show();
    this.httpService.getData(PATH.GET_LOGGEDIN_COMPANY).subscribe((res)=>{
      this.companyInfo=res;
      this.informationForm.patchValue({
        companyName: this.companyInfo.name,
        registrationNumber:this.companyInfo.identificationNumber
      });
      this.informationForm.controls['companyName'].disable();
      this.informationForm.controls['registrationNumber'].disable();
      this.spinnerService.hide();
    },(err) => {
      this.spinnerService.hide();
      this.toastrService.error(err.message);
    }) 
  }

  getCompanyInfo(){
    this.httpService.getData(PATH.GET_COMPANY_DETAILS).subscribe((res)=>{
      this.companyInfo=res;
      if(this.companyInfo)
      this.fileName = this.companyInfo?.companyLogo;
      this.getFile(this.fileName);
      this.informationForm.get('phoneNumber').setValidators(Validators.required,noSpecialCharAllow);
      this.informationForm.patchValue({
        companyId:this.companyInfo?.companyId,
        legalAddress:this.companyInfo?.legalAddress,
        legalName:this.companyInfo?.legalName,
        // registrationNumber: this.companyInfo.registrationNumber,
        phoneNumber: this.companyInfo?.phoneNumber,
      });
      this.spinnerService.hide();
      this.hasError=true;
    })
  }

  upload() {
    this.fileInput.nativeElement.value = '';
    this.fileInput.nativeElement.click();
    // this.courseImgFlag = false;
  }

  uploadFile() {
    const fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      if (fileBrowser.files[0].size > 2485760) {
        this.toastrService.error('File size shold be max 2MB', 'Error');
        return;
      }
      let  type = fileBrowser.files[0].type.split("/");
      if (type[0] !='image') {
        this.toastrService.error('Invalid File Format', 'Error');
        return;
      }
      let data = new FormData();
      data.append('file', fileBrowser.files[0]);
      this.spinnerService.show();
      this.httpService.postData(PATH.FILE_UPLOAD,data).subscribe((res) => {
          this.spinnerService.hide();
          this.fileName = res.fileName;
          this.getFile(this.fileName);
          this.fileInput.nativeElement.value = '';
          this.spinnerService.hide();
        },
        (err) => {
          this.spinnerService.hide();
          this.toastrService.error(err.message);
          this.fileInput.nativeElement.value = '';
        }
      );
    }
  }

  getFile(file){
    this.httpService.getImage(PATH.GET_UPLOADED_FILE+file).subscribe((res)=>{
      this.spinnerService.show()
      this.imgUrl = res;
      this.spinnerService.hide();
    })
  }
  
  onError(obj) {
    this.hasError = obj;
  }

  onCountryChange(obj){
    this.countryCode = obj.iso2
  }

  gotoDashboard(){
    this.router.navigate(['customer/dashboard']);
  }


  numberOnly(event:any){   
    const regexpNumber = /[0-9]/;
    let inputCharacter = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !regexpNumber.test(inputCharacter)) {
      event.preventDefault();
    }
  }

}
