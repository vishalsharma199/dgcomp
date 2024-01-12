import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'primeng/dynamicdialog';
import { PATH } from 'src/app/app.constant';
import { HttpService } from 'src/app/services/http.service';
import { ConfirmationService,LazyLoadEvent } from 'primeng/api';
import {Router } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-invited-vendor-list',
  templateUrl: './invited-vendor-list.component.html',
  styleUrls: ['./invited-vendor-list.component.scss']
})
export class InvitedVendorListComponent implements OnInit,OnDestroy {

  checked: boolean=true;
  showMe: boolean = false
  page = 0;
  pageSize = 10;
  collectionSize = 0;

  totalByStatus=0;
  totalRecords=0;

  customerHeaders: Array<any>
  customerPortList: Array<any>
  order: any = 'desc';
  numberOfElements: any;
  invitedVendorList:any

  active:number =0;
  inActive:number =0;

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
  sortBy='vendorId';
  sortOrder='desc';
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
    this.getSelectedData();
  

    // this.getUser();
  }

  getSelectedData(){
  
   this.subscription= this.sharedDataService.selectedStatus$.subscribe((value) => {
       if(value && typeof value != "undefined"){
        this.status=value;
      }
      else{
        this.status='ALL';
      }
    });
  }

  ngOnDestroy(): void {
    this.sharedDataService.setCustomerStatus('ALL');
  }

  getAllVendors(){
    this.spinnerService.show();
    let payload:any={}
    payload.isActive=this.status?this.status:'ALL';
    if(this.sortBy=='fullName'){
      this.sortBy='firstName';
    }
    this.httpService.postData(`${PATH.VENDOR}/filter?page=${this.page}&size=${this.pageSize}&sort=${this.sortBy},${this.sortOrder}`, payload).subscribe((res:any)=>{
      this.filterData = res['content'];
      this.invitedVendorList=res['content'];
      this.allVendorList=res['content'];

     
      if(this.status=='ALL'){
        this.totalRecords=res.totalElements;
      }
      this.totalByStatus=res.totalElements;

      // this.invitedVendorList.forEach(elm => {
      //   elm.fullName = elm.firstName+' '+elm.lastName
      //   if(elm.status=='Submitted'){
      //     elm.status = 'Approval Pending'
      //   }
      //   if(elm.status=='Rfi Generated'){
      //     elm.status = 'RFI'
      //   } 	
      //   if(elm.status=='Profile Incomplete'){
      //     elm.status = 'Information Pending'
      //   } 
      // });
      this.spinnerService.hide();
      
    },
    (err) => {
      let errorMsg;
      if(err.code==401){
        errorMsg = "Incorrect Password / Unauthorized";
      }else if(err.code==400){
        errorMsg = "User not active.  Please contact support@digicompplus.com for assistance.";
      }else if(err.code==404){
        errorMsg = "Not found";
    }else{
        errorMsg = "Please try again after sometime. If issue persists, please contact support@digicompplus.com for assistance.";
      }
      // this.toastrService.error(errorMsg);
      
    })
  }

  prepareCustomerHeaders() {
    this.customerHeaders = [
      { name: 'companyName', header: 'Company Name', sort: true, isAsc: true },
      { name: 'fullName', header: 'Customer Name', sort: true, isAsc: false },
      { name: 'emailId', header: 'Email ID', sort: true, isAsc: false },
      { name: 'phoneNumber', header: 'Phone Number', sort: true, isAsc: false },
      { name: 'vendorType', header: 'Type', sort: true, isAsc: false },
      // { name: 'status', header: 'Status', sort: true, isAsc: false },
      { name: 'view', header: 'View', sort: false, isAsc: false  },
      { name: 'enable', header: 'Enable / Disable', sort: false, isAsc: false  },
    ];
  }

  getRegistrationStatus(){
    this.httpService.getData(PATH.VENDOR + '/summary').subscribe((res:any)=>{

      this.regStatusData = res;
      res.forEach(element => {   
        // if (element.category == 'Active') {
        //   this.invited = element.count
        // }
        // if (element.category == 'Submitted') {
        //   this.approvalPending = element.count
        // }
        // if (element.category == 'Not Started') {
        //   this.notStarted = element.count
        // }
        // if (element.category == 'Approved') {
        //   this.approved = element.count
        // }
        // if (element.category == 'Rejected') {
        //   this.rejected = element.count
        // }
        // if (element.category == 'Rfi Generated') {
        //   this.rfi = element.count
        // }
        // if (element.category == 'Link Opened') {
        //   this.linkedOpen = element.count
        // }
        // if (element.category == 'Profile Incomplete') {
        //   this.profileInComplete = element.count
        // }
        // if (element.category == 'Invitation Expired') {
        //   this.invitationExpired = element.count
        // }
        // if (element.category == 'Registered') {
        //   this.registered = element.count
        // }
        if (element.status) {
          this.active = element.count
        }
        if(!element.status){
          this.inActive=element.count
        }
        
       
      });

    })
  }

  toogleTag() {
    this.showMe = !this.showMe
  }


  changeStatus(user) {
 
    
    this.confirmationService.confirm({
      message:"Are you sure that you want to change status ?",
      accept:()=>{
        let vendorId= user.vendorId;
    let usersId = user.companyId;
    this.status = user.isActive;
    let url =  PATH.VENDOR + '/update-isActive'+"?status="+ this.status + "&vendorId="+vendorId;
    this.spinnerService.show();
    this.httpService.statusData(url).subscribe((res) => {
        this.spinnerService.hide();
        this.toastrService.success('Status Changed Successfully');
        this.getRegistrationStatus();
        this.getAllVendors();
      }, (err) => {
        this.spinnerService.hide();
        this.toastrService.error('Status Changed Failed');
        
      })
    },reject:()=>{      
      
    }
  })
  
  }

  filter(type){
    this.page=0;
    this.status=type;
    this.getAllVendors();
     
  }

  vendorOpen(id){
    this.router.navigate(['/customer/view-vendor/',1,this.status]);
    localStorage.setItem('customerCompanyId',id);
  }

  refreshPage(event:LazyLoadEvent){
    console.log(event.rows)
    console.log(event.first)
      this.page=  event.first/event.rows + 1;
    this.pageSize=event.rows;
    this.getAllVendors();
    
  }

  handleSort(ev){
    this.sortBy = ev.field;
    this.sortOrder = ev.order==-1?'asc':'desc';
    this.getAllVendors();
    }

}
