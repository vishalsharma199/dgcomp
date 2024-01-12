
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from '../../services/http.service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, Validators, } from '@angular/forms';
import { Country } from 'country-state-city';
import { PATH } from 'src/app/app.constant';
import {Router } from '@angular/router';
import { ValidatorsServiceService } from 'src/app/services/validators-service.service';
import { noExtraWhiteSpace, noSpecialCharAllow, onlyCharacters } from 'src/app/services/custom.validations';
import * as moment from 'moment';
import { throwIfEmpty } from 'rxjs/operators';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
@Component({
  selector: 'app-customer-compliance',
  templateUrl: './customer-compliance.component.html',
  styleUrls: ['./customer-compliance.component.scss']
})
export class CustomerComplianceComponent implements OnInit {

  heading:any;
  vendorHeading:any;
  customerData:Array<any>=[];
  vendorData:Array<any>=[];
  type:any;
  page = 0;
  pageSize = 10;
  collectionSize = 0;
  totalRecords=0;
  sortBy='createdAt';
  sortOrder='desc';
  searchFor:any='COMPLIANCE';
  constructor(
    private route:ActivatedRoute,
    private fb: UntypedFormBuilder,
    private httpService :HttpService,
    private spinnerService: NgxSpinnerService,
    private toastrService :ToastrService,
    private router : Router,
    public validators:ValidatorsServiceService,
    private confirmationService:ConfirmationService

  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((res)=>{
      this.type=res.type 
    });
    this.prepareHeading();
    this.getData();
  }

  prepareHeading(){
    this.heading=[
      {title:'companyName',name:'Customer Name'},
      {title:'entityType',name:'Entity Type'},
      {title:'sanctions',name:'Sanctions, Warnings & Probity'},
      // {title:'policyExposed',name:'Politically Exposed Persons'},
      {title:'adverseMedia',name:'Adverse Media'},
      {title:'delete',name:'Delete'},
    ]
    this.vendorHeading=[
      {title:'vendorName',name:'Vendor Name'},
      {title:'entityType',name:'Entity Type'},
      {title:'sanctions',name:'Sanctions, Warnings & Probity'},
      // {title:'policyExposed',name:'Politically Exposed Persons'},
      {title:'adverseMedia',name:'Adverse Media'},
      {title:'delete',name:'Delete'},
    ]
  }

  // getData(){
  //   this.vendorData=[
  //     {company:'Central Bank of Iran',entityType:'COMPANY',sanctions:'Y',policyExposed:'',adverseMedia:'Y'},
  //     {company:'Google',entityType:'COMPANY',sanctions:'Y',policyExposed:'N',adverseMedia:'Y'},
  //     {company:'MERRILL LYNCH INTERNATIONAL LIMITED BANK',entityType:'COMPANY',sanctions:'N',policyExposed:'',adverseMedia:'N'},
  //     {company:'JP MORGAN J.P.MORGAN',entityType:'COMPANY',sanctions:'N',policyExposed:'',adverseMedia:'N'},
  //     {company:'HSBC PRIVATE BANK (SUISSE) SA',entityType:'COMPANY',sanctions:'N',policyExposed:'',adverseMedia:'Y'},
  //     {company:'ROYAL DUTCH SHELL PLC',entityType:'COMPANY',sanctions:'Y',policyExposed:'',adverseMedia:'Y'},
  //     {company:'FACEBOOK, INC.',entityType:'COMPANY',sanctions:'N',policyExposed:'',adverseMedia:'Y'},
  //     {company:'WASHINGTON FEDERAL BANK FOR SAVINGS',entityType:'COMPANY',sanctions:'N',policyExposed:'',adverseMedia:'N'},
  //     {company:'BANQUE PRIVEE EDMOND DE ROTHSCHILD',entityType:'COMPANY',sanctions:'Y',policyExposed:'',adverseMedia:'N'},
  //     {company:'GENERAL MOTORS COMPANY',entityType:'COMPANY',sanctions:'N',policyExposed:'',adverseMedia:'Y'},
  //     {company:'Route Mobile',entityType:'COMPANY',sanctions:'N',policyExposed:'',adverseMedia:'N'}
  //   ]
  //   this.complianceData=[
  //     {company:'AIRBUS GROUP',entityType:'COMPANY',sanctions:'N',policyExposed:'',adverseMedia:'Y'},
  //     {company:'MICROSOFT CORPORATION',entityType:'COMPANY',sanctions:'N',policyExposed:'',adverseMedia:'N'},
  //     {company:'WALMART INC.',entityType:'COMPANY',sanctions:'N',policyExposed:'',adverseMedia:'Y'},
  //     {company:'BARCLAYS BANK PLC UAE',entityType:'COMPANY',sanctions:'N',policyExposed:'',adverseMedia:'N'},
  //     {company:'INTERNATIONAL BUSINESS MACHINES CORPORATION (IBM)',entityType:'COMPANY',sanctions:'N',policyExposed:'',adverseMedia:'N'},
  //     {company:'BERKSHIRE HATHAWAY INC.',entityType:'COMPANY',sanctions:'N',policyExposed:'',adverseMedia:'N'},
  //     {company:'KINGFISHER AIRLINES LTD',entityType:'COMPANY',sanctions:'Y',policyExposed:'',adverseMedia:'Y'},
  //     {company:'GLOBUS MARITIME PTE. LTD.',entityType:'COMPANY',sanctions:'Y',policyExposed:'',adverseMedia:'Y'},
  //     {company:'TRUMP HOTELS &. CASINO RESORTS INC.',entityType:'COMPANY',sanctions:'Y',policyExposed:'',adverseMedia:'N'},
  //     {company:'DE BEERS UK LIMITED',entityType:'COMPANY',sanctions:'Y',policyExposed:'',adverseMedia:'Y'}
  //   ]
  // }

  getData(){
    this.spinnerService.show();
    let type=this.type.toUpperCase();
     this.httpService.getDataSearch(`${PATH.SEARCH_CIS}/dashboard/data?page=${this.page}&searchFor=${this.searchFor}&size=${this.pageSize}&sort=${this.sortBy},${this.sortOrder}&vendorType=${type}`).subscribe((res:any)=>{    
       this.spinnerService.hide(); 
       if(this.type=='customer'){
        this.customerData=res['content'];
        this.customerData.forEach(elm=>{
          let adverseMedia = elm.cisComplianceData.searchData[0].amlType.includes('adverse-media');
          if(adverseMedia){
            elm.adverseMedia = 'Y';
          }else{
            elm.adverseMedia = 'N';
          }
          let sanctions = elm.cisComplianceData.searchData[0].amlType.includes('sanction');
          if(sanctions){
            elm.sanctions = 'Y';
          }else{
            elm.sanctions = 'N';
          }          
        })
       }
       if(this.type=='vendor'){
        this.vendorData=res['content'];
        this.vendorData.forEach(elm=>{
          let adverseMedia = elm.cisComplianceData.searchData[0].amlType.includes('adverse-media');
          if(adverseMedia){
            elm.adverseMedia = 'Y';
          }else{
            elm.adverseMedia = 'N';
          }
          let sanctions = elm.cisComplianceData.searchData[0].amlType.includes('sanction');
          if(sanctions){
            elm.sanctions = 'Y';
          }else{
            elm.sanctions = 'N';
          }          
        })
       }
  },
      (err) => {
      this.spinnerService.hide();
      this.toastrService.error(err.message.message);
    }) 
  }

  gotoDashboard(itm){
    this.router.navigate(['/customer/bank-dashboard',itm.searchId,'']);
  }

  onDeleteRow(itm,index){
    this.confirmationService.confirm({
      message:"Are you sure that you want to delete?",
      accept:()=>{
        this.httpService.deleteData(PATH.SEARCH_CIS+'/dashboard/'+itm.id).subscribe(res=>{
          this.toastrService.success('Deleted successfully');
          this.getData();
        })
      }
    })
  }
}
