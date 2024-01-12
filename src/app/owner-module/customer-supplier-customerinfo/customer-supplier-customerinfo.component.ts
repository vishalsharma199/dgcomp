import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
@Component({
  selector: 'app-customer-supplier-customerinfo',
  templateUrl: './customer-supplier-customerinfo.component.html',
  styleUrls: ['./customer-supplier-customerinfo.component.scss']
})
export class CustomerSupplierCustomerinfoComponent implements OnInit {

 
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  headers:any;
  companyContracts: Array<any>=[
    {
      supplierName: 'Sealinks',uniqueCode:'DG56R778J737',address:'SFO-2, 3rd floor, sec-2 mumbai, India',contactNumber:'(+91)8342123231'
    },
    {
      supplierName: 'Sealinks',uniqueCode:'DG56R778J737',address:'SFO-2',contactNumber:'(+91)8342123231'
    },
    {
      supplierName: 'Sealinks',uniqueCode:'DG56R778J737',address:'SFO-2',contactNumber:'(+91)8342123231'
    },
    {
      supplierName: 'Sealinks',uniqueCode:'DG56R778J737',address:'SFO-2',contactNumber:'(+91)8342123231'
    },
  ];
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.prepareHeaders();
    if(this.companyContracts.length==0){
      this.router.navigate(['/customer/Add-supplier-info']);
    }
  }

  prepareHeaders(){
    this.headers = [
      { name: 'supplierName', header: 'Supplier Name', sort:false,isAsc:true},
      { name: 'uniqueCode', header: 'Unique Code', sort: false,isAsc:false},
      { name: 'address', header: 'Address', sort: false,isAsc:false},
      { name: 'phoneNumber', header: 'Phone Number', sort: false,isAsc:false},
      { name: 'action', header: 'Action', sort: false,isAsc:false}
    ];
  }

}
