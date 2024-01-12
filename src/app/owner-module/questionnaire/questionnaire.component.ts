import { Component, Input, OnInit } from '@angular/core';
import {DialogService} from 'primeng/dynamicdialog';
import { NewQuestionnaireComponent } from '../new-questionnaire/new-questionnaire.component';
import { HttpService } from 'src/app/services/http.service';
import { PATH } from 'src/app/app.constant';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent implements OnInit {
  @Input() type;
  @Input() data;
  showMe:boolean=false;
  companyQuestion:any;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  headers: Array<any>
  portList: Array<any>;
  order: any = 'desc';
  col: any = 'createdDate';
  numberOfElements:any;


  constructor(public dialogService:DialogService,
    private httpService: HttpService,
    private toastrService: ToastrService,
    private spinnerService: NgxSpinnerService,
    private confirmationService:ConfirmationService,
    ) { }
  

  ngOnInit(): void {
    this.getQuestionnaire();
  this.prepareHeader();

  }
  
  
  prepareHeader(){
    this.headers = [
      { name: 'Questionnaire', header: 'Questionnaire', sort: false,isAsc:true},
      { name: 'action', header: 'Action', sort: false,isAsc:false},
    ];
  }

  addNewQuestion(){
    const ref=this.dialogService.open(NewQuestionnaireComponent,
      {
        header:'Add Question',
        width:'50%'
      });
      ref.onClose.subscribe(res => {
        this.getQuestionnaire();
      });
  }

  getQuestionnaire(){
    this.httpService.getData(PATH.QUESTIONNAIRE).subscribe((res)=>{
      this.companyQuestion=res;
    }) 
  }
  
  delete(item){
    this.confirmationService.confirm({
      message:"Are you sure that you want to delete?",
      accept:()=>{
        this.spinnerService.show();
        this.httpService
          .deleteData(PATH.QUESTIONNAIRE+ '/'+ item.id)
          .subscribe(
            (res: any) => {
              this.spinnerService.hide();
              this.toastrService.success('Question Deleted Successfully!')
              this.getQuestionnaire();
            },
            (error) => {
              this.spinnerService.hide();
              this.toastrService.error(error.message?.error);
            }
          );
        this.confirmationService.close();
      },
      reject:()=>{
        this.confirmationService.close();
      }
    })
  }
  
  editQuestion(itm) {
    const ref=this.dialogService.open(NewQuestionnaireComponent,
      { data: itm,
        header:'Add Question',
        width:'50%'
      });
      ref.onClose.subscribe(res => {
        this.getQuestionnaire();
      });
  }
  

  


  // show and hide toggle button
  toogleTag(){
    this.showMe=!this.showMe
  }

}
