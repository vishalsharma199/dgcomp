import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {  ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from './../../services/http.service';
import { PATH } from 'src/app/app.constant';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

 
  showMe:boolean=false
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  headers: Array<any>;
  potentialHeader:Array<any>;
  financialHeader:Array<any>;
  cisDataBestMatchList: Array<any>;
  checked:boolean=false;
  header:Array<any>;
  cisDataPotentialMatchList:Array<any>;
  searchData:any
  cisId:any;
  storeMatch:any=[];
  formSubmitAttempt:boolean=false;
  cisDescription:any=[]
  description:any=[];
  financialInformation:boolean=false;
  isDataAvailable:boolean=true;
  order: any = 'desc';
  col: any = 'createdDate';
  numberOfElements:any;
  isFinancial:boolean=false;
  cisFinancialData:any=[];
  isSeekData:boolean=false;
  count:number=0;
  constructor(
    private fb: UntypedFormBuilder, 
    private toastrService: ToastrService,
    private router: Router,
    private httpService :HttpService,
    private ar:ActivatedRoute,
    private spinnerService: NgxSpinnerService,
    ) {}

  public companySearchForm = this.fb.group({
    checkbox: ['',Validators.required],
  })

  ngOnInit(): void {
    this.ar.params.subscribe((params)=>{
      this.cisId=params.id;
    })
    this.getCisDataById();
    this.prepareHeaders();
    // this.spinnerService.show();
  }

  prepareHeaders(){
    this.headers = [
      { name: 'name', header: 'Name', sort: false,isAsc:true,width:'200px'},
      { name: 'entityType', header: 'Entity Type', sort: false,isAsc:false,width:'100px'},
      { name: 'description', header: 'Description', sort: false,isAsc:false,width:'350px'},
      { name: '', header: '',sort: false, width:'100px'},
    ]; 

    this.potentialHeader = [
      { name: 'name', header: 'Name', sort: false,isAsc:true,width:'200px'},
      { name: 'entityType', header: 'Entity Type', sort: false,isAsc:false,width:'100px'},
      { name: 'description', header: 'Description', sort: false,isAsc:false,width:'350px'},
      { name: '', header: '',sort: false,width:'100px'},
    ]; 

    this.financialHeader=[
      { name: 'name', header: 'Name', sort: false,isAsc:true},
      { name: 'country', header: 'Country', sort: false,isAsc:true},
      { name: 'town', header: 'Town', sort: false,isAsc:true},
      { name: 'uid', header: 'UID', sort: false,isAsc:true},
      { name: 'addressInfo', header: 'Address', sort: false,isAsc:true},
      { name: '', header: ''},
    ]
  }




  getCisDataById(){ 

    this.httpService.getDataSearch(PATH.SEARCH_CIS+'/'+this.cisId).subscribe((res: any) => {
      if(res.searchFor=='COMPLIANCE'){
        this.isFinancial=false;
        this.getDataBySummary();
       }
      if(res.searchFor=='FINANCIAL'){
        this.isFinancial=true;
        this.getCisCompanies();
        // this.getSeekFinancialData();
      }
    },
      (err) => {
        this.spinnerService.hide();
        this.toastrService.error(err.message.message);
      })
  }

  callCisCompanies() {
    // if(this.isDataAvailable){
    //   this.getFinancialData();
    // }
    // else{
    
      this.count=this.count+1;
        setTimeout(()=>{
          this.getCisCompanies();
        }, 2000);
   
    // }
  }

  getCisCompanies(){
    // this.spinnerService.show();
    this.httpService.getDataSearch(PATH.SEARCH_CIS+'/search-companies/?cisId='+this.cisId).subscribe((res: any) => {
        this.cisFinancialData=res;
        this.isDataAvailable=true;
        if(res.length==0){
          if(this.count>5){
            this.isSeekData=true;
            this.isDataAvailable=false;
          }
          else{
            this.callCisCompanies();
          }
        }
        this.isSeekData=true;
        this.spinnerService.hide();
    },
      (err) => {
        this.cisFinancialData=false;
        this.spinnerService.hide();
        this.isSeekData=false;
        // this.toastrService.error(err.message.message);
        if(this.count>5){
          this.isSeekData=true;
          this.isDataAvailable=false;
        }
        else{
          this.callCisCompanies();
        }
      })
  }

  checkValue(data){
   
      if(!data.isFinancialInfo){
        data.isFinancialInfo=false;
      }
      else
      {
        data.isFinancialInfo=true;
      }
  }
  checkPotentialValue(data){
   
    if(!data.isFinancialInfo){
      data.isFinancialInfo=false;
    }
    else
    {
      data.isFinancialInfo=true;
    }
}


  changePath(data,match){
    this.router.navigate(['/customer/bank-dashboard',this.cisId,'']);
    localStorage.setItem('match',match);
    localStorage.setItem('entityId',data.entityId);
    localStorage.setItem('matchList',JSON.stringify(data.matchList));
  }

  view(data,match){
    
    localStorage.setItem('entityId',data.entityId);
    localStorage.setItem('match',match);
    this.router.navigate(['/customer/bank-dashboard',this.cisId,'']);
    localStorage.setItem('matchList',JSON.stringify(data.matchList));
  }

  financialView(data){
    localStorage.setItem('entityId',data.entityId);
    this.router.navigate(['/customer/bank-dashboard',this.cisId,data.cisCompanyId]);
    localStorage.setItem('matchList',JSON.stringify(data.matchList));
  }
  
  getDataBySummary(){
    this.formSubmitAttempt=true;
    // this.spinnerService.show();
        this.httpService.getDataSearch(PATH.SEARCH_CIS + '/data-summary/' + this.cisId).subscribe((res:any)=>{ 
          if(res){ 
          this.searchData = res;  
          if(res.length==0){
            this.isDataAvailable=false;
          }
          this.cisDataBestMatchList=this.searchData.cisDataBestMatchList;
          this.cisDataBestMatchList.forEach((elm)=>{
            elm.isFinancialInfo=false;
          })
       
          this.cisDescription = this.searchData.cisDataBestMatchList;
          this.cisDescription.forEach(element => {
            this.description=element.description;
          });
          
          
          this.cisDataPotentialMatchList=this.searchData.cisDataPotentialMatchList;
          this.cisDataPotentialMatchList.forEach(elm=>{
            elm.isFinancialInfo=false;
          })
          this.spinnerService.hide();
          this.isSeekData=true;
        }
    },
     (err) => {
      this.spinnerService.hide();
      this.isDataAvailable=false;
      this.isSeekData=true;
      // this.toastrService.error(err.error.message?err.error.message:err.message);
    }) 

  }

  
  postData(){
    this.formSubmitAttempt=true;
    if(this.companySearchForm.invalid){
      return;
    }else{
      this.formSubmitAttempt=false;
      this.companySearchForm.reset();
    }
  }
  
  onClear(){
    this.formSubmitAttempt=false
  }

  get f(){
    return this.companySearchForm.controls
  }

}
