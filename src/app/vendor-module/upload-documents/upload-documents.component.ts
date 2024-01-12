import { Router } from '@angular/router';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { AppCookieService } from 'src/app/services/cookieService';
import { PATH } from 'src/app/app.constant';
import { HttpService } from 'src/app/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsServiceService } from 'src/app/services/validators-service.service';
import { UntypedFormArray, UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { email } from 'src/app/services/custom.validations';

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
})
export class UploadDocumentsComponent implements OnInit {
  user: any;
  disableBtn:boolean = false;
  uploaded: boolean;
  @Output('getCompanyInfo') callParent: EventEmitter<any> = new EventEmitter();
  submitted: boolean = false;
  documents = [
    {
      title: 'Incorporation Documents',
      name: 'certificateOfIncorporation',
    },
    {
      title: 'Memorandum & Articles of Association',
      name: 'memorandumArticlesOfAssociation',
    },
    {
      title: 'Financial Statements for last three years',
      name: 'financialStatementsLast3Years',
    },
    {
      title: 'Trading License',
      name: 'tradingLicense',
    },
    {
      title: 'Address Proof',
      name: 'addressApproval',
    },
    {
      title: 'Insurance Certificate',
      name: 'insuranceCertificate',
    },
  ];

  shareholders = [
    {
      title: 'Passport',
      name: 'passport',
    },
    {
      title: 'National ID Card',
      name: 'personalIdentification',
    },
  ];

  companyShareholders = [
    {
      title: 'Trading License',
      name: 'tradingLicense',
    },
  ];
  

  directors = [
    {
      title: 'Passport',
      name: 'passport',
    },
    {
      title: 'National ID Card',
      name: 'personalIdentification',
    },
    // {
    //   title: 'Address Proof',
    //   name: 'addressProof',
    // },
  ];
  contracts = [
    {
      title: 'Upload Contract Docs',
      name: 'contractDocument',
      contractName: '',
      endDate: '',
      renewalDate: '',
      startDate: '',
    },
  ];

  
  companyInfo: any = {};
  type:any='';
  @ViewChild('file') fileInput: ElementRef;
  fileDetails: any = {};
  reqType:string = 'save';
  date =new Date();
  constructor(
    private router: Router,
    private appCookieService: AppCookieService,
    private httpService: HttpService,
    private toastrService: ToastrService,
    private spinnerService: NgxSpinnerService,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    public validators:ValidatorsServiceService,
    private formBuilder: UntypedFormBuilder,
  ) {}

  infoForm = this.formBuilder.group({
    contractInformation:this.formBuilder.array([this.addContractGroup(null)]),
  })

  ngOnInit(): void {
    this.user = JSON.parse(this.appCookieService.get('digiUser'));
    this.getCompanyInfo();
    
  }

  getCompanyInfo() {
    this.spinnerService.show();
    this.httpService
      .getData(PATH.COMPANY_INFORMATION)
      .subscribe(
        (res: any) => {
          if (!res) {
            this.spinnerService.hide();
            return;
          }
          // if (!res.contractInformation) {
          //   res.contractInformation = [
          //     // {
          //     //   title: 'Upload Contract Docs',
          //     //   name: 'contractDocument',
          //     //   contractName: '',
          //     //   endDate: new Date(),
          //     //   renewalDate:  new Date(),
          //     //   startDate:  new Date(),
          //     // },
          //   ];
          // } else {
          //   res.contractInformation.map((o) => {
          //     o.endDate = new Date(o.endDate);
          //     o.renewalDate = new Date(o.renewalDate);
          //     o.startDate = new Date(o.startDate);
          //   });
          // }
          
          let branches = [];
          if (res.branchInOtherCountry) {
            res.branchInOtherCountry?.map((o) => {
              branches.push(o);
            });
            res.branchInOtherCountry = branches;
          } 
          this.spinnerService.hide();

          
          // let contractInformation = [];
          // if (res.contractInformation.length>0) {
          //   res.contractInformation?.map((o) => {
          //     o.endDate = new Date(o.endDate);
          //     o.renewalDate = new Date(o.renewalDate);
          //     o.startDate = new Date(o.startDate);
          //     contractInformation.push( o );
          //   });
          //   res.contractInformation = contractInformation;
          // }
          // if(!res.contractInformation){
          //   res.contractInformation=[];
          // }
          this.companyInfo = res;
          const contractInformation = new UntypedFormArray([]);
          res.contractInformation?.forEach((data) => {
            if(data.endDate){
              data.endDate =new Date( moment(data.endDate).format('yyyy-MM-DD'));
            }
            if(data.renewalDate){
              data.renewalDate =new Date( moment(data.renewalDate).format('yyyy-MM-DD'));
            }
            if(data.startDate){
              data.startDate = new Date(moment(data.startDate).format('yyyy-MM-DD'));
            }
            
            
            contractInformation.push(this.addContractGroup(data));
          });
          this.infoForm.setControl('contractInformation', contractInformation);
        
          if(this.companyInfo.status == 'Submitted'){
            this.disableBtn = true;
          }

          // this.toastrService.success('Company Information Updated Successfully');
        },
        (error) => {
          this.spinnerService.hide();
          
          // this.toastrService.error(error.message?.error);
        }
      );
  }
  upload(type, name, index) {
    this.fileDetails = { type: type, name: name, index: index };
    let i = this.documents.findIndex((d) => {
      return d.name == name;
    });
    this.fileInput.nativeElement.click();
  }
  addContract() {
    // this.companyInfo.contractInformation.push({
    //   title: 'Upload Contract Docs',
    //   name: 'contractDocument',
    //   contractName: '',
    //   endDate: '',
    //   renewalDate: '',
    //   startDate:'',
    //   annualValue:'',
    //   contractOwner:'',
    //   currency:'',
    //   email:''
    // });

    (<UntypedFormArray>this.infoForm.get('contractInformation')).push(
      this.addContractGroup(null)
    );
  }
  deleteContract(index) {
    // this.companyInfo.contractInformation.splice(index, 1);
    (<UntypedFormArray>this.infoForm.get('contractInformation')).removeAt(index);
    // this.updateCompanyInfo();
  }

  emailChange(){
    
  }

  addContractGroup(data): UntypedFormGroup {
    return this.formBuilder.group({
      annualValue: [data ? data.annualValue : ''],
      contractDocument: [data ? data.contractDocument : ''],
      contractName: [data ? data.contractName : ''],
      contractOwner: [data ? data.contractOwner : ''],
      currency: [data ? data.currency : ''],
      email: [data ? data.email : '',[email,Validators.maxLength(80)]],
      endDate: [data ? data.endDate : ''],
      renewalDate: [data ? data.renewalDate : ''],
      startDate: [data ? data.startDate : ''],
    });
  }

  uploadFile() {
    const fileBrowser = this.fileInput.nativeElement;

    if (fileBrowser.files && fileBrowser.files[0]) {
      if (fileBrowser.files[0].size > 10485760) {
        this.toastrService.error('File size should be max 10MB', 'Error');
        return;
      }
      if (fileBrowser.files[0].type !='application/pdf') {
        this.toastrService.error('Only Pdf Allowed', 'Error');
        return;
      }
     
      let data = new FormData();
      data.append('file', fileBrowser.files[0]);
      this.spinnerService.show();

      this.httpService.postData(PATH.FILE_UPLOAD,data).subscribe(
        (res) => {
          if (this.fileDetails.type == 'doc') {
            this.companyInfo[this.fileDetails.name] = res.fileName;
          } else if (this.fileDetails.type == 'shareholder') {
            this.companyInfo.shareHolders[this.fileDetails.index][
              this.fileDetails.name
            ] = res.fileName;
          } else if (this.fileDetails.type == 'director') {
            this.companyInfo.boardOfDirectors[this.fileDetails.index][
              this.fileDetails.name
            ] = res.fileName;
          } else if (this.fileDetails.type == 'contract') {
            // this.companyInfo.contractInformation[this.fileDetails.index][
            //   this.fileDetails.name
            // ] = res.fileName;
            this.infoForm.get('contractInformation')['controls'][this.fileDetails.index].value[this.fileDetails.name]=res.fileName
          }
          this.updateCompanyInfo();
          this.fileInput.nativeElement.value = '';
          this.toastrService.success("File uploaded Successfully")
          this.spinnerService.hide();
        },
        (err) => {
          this.spinnerService.hide();

          this.toastrService.error(err.message);
          this.fileInput.nativeElement.value = '';
        }
      );
      //  fileBrowser.files.forEach(function(file){
      //   this.files.push(file);
      //  })
    }
  }
  convertDate(dateString) {
    var dateParts: Array<any> = this.ngbDateParserFormatter
      .format(dateString)
      .split('/');

    // month is 0-based, that's why we need dataParts[1] - 1
    return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
  }
  updateCompanyInfo() {
   
    // delete this.companyInfo.branchInOtherCountry;
    // this.companyInfo.contractInformation.map((o) => {
    //   o.endDate = new Date(o.endDate);
    //   o.renewalDate = new Date(o.renewalDate);
    //   o.startDate = new Date(o.startDate);
    // });
    this.infoForm.markAllAsTouched();
    if(!this.infoForm.valid){
      return;
    }
   
    this.companyInfo.contractInformation=this.infoForm.get('contractInformation').value;
    this.companyInfo.contractInformation.map((o) => {
      o.endDate =='Invalid date'?'': moment(o.endDate).format('yyyy-MM-DD');
      o.renewalDate =='Invalid date'?'': moment(o.renewalDate).format('yyyy-MM-DD');
      o.startDate == 'Invalid date'?'': moment(o.startDate).format('yyyy-MM-DD');
      o.email=o.email.toLowerCase();
    });
    this.spinnerService.show();
    if(this.reqType=='submit'){
      this.companyInfo.status = 'Submitted';
    }
    this.httpService.updateData(PATH.COMPANY_INFORMATION,this.companyInfo).subscribe(
        (res) => {
          if(res){
            this.validateDocs();
            this.companyInfo = res;
            this.spinnerService.hide();
            this.getCompanyInfo();
            // this.callParent.emit({
            //   step: this.companyInfo.step,
            //   url: '/vendor/vendor-info/3',
            // });
            // if(this.type=='save'){
            // this.router.navigate(['/vendor/vendor-info/3']);
            // this.callParent.emit({
            //   step: 3,
            //   url: '/vendor/vendor-info/3',
            //   progressStep:this.companyInfo.step
            // });
            // }
          }
         
        },
        (error) => {
          this.spinnerService.hide();
          
        }
      );
  }
  deleteFile(type, name, index, filename) {
    this.httpService
      .deleteData(PATH.DELETE_FILE + filename)
      .subscribe((res) => {
        this.toastrService.success('File Deleted Successfully!');
        if (type == 'doc') {
          this.companyInfo[name] = null;
        } else if (type == 'shareholder') {
          this.companyInfo.shareHolders[index][name] = null;
        } else if (type == 'director') {
          this.companyInfo.boardOfDirectors[index][name] = null;
        }
        this.updateCompanyInfo();
      });
  }

  next(type) {
    this.submitted = true;
    this.reqType = type;
    if (this.validateDocs()) {
      if (this.companyInfo.step <= 3) {
        this.companyInfo.step = 3;
      }
      this.updateCompanyInfo();
      if(type=='save'){
        // this.type=type;
        this.router.navigate(['/vendor/vendor-info/3']);
        this.callParent.emit({
          step: 3,
          url: '/vendor/vendor-info/3',
          progressStep:this.companyInfo.step
        });
      }
    } else {
      this.toastrService.error('Please Upload All Required Documents', 'Error');
    }
  }

  skip() {
    this.router.navigate(['/vendor/vendor-info/3']);
  }

  validateDocs() {
    if (this.submitted) {
      let invalidElements = [];
      let validElements = [];
      this.documents.map((o) => {
        if(o.name=='certificateOfIncorporation' || o.name=='tradingLicense' || o.name=='addressApproval'){
          if (!this.companyInfo[o.name]) {
            invalidElements.push(document.getElementById(o.name));
          } else {
            validElements.push(document.getElementById(o.name));
          }
        }
      });
      // this.shareholders.map((o) => {
      //   this.companyInfo.shareHolders.map((shareHolder, index) => {
      //     if (!shareHolder[o.name]) {
      //       invalidElements.push(document.getElementById(o.name + index));
      //     } else {
      //       validElements.push(document.getElementById(o.name + index));
      //     }
      //   });
      // });
      // this.directors.map((o) => {
      //   this.companyInfo.boardOfDirectors.map((director, index) => {
      //     if (!director[o.name]) {
      //       invalidElements.push(document.getElementById('bod'+o.name + index));
      //     } else {
      //       validElements.push(document.getElementById('bod'+o.name + index));
      //     }
      //   });
      // });
      validElements.map((o) => {
        o.classList.remove('b-red');
      });
      if (invalidElements.length) {
        invalidElements.map((o) => {
          o.classList.add('b-red');
        });
        invalidElements[0].scrollIntoView();
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  download(filename) {
    if(filename){
      this.spinnerService.show();
      let type = this.checkDocumentType(filename);
      this.httpService.download(PATH.GET_UPLOADED_FILE+filename).subscribe((res)=>{
        this.spinnerService.hide();
        var file = new Blob([res], {type: type});
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      })
    }else{
      this.toastrService.error('Please Upload Document', 'Error');
    }
  }
  
  goNext(){
    this.router.navigate(['vendor/vendor-info/3']);
    this.callParent.emit({
      step: this.companyInfo.step,
      url: '/vendor/vendor-info/3',
      progressStep:this.companyInfo.step
    });
  }

  checkDocumentType(filename){
    let fileType = filename.split('.').pop();
    if(fileType == 'jpeg'){
      return 'image/jpeg';
    }
    if(fileType == 'pdf'){
      return 'application/pdf';
    }
    if(fileType == 'png'){
      return 'image/png';
    }
    if(fileType == 'gif'){
      return 'image/gif';
    }
  }

  back() {
    this.router.navigate(['/vendor/vendor-info/1']);
    this.callParent.emit({
      step: 1,
      url: '/vendor/vendor-info/1',
      progressStep:this.companyInfo.step
    });
  }
}
