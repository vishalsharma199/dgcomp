import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PATH } from 'src/app/app.constant';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  @Input() companyInfo:any;
  basicData: any;
  customer: Array<any> = []; 
  basicOptions: any;
  pdfData:any=[];
  cardCount:any;
  logo:any;
  imgUrl
  constructor( private router: Router,
    private httpService: HttpService,
    private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.basicData = {
      labels: ['2020', '2021', '2022'],
      datasets: [
          {
              label: 'Revenue',
              backgroundColor: '#2b2c41',
              data: [65, 59, 80]
          },
          {
              label: 'Net Profit',
              backgroundColor: '#f19937',
              data: [28, 48, 40]
          }
      ]
  };

  this.customer=[
    {numbers:'390',heading:'Total Assests',img:'../../assets/images/arrow-up.png',cost:'400', assests:'2.5%', year:'Previous Year'},
    {numbers:'250',heading:'Net Assets',img:'../../assets/images/arrow-down.png',cost:'280', assests:'4.1%', year:'Previous Year'},
    {numbers:'170',heading:'Current Liablities',img:'../../assets/images/arrow-up.png',cost:'190', assests:'2.5%', year:'Previous Year'},
    {numbers:'130',heading:'Cash in Hand',img:'../../assets/images/arrow-down.png',cost:'190', assests:'4.1%', year:'Previous Year'},
    {numbers:'2350',heading:'Turnover',img:'../../assets/images/arrow-up.png',cost:'2500', assests:'2.5%', year:'Previous Year'},
    {numbers:'3',heading:'Employees',img:'../../assets/images/arrow-up.png',cost:'4', assests:'25%', year:'Previous Year'},
    ]
    this.cardInfo();
  }

  download(evt) {
    this.spinnerService.show();
    let type = this.checkDocumentType( evt);
    this.httpService.download(PATH.GET_UPLOADED_FILE+evt).subscribe((res)=>{
      var file = new Blob([res], {type: type});
      var fileURL = URL.createObjectURL(file);
      window.open(fileURL);
      this.spinnerService.hide();

    })
  }

  checkDocumentType(filename){
    this.spinnerService.show();
      let fileType = filename.split('.').pop();
      if(fileType == 'jpeg'){
        return 'image/jpeg';
      }
      if(fileType == 'pdf'){
        return 'application/pdf';
      }
      if(fileType == 'png'){
        return 'image/png';
      }
      if(fileType == 'gif'){
        return 'image/gif';
      }
    }

  cardInfo() {
    this.spinnerService.show();
    this.httpService.getData(PATH.DASHBOARD_COUNT).subscribe((res: any) => {
          this.cardCount = res;
          this.spinnerService.hide();
          },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }

  

  gotovendordashboard(){
    this.router.navigate(['/vendor/vendor-info/1'])
  }

}
