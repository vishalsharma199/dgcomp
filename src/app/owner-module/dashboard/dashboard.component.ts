import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import {NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CaptureShareComponent } from '../capture-share/capture-share.component';
import { PATH } from 'src/app/app.constant';
import * as echarts from 'echarts';
import { DialogService } from 'primeng/dynamicdialog';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  riskReview: Array<any> = []; 
  complianceReview: Array<any> = [];
  documentation: Array<any> = []; 
  conformance: Array<any> = [];
  percent=2.4;
  animation=true;
  customerGraph: any;
  supplierGraph:any
  data: any;
  chartOptions: any;
  adverseMedia:any;
  vendorEsgScore:any;
  customerEsgScore:any;
  complianceRisk:any;
  VendorCompliance:any;
  customerComplianceChart :any =[]
  customerRiskChart:any[]
  bar2:any;
  main123:any;
  main2:any;
  main3:any;
  main4:any;
  
  vendorComplianceChart:any=[]
  vendorRiskChart:any=[]  
  customerDummy=[{
  compliance:0,
  complianceCount: 0,
  highRisk: 0,
  lowRisk: 0,
  mediumRisk: 0,
  moderateCompliance: 0,
  nonCompliance: 0,
  risk: 0,
  type: "CUSTOMER" 
},
{
  compliance:0,
  complianceCount: 0,
  highRisk: 0,
  lowRisk: 0,
  mediumRisk: 0,
  moderateCompliance: 0,
  nonCompliance: 0,
  risk: 0,
  type: "VENDOR" 
}]
responsiveOptions;
customerData;
vendorData;
financialData;
infoSecData;
ageList: any = [];
bar1:any;
bar3:any;
bar4:any;
barChart: any = [
  {
    value: 0,
    itemStyle: {
      color: '#8047a4'
    }
  },
  {
    value: 0,
    itemStyle: {
      color: '#ffb200'
    }
  },
  {
    value: 0,
    itemStyle: {
      color: '#005cb1'
    }
  },

]
  constructor(private router: Router,
    private httpService: HttpService,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    public dialogService: DialogService,) { 
      this.responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 1,
            numScroll: 1
        },
        {
            breakpoint: '768px',
            numVisible: 1,
            numScroll: 1
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
    ];
  }

  ngOnInit(): void {
    this.prepareCustomerGraph();
    this.prepareTopCustomers();
    this.getEsgScore();
    this.getMedia();
    this.getEsgScore();
    if(!localStorage.getItem('firstLoading')){
      this.getComplianceRisk();
    }
    else{
      this.getFinancialRisk();
    }
    this.chart();
    this.YearlyChar();
    this.getSearchData();
  }
  

  getMedia(){
    this.adverseMedia=[
      {
        title:'Hong Kong Securities Futures Commission Enforcement Actions Organisations',img:'../../assets/images/login-bg.jpg', date:'5 Jul 2022', url:'https://apps.sfc.hk/edistributionWeb/gateway/EN/news-and-announcements/news/enforcement-news/'
      },
      {
        title:'Netherlands Authority for the Financial Markets Warnings from other regulators',img:'../../assets/images/login-bg.jpg', date:'17 June 2021', url:'https://www.afm.nl/nl-nl/consumenten/controleer-je-aanbieder/overzicht-waarschuwingen'
      },
      {
        title:'International IOSCO Warnings International Organization of Securities Commissions',img:'../../assets/images/login-bg.jpg', date:'27 Jun 2022', url:'https://www.iosco.org/investor_protection/?subsection=investor_alerts_portal'
      },
      {
        title:'India Securities Exchange Board of India Debarred Entities',img:'../../assets/images/login-bg.jpg', date:'12 Dec 2021', url:'https://www.nseindia.com/regulations/member-sebi-debarred-entities'
      }
    ]
  
  }
  prepareCustomerGraph(){
    this.customerGraph = {
      labels: ['A','B','C'],
      datasets: [
          {
              data: [300, 50, 100],
              backgroundColor: [
                  "#42A5F5",
                  "#66BB6A",
                  "#FFA726"
              ],
              hoverBackgroundColor: [
                  "#64B5F6",
                  "#81C784",
                  "#FFB74D"
              ]
          }
      ]
    };
  }

  prepareTopCustomers(){
    this.data = {
            labels: ['2','5','3'],
           
            datasets: [
                {
                    data: [130, 250, 100],
                    backgroundColor: [
                        "#ea4335",
                        "#fbbc05",
                        "#34a853"
                    ],
                    hoverBackgroundColor: [
                        "#ea4335",
                        "#fbbc05",
                        "#34a853"
                        // $red-color: #ea4335;
                        // $yellow-color: #fbbc05;
                        // $green-color:#34a853;
                    ]
                }
            ]
        };
  }    
  
  shareModal(){
    const modalRef = this.modalService.open(CaptureShareComponent,{centered:true});
    modalRef.componentInstance.type = 'Service';
  }


  getEsgScore() {
    this.spinnerService.show();
    this.httpService.getData(PATH.GET_DASHBOARD_ESG).subscribe((res: any) => {
      this.customerEsgScore = res.customerEsgScore;
          this.vendorEsgScore = res.vendorEsgScore;
          this.spinnerService.hide();
          },
        (error) => {
          this.spinnerService.hide();
        }
    );
  }
  // searchCis
  getSearchData(){
    this.httpService.getData(`${PATH.SEARCH_CIS}/dashboard/dashboard-summary`).subscribe((res: any) =>{
      if(res?.cisDashboardSummaryCustomer?.searchFor=='COMPLIANCE'){
        console.log(res.cisDashboardSummaryCustomer.count);
        
      }
      res.cisDashboardSummaryCustomer.forEach(element => {
        if(element?.searchFor=='COMPLIANCE'){
          this.customerData.compliance.value=element.count
        }if(element?.searchFor=='FINANCIAL'){
          console.log(element.count);
          this.customerData.risk.value=element.count
          
        }
        
      });

      res.cisDashboardSummaryVendor.forEach(element => {
        if(element?.searchFor=='COMPLIANCE'){
          
          this.vendorData.compliance.value=element.count
          
          
        }if(element?.searchFor=='FINANCIAL'){
 
          this.vendorData.risk.value=element.count
          
        }
        
      });

    });
  }


  getComplianceRisk() {
   
    this.customerComplianceChart= [
      { value: 8,  name: '8',  itemStyle: { color: '#34a853' } },
      { value: 2,  name: '2',  itemStyle: { color: '#ea4335' } },
    ]
    this.vendorComplianceChart= [
      { value: 8,  name: '8',  itemStyle: { color: '#34a853' } },
      { value: 2,  name: '2',  itemStyle: { color: '#ea4335' } },
    ]
    this.customerRiskChart= [
      { value: 5,  name: '5',  itemStyle: { color: '#34a853' } },
      { value: 2,  name: '2',  itemStyle: { color: '#fbbc05' } },
      { value: 3,  name: '3',  itemStyle: { color: '#ea4335' } },
    ]
    this.vendorRiskChart= [
      { value: 4,  name: '4',  itemStyle: { color: '#34a853' } },
      { value: 1,  name: '1',  itemStyle: { color: '#fbbc05' } },
      { value: 5,  name: '5',  itemStyle: { color: '#ea4335' } },
    ]
    this.customerData = {"compliance":{"value":0,"compliance":0,"noncompliance":0},"risk":{"value":0,"lowRisk":0,"mediumRisk":0,"highRisk":0}};
    this.vendorData = {"compliance":{"value":0,"compliance":0,"noncompliance":0},"risk":{"value":0,"lowRisk":0,"mediumRisk":0,"highRisk":0}};
     
    this.financialData = {"customer":{"value":10,"lowRisk":4,"mediumRisk":4,"highRisk":2},"vendor":{"value":11,"lowRisk":5,"mediumRisk":1,"highRisk":5}};
    this.infoSecData = {"customer":{"value":10,"lowRisk":4,"mediumRisk":4,"highRisk":2},"vendor":{"value":11,"lowRisk":5,"mediumRisk":1,"highRisk":5}};
   
    this.complianceReview=[
      {"scheduled":6,"missed":4,heading:'Customer',img:'../../assets/images/dashboard-icons/icon4.png'},
      {"scheduled":8,"missed":3,heading:'Vendor',img:'../../assets/images/dashboard-icons/icon5.png'}
    ];
    
    this.riskReview=[
      {"scheduled":6,"missed":4,numbers:'250',heading:'Customer',img:'../../assets/images/dashboard-icons/icon4.png'},
      {"scheduled":8,"missed":3,heading:'Vendor',img:'../../assets/images/dashboard-icons/icon5.png'}
     ];
    

// chart
// this.customerComplianceChart
// this.customerRiskChart

// this.vendorComplianceChart
// this.vendorRiskChart


    let load = 'fL';
    localStorage.setItem('firstLoading',load);    
  }


  getFinancialRisk() {
    localStorage.removeItem('firstLoading');
    this.customerComplianceChart= [
      { value: 6,  name: '6',  itemStyle: { color: '#34a853' } },
      { value: 4,  name: '4',  itemStyle: { color: '#ea4335' } },
    ]
    
    this.vendorComplianceChart= [
      { value: 8,  name: '8',  itemStyle: { color: '#34a853' } },
      { value: 2,  name: '2',  itemStyle: { color: '#ea4335' } },
    ]
    this.customerRiskChart= [
      { value: 3,  name: '3',  itemStyle: { color: '#34a853' } },
      { value: 1,  name: '1',  itemStyle: { color: '#fbbc05' } },
      { value: 6,  name: '6',  itemStyle: { color: '#ea4335' } },
    ]
    this.vendorRiskChart= [
      { value: 5,  name: '5',  itemStyle: { color: '#34a853' } },
      { value: 4,  name: '4',  itemStyle: { color: '#fbbc05' } },
      { value: 1,  name: '1',  itemStyle: { color: '#ea4335' } },
    ]
  this.customerData = {"compliance":{"value":0,"compliance":6,"noncompliance":4},"risk":{"value":0,"lowRisk":3,"mediumRisk":1,"highRisk":6}};
  this.vendorData = {"compliance":{"value":0,"compliance":8,"noncompliance":3},"risk":{"value":0,"lowRisk":5,"mediumRisk":4,"highRisk":2}};
   
  this.financialData = {"customer":{"value":10,"lowRisk":4,"mediumRisk":3,"highRisk":3},"vendor":{"value":11,"lowRisk":2,"mediumRisk":5,"highRisk":4}};
  this.infoSecData = {"customer":{"value":10,"lowRisk":2,"mediumRisk":5,"highRisk":3},"vendor":{"value":11,"lowRisk":6,"mediumRisk":2,"highRisk":3}};
 
  this.complianceReview=[
    {"scheduled":5,"missed":5,heading:'Customer',img:'../../assets/images/dashboard-icons/icon4.png'},
    {"scheduled":7,"missed":3,heading:'Vendor',img:'../../assets/images/dashboard-icons/icon5.png'}
   ];
   
   this.riskReview=[
    {"scheduled":2,"missed":8,numbers:'250',heading:'Customer',img:'../../assets/images/dashboard-icons/icon4.png'},
    {"scheduled":1,"missed":9,heading:'Vendor',img:'../../assets/images/dashboard-icons/icon5.png'}
   ];

  }
  
  seaway(id){
    this.router.navigate(['/customer/seaway-shipping',id]);

  }

  gotoCompliance(type){
    this.router.navigate(['/customer/customers-compliance',type]);
  }

  gotoCustomer(type){
    this.router.navigate(['/customer/customersrisk',type]);
  }

  latestNews: Array<any> = [

    {news: 'Digicomp+ Compliance and Risk analysis platform enables customers to mitigate risk and develop competitive advantages.'},
    {news: 'Digicomp+ Compliance and Risk analysis platform enables customers to mitigate risk and develop competitive advantages.'},

  ];



chart(){

  // var chartDom = document.getElementById('main123');

  // var myChart = echarts.init(chartDom);
  // var option;
  this.main123 = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      // top: '5%',
      // left: 'center'
      orient: 'vertical',
    right: 0,
    top: '30%',
    },
    series: [
      {
        name: 'Compliance',
        type: 'pie',
        radius: ['50%', '60%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        data:this.customerComplianceChart
        // data: [
        //   {
        //     value: 2,
        //     name: '2',
        //     itemStyle: {
        //       color: '#ea4335'
        //     }
        //   },
         
        //   {
        //     value: 8,
        //     name: '8',
        //     itemStyle: {
        //       color: '#34a853'
        //     }
        //   }
        // ]
      }
    ]
  };
  
  // option && myChart.setOption(option);


// 2th chart
  // var chartDom2 = document.getElementById('main2');

  // var myChart = echarts.init(chartDom2);
  // var option2;
  this.main2 = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      // top: '5%',
      // left: 'center'
      orient: 'vertical',
    right: -5,
    top: '30%',
    },
    series: [
      {
        name: 'Risk',
        type: 'pie',
        radius: ['50%', '60%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        data:this.customerRiskChart
      }
    ]
  };
  
  // option2 && myChart.setOption(option2);


// 3th chart
  // var chartDom3 = document.getElementById('main3');

  // var myChart = echarts.init(chartDom3);
  // var option3;
  this.main3 = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      // top: '5%',
      // left: 'center'
      orient: 'vertical',
    right: 0,
    top: '30%',
    },
    series: [
      {
        name: 'Compliance',
        type: 'pie',
        radius: ['50%', '60%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        data: this.vendorComplianceChart
      }
    ]
  };
  
  // option3 && myChart.setOption(option3);



// 4th chart
  // var chartDom4 = document.getElementById('main4');

  // var myChart = echarts.init(chartDom4);
  // var option4;
  this.main4 = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      // top: '5%',
      // left: 'center'
      orient: 'vertical',
    right: 0,
    top: '30%',
    },
    series: [
      {
        name: 'Risk',
        type: 'pie',
        radius: ['50%', '60%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        data:this.vendorRiskChart
      }
    ]
  };
  
  // option4 && myChart.setOption(option4);
}


YearlyChar(){

  // var chartDom = document.getElementById('bar1');
  // var myChart = echarts.init(chartDom);
  // var option;
  
  this.bar1 = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      
    },
    xAxis: {
      type: 'category',
      data: ['Scheduled', 'Missed'],
      splitLine: {
        show: false
     }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false
     }
    },
    series: [
      {
        data: [{
          value: 8,
          name: '2',
          itemStyle: {
            color: '#34a853'
          }
        },
     {
          value: 2,
          name: '2',
          itemStyle: {
            color: '#ea4335'
          }
        },],
        type: 'bar',
        label: {
          show: true,
          position: 'top',
          valueAnimation: true
        }
      }
    ]
  };  
  // option && myChart.setOption(option);

  // var chartDom = document.getElementById('bar2');
  // var myChart = echarts.init(chartDom);
  // var option;
  
  this.bar2 = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {},
    xAxis: {
      type: 'category',
      data: ['Scheduled', 'Missed'],
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false
      }
    },
  
    series: [
      {
        data: [{
          value: 10,
          name: '10',
          itemStyle: {
            color: '#34a853'
          }
        },
     {
          value: 1,
          name: '1',
          itemStyle: {
            color: '#ea4335'
          }
        },],
        type: 'bar',
        label: {
          show: true,
          position: 'top',
          valueAnimation: true
        }
      }
    ]
  };  
  // option && myChart.setOption(option);

  // var chartDom = document.getElementById('bar3');
  // var myChart = echarts.init(chartDom);
  // var option;
  
  this.bar3 = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {},
    xAxis: {
      type: 'category',
      data: ['Scheduled', 'Missed'],
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false
      }
    },
  
    series: [
      {
        data: [{
          value: 9,
          name: '9',
          itemStyle: {
            color: '#34a853'
          }
        },
     {
          value: 1,
          name: '1',
          itemStyle: {
            color: '#ea4335'
          }
        },],
        type: 'bar',
        label: {
          show: true,
          position: 'top',
          valueAnimation: true
        }
      }
    ]
  };  

  // var chartDom = document.getElementById('bar4');
  // var myChart = echarts.init(chartDom);
  // var option;
  
  this.bar4 = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {},
    xAxis: {
      type: 'category',
      data: ['Scheduled', 'Missed'],
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false
      }
    },
  
    series: [
      {
        data: [{
          value: 9,
          name: '9',
          itemStyle: {
            color: '#34a853'
          }
        },
        {
          value: 2,
          name: '2',
          itemStyle: {
            color: '#ea4335'
          }
        },],
        type: 'bar',
        label: {
          show: true,
          position: 'top',
          valueAnimation: true
        }
      }
    ]
  };  
  // option && myChart.setOption(option);


}





adverseMediaUrl(url){
  window.open(url, '_blank');
}

}
