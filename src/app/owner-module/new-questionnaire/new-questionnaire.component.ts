import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PATH } from 'src/app/app.constant';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ValidatorsServiceService } from 'src/app/services/validators-service.service';

@Component({
  selector: 'app-addnewquestionpopup',
  templateUrl: './new-questionnaire.component.html',
  styleUrls: ['./new-questionnaire.component.scss']
})
export class NewQuestionnaireComponent implements OnInit {

  formSubmitAttempt:boolean=false;
  error:boolean=false;
  errorMsg;
  question:any;

  constructor(
    private formbuilder: UntypedFormBuilder, 
    private httpService: HttpService,
    private toastrService: ToastrService, 
    private spinnerService: NgxSpinnerService,
    private ref: DynamicDialogRef,
    private dialogService : DynamicDialogConfig,
    public DialogService:DialogService,
    public validators:ValidatorsServiceService
    ) {}

  ngOnInit(): void {
    if(this.dialogService.data?.id){
      this.question = this.dialogService.data?.id;
      this.getQuestionnaire(this.dialogService.data?.id);
    }
    
  }
  
  public addNewQuestionForm = this.formbuilder.group({
    id:[''],
    question: ['',Validators.required],
  })
 
  get f(){
    return this.addNewQuestionForm.controls
  }

  saveQuestion(){
    this.formSubmitAttempt=true;
    if(this.addNewQuestionForm.invalid){
      return;
    }else{
      this.spinnerService.show();
      let payload = this.addNewQuestionForm.value;
      if(!this.question){
        delete payload.id
      }
      const request=this.question? this.httpService.updateData(PATH.QUESTIONNAIRE,payload):  this.httpService.postData(PATH.QUESTIONNAIRE,payload)
      request.subscribe((res)=>{
        this.spinnerService.hide();
        this.toastrService.success('Questions Saved Successfully!');
        this.ref.close(); 
        this.formSubmitAttempt=false;
        this.addNewQuestionForm.reset()
      },(err) => {
        this.spinnerService.hide();
        this.error = true;
        this.errorMsg = err.message.message;
        this.toastrService.error(this.errorMsg);
      })
    }
    
    

    
  }

  getQuestionnaire(id){
    this.spinnerService.show();
    this.httpService.getData(PATH.QUESTIONNAIRE+ '/findById/' + id).subscribe((res)=>{
      this.addNewQuestionForm.patchValue(res);
      this.spinnerService.hide();
    },(err) => {
      this.spinnerService.hide();
      this.error = true;
      this.errorMsg = err.message.message;
      this.toastrService.error(this.errorMsg);
    })
  }

  onClear(){
    this.ref.destroy();
   }

  
}
