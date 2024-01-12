import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DialogService } from 'primeng/dynamicdialog';
import { PATH } from 'src/app/app.constant';
import { HttpService } from 'src/app/services/http.service';
import { SeekInformationComponent } from '../seek-information/seek-information.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddToDashboardComponent } from '../add-to-dashboard/add-to-dashboard.component';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-bank-dashboard',
  templateUrl: './bank-dashboard.component.html',
  styleUrls: ['./bank-dashboard.component.scss']
})
export class BankDashboardComponent implements OnInit {

  cisId: any;
  entityId: any;
  title:any;
  dashboardData:any;
  companyName:any;
  isFinancial:boolean=false;
  interval:any;
  financialData:any;
  index: number = 0;
  isFinancialRes:boolean=false;
  cisCompanyId:any;
  isCompliance:boolean=false;
  isRes:boolean=false;
  isSeekData:boolean=false;
  isFinancialData:boolean=false;
  count:number=0;
  constructor(
    private ar: ActivatedRoute,
    public dialogService: DialogService,
    private httpService: HttpService,
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    if(localStorage.getItem('entityId')){
      this.entityId = localStorage.getItem('entityId');
     } 
    
    this.ar.params.subscribe((params) => {
      this.cisId = params.id;
      if(params.cisCompanyId){
        this.cisCompanyId=params.cisCompanyId;
      }
      
      // this.companyName=params.companyName;
      // if(params.finInfo=="true"){
      //   this.isFinancialInfo=true;
      // }
      // else
      // {
      //   this.isFinancialInfo=false;
      // }
    
      if (this.cisId) { 
       
        this.getCisDataById();
       }
    })
   
  }

 

  
  getCisDataById(){ 
  
    this.httpService.getDataSearch(PATH.SEARCH_CIS+'/'+this.cisId).subscribe((res: any) => {
   
      if(res.searchFor=='COMPLIANCE'){
        this.isFinancial=false;
        this.isCompliance=true;
        this.getCisDataSummary();
       }
      if(res.searchFor=='FINANCIAL'){
        this.isFinancial=true;
        this.getFinancialData();
      }
      this.isRes=true;
      this.spinnerService.hide();
    },
      (err) => {
        this.isRes=true;
        this.spinnerService.hide();
        this.toastrService.error(err.message.message);
      })
  }

  getCisDataSummary() {
    // this.spinnerService.show();
    this.httpService.getDataSearch(PATH.SEARCH_CIS + '/data-summary/' + this.cisId).subscribe((res: any) => {
      this.isSeekData=true;
      res.cisDataBestMatchList.forEach(element => {
        if(element.entityId == this.entityId)
        {
          this.title = element.name;      
        }
      });
      res.cisDataPotentialMatchList.forEach(element => {
        if(element.entityId == this.entityId)
        {
          this.title = element.name;        
        }
      });
      this.spinnerService.hide();
    },
      (err) => {
        this.spinnerService.hide();
        // this.toastrService.error(err.message.message);
      })
  }


  getSeekFinancialData() {
    if(this.isFinancialData){
      this.getFinancialData();
    }
    else{
    
      this.count=this.count+1;
        setTimeout(()=>{
          this.getFinancialData();
        }, 2000);
   
    }
  }

  getFinancialData() {
    // this.spinnerService.show();
    // if(!this.isSeekData){
      this.httpService.getDataSearch(PATH.SEARCH_CIS+'/financial-data?cisCompanyId='+this.cisCompanyId).subscribe((res: any) => {
        this.financialData=res;
        this.isFinancialRes=true;
        this.title = res.companyName;  
        clearInterval(this.interval);
        this.spinnerService.hide();
        this.isFinancialData=true;
        this.isSeekData=true;
    },
      (err) => {
        this.isFinancialRes=true;
        this.isSeekData=false;
        this.spinnerService.hide();
        // this.toastrService.error(err.error.message);
        // clearInterval(this.interval);
        this.isFinancialData=false;
       
        if(this.count>10){
          clearTimeout(this.interval);
          this.isSeekData=true;
        }
        else{
          this.getSeekFinancialData();
        }
      })
    // }
   
  }

  // seekInformation(itm){
  //   this.spinnerService.hide();
  //   if(!this.financialData){
  //     if(itm.index!=0 && !this.isFinancialInfo ){
  //       let modelRef = this.modalService.open(SeekInformationComponent, {
  //         windowClass: "center",
  //        size:'sm',
  //        backdrop  : 'static',
  //        keyboard  : false
  //       })
  //       itm.index==1?modelRef.componentInstance.type = 'directors-shareholders':modelRef.componentInstance.type = 'financial';

  //       modelRef.componentInstance.sendData.subscribe((receivedEntry) => {
  //         modelRef.close();
  //         if (receivedEntry == 'cancel') {
  //           this.index=0;
  //         } 
  //         else{
  //           this.getSeekFinancialData()
  //         }
  //       });
  //     }

    
  //   }
   
 
  // }

  gotoCompliance(){
    this.index=0;
  }

  addToDashboard(){
    const ref = this.dialogService.open(AddToDashboardComponent, {
      header: 'Add To My Dashboard List As',
      width: '35%',
      data:{searchFor:this.isFinancial?'FINANCIAL':'COMPLIANCE',searchId:this.isFinancial?this.cisCompanyId:this.cisId,vendorEntityId:this.entityId}
  });
  }

}
