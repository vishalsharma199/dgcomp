import { ActivatedRoute, Router } from '@angular/router';
import { Component, EventEmitter, OnInit, Output,OnDestroy } from '@angular/core';
import { PATH } from 'src/app/app.constant';
import { HttpService } from './../../services/http.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {DialogService} from 'primeng/dynamicdialog';
import { CustomerRfiComponent } from '../customer-rfi/customer-rfi.component';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from 'src/app/services/shared-data.service';
@Component({
  selector: 'app-customer-companyinformation',
  templateUrl: './customer-companyinformation.component.html',
  styleUrls: ['./customer-companyinformation.component.scss']
})
export class CustomerCompanyinformationComponent implements OnInit,OnDestroy {
  
  formSubmitAttempt: boolean = false;
  uploaded: boolean;
  companyInfo:any;
  errorMsg;
  isbranch;
  imgUrl;
  infoForm;
  companyId:any;
  isFormChanged:boolean=false;
  isSubmitted:boolean=false;
  filterType:any;
  
  @Output('getCompanyInfo') callParent: EventEmitter<any> = new EventEmitter();
  

  constructor(
    private httpService:HttpService, 
    private spinnerService: NgxSpinnerService,
    private router : Router,
    public dialogService: DialogService,
    private toastrService: ToastrService,
    private sharedDataService:SharedDataService,
    private activateRoute : ActivatedRoute,) {}


  ngOnInit(): void {
    this.companyId=localStorage.getItem('customerCompanyId');
    this.getVendorCompanyInfo();
    this.activateRoute.params.subscribe((res) => {
      this.filterType=res.filtertype
    });
  }


  ngOnDestroy(): void {
    if(this.filterType){
      // if(this.companyInfo.status=='Submitted'){
      //   this.companyInfo.status='Approval Pending';
      // }
      // if(this.companyInfo.status=='Rfi Generated'){
      //   this.companyInfo.status='RFI';
      // }
      this.sharedDataService.setCustomerStatus(this.filterType);
    }
  }

  getCompanyInfo() {
    this.spinnerService.show();
    this.httpService.getData(PATH.COMPANY_INFORMATION).subscribe((res: any) => {
      this.spinnerService.hide();
          if (!res) {
            return;
          }
          if(res){
          this.isFormChanged = false;
          this.companyInfo = res;
          }
        },
        (err)=>{
          this.spinnerService.hide();
        })
  }



  getFile(data){
    this.httpService.getImage(PATH.GET_UPLOADED_FILE+data).subscribe((res)=>{
      this.imgUrl = res;
    })
  }

  getVendorCompanyInfo(){
    this.httpService.getData(PATH.GET_CUSTOMER_COMPANY_INFORMATION + '/' + this.companyId).subscribe((res:any)=>{
      this.companyInfo=res;
      if(res.status=='Submitted'){
        this.isSubmitted=true;
      }
      let data = res.companyLogo;
      this.getFile(data)
    },(err)=>{
      this.toastrService.error(err.error.message);
    })
  }
  
  rfiModal(){
    const ref = this.dialogService.open(CustomerRfiComponent, {
      header: 'Request For Company Information',
      width: '50%',
      data:{type:'companyInfo',companyInformationId:this.companyInfo.id,organizationId:this.companyInfo.organizationId}
  });
  }


  postData() {
    this.formSubmitAttempt = true
    if (this.infoForm.invalid) {
      return;
    } else {
      this.formSubmitAttempt = false;
      this.infoForm.reset();
    }
  }

  
  next(){
    this.router.navigate(['customer/view-vendor/2']);
    this.callParent.emit({
        step: 2,
        url: '/customer/view-vendor/2',
      });
  }

  back(){
    this.router.navigate(['/customer/invite-customer']);
    if(this.companyInfo?.status){
      if(this.companyInfo.status=='Submitted'){
        this.companyInfo.status='Approval Pending';
      }
      if(this.companyInfo.status=='Rfi Generated'){
        this.companyInfo.status='RFI';
      }
      this.sharedDataService.setCustomerStatus(this.companyInfo.status);
    }
    
    
  }
}
