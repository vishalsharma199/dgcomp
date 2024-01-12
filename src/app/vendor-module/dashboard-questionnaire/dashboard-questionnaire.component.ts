import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-questionnaire-screen',
  templateUrl: './dashboard-questionnaire.component.html',
  styleUrls: ['./dashboard-questionnaire.component.scss']
})
export class QuestionnaireScreenComponent implements OnInit {

  @Input() companyInfo:any;

  constructor() { }

  ngOnInit(): void {
  }

}
