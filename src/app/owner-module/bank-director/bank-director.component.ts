import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-bank-director',
  templateUrl: './bank-director.component.html',
  styleUrls: ['./bank-director.component.scss']
})
export class BankDirectorComponent implements OnInit {

  responsiveOptions;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  order: any = 'desc';
  col: any = 'createdDate';
  locationheaders: Array<any>;
  shareholderheader: Array<any>;
  numberOfElements:any;
  locationData:any;
  shareholderdata:any;
  isFinInfo:boolean=false;
  @Input() financialData:any;
  constructor(public dialogService:DialogService,
    private ar: ActivatedRoute) { 
  }

  ngOnInit(): void {
    this.prepareHeader();
    this.prepareShareHolder();
 
  }
 

    prepareHeader(){
      this.locationheaders = [
        { name: 'name', header: 'Name', sort: false,isAsc:false},
        { name: 'position', header: 'Position', sort: false,isAsc:false},
      ];
      this.locationData=this.financialData?this.financialData.directors:[];
    }


    prepareShareHolder(){
      this.shareholderheader = [
        { name: 'companyName', header: 'Name', sort: false,isAsc:false},
        { name: 'percentage', header: 'Percentage', sort: false,isAsc:false},
        { name: 'country', header: 'Nationality', sort: false,isAsc:false},
      ];
      this.shareholderdata=this.financialData?this.financialData.shareHolders:[];
    }


}
