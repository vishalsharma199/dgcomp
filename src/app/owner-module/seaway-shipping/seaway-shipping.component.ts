import { Component, OnInit } from '@angular/core';
import {DialogService} from 'primeng/dynamicdialog';
import {  ActivatedRoute } from '@angular/router';
import { PATH } from 'src/app/app.constant';
import { HttpService } from 'src/app/services/http.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
@Component({
  selector: 'app-seaway-shipping',
  templateUrl: './seaway-shipping.component.html',
  styleUrls: ['./seaway-shipping.component.scss']
})
export class SeawayShippingComponent implements OnInit {
  responsiveOptions;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  order: any = 'desc';
  VendorQuestion:any;
  col: any = 'createdDate';
  locationheaders: Array<any>;
  vendorId:any;
  titleName:any;
  esgScore:any;
  numberOfElements:any;
  constructor(public dialogService:DialogService,
    private httpService: HttpService,
    private spinnerService: NgxSpinnerService,
    private ar:ActivatedRoute) { 
  }

  ngOnInit(): void {
    this.ar.params.subscribe((params)=>{
      this.vendorId=params.id;
    this.getComplianceRisk(this.vendorId);

    })
    this.prepareHeader();
  }

  getComplianceRisk(id) {
    this.spinnerService.show();
    this.httpService.getData(PATH.VENDOR_ID_INFO + '/{id}?vendorId='+id).subscribe((res: any) => {
          this.VendorQuestion = res.questionAnswers;
          this.titleName = res.vendorName;
          this.esgScore = res.esgScore;
          
          this.spinnerService.hide();
          },
        (error) => {
          this.spinnerService.hide();
        }
      );

  }


  locationData: Array<any> = [
    {item: 'Do you have an ESG policy and pain in place?', image:'icon icon-tick-circle'},
    {item: 'If yes, do you have a designated person diving day-to day ESG matters?',  image:'icon icon-tick-circle'},
    {item: 'Do you Provide ESG traning to staff', image:'icon icon-tick-circle'},
    {item: 'Do you have an environment policy and targets to improve the company environmental footprint', image:'icon icon-cross-circle'},
    {item: 'Does the company moniter and report its carbon and/or other greenhouse gas emissions', image:'icon icon-tick-circle'},
    {item: 'Has the company conducted a climate change risk assessment to ascertain whether its operations could be at risk from current/evolving climate change regulations', image:'icon icon-tick-circle'},
    {item: 'Does the company have a health and safety policy', image:'icon icon-cross-circle'},
    {item: 'Does the company moniter incident/accidents', image:'icon icon-tick-circle'},
    {item: 'Does the company have a  policy that supports diversity and equal opportunity? ', image:'icon icon-tick-circle'},
    {item: 'Does the company have corporate goveernance defined and mapped? ', image:'icon icon-cross-circle'},
    {item: 'Do you have 1) Audit Commitee 2) Risk Commitee 3) ESG / CSR Committee ', image:'icon icon-tick-circle'},
    {item: 'Does the company have code of Ethics in place? ', image:'icon icon-tick-circle'},
    {item: 'Does the company have a Company Gifts / Corporate Entertainment policy ', image:'icon icon-cross-circle'},
  ];


    prepareHeader(){
      this.locationheaders = [
        { name: 'item', header: 'Items', sort: false,isAsc:false},
        { name: 'answer', header: 'Answer', sort: false,isAsc:false},
      ];
    }

}
