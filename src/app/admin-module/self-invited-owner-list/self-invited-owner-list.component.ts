import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PATH } from 'src/app/app.constant';
import { HttpService } from 'src/app/services/http.service';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-self-invited-owner-list',
  templateUrl: './self-invited-owner-list.component.html',
  styleUrls: ['./self-invited-owner-list.component.scss']
})
export class SelfInvitedOwnerListComponent implements OnInit {

  showMe: boolean = false
  page = 0;
  pageSize = 10;
  collectionSize = 0;
  totalRecords=0;
  filterType: any = 'ALL';
  customerHeaders: Array<any>
  customerPortList: Array<any>
  order: any = 'desc';
  col: any = 'createdDate';
  numberOfElements: any;
  invitedCustomerList: any
  regStatusData: any;
  status: any;
  invited: number = 0;
  pending: number = 0;
  register: number = 0;
  approved: number = 0;
  linkOpened: number = 0;
  userCreated: number =0;
  registered: number =0;
  pendingUserCreation:number =0;
  invitationExpired:number =0;
  first=0;
  rejected:number =0;
  totalByStatus=0;
  sortBy='companyName';
  sortOrder='desc';
  constructor(public dialogService: DialogService,
    private httpService: HttpService,
    private toastrService: ToastrService,
    private confirmationService: ConfirmationService,
    private spinnerService: NgxSpinnerService,
    private sharedDataService:SharedDataService) { }

  ngOnInit(): void {
    this.prepareCustomerHeaders();
    this.getRegistrationStatus();
    this.getSelectedData();
    this.getOwnerList();
  }


  getOwnerList() {
    this.spinnerService.show();
    let payload:any={};
    payload.status=this.status?this.status:'ALL';
    if(this.sortBy=='fullName'){
      this.sortBy='firstName';
    }
    this.httpService.postData(`${PATH.OWNER_SELF_REGISTRATION}?page=${this.page}&size=${this.pageSize}&sort=${this.sortBy},${this.sortOrder}`,payload).subscribe((res) => {
      if(res){
        if(this.status=='ALL'){
          this.totalRecords=res.totalElements;
        }
        this.invitedCustomerList = res['content']
        this.totalByStatus=res.totalElements;
        this.invitedCustomerList.forEach(elm => {
          elm.fullName = elm.firstName + ' ' + elm.lastName
        });
        this.spinnerService.hide();
      }
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

  getSelectedData(){
    this.sharedDataService.selectedOwnerStatus$.subscribe((value) => {
      if(value && typeof value != "undefined"){
        this.status=value;
      }
      else{
        this.status='ALL'
      }
   
    });
  }

  prepareCustomerHeaders() {
    this.customerHeaders = [
      { name: 'companyName', header: 'Company Name', sort: true, isAsc: true },
      { name: 'fullName', header: 'Customer Name', sort: true, isAsc: false },
      { name: 'emailId', header: 'Email ID', sort: true, isAsc: false },
      { name: 'country', header: 'Country', sort: true, isAsc: false },
      { name: 'phoneNumber', header: 'Phone Number', sort: true, isAsc: false },
      { name: 'status', header: 'Status', sort: true, isAsc: false },
      { name: 'view', header: 'View', sort: false, isAsc: false },
      // { name: 'enable', header: 'Enable / Disable',sort: false, isAsc: false }
    ];
  }

  getRegistrationStatus() {
    this.httpService.getData(PATH.OWNER_SELF_REGISTRATION+'/counts').subscribe((res: any) => {
      this.regStatusData = res;
      
      res.forEach(element => {
        if (element.status == 'APPROVED') {
          this.approved = element.count
        }
        if (element.status == 'CREATED') {
          this.userCreated = element.count;
        }
        if (element.status == 'REJECTED') {
          this.rejected = element.count;
        }
        // if (element.category == 'Approval Pending') {
        //   this.pending = element.count
        // }
        // if (element.category == 'Invited') {
        //   this.invited = element.count
        // }  

        // if (element.category == 'Link Opened') {
        //   this.linkOpened = element.count
        // } 
        // if (element.category == 'Pending User Creation') {
        //   this.pendingUserCreation = element.count;
        // }
        // if (element.category == 'Registered') {
        //   this.registered = element.count;
        // } 
        // if (element.category == 'Invitation Expired') {
        //   this.invitationExpired = element.count;
        // } 
      });

    },(err)=>{
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
      this.toastrService.error(errorMsg);
    })
  }


  // show and hide toggle button

  toogleTag() {
    this.showMe = !this.showMe
  }



  filter(type){
    this.page=1;
    this.status=type;
    this.getOwnerList();
  }

refreshPage(event:LazyLoadEvent){
  console.log(event.rows)
  console.log(event.first)
  this.page=  event.first/event.rows + 1;
  this.pageSize=event.rows;
  this.getOwnerList();
}

handleSort(ev){
  this.sortBy = ev.field;
  this.sortOrder = ev.order==-1?'asc':'desc';
  this.getOwnerList();
  }

ngOnDestroy(): void {
  this.sharedDataService.setOwnerStatus('ALL');
}

}

