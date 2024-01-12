import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'primeng/dynamicdialog';
import { PATH } from 'src/app/app.constant';
import { HttpService } from 'src/app/services/http.service';
import { ConfirmationService } from 'primeng/api';
import {Router } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-vendor-list-by-owner',
  templateUrl: './vendor-list-by-owner.component.html',
  styleUrls: ['./vendor-list-by-owner.component.scss']
})
export class VendorListByOwnerComponent implements OnInit {

  checked: boolean=true;
  showMe: boolean = false
  page = 1;
  pageSize = 10;
  collectionSize = 0;

  customerHeaders: Array<any>
  customerPortList: Array<any>
  order: any = 'desc';
  col: any = 'createdDate';
  numberOfElements: any;
  invitedVendorList:any
  allVendorList: Array<any>=[];
  regStatusData:any;
  status: any;
  users: any = [];
  user:any;
  invited: number = 0;
  notStarted: number = 0;
  linkedOpen: number = 0;
  registered: number=0;
  profileInComplete: number=0
  approvalPending: number = 0;
  rfi: number = 0;
  approved: number = 0;
  rejected: number = 0;
  invitationExpired: number = 0;
  filterType: any = 'all';
  filterData:any;
  first=0;
  subscription:any; 
  constructor(public dialogService: DialogService,
    private httpService: HttpService,
    private toastrService: ToastrService,
    private spinnerService: NgxSpinnerService,
    private confirmationService:ConfirmationService,
    private router: Router,
    private sharedDataService:SharedDataService
    ) { }


  ngOnInit(): void {
    this.prepareCustomerHeaders();
    this.getAllVendors();
    this.getRegistrationStatus();
  

    // this.getUser();
  }



  getAllVendors(){
    this.spinnerService.show();
    this.httpService.getData(PATH.GET_ALL_VENDOR).subscribe((res:any)=>{
      this.filterData = res;
      this.invitedVendorList=res;
      this.allVendorList=res;
     
      this.invitedVendorList.forEach(elm => {
        elm.fullName = elm.firstName+' '+elm.lastName
        if(elm.status=='Submitted'){
          elm.status = 'Approval Pending'
        }
        if(elm.status=='Rfi Generated'){
          elm.status = 'RFI'
        } 	
        if(elm.status=='Profile Incomplete'){
          elm.status = 'Information Pending'
        } 
      });
      this.spinnerService.hide();
    },
    (error) => {
      this.spinnerService.hide();
      
    })
  }

  prepareCustomerHeaders() {
    this.customerHeaders = [
      { name: 'name', header: 'Company Name', sort: true, isAsc: true },
      { name: 'fullName', header: 'Customer Name', sort: true, isAsc: false },
      { name: 'emailId', header: 'Email ID', sort: true, isAsc: false },
      { name: 'phoneNumber', header: 'Phone Number', sort: true, isAsc: false },
      // { name: 'vendorType', header: 'Type', sort: true, isAsc: false },
      { name: 'status', header: 'Status', sort: true, isAsc: false },
      { name: 'view', header: 'View', sort: false, isAsc: false  },
      // { name: 'enable', header: 'Enable / Disable', sort: false, isAsc: false  },
    ];
  }

  getRegistrationStatus(){
    this.httpService.getData(PATH.REGISTRATION_STATUS_VENDOR).subscribe((res:any)=>{

      this.regStatusData = res;
      res.forEach(element => {   
        if (element.category == 'Invited') {
          this.invited = element.count
        }
        if (element.category == 'Submitted') {
          this.approvalPending = element.count
        }
        if (element.category == 'Not Started') {
          this.notStarted = element.count
        }
        if (element.category == 'Approved') {
          this.approved = element.count
        }
        if (element.category == 'Rejected') {
          this.rejected = element.count
        }
        if (element.category == 'Rfi Generated') {
          this.rfi = element.count
        }
        if (element.category == 'Link Opened') {
          this.linkedOpen = element.count
        }
        if (element.category == 'Profile Incomplete') {
          this.profileInComplete = element.count
        }
        if (element.category == 'Invitation Expired') {
          this.invitationExpired = element.count
        }
        if (element.category == 'Registered') {
          this.registered = element.count
        }
        
       
      });

    })
  }

  toogleTag() {
    this.showMe = !this.showMe
  }


  changeStatus(user) {
    this.confirmationService.confirm({
      message:"Are you sure that you want to change status?",
      accept:()=>{
    let usersId = user.companyId;
    this.status = user.isActive;
    let url =  PATH.VENDOR_ACTIVE_INACTIVE+usersId+"?status="+ this.status;
    this.spinnerService.show();
    this.httpService.statusData(url).subscribe((res) => {
        this.spinnerService.hide();
        this.toastrService.success('Status Changed Successfully');
        
      }, (err) => {
        this.spinnerService.hide();
        this.toastrService.error('Status Changed Failed');
        
      })
    },reject:()=>{      
      
    }
  })
  
  }
  // view(id){
  //   // localStorage.setItem('customerCompanyId',id);
  //   // this.router.navigate(['/customer/view-vendor']);
    
  // }

  

  vendorOpen(id){
    // this.router.navigate(['/customer/view-vendor/1']);
    // localStorage.setItem('customerCompanyId',id);
    this.router.navigate(['/customer/dashboard']);
  }

}
