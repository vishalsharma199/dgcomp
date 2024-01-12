import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { PATH } from 'src/app/app.constant';
import { AppCookieService } from 'src/app/services/cookieService';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'company-info-esg',
  templateUrl: './company-info-esg.component.html',
  styleUrls: ['./company-info-esg.component.scss'],
})
export class CompanyInfoEsgComponent implements OnInit {
  @Output("getCompanyInfo") callParent: EventEmitter<any> = new EventEmitter();

  esg: Array<any> = [];
  subsriptions: Subscription;
  user: any;
  companyInfo: any = {};
  disableBtn:boolean= false;
  questionForm: UntypedFormGroup;
  constructor(
    private httpService: HttpService,
    private router: Router,
    private appCookieService: AppCookieService,
    private toastrService: ToastrService,
    private spinnerService: NgxSpinnerService,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(this.appCookieService.get('digiUser'));
    this.getEsg();
  }

  getEsg() {
    this.httpService.getData(PATH.VENDOR_ESG).subscribe((res: Array<any>) => {
        this.esg = [];
        res.forEach((question) => {
          if (question.question) {
            this.esg.push({ question: question.question, answer: '' });
          }
        });
        this.getCompanyInfo();
        this.spinnerService.hide();
      });
  }

  getCompanyInfo() {
    this.spinnerService.show();
    this.httpService.getData(PATH.COMPANY_INFORMATION).subscribe((res: any) => {
          if (!res) {
            this.spinnerService.hide();
            return;
          }

          this.spinnerService.hide();
          this.companyInfo = res;
          if(this.companyInfo.status == 'Submitted'){
             this.disableBtn = true;
          }

          if(this.companyInfo['esg'])
          {
            this.esg = this.companyInfo['esg'];
          }
        },
        (error) => {
          this.spinnerService.hide();
          
          // this.toastrService.error(error.message?.error);
        }
      );
  }
  onSubmit(form: UntypedFormGroup) {
    // let answers=form.value;
    if(form.invalid){
      this.toastrService.error('Please Fill all The Fields', 'Error');
      return;
    }
    else
    {
      let esg = [];
      this.esg.forEach((q) => {
        let answer = {
          "answer": q.answer,
          "question": q.question
        }
        esg.push(answer)
        // answers[q.question] = q.answer;
      });
      form.markAllAsTouched();
      this.companyInfo['esg'] = esg;
      this.updateCompanyInfo();
    }
   
  }


  updateCompanyInfo() {
    this.spinnerService.show();
    let branches = [];
    if (this.companyInfo.branchInOtherCountry) {
      this.companyInfo.branchInOtherCountry.map((o) => {
        o.branch ? branches.push(o.branch) : branches.push(o);
      });
      this.companyInfo.branchInOtherCountry = branches;
    }
    // this.companyInfo.step = 4;
    if (this.companyInfo.step <= 5) {
      this.companyInfo.step = 5;
    }
    this.httpService.updateData(PATH.COMPANY_INFORMATION,this.companyInfo).subscribe(
        (res) => {
          this.companyInfo = res;
          this.spinnerService.hide();
          this.router.navigate(['/vendor/vendor-info/5']);
          this.callParent.emit({step:5,url:'/vendor/vendor-info/5',progressStep:this.companyInfo.step})

        },
        (error) => {
          this.spinnerService.hide();
          
          this.toastrService.error(error.message?.error);
        }
      );
  }


  goNext(){
    this.router.navigate(['vendor/vendor-info/5']);
    this.callParent.emit({
      step: 5,
      url: '/vendor/vendor-info/5',
      progressStep:this.companyInfo.step
    });
  }



  back(){
    this.router.navigate(['/vendor/vendor-info/3'])
    this.callParent.emit({step:3,url:'/vendor/vendor-info/3',progressStep:this.companyInfo.step})
  }
}
