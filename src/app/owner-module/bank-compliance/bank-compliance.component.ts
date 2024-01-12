import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'primeng/dynamicdialog';
import { PATH } from 'src/app/app.constant';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-bank-compliance',
  templateUrl: './bank-compliance.component.html',
  styleUrls: ['./bank-compliance.component.scss']
})
export class BankComplianceComponent implements OnInit {
  @Input() matchCount;
  headers: Array<any>
  bestMatch: Array<any>;
  cisId: any;
  entityId: any;
  title:any;
  tableHide:boolean=true;
  tableShow:boolean=false;
  dashboardData:any;
  adverseMedia: Array<any>=[];
  sanctioned:Array<any>=[];
  adverseMediaFinancialCrime:Array<any>=[];
  adverseMediaViolentCrime:Array<any>=[];
  adverseMediaFraud:Array<any>=[];
  adverseMediaNarcotics:Array<any>=[];
  matchType:any;
  matchedData:any;
  constructor(  private ar: ActivatedRoute,
    public dialogService: DialogService,
    private httpService: HttpService,
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.ar.params.subscribe((params) => {
      this.cisId = params.id;
      if(!params.cisCompanyId){
        if(localStorage.getItem('matchList')){
          this.matchCount = JSON.parse(localStorage.getItem('matchList'));
         } 
         if(localStorage.getItem('match')){
          this.matchType = localStorage.getItem('match');
         } 
         this.filterData();
         this.prepareHeaders();
         this.entityId = localStorage.getItem('entityId');
         this.getResult();
         this.getCisDataSummary();
      }
    })
  
   
  }
  prepareHeaders(){
    this.headers = [
      { name: 'keyinfo', header: 'Key Information', sort: true,isAsc:true},
      { name: '', header: ''},
    ]; 
    this.bestMatch=[
        {name:'Company AM', data:'New Zealand Ministry of Foreign Affairs and Trade Russia Sanctions Act',para:'(Added to list On: Wednesday 20th April 2022)',
        data1:'DFAT Australia Consolidated Sactions List',data2:'OFAC Consolidated List',data3:'Norway Sanctions and Restrictive Measures',
        data4:'South Korea Financial Sanctions against Russia'
      },
    ]
  }

  filterData(){
    this.adverseMedia = this.matchCount.filter((o) => {
      return o == 'adverse-media';
    });
     this.sanctioned = this.matchCount.filter((o) => {
      return o == 'sanction';
    });

    this.adverseMediaFinancialCrime=this.matchCount.filter((o) => {
      return o == 'adverse-media-financial-crime';
    });

    this.adverseMediaViolentCrime=this.matchCount.filter((o) => {
      return o == 'adverse-media-violent-crime';
    });
    this.adverseMediaFraud=this.matchCount.filter((o) => {
      return o == 'adverse-media-fraud';
    });
    this.adverseMediaNarcotics=this.matchCount.filter((o) => {
      return o == 'adverse-media-narcotics';
    });
  }

 
  getResult() {
    this.spinnerService.show();
    this.httpService.getDataSearch(PATH.SEARCH_CIS + '/search-data?cisId=' + this.cisId + "&entityId=" + this.entityId).subscribe((res: any) => {
      this.dashboardData = res['searchDataList'];
      this.spinnerService.hide();
    },
      (err) => {
        this.spinnerService.hide();
        this.toastrService.error(err.error.message);
        console.log(err);
        

      })
  }


  getCisDataSummary() {
    // this.spinnerService.show();
    this.httpService.getDataSearch(PATH.SEARCH_CIS + '/data-summary/' + this.cisId).subscribe((res: any) => {
      if(this.matchType=='cisDataBestMatchList'){
        this.matchedData=res['cisDataBestMatchList']
      }
      if(this.matchType=='cisDataPotentialMatchList'){
        this.matchedData=res['cisDataPotentialMatchList'];
      }
      this.spinnerService.hide();
    },
      (err) => {
        this.spinnerService.hide();
        // this.toastrService.error(err.message.message);
      })
  }

  onDisplayHide(){
  if( this.tableHide==true){
    this.tableHide=false;
    console.log(this.tableHide=false);
  }else if(this.tableHide==false){
    this.tableHide=true;
    console.log(this.tableHide=true);
  }
 
   
  }

}
