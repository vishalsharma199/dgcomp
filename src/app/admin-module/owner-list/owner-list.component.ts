import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PATH } from 'src/app/app.constant';
import { HttpService } from 'src/app/services/http.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-invite-customer',
  templateUrl: './owner-list.component.html',
  styleUrls: ['./owner-list.component.scss']
})
export class OwnerListComponent implements OnInit {

  showMe: boolean = false
  page = 0;
  pageSize = 10;
  collectionSize = 0;
  totalRecords=0;
  allCustomerList:Array<any>=[];

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
  active:number =0;
  inActive:number =0;
  totalByStatus=0;
  sortBy='ownerId';
  sortOrder='desc';
  @ViewChild('tt') tt: Table;
  constructor(public dialogService: DialogService,
    private httpService: HttpService,
    private toastrService: ToastrService,
    private confirmationService: ConfirmationService,
    private spinnerService: NgxSpinnerService,
    private sharedDataService:SharedDataService) { }

  ngOnInit(): void {
    this.prepareCustomerHeaders();
    this.getSelectedData();
    this.getOwnerList();
    this.getRegistrationStatus();
  }


  getOwnerList() {
    this.spinnerService.show();
    let payload:any={};
    payload.isActive=this.status?this.status:'ALL';
    if(this.sortBy=='fullName'){
      this.sortBy='firstName'
    }
    this.httpService.postData(`${PATH.OWNER}/filter?page=${this.page}&size=${this.pageSize}&sort=${this.sortBy},${this.sortOrder}`,payload).subscribe((res:any) => {
      this.invitedCustomerList = res['content'];
      this.allCustomerList=res['content'];
      if(this.status=='ALL'){
        this.totalRecords=res.totalElements;
      }
      this.totalByStatus=res.totalElements;
      this.invitedCustomerList.forEach(elm => {
        elm.fullName = elm.firstName + ' ' + elm.lastName
      });
      this.spinnerService.hide();
    },
      (error) => {
        this.spinnerService.hide();

      })
  }

  getSelectedData(){
    this.sharedDataService.selectedOwnerStatus$.subscribe((value) => {
      if(value && typeof value != "undefined"){
        this.status=value;
      }
      else{
        this.status='ALL';
      }
    });
  }

  prepareCustomerHeaders() {
    this.customerHeaders = [
      { name: 'companyName', header: 'Company Name', sort: true, isAsc: true,width:'150px' },
      { name: 'fullName', header: 'Customer Name', sort: true, isAsc: false,width:'170px' },
      { name: 'emailId', header: 'Email ID', sort: true, isAsc: false,width:'100px' },
      { name: 'country', header: 'Country', sort: true, isAsc: false,width:'100px' },
      { name: 'phoneNumber', header: 'Phone Number', sort: true, isAsc: false,width:'150px' },
      { name: 'enable', header: 'Enable / Disable',sort: false, isAsc: false,width:'140px' }
    ];
  }

  getRegistrationStatus() {
    this.httpService.getData(PATH.OWNER+'/summary').subscribe((res: any) => {
      this.regStatusData = res;
      
      res.forEach(element => {
     
         if (element.status) {
          this.active = element.count
        }
        if(!element.status){
          this.inActive=element.count
        }
        // if (element.category == 'Approved') {
        //   this.approved = element.count
        // }

        // if (element.category == 'Approval Pending') {
        //   this.pending = element.count
        // }
        // if (element.category == 'Invited') {
        //   this.invited = element.count
        // }  

        // if (element.category == 'Link Opened') {
        //   this.linkOpened = element.count
        // } 
        // if (element.category == 'User Created') {
        //   this.userCreated = element.count;
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
      this.spinnerService.hide();

    })
  }


  // show and hide toggle button

  toogleTag() {
    this.showMe = !this.showMe
  }


  changeStatus(user) {
    this.confirmationService.confirm({
      message: "Are you sure that you want to change status?",
      accept: () => {
        let ownerId = user.ownerId;
        let status = user.isActive;
        let url = PATH.OWNER+'/?'+'ownerId='+ ownerId + "&status=" + status;
        this.spinnerService.show();
        this.httpService.statusData(url).subscribe((res) => {
          this.spinnerService.hide();
          this.toastrService.success('Status Changed Successfully');
          this.getOwnerList();
          this.getRegistrationStatus();
        }, (err) => {
          this.spinnerService.hide();
          this.toastrService.error(err.error.message);
        })
      }, reject: () => {

      }
    })

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


}
