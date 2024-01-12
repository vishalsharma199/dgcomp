import { Router } from '@angular/router';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import Stepper from 'bs-stepper';
import { HttpService } from 'src/app/services/http.service';
import { CustomerUploaddocumentComponent } from '../customer-uploaddocument/customer-uploaddocument.component';
import { CustomerCompanyinformationComponent } from '../customer-companyinformation/customer-companyinformation.component';
import { CustomerQuestionnaireComponent } from '../customer-questionnaire/customer-questionnaire.component';
import { CustomerRegulationComponent } from '../customer-regulation/customer-regulation.component';
import { CustomerEsgComponent } from '../customer-esg/customer-esg.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { PATH } from 'src/app/app.constant';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-vendor',
  templateUrl: './view-vendor.component.html',
  styleUrls: ['./view-vendor.component.scss']
})
export class ViewVendorComponent implements OnInit {

  private stepper: Stepper;
  step = 1;
  percent = 100;
  notes;
  notesRes: Array<any> = [];
  responseRFI: Array<any> = [];
  items:any;
  companyInfoData;
  isRfi:boolean=false;
  false:boolean = false;
  stepCount:any;
  isProfileIncomplete:boolean=false;
  @ViewChild(CustomerUploaddocumentComponent) upload: CustomerUploaddocumentComponent;
  @ViewChild(CustomerCompanyinformationComponent)companyInfo: CustomerCompanyinformationComponent;
  @ViewChild (CustomerEsgComponent) esg : CustomerEsgComponent;
  @ViewChild(CustomerQuestionnaireComponent) questions: CustomerQuestionnaireComponent;
  @ViewChild(CustomerRegulationComponent) regulations: CustomerRegulationComponent;
  companyId: string;

  constructor(
    private httpService:HttpService,
    private spinnerService:NgxSpinnerService,
    private toastrService: ToastrService,
    private router : Router,
  ) {}

  ngOnInit(): void {
    this.companyId=localStorage.getItem('customerCompanyId');
    var stepper = document.querySelector('.bs-stepper');
    this.stepper = new Stepper(stepper, {
      linear: true,
      animation: true,
    });
    this.getDefaultCompanyInfo();
    this.disbleBtns();
  }


  stepperMove(data) {
    if (data.step == 1) {
      this.stepper.to(1);
      this.companyInfo.getCompanyInfo();
    } else if (data.step == 2) {
      this.stepper.to(2);
      this.upload.getCompanyInfo();
    } else if (data.step == 3) { 
      this.stepper.to(3);
      this.questions.getCompanyInfo(); 

    } else if (data.step == 4) {
      this.stepper.to(4);
      this.esg.getCompanyInfo(); 

    } else {
      this.stepper.to(5);
      this.regulations.getCompanyInfo();
      this.regulations.getInfo();
    }
this.disbleBtns();
  }

  getCompanyInfo(data) {
    this.stepperMove(data);
    this.step = data.step;
  }


  getDefaultCompanyInfo() {
    this.spinnerService.show();
    this.httpService.getData(PATH.COMPANY_INFORMATION+ '/' + this.companyId).subscribe((res: any) => {
          this.spinnerService.hide();
          this.companyInfoData = res;
          if(res?.status=='Profile Incomplete'){
            this.stepCount=res?.step; 
          }
          if(res.status=='Rfi Generated'){
            this.isRfi=true;
          }
          if(res.status=='Profile Incomplete'){
            this.isProfileIncomplete=true;
            this.percent=(res.step-1) * 20;
          }
          
          this.getRFI(res.id);
         },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }


  getRFI(id) {  
    this.spinnerService.show();
    this.httpService.getData(PATH.RFI +'/'+id).subscribe((res: any) => {
      this.responseRFI = res;
      this.spinnerService.hide();
    },
      (error) => {
        this.spinnerService.hide();
        this.toastrService.error(error.message?.error);
      }
    )
  }

  pages(step){
    let data = {step:step}
    this.stepperMove(data);
  }

  disbleBtns(){
  document.getElementById("questionnaire-trigger").removeAttribute("disabled");
  document.getElementById("upload-part-trigger").removeAttribute("disabled");
  document.getElementById("companyInformation-part-trigger").removeAttribute("disabled");
  document.getElementById("esg-trigger").removeAttribute("disabled");
  document.getElementById("regulations-part-trigger").removeAttribute("disabled");
}

  back(){
    window.history.back();
  }

}
