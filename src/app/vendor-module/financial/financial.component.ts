import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.scss']
})
export class FinancialComponent implements OnInit {
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  order: any = 'desc';
  col: any = 'createdDate';
  locationheaders: Array<any>;
  numberOfElements:any;

  capital:number=211992000;

  constructor() { }

  ngOnInit(): void {
    this.prepareHeader();

  }


  locationData: Array<any> = [
    {particular: ' Particular',first:'30-06-2020',financial:'30-06-2021',currency:'30-06-2022', current:'(Currency USD)' },
    {particular: ' Stocks',first:'13490101',financial:'13490101',currency:'13490101',},
    {particular: 'Debtors',first:'',financial:'3209212',currency:'3209212',},
    {particular: 'Cash & Cash Equivalent',first:'2990000',financial:'2990000',currency:'2990000',},
    {particular: 'Other Current Assets',first:'11192090',financial:'',currency:'11192090',},
    {particular: ' Current Assets',first:'59029310',financial:'74309022',currency:'104193200',},
    {particular: 'Intengible Fixed Assets',first:'39029310',financial:'',currency:'59029310',},
    {particular: 'Intengible Fixed Assets',first:'39029310',financial:'',currency:'59029310',},
    {particular: 'Tengible Fixed Assets',first:'29029310',financial:'109029310',currency:'59029310',},
    {particular: 'Other Fixed Assets' , span: '(Incl Financial Fixed Assets)',first:'29029310',financial:'109029310',currency:'59029310',},
    {particular: ' Fixed Assets' ,first:'29029310',financial:'109029310',currency:'59029310',},
    {particular: 'Total Assets' , first:'29029310',financial:'109029310',currency:'59029310',},
    {particular: ' Capital' ,first:'29029310',financial:'109029310',currency:'59029310',},
    {particular: 'Other Shareholders Fund' , span: '(Incl Reserves)',first:'29029310',financial:'109029310',currency:'59029310',},
    {particular: ' Shareholders Fund',first:'29029310',financial:'109029310',currency:'59029310',},
    {particular: ' Loan',first:'',financial:'109029310',currency:'5,90,29,310',},
    {particular: ' Creditors',first:'29029310',financial:'',currency:'59029310',},
    {particular: 'Other Current Liabilities',first:'29029310',financial:'109029310',currency:'59029310',},
    {particular: 'Current Liabilities',first:'69029310',financial:'59029310',currency:'79029310',},
    {particular: 'Non Current Liabilities',first:'69029310',financial:'59029310',currency:'79029310',},
    {particular: 'Total Shareholders Funds & Liabilities',first:'129029310',financial:'399029310',currency:'459029310',},
  ];


    prepareHeader(){
      this.locationheaders = [
        { name: 'particular', header: '', sort: false,isAsc:false},
        { name: 'first', header: '', sort: false,isAsc:false},
        { name: 'financial', header: 'Financial Year', sort: false,isAsc:false},
        { name: 'currency', header: '', sort: false,isAsc:false},
      ];
    }
}
