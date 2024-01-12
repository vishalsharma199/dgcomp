import { CapacityModalComponent } from './../capacity-modal/capacity-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sealink-details',
  templateUrl: './sealink-details.component.html',
  styleUrls: ['./sealink-details.component.scss']
})
export class SealinkDetailsComponent implements OnInit {

  percent:any=2.4;
  type:any;
  riskData:any=[];
  riskRating:any=[];
  companyName;

  constructor(private modalService:NgbModal, private route:ActivatedRoute,
    private router: Router,) { }

  ngOnInit(): void {
    this.route.params.subscribe((res)=>{
      this.type=res.type;
      if(this.type=='vendor-risk'){
        this.companyName = 'Central Bank of Iran Details';
        this.getVendorRiskData();
      }else{
        this.companyName = 'Airbus Group Details';
        this.getCustomerRiskData();
      }
    });
  }

  editCapacity(capacity){
    const modelRef=this.modalService.open(CapacityModalComponent,{size:'sm',centered:true});
    modelRef.componentInstance.capacity=capacity;
  }


  getVendorRiskData(){
    this.riskData=[
      {name:'Company Name', value:'Central Bank of Iran'},
      {name:'Former Name', value:'Bank Melli Iran'},
      {name:'Contact Person', value:'Mr Ibrahim Iman'},
      {name:'Phone Number', value:'8765429872'},
      {name:'Email Address', value:'webab90662@shbiso.com'},
      {name:'Company Registration Number', value:'7676489388'},
      {name:'Category', value:'Shipping Company'},
      {name:'VAT Registration Number', value:'AIJP7845623DD'},
      {name:'Duns Number', value:'UKRTS8870993'},
      {name:'Date of Incorporation', value:'04 Jun.2001'},
      {name:'Legal Status', value:'Limited Liability Company / Partnership'},
      {name:'Website Url', value:'www.bankofiran.com'},
      {name:'Product/Service', value:'Agency'},
      {name:'Annual Revenue in USD', value:'10 million'},
    ];
    this.riskRating=[
      {name:'Compliance',percent:3,capacity:7,color:'#34a853'}, 
      {name:'Cybersecurity',percent:9,capacity:7,color:'#ea4335'}, 
      {name:'Reputational',percent:3,capacity:7,color:'#34a853'},
      {name:'Financial',percent:9,capacity:7,color:'#ea4335'},
      {name:'Operation',percent:5,capacity:7,color:'#34a853'},
      {name:'Strategic',percent:3,capacity:7,color:'#34a853'},
      {name:'Competition',percent:8,capacity:7,color:'#ea4335'},
      {name:'Enterprise',percent:10,capacity:7,color:'#ea4335'},
      {name:'Security & Fraud',percent:7,capacity:7,color:'#fbbc05'},
      {name:'Performance',percent:7,capacity:7,color:'#fbbc05'},
      {name:'Schedule',percent:9,capacity:7,color:'#ea4335'},
      {name:'Cost',percent:6,capacity:7,color:'#fbbc05'},
      {name:'Ultimate Bencificial Owners',percent:3,capacity:7,color:'#34a853'},
      {name:'Power of Customers',percent:9,capacity:7,color:'#ea4335'},
      {name:'Power of Suppliers',percent:8,capacity:7,color:'#ea4335'}
    ]
  }

  getCustomerRiskData(){
    this.riskData=[
      {name:'Company Name', value:'AIRBUS GROUP'},
      {name:'Former Name', value:'Airbus Inc.'},
      {name:'Contact Person', value:'Mr Johanthan Warwick'},
      {name:'Phone Number', value:'(+33) 765438729'},
      {name:'Email Address', value:'pariw76801@weepm.com'},
      {name:'Company Registration Number', value:'HIJLIOH98742348'},
      {name:'Category', value:'Agency'},
      {name:'VAT Registration Number', value:'VT5639HG904'},
      {name:'Duns Number', value:'RG52637F89'},
      {name:'Date of Incorporation', value:'03 Mar.2002'},
      {name:'Legal Status', value:'Joint Stock Limited Company'},
      {name:'Website Url', value:'www.airbus.com'},
      {name:'Product/Service', value:'Chartering'},
      {name:'Annual Revenue in USD', value:'12.64 billion'},
    ];
    this.riskRating=[
      {name:'Compliance',percent:3,capacity:7,color:'#34a853'}, 
      {name:'Cybersecurity',percent:8,capacity:7,color:'#ea4335'}, 
      {name:'Reputational',percent:3,capacity:7,color:'#34a853'},
      {name:'Financial',percent:9,capacity:7,color:'#ea4335'},
      {name:'Operation',percent:7,capacity:7,color:'#fbbc05'},
      {name:'Strategic',percent:3,capacity:7,color:'#34a853'},
      {name:'Competition',percent:8,capacity:7,color:'#ea4335'},
      {name:'Enterprise',percent:8,capacity:7,color:'#ea4335'},
      {name:'Security & Fraud',percent:7,capacity:7,color:'#fbbc05'},
      {name:'Performance',percent:7,capacity:7,color:'#fbbc05'},
      {name:'Schedule',percent:9,capacity:7,color:'#ea4335'},
      {name:'Cost',percent:6,capacity:7,color:'#fbbc05'},
      {name:'Ultimate Bencificial Owners',percent:3,capacity:7,color:'#34a853'},
      {name:'Power of Customers',percent:9,capacity:7,color:'#ea4335'},
      {name:'Power of Suppliers',percent:8,capacity:7,color:'#ea4335'}
    ]
  }

  backToRisk(){
    if(this.type=='vendor-risk'){
      this.router.navigate(['/customer/customersrisk/vendor']);
    }
    else
    {
      this.router.navigate(['/customer/customersrisk/customer']);
    }
    
  }
}
