
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
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-customers-risk',
  templateUrl: './customers-risk.component.html',
  styleUrls: ['./customers-risk.component.scss']
})
export class CustomersRiskComponent implements OnInit {

  type:any;
  page = 0;
  pageSize = 10;
  collectionSize = 0;
  totalRecords=0;
  sortBy='createdAt';
  sortOrder='desc';
  searchFor:any='FINANCIAL';
  customerRisk:Array<any>=[];
  vendorRisk:Array<any>=[];
  // vendorRisk:any=[
  //   {companyName:'Central Bank of Iran', capacity:'7', cyberSecurity:'9', financial:'9', operation:'5', enterprise:10, country:10}, 
  //   {companyName:'Google', capacity:'7', cyberSecurity:'8', financial:'5', operation:'1', enterprise:'1', country:'1'}, 
  //   {companyName:'MERRILL LYNCH INTERNATIONAL LIMITED BANK', capacity:'7', cyberSecurity:'2', financial:'6', operation:'2', enterprise:'1', country:'1'}, 
  //   {companyName:'JP MORGAN J.P.MORGAN', capacity:'7', cyberSecurity:'2', financial:'6', operation:'1', enterprise:'1', country:'1'}, 
  //   {companyName:'HSBC PRIVATE BANK (SUISSE) SA', capacity:'7', cyberSecurity:'1', financial:'7', operation:'2', enterprise:'1', country:'1'},
  //   {companyName:'ROYAL DUTCH SHELL PLC', capacity:'7', cyberSecurity:'3', financial:'3', operation:'1', enterprise:'1', country:'1'}, 
  //   {companyName:'FACEBOOK, INC.', capacity:'7', cyberSecurity:'2', financial:'2', operation:'2', enterprise:'1', country:'1'}, 
  //   {companyName:'WASHINGTON FEDERAL BANK FOR SAVINGS', capacity:'7', cyberSecurity:'1', financial:'7', operation:'1', enterprise:'1', country:'1'}, 
  //   {companyName:'BANQUE PRIVEE EDMOND DE ROTHSCHILD', capacity:'7', cyberSecurity:'8', financial:'8', operation:'2', enterprise:'1', country:'1'}, 
  //   {companyName:'GENERAL MOTORS COMPANY', capacity:'7', cyberSecurity:'9', financial:'6', operation:'1', enterprise:'1', country:'1'},
  //   {companyName:'Route Mobile', capacity:'7', cyberSecurity:'7', financial:'7', operation:'3', enterprise:'1', country:'1'},
  // ]

  // customerRisk:any=[
  //   {companyName:'AIRBUS GROUP', capacity:'7', cyberSecurity:'8', financial:'9', operation:'7', enterprise:'8', country:'9'}, 
  //   {companyName:'MICROSOFT CORPORATION', capacity:'7', cyberSecurity:'3', financial:'5', operation:'2', enterprise:'1', country:'1'}, 
  //   {companyName:'WALMART INC.', capacity:'7', cyberSecurity:'4', financial:'5', operation:'1', enterprise:'1', country:'1'}, 
  //   {companyName:'BARCLAYS BANK PLC UAE', capacity:'7', cyberSecurity:'2', financial:'4', operation:'2', enterprise:'1', country:'1'}, 
  //   {companyName:'INTERNATIONAL BUSINESS MACHINES CORPORATION (IBM)', capacity:'7', cyberSecurity:'1', financial:'7', operation:'1', enterprise:'1', country:'1'},
  //   {companyName:'BERKSHIRE HATHAWAY INC.', capacity:'7', cyberSecurity:'1', financial:'2', operation:'2', enterprise:'2', country:'1'}, 
  //   {companyName:'KINGFISHER AIRLINES LTD', capacity:'7', cyberSecurity:'9', financial:'8', operation:'1', enterprise:'1', country:'1'}, 
  //   {companyName:'GLOBUS MARITIME PTE. LTD.', capacity:'7', cyberSecurity:'7', financial:'5', operation:'2', enterprise:'1', country:'1'}, 
  //   {companyName:'TRUMP HOTELS &. CASINO RESORTS INC.', capacity:'7', cyberSecurity:'7', financial:'3', operation:'1', enterprise:'2', country:'1'}, 
  //   {companyName:'DE BEERS UK LIMITED', capacity:'7', cyberSecurity:'5', financial:'3', operation:'1', enterprise:'1', country:'1'}
  // ]

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
    this.getData();
  }

  getData(){
    this.spinnerService.show();
    let type=this.type.toUpperCase();
     this.httpService.getDataSearch(`${PATH.SEARCH_CIS}/dashboard/data?page=${this.page}&searchFor=${this.searchFor}&size=${this.pageSize}&sort=${this.sortBy},${this.sortOrder}&vendorType=${type}`).subscribe((res:any)=>{    
       this.spinnerService.hide(); 
       if(this.type=='customer'){
        this.customerRisk=res['content'];
       }
       if(this.type=='vendor'){
        this.vendorRisk=res['content'];
       }
   },
    (err) => {
    this.spinnerService.hide();
    this.toastrService.error(err.message.message);
  }) 
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
