import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { PATH } from 'src/app/app.constant';
import { AppCookieService } from 'src/app/services/cookieService';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'company-info-questionnaire',
  templateUrl: './company-info-questionnaire.component.html',
  styleUrls: ['./company-info-questionnaire.component.scss'],
})
export class CompanyInfoQuestionnaireComponent implements OnInit {
  @Output("getCompanyInfo") callParent: EventEmitter<any> = new EventEmitter();

  questions: Array<any> = [];
  subsriptions: Subscription;
  user: any;
  companyInfo: any = {};
  questionForm: UntypedFormGroup;
  disableBtn:boolean = false;
  constructor(
    private httpService: HttpService,
    private router: Router,
    private appCookieService: AppCookieService,
    private toastrService: ToastrService,
    private spinnerService: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(this.appCookieService.get('digiUser'));
    this.getQuestions();
  }

  getQuestions() {
    this.httpService.getData(PATH.VENDOR_QUESTIONS).subscribe((res: Array<any>) => {
        this.questions = [];
        res.forEach((question) => {
          if (question.question) {
            this.questions.push({ question: question.question, answer: '' });
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

          if(this.companyInfo['answers'])
          {
            this.questions = this.companyInfo['answers'];
          }
        },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }

  onSubmit(form: UntypedFormGroup) {
    let answers = [];
    this.questions.forEach((q) => {
      let answer = {
        "answer": q.answer,
        "question": q.question
      }
      answers.push(answer)
    });
    form.markAllAsTouched();
    this.companyInfo['answers'] = answers;
    this.updateCompanyInfo();
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
    if (this.companyInfo.step <= 4) {
      this.companyInfo.step = 4;
    }
    this.httpService.updateData(PATH.COMPANY_INFORMATION,this.companyInfo).subscribe(
        (res) => {
          this.companyInfo = res;
          this.spinnerService.hide();
          this.router.navigate(['/vendor/vendor-info/4']);
          this.callParent.emit({step:4,url:'/vendor/vendor-info/4',progressStep:this.companyInfo.step})

        },
        (error) => {
          this.spinnerService.hide();
          
          this.toastrService.error(error.message?.error);
        }
      );
  }

  goNext(){
    this.router.navigate(['vendor/vendor-info/4']);
    this.callParent.emit({
      step: 4,
      url: '/vendor/vendor-info/4',
      progressStep:this.companyInfo.step
    });
  }


  back(){
    this.router.navigate(['/vendor/vendor-info/2'])
    this.callParent.emit(
      {step:2,
      url:'/vendor/vendor-info/2',
      progressStep:this.companyInfo.step
    }
      )
  }
}
