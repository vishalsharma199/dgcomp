import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as echarts from 'echarts';

@Component({
  selector: 'app-bank-financial',
  templateUrl: './bank-financial.component.html',
  styleUrls: ['./bank-financial.component.scss']
})
export class BankFinancialComponent implements OnInit {
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  order: any = 'desc';
  col: any = 'createdDate';
  locationheaders: Array<any>;
  numberOfElements:any;
  basicData: any;
  basicOptions: any;
  ratioData:any;
  ratioOption:any;
  isFinInfo:boolean=false;
  @Input() financialData:any;
  locationData:any;
  balanceSheetYears:any;
  incomeStatementYears:any;
  cashFlowYears:any;
  options:any;
  profitabilityOption:any;
  incomeStatement:any;
  cashFLow:any;
  constructor(
    private ar: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.prepareHeader();
    // this.ar.params.subscribe((params) => {      
    //   if(params.finInfo=='false'){
    //     this.isFinInfo=false;
    //   }
    //   else{
    //     this.isFinInfo=true;
    //   }
    // })
    this.prepareCharts();
  }
    prepareHeader(){
      this.locationheaders = [
        { name: 'particular', header: '', sort: false,isAsc:false},
        // { name: 'first', header: '', sort: false,isAsc:false},
        { name: 'financial', header: 'Financial Year', sort: false,isAsc:false},
        // { name: 'currency', header: '', sort: false,isAsc:false},
      ];
      this.locationData=this.financialData?this.financialData.balanceSheets:[];
      this.incomeStatement=this.financialData?this.financialData.incomeStatements:[];
      this.cashFLow=this.financialData?this.financialData.cashFlows:[];
      if(this.locationData.length>0){
        this.balanceSheetYears=this.locationData[0]['financialValues']
      }
      if(this.incomeStatement.length>0){
       this.incomeStatementYears=this.incomeStatement[0]['financialValues'];
      }
      if(this.cashFLow.length>0){
        this.cashFlowYears=this.cashFLow[0]['financialValues'];
       }

     
      
    }

    prepareCharts(){
      this.options = {
        title: {
          textStyle: {
              color: "grey",
              fontSize: 20
          },
          text: "No Data Available",
          left: "center",
          top: "center"
        },
        xAxis: {
          type: 'category',
          // data: [2020,2021,2022]
        },
        yAxis: {  
          type: 'value'
        },
        series: [
          {
            data: [0, 0, 0],
            type: 'bar',
            showBackground: false,
            color:'#2b3858',
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
  
      };

      this.profitabilityOption = {
        title: {
          textStyle: {
              color: "grey",
              fontSize: 20
          },
          text: "No Data Available",
          left: "center",
          top: "center"
        },
        // legend: {},
        tooltip: {},
        dataset: {
          // dimensions: ['product', 'Retrun On Equity', 'Net Profit Margin'],
          source: [
            { product: '0', 'Retrun On Equity': 0, 'Net Profit Margin': 0},
            { product: '0', 'Retrun On Equity': 0, 'Net Profit Margin': 0},
            { product: '0', 'Retrun On Equity': 0, 'Net Profit Margin': 0},
          ]
        },
        xAxis: { type: 'category' },
        yAxis: {},
        series: [
          { 
            type: 'bar',
            showBackground: false,
            color:'#2b3858',
            backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
            }
           },
           { 
            type: 'bar',
            showBackground: false,
            color:'#f19937',
            backgroundStyle: {
            color: 'blue'
            }
           },
        ]
      };
    
    }

}
