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
  selector: 'app-new-company-search',
  templateUrl: './company-search.component.html',
  styleUrls: ['./company-search.component.scss']
})
export class NewCompanySearchComponent implements OnInit {
  formSubmitAttempt:boolean=false;
  isCompany:boolean=true;
  isPortion:boolean=false
  isIndividual:boolean=false
  headers: Array<any>
  bestMatch: Array<any>;
  public countries = Country.getAllCountries();
  checked: boolean = false;
  maxDate = new Date();
  individual:boolean = false;
  companyDisplay:boolean = true ;
  CompanyData:any;
  cities:any=[];
  status:any;
  totalSearch=150;
  totalUsed;
  totalAvailable;
  companySearchForm:any;
  amlTypesError:boolean = false;
  ddata:any='COMPANY';
  totalCompliance:number=150;
  totalFinancial:number=120;
  usedCompliance:number=0;
  usedFinancial:number=0;
  availableCompliance:number=0;
  availableFinancial:number=0;
  page = 0;
  pageSize = 10;
  collectionSize = 0;
  totalRecords=0;
  sortBy='createdAt';
  sortOrder='desc';
  constructor(private fb: UntypedFormBuilder,
    private httpService :HttpService,
    private spinnerService: NgxSpinnerService,
    private toastrService :ToastrService,
    private router : Router,
    public validators:ValidatorsServiceService
    ) {}

  ngOnInit(): void {
    this.prepareCompanySearchForm();
    this.prepareHeaders();
    this.getData();
    this.getCisSummary();
  }

  
  prepareCompanySearchForm(){
    this.companySearchForm= this.fb.group({
      //  amlType: this.fb.group({
      //   compliance: [true],
      //   financial:[''],
       
      // }),
      // amlType:[[],Validators.required],
      country: [''],
      dob: ['',],
      fuzziness: ['0.5',[Validators.required]],
      gender: ['MALE'],
      name: ['',[Validators.required,noExtraWhiteSpace]],
      searchType: ['COMPANY',[Validators.required]],
      searchFor:['COMPLIANCE']
    })

  }



  prepareHeaders(){
    this.headers = [
      { name: 'createdAt', header: 'Search Date', sort: true,isAsc:true},
      { name: 'name', header: 'Name', sort: true,isAsc:false},
      { name: 'searchType', header: 'Entity Type', sort: true,isAsc:false},
      { name: 'fuzziness', header: 'Matching Threshold', sort: true,isAsc:false},
      { name: 'searchFor', header: 'Search For', sort: true,isAsc:false},
      { name: 'status', header: 'Status', sort: true,isAsc:false},
    ]; 
  }


  getData(){
    this.spinnerService.show();
       let payload = this.companySearchForm.value;
        this.httpService.getDataSearch(`${PATH.SEARCH_CIS}?page=${this.page}&size=${this.pageSize}&sort=${this.sortBy},${this.sortOrder}`).subscribe((res:any)=>{    
          this.CompanyData = res['content'];  
          this.CompanyData.forEach(elm=>{
            elm.searchDate=new Date(moment(elm.searchDate).format('yyyy-MM-DD'));
          })
          this.totalRecords=res.totalElements;
          this.totalUsed = res.length;
          this.spinnerService.hide(); 
    },
     (err) => {
      this.spinnerService.hide();
      // this.toastrService.error(err.message.message);
    }) 

  }

  getCisSummary(){
  
    let payload = this.companySearchForm.value;
     this.httpService.getDataSearch(PATH.SEARCH_CIS+'/cis-summary').subscribe((res:any)=>{    
       for(var i=0;i<res.length;i++){
        if(res[i]['searchFor']=='COMPLIANCE'){
          this.usedCompliance=res[i]['count'];
        }
        if(res[i]['searchFor']=='FINANCIAL'){
          this.usedFinancial=res[i]['count'];
        }
       }
       this.spinnerService.hide();
    },
    (err) => {
    // this.toastrService.error(err.message.message);
    
  }) 
  }

  onCheckboxChange(e) {
    if(e !=''){
      this.amlTypesError = false;
    }
    else{
      this.amlTypesError = true;  
    }
    const checkArray: UntypedFormArray = this.companySearchForm.get('amlTypes') as UntypedFormArray;
    if (e.target.checked) {
      checkArray.push(new UntypedFormControl(e.target.value));
    } 
    else {
      let i: number = 0;
      checkArray.controls.forEach((item: UntypedFormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }


  get f(){
    return this.companySearchForm.controls;
  }

  postData(){
    
    if(this.companySearchForm.invalid){
      this.formSubmitAttempt=true;
      return;
    }    
    this.formSubmitAttempt=false;
    this.spinnerService.show();
    // let fuzzinessData = this.companySearchForm.controls['fuzziness'].value;
    // let checkvalues=this.companySearchForm.get('amlType').value;
    // let ans = fuzzinessData / 100;
    // this.companySearchForm.patchValue({ fuzziness:ans });
    let payload = this.companySearchForm.value;
    if(payload.dob){
      payload.dob=moment(payload.dob).format('yyyy-MM-DD');
    }
    if(payload.searchType=='INDIVIDUAL'){
       payload.searchFor='COMPLIANCE';
    }

    this.httpService.postData(PATH.SEARCH_CIS,payload).subscribe((res:any)=>{
    this.toastrService.success('Search Created Successfully!');
    this.formSubmitAttempt=false;
    this.companySearchForm.reset(); 
    this.companyDisplay=true;
    this.spinnerService.hide();
    this.status = res.id;
    // this.getDataById(this.status);
    this.getData();
    this.getCisSummary();
    this.prepareCompanySearchForm();
    },
     (err) => {
      this.spinnerService.hide();
      this.toastrService.error(err.message.errors[0]['field']+' '+err.message.errors[0]['message']);
    }) 
  }

  onClear(){
    // this.formSubmitAttempt=false
    // this.isIndividual=false
    // this.companySearchForm.reset();
    // this.ngOnInit();
    // this.companyDisplay=true;
    // this.individual=false;
    debugger
    this.formSubmitAttempt=false
    this.isIndividual=false
    this.companySearchForm.controls['country'].reset()
    this.companySearchForm.controls['dob'].reset()
    this.companySearchForm.controls['name'].reset()

    this.companySearchForm.patchValue({
      searchType: this.ddata,
      fuzziness: '0.5',
      gender:'MALE',
      searchFor:'COMPLIANCE'
    });
  }

  company(data) {
    if(data == 'company'){
   this.companyDisplay = true;
   this.ddata = 'COMPANY';
   this.individual = false;
   this.companySearchForm.reset();
  this.companySearchForm.controls.name.setValidators([Validators.required,noExtraWhiteSpace]);
   this.setCompanySearchForm(data);
   }

   if(data == 'Individual'){
     this.companyDisplay = false;
     this.ddata = 'INDIVIDUAL';
     this.individual = true;
     this.companySearchForm.reset();
     this.companySearchForm.controls.name.setValidators([Validators.required,noSpecialCharAllow,Validators.minLength(2),Validators.maxLength(20),onlyCharacters,noExtraWhiteSpace]);
     this.setCompanySearchForm(data);
    
   }

}
  view(id){
    this.router.navigate(['/customer/search-result',id]);
  }

  getDataById(id){
  this.httpService.getDataSearch(PATH.GET_SEARCH_CIS + '/' + id).subscribe((res:any)=>{
   this.checkStatus(res.status);
   this.spinnerService.hide();
    },
     (err) => {
      this.toastrService.error(err.message.message);
    }) 
  }

  checkStatus(status){
 if(status =='COMPLETED'){
   this.getData();
   }
   if(status == 'CREATED'){
     this.getDataById(this.status);
   }
  }

  setCompanySearchForm(type){
    this.companySearchForm.patchValue({
      fuzziness: '0.5',
      gender: 'MALE',
      searchType: type=='company'?'COMPANY':'INDIVIDUAL',
      searchFor:'COMPLIANCE'
    })
}

refreshPage(event:LazyLoadEvent){
  console.log(event.rows)
  console.log(event.first)
    this.page=  event.first/event.rows + 1;
  this.pageSize=event.rows;
  this.getData();
}

handleSort(ev){
  this.sortBy = ev.field;
  this.sortOrder = ev.order==-1?'asc':'desc';
  this.getData();
  }

}
