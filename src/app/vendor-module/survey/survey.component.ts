import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormArray, } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import {DialogService} from 'primeng/dynamicdialog';
import { PATH } from 'src/app/app.constant';
import { HttpService } from 'src/app/services/http.service';
import { AddvendorscreenSurveyComponent } from '../addvendorscreen-survey/addvendorscreen-survey.component';
@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {

  isCreateSurvey:boolean=false;
  isQuestionAdd:boolean=false;
  surveyHeaders: Array<any>;
  surveyInfo :any;
  surveyData :any;
  index: any;
  removeIndex:any;
  quantity: any = [];
  quality: any = [];
  getSurveyId:any;
  apiData: any = [];
  formData:any = [];
  constructor(private fb: UntypedFormBuilder,
    public dialogService:DialogService,
    private spinnerService: NgxSpinnerService,
    private httpService: HttpService,
    private toastrService: ToastrService,

    ) { 
  }

  ngOnInit(): void {
    this.prepareSurveyHeader();
    this.getAllSurvey();
  }


  onChange(deviceValue?, i?) {
    if (deviceValue == "Quantitative") {
      this.quantity[i] = true;
      this.quality[i] = false;
    }
    if (deviceValue == "Qualitative") {
      this.quantity[i] = false;
      this.quality[i] = true;
    }
  }

  addSurvey(survey){

    this.isCreateSurvey=true;
    this.isQuestionAdd=false;
    this.getSurveyById(survey);
  }

  backSurvey(){
    this.isCreateSurvey=false;
    this.isQuestionAdd=false;
    (<UntypedFormArray>this.surveyForm.get('questionsAnswer')).removeAt(-1);  
  }

    prepareSurveyHeader(){
      this.surveyHeaders = [
        { name: 'date', header: 'Date', sort: false,isAsc:false},
        { name: 'item', header: 'Survey Title', sort: false,isAsc:false},
        { name: 'status', header: 'Status', sort: false,isAsc:false},
        {name:'',header:''}
      ];
    }
  
    
  public surveyForm = this.fb.group({
    title:[""],
    message: [""],
    questionsAnswer: this.fb.array([]),
    // title: ["", [Validators.required]]
  })


  addQuestionsAnswer(data): void {
    // (<FormArray>this.surveyForm.get('questionsAnswer')).push(this.addAnswer(data));
    const control = <UntypedFormArray>this.surveyForm.controls['questionsAnswer']
    control.push(this.addAnswer(data))
  }

  addAnswer(data) {
    return this.fb.group({  
      question: [data ? data.question : '', {validators: [Validators.required]}],  
      answerParameter: [data ? data.answerParameter : '', {validators: [Validators.required]}],  
      rating: [data ? data.rating : '', {validators: [Validators.required]}],  
      vendorRatingType: [data ? data.rating  : ''],  
       
    });  
   }

   addNewRequestPopup(){
    const ref=this.dialogService.open(AddvendorscreenSurveyComponent,
      { width:'50%',  })
  } 
  
  getAllSurvey() {
    this.spinnerService.show();
    this.httpService.getData(PATH.GET_VENDOR_SURVEY+'/dashboard').subscribe((res: any) => {
          this.surveyInfo = res;
          this.spinnerService.hide();
          },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }
  
  getSurveyById(survey){
    this.spinnerService.show();
    this.httpService.getData(PATH.GET_VENDOR_SURVEY+'/{id}?surveyId='+survey.surveyId+'&vendorId='+survey.vendorId).subscribe((res: any) => {
    this.getSurveyId=res.surveyId
      this.surveyData = res.questionsAnswer;
      this.removeIndex = this.surveyData.length;
     const directorsformArray = new UntypedFormArray([]);
     
     this.surveyData.forEach(data => {
      this.apiData = data.rating;
      this.addQuestionsAnswer(data)
      directorsformArray.push(this.addAnswer(data));
     });

     this.surveyForm.patchValue(res);
     this.spinnerService.hide();
    },(error) => {
      this.spinnerService.hide();
    });
  }

  inviteSend(){
     let newData = this.surveyForm.value;
     newData.questionsAnswer.forEach(element => {
      this.formData =  element.rating;
     });
     
     if(this.getSurveyId){    
      if(this.apiData === this.formData){
        this.toastrService.error('Please fill all the required fields');
        return
       }  

    this.spinnerService.show();
      let payload = this.surveyForm.value;
      const request = this.httpService.patchData(PATH.GET_VENDOR_SURVEY + '?surveyId=' + this.getSurveyId, payload)
      request.subscribe((res) => {
        this.spinnerService.hide();
        this.isCreateSurvey=false;
        for (let i = 0; i <= this.removeIndex; i++) { 
          (<UntypedFormArray>this.surveyForm.get('questionsAnswer')).removeAt(i);  
          }
        this.surveyForm.reset();

        this.getAllSurvey();
      }, (err) => {
        this.spinnerService.hide();
        this.toastrService.error(err.message.message);
      })
    }

  }

}
