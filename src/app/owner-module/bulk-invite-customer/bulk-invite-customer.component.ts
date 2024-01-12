import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PATH } from 'src/app/app.constant';
import { HttpService } from 'src/app/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { email,noExtraWhiteSpace,noSpecialCharAllow, noWhitespace, onlyCharacters, regNumber } from 'src/app/services/custom.validations';
import { ValidatorsServiceService } from 'src/app/services/validators-service.service';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-invitesheet',
  templateUrl: './bulk-invite-customer.component.html',
  styleUrls: ['./bulk-invite-customer.component.scss']
})
export class BulkInviteCustomerComponent implements OnInit {
  
  documents = [
    {
      title: 'Bulk Invite Sheet',
      name: 'bulkInviteSheet',
    },
  ];


  columns = [
    {title: "type", name: "Type"},
    {title:"identificationNumber",name : "Registration Number"},
    {title:"country",name : "Country Name"},
    {title:"identificationType",name:"Registration Reference Type"},
    {title: "companyName", name: "Company Name"},
    {title: "firstName", name: "First Name"},
    {title: "lastName", name: "Last Name"},
    {title: "emailId", name: "Email ID"},
    {title: "phoneNumber", name: "Phone Number"},
    // {title: "seekData", name: "Seek Data"},
  ];

  type:any=[
    {label:'Vendor', value:'vendor'},
    {label:'Customer', value:'customer'}
  ]
  
  // seekData:any=[
  //   {label:'Yes', value:'yes'},
  //   {label:'No', value:'no'}
  // ]
 
  submitted:boolean=false;
  tableNames: Array<any> = [];
  isSubmit:boolean=false;
  bulkInviteData:any;
  @ViewChild('file') fileInput: ElementRef;
  fileDetails: any = {};
  formSubmitAttempt: boolean = false;
  bulkInviteForm: UntypedFormGroup; 
  customerType:any;
  emailValid:boolean= false;
  isBlank:boolean=false;
  duplicates = [];
  countries:any;
  constructor( private router: Router,
    private httpService: HttpService,
    private toastrService: ToastrService,
    private spinnerService: NgxSpinnerService,
    private ngbDateParserFormatter: NgbDateParserFormatter, private formBuilder:UntypedFormBuilder,
    private messageService: MessageService,
    private confirmationService:ConfirmationService,
public validators:ValidatorsServiceService) { }

  ngOnInit(): void {
    this.prepareTable();
    this.createForm();
    this.getCountriesList();
  }


  createForm(): void {  
    this.bulkInviteForm = this.formBuilder.group({  
        tableRowArray: this.formBuilder.array([])
    })  
  }

  createTableRow(data): UntypedFormGroup {  
    return this.formBuilder.group({
        type: [data ? data.type : '', {validators: [Validators.required]}],  
        country: [data ? data.country : '', {validators: [Validators.required]}],
        name: [data ? data.companyName : '', {validators: [Validators.required,noExtraWhiteSpace,Validators.minLength(2),Validators.maxLength(50)]}],  
        firstName: [data ? data.firstName : '', {validators: [Validators.required,noSpecialCharAllow,Validators.minLength(2),Validators.maxLength(20),onlyCharacters,noExtraWhiteSpace]}],  
        lastName: [data ? data.lastName : '', {validators: [Validators.required,noSpecialCharAllow,Validators.minLength(2),Validators.maxLength(20),onlyCharacters,noExtraWhiteSpace]}],  
        emailId: [data ? data.emailId : '', {validators: [Validators.required, email]}],
        phoneNumber: [data ? data.phoneNumber : '', {validators: [Validators.required,noSpecialCharAllow,noExtraWhiteSpace]}],
        identificationNumber: [data ? data.identificationNumber : '', {validators: [Validators.required,noExtraWhiteSpace,regNumber]}],
        identificationType: [data ? data.identificationType : '', {validators: [Validators.required,noExtraWhiteSpace]}],
        // seekData: [data ? data.seekData : '', {validators: [Validators.required]}]
    });  
  }

  get tableRowArray(): UntypedFormArray {  
    return this.bulkInviteForm.get('tableRowArray') as UntypedFormArray;  
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
      identificationType:country[0]['code']?.documentType
     })
   }
   
   changeCountryUpload(ev,index){
    let country= this.countries.filter((o) => {
     return o.name == ev.country;
   });
   if(country.length>0){
    this.bulkInviteForm.get('tableRowArray')['controls'][index].patchValue({
      identificationType:country[0]['code']?.documentType
     })
   }
   else{
    this.bulkInviteForm.get('tableRowArray')['controls'][index].patchValue({
      country:'',
    })
    this.bulkInviteForm.get('tableRowArray')['controls'][index].get('country').setValidators([Validators.required])
   } 
   }

  checkDuplicates(key_form) {
  
    const checkArray: UntypedFormArray = this.bulkInviteForm.get('tableRowArray') as UntypedFormArray;
    for (const index of this.duplicates) {
      let errors = checkArray.at(index)?.get(key_form).errors as Object || {};
      delete errors['duplicated'];
    
      checkArray.at(index)?.get(key_form).setErrors(null);
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



  prepareTable(){
    this.tableNames=[ 
      { title: "type",name: "emailId",inpType: "select",required: true},
      { title: "companyName",name: "Company Name",inpType: "text",required: true},  
      { title: "firstName",name: "First Name",inpType: "text",required: true},
      { title: "lastName",name: "emailId",inpType: "text",required: true},
      { title: "emailId",name: "emailId",inpType: "text"},
      { title: "phoneNumber",name: "emailId",inpType: "text"},
      // { title: "seekData",name: "emailId",inpType: "text"},   
    ]
  }

  upload() {
    this.fileInput.nativeElement.click();
  }

  download(filename) {
    this.httpService
      .getData(PATH.GET_FILE + filename)
      .subscribe((res: string) => {
        window.open(res, '_blank');
      });
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

      this.httpService.postData(PATH.VENDOR+'/bulk-invites',data).subscribe((res) => {
        this.createForm();
        this.bulkInviteData=res;
        if(res.length==0){
          this.isBlank=true;
        }
       
        if(this.isBlank){
          this.toastrService.error('Blank File');
        }
          this.bulkInviteData.forEach(element => {
           if(element.type){
            let type = element.type;
            element.type = type.toLowerCase( );
           }
          //  if(element.seekData){
          //   let seek = element.seekData;
          //   element.seekData = seek.toLowerCase( )
          //  }
          });
          this.bulkInviteData.forEach((data,index) => {
            console.log(index);
            this.addNewRow(data);
            this.changeCountryUpload(data,index);
          });
        
         
          this.spinnerService.hide();
          this.fileInput.nativeElement.value = '';
          if(!this.isBlank){
            this.toastrService.success("File uploaded successfully")
          }
          
          this.submitted=false;
          // this.bulkInviteForm.valueChanges.subscribe(x => {
          //   this.checkDuplicates('emailId');
          // });
          
        },
        (err) => {
          this.spinnerService.hide();
          this.deleteFile();
          this.toastrService.error(err.message.message);
          this.fileInput.nativeElement.value = '';
        }
      );

    }
  }

  bulkInvite(){
      this.httpService.download(PATH.OWNER+'/file?fileName='+'1659075514800-Bulk_Invite.xlsx').subscribe((res)=>{
        var file = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(file);
        var fileName = 'Bulk_Invite';
        link.download = fileName;
        link.click();
        this.spinnerService.hide();
      })
  }
  
  selectedValue(event){
    this.bulkInviteForm.patchValue({
      type:event.target.value,
    })  
  }

//  selectedSeekValue(event){
//     this.bulkInviteForm.patchValue({
//       seekData:event.target.value,
//     })  
//   }
  
  submit(){
    // this.checkDuplicates('emailId');
    this.isSubmit=true;
    let payload;
    this.submitted=true;
    let formData=this.bulkInviteForm.value;
    formData.tableRowArray.forEach((elm)=>{
      elm.vendorType=elm.type
      elm.vendorType=elm.vendorType.toUpperCase();
      if(elm.emailId){
        elm.emailId=elm.emailId.toLowerCase();
      }
      elm.companyName=elm.name
    })
    payload=formData.tableRowArray;

    this.bulkInviteForm.markAllAsTouched();
    
    if(!this.bulkInviteForm.valid){
      this.toastrService.error('All Fields are Required');
      return;
    }
  
      this.spinnerService.show();
      this.httpService.postData(PATH.VENDOR+'/bulk',payload).subscribe((res)=>{
      this.spinnerService.hide();
      this.toastrService.success('Invite Sent Successfully');
      this.submitted=true;
      this.router.navigate(['/customer/invite-customer']);
      },(err)=>{
        this.spinnerService.hide();
        this.toastrService.error(err.message.message);
      })
    }

    deleteFile() {
      this.bulkInviteData=null;
      this.createForm();
    }

    get f(){
      return this.bulkInviteForm.controls;
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
  
    cancelClick(){
      this.bulkInviteData=null;
      this.createForm();
    }
    
}
