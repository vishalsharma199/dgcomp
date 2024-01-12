import { Component, OnInit,Input  } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { PATH } from 'src/app/app.constant';
import { HttpService } from 'src/app/services/http.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { TableSettingComponent } from '../table-setting/table-setting.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  headers: Array<any>
  vendors: Array<any>=[];
  _selectedColumns: any[];
  order: any = 'desc';
  col: any = 'createdDate';
  numberOfElements:any;
 
  constructor(private modalService: NgbModal,
    private httpService: HttpService,
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    ) {   
   
}

  ngOnInit(): void {
    this.getCompanyInfo();
    this.prepareHeader();
    
  }
  prepareHeader(){
    this.headers = [
      { name: 'companyName', header: 'Company Name', sort: true,isAsc:true},
      { name: 'category', header: 'Category', sort: true,isAsc:true},
      { name: 'location', header: 'Location', sort: false,isAsc:false},
      { name: 'reviewState', header: 'Review State', sort: true,isAsc:true},
      { name: 'screeningStatus', header: 'Screening Status', sort: false,isAsc:false},
      { name: 'riskRating', header: 'Risk Rating', sort: true,isAsc:true},
      { name: 'action', header: 'Action', sort: false,isAsc:false},
    ]; 
    this._selectedColumns = this.headers;
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
}
   set selectedColumns(val: any[]) {
        //restore original order
        this._selectedColumns = this.headers.filter(col => val.includes(col));
    }
  getCompanyInfo(){
    // this.spinnerService.show();
    this.vendors=[
      {companyName:'Dgcomp',category:'Admin',location:'India',reviewState:'',screeningStatus:'',action:''}
    ]
    // this.httpService
    //   .getData(`${PATH.COMPANY_INFORMATION}?page=${this.page}&size=${this.pageSize}&sort=${this.col},${this.order}`)
    //   .subscribe(
    //     (res: any) => {
    //       this.spinnerService.hide();
    //       this.vendors=res['content'];
    //       this.collectionSize=res.totalElements;
    //       this.numberOfElements=res.numberOfElements;
    //     },
    //     (error) => {
    //       this.spinnerService.hide();
    //       console.log(error);
    //       this.toastrService.error(error.error?.message);
    //     }
    //   );
  }

  sortBy(type, details) {
    // let order = '';
    // order = details.isAsc ? 'asc' : 'desc';
    // this.httpService
    //   .getData(`${PATH.COMPANY_INFORMATION}?page=${this.page}&size=${this.pageSize}&sort=${type},${order}`)
    //   .subscribe(
    //   (res : any) => {
    //     details.isAsc = !details.isAsc;
    //     this.vendors=res['content'];
    //     this.collectionSize=res.totalElements;
    //     this.numberOfElements=res.numberOfElements;
       
    //   },
    //   (err) => {
    //     ;
    //   }
    // );
  }
  updatePageSize() {
    this.getCompanyInfo();
  }

  refreshPages() {
    this.getCompanyInfo();
  }

  open(itm){
    return
    if(itm=='rating'){
    const modalRef = this.modalService.open(TableSettingComponent);
    modalRef.componentInstance.type = 'rating';
    modalRef.componentInstance.data='';
    
    }
     if(itm=='tableModal'){
    const modalRef = this.modalService.open(TableSettingComponent);
    modalRef.componentInstance.type = 'tableSetting';
    modalRef.componentInstance.data='';
    }
  
  }
 


}
