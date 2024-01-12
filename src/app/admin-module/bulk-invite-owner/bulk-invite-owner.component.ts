import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PATH } from 'src/app/app.constant';
import { HttpService } from 'src/app/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import { email,noExtraWhiteSpace,noSpecialCharAllow, noWhitespace, onlyCharacters, regNumber } from 'src/app/services/custom.validations';
import { ValidatorsServiceService } from 'src/app/services/validators-service.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-invitesheet',
  templateUrl: './bulk-invite-owner.component.html',
  styleUrls: ['./bulk-invite-owner.component.scss']
})
export class BulkInviteOwnerComponent implements OnInit {
  documents = [
    {
      title: 'Bulk Invite Sheet',
      name: 'bulkInviteSheet',
    },
  ];
  columns = [
    {
      title: "country",
      name: "Country"
    },
    {
      title: "name",
      name: "Company Name"
    }, 
    {
      title: "registrationNumber",
      name: "Registration Number"
    },
   {
      title: "registrationReferenceType",
      name: "Registration Reference Type"
    },
    {
      title: "firstName",
      name: "First Name"
    },
    {
      title: "lastName",
      name: "Last Name"
    },
    {
      title: "emailId",
      name: "Email Id"
    },
    {
      title: "phoneNumber",
      name: "Phone Number"
    },
  ];

  submitted:boolean=false;
  tableNames: Array<any> = [];
  bulkInviteData:any;
  bulkInviteForm: UntypedFormGroup; 
  countries:any;
  duplicates = [];
  isBlank:boolean=false;

  @ViewChild('file') fileInput: ElementRef;
  fileDetails: any = {};
  constructor( private router: Router,
    private httpService: HttpService,
    private toastrService: ToastrService,
    private spinnerService: NgxSpinnerService,
    public validators:ValidatorsServiceService,
    private formBuilder :UntypedFormBuilder,
    private confirmationService:ConfirmationService) { }

  ngOnInit(): void {
    // this.prepareTable();
    this.createForm();
    this.getCountriesList();
   
  }

  createForm(): void {  
    this.bulkInviteForm = this.formBuilder.group({  
        tableRowArray: this.formBuilder.array([])
    })  
  }

  getCountriesList(){
    this.spinnerService.show();
    this.httpService.getData(PATH.GET_ALL_COUNTRIES+'?page=1&size=1000').subscribe((res)=>{
      let countryList = res['content'];
      this.countries = countryList.map((elm)=> {return {name:elm.countryName,code:elm}})
      this.spinnerService.hide();
    })
  }
  changeCountry(ev,index){
   let country= this.countries.filter((o) => {
    return o.name == ev.value;
  });

    this.bulkInviteForm.get('tableRowArray')['controls'][index].patchValue({
      registrationReferenceType:country[0]['code']?.documentType
    })
  }

  changeCountryUpload(ev,index){
    let country= this.countries.filter((o) => {
     return o.name == ev.country;
   });
   if(country.length>0){
    this.bulkInviteForm.get('tableRowArray')['controls'][index].patchValue({
      registrationReferenceType:country[0]['code']?.documentType
     })
   }
   else{
    this.bulkInviteForm.get('tableRowArray')['controls'][index].patchValue({
      country:'',
    })
    this.bulkInviteForm.get('tableRowArray')['controls'][index].get('country').setValidators([Validators.required])
   } 
   }

  createTableRow(data): UntypedFormGroup {  
    return this.formBuilder.group({  
      country: [data ? data.country : '', {validators: [Validators.required]}],  
      companyName: [data ? data.companyName : '', {validators: [Validators.required,noExtraWhiteSpace,Validators.minLength(2),Validators.maxLength(50)]}],  
      firstName: [data ? data.firstName : '', {validators: [Validators.required,noSpecialCharAllow,Validators.minLength(2),Validators.maxLength(20),onlyCharacters,noExtraWhiteSpace]}],
      lastName: [data ? data.lastName : '', {validators: [Validators.required,noSpecialCharAllow,Validators.minLength(2),Validators.maxLength(20),onlyCharacters,noExtraWhiteSpace]}],
      emailId: [data ? data.emailId : '', {validators: [Validators.required,email]}],
      // phoneNumber: [data ? data.phoneNumber : '', {validators: [Validators.required,Validators.pattern('/[0-9]/')]}],
      phoneNumber: [data ? data.phoneNumber : '', {validators: [Validators.required,noSpecialCharAllow]}],
      // phoneNumber: [data ? data.phoneNumber : '', {validators: [Validators.required,phone,]}],
      identificationNumber: [data ? data.registrationNumber : '', {validators: [Validators.required,noExtraWhiteSpace,regNumber]}],  
      registrationReferenceType: [data ? data.registrationReferenceType : '', {validators: [Validators.required,noExtraWhiteSpace]}],  
      
    });  
  }

  get tableRowArray(): UntypedFormArray {  
    return this.bulkInviteForm.get('tableRowArray') as UntypedFormArray;  
  }

  checkDuplicates(key_form) {
  
    const checkArray: UntypedFormArray = this.bulkInviteForm.get('tableRowArray') as UntypedFormArray;
    for (const index of this.duplicates) {
      let errors = checkArray.at(index).get(key_form).errors as Object || {};
      delete errors['duplicated'];
    
      checkArray.at(index).get(key_form).setErrors(null);
    }
    this.duplicates = [];

    let dict = {};
    checkArray.value.forEach((item, index) => {
      dict[item.emailId] = dict[item.emailId] || [];
      dict[item.emailId].push(index);
    });
    for (var key in dict) {
      if (dict[key].length > 1)
        this.duplicates = this.duplicates.concat(dict[key]);
    }
    for (const index of this.duplicates) {
      this.tableRowArray.at(index).get(key_form).setErrors({ duplicated: true });
      this.bulkInviteForm.markAllAsTouched();
    }
  }


  addNewRow(data): void {  
    this.tableRowArray.push(this.createTableRow(data));  
  }

  onDeleteRow(rowIndex:number): void {  
    this.confirmationService.confirm({
      message:"Are you sure that you want to delete?",
      accept:()=>{
        this.tableRowArray.removeAt(rowIndex); 
      }
    })
    
  }



  upload() {
    this.fileInput.nativeElement.click();
  }
  download(filename) {
    this.httpService
      .getData(PATH.GET_FILE + filename)
      .subscribe((res: string) => {
        window.open(res, '_blank');
        this.spinnerService.hide();
      });
  }


  deleteFile() {
    this.bulkInviteData=null;
    this.createForm();
  }
  uploadFile() {
    const fileBrowser = this.fileInput.nativeElement;
    this.isBlank=false;
    if (fileBrowser.files && fileBrowser.files[0]) {
      if (fileBrowser.files[0].size > 10485760) {
        this.toastrService.error('File size shold be max 10MB', 'Error');
        return;
      }
      let data = new FormData();
      data.append('file', fileBrowser.files[0]);
      this.spinnerService.show();

      this.httpService.postData(PATH.OWNER+'/bulk-invites',data).subscribe(
        (res) => {
          this.createForm();
          this.bulkInviteData=res;
          if(res.length==0){
            this.isBlank=true;
          }
          this.bulkInviteData.forEach((data,index) => {
            this.addNewRow(data);
            this.changeCountryUpload(data,index);
          });
          
          this.spinnerService.hide();
          this.fileInput.nativeElement.value = '';
          if(this.isBlank){
            this.toastrService.error('Blank File');
          }
          else{
            this.toastrService.success("File uploaded successfully")
          }
          
          this.submitted=false;
          this.spinnerService.hide();
        },
        (err) => {
          this.spinnerService.hide();
          this.toastrService.error(err.message.message);
          this.fileInput.nativeElement.value = '';
        }
      );

    }
  }

  bulkInvite(){
    this.httpService.download(PATH.OWNER+'/file?fileName='+'1659079116131-Owner_Bulk_Invite.xlsx').subscribe((res)=>{
      var file = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(file);
      var fileName = 'Owner_Bulk_Invite';
      link.download = fileName;
      link.click();
      this.spinnerService.hide();
    })
  }
  
  submit(){
    // this.checkDuplicates('emailId');
    this.bulkInviteForm.markAllAsTouched();
    let payload;
    payload=this.bulkInviteForm.value;
    let formData=this.bulkInviteForm.value;
    payload=formData.tableRowArray;
    for(var i=0;i<payload.length;i++){
      let country= this.countries.filter((o) => {
        return o.name == payload[i]['country']
      });
      if(country.length==0){
        this.toastrService.error('Please Select Country');
        return;
      }
     
      if(payload[i]['companyName']){
        payload[i]['name']=payload[i]['companyName'];
      }
      if(payload[i]['emailId']){
        payload[i]['emailId']=payload[i]['emailId'].toLowerCase();
      }
      if(payload[i]['registrationReferenceType']){
        payload[i]['identificationType']=payload[i]['registrationReferenceType'];
      }
      
    }

    
    if(!this.bulkInviteForm.valid){
      this.toastrService.error('All Fields are Required');
      return;
    }
    
      this.spinnerService.show();
      this.httpService.postData(PATH.OWNER+'/bulk',payload).subscribe((res)=>{
      this.spinnerService.hide();
      this.toastrService.success('Invite Sent Successfully');
      this.submitted=true;
      this.router.navigate(['/admin/owner-list']);
      },(err)=>{
        this.spinnerService.hide();
        this.toastrService.error(err.message.message);
      })
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
