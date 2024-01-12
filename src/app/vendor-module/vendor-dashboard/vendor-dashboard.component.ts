import {
  Component,
  OnInit
} from '@angular/core';

import { PATH } from 'src/app/app.constant';
import { HttpService } from 'src/app/services/http.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.scss']
})
export class VendorDashboardComponent implements OnInit {
  isDashboard:true;
  isDirectors:true;
  adverseMedia:any;
  invitedCompDetails:any;
  companyLogoUrl;
  companyInfo:any;

  constructor(private httpService: HttpService,
    private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getCompanyInfo();
    this.getCompanyLogo();
    this.getAdverseMediaData();
  }

  getCompanyLogo(){
    this.spinnerService.show();
      this.httpService.getData(PATH.DASHBOARD_BASIC_DETAILS).subscribe((res: any) => {
        this.invitedCompDetails = res;
        this.getFile(res.companyLogo)
        this.spinnerService.hide();
      },(error) => {
        this.spinnerService.hide();
      });
    }

    getFile(data){
      this.httpService.getImage(PATH.GET_UPLOADED_FILE+data).subscribe((res)=>{
        this.companyLogoUrl = res;
      })
    }

    getAdverseMediaData(){
      this.adverseMedia=[
        {
          title:'It is a long established fact that a reader will be distracted by readable.',img:'../../assets/images/login-bg.jpg'
        },
        {
          title:'It is a long established fact that a reader will be distracted by readable.',img:'../../assets/images/login-bg.jpg'
        },
        {
          title:'It is a long established fact that a reader will be distracted by readable.',img:'../../assets/images/login-bg.jpg'
        },
        {
          title:'It is a long established fact that a reader will be distracted by readable.',img:'../../assets/images/login-bg.jpg'
        }
      ]
    }

    getCompanyInfo() {
      this.spinnerService.show();
      this.httpService.getData(PATH.COMPANY_INFORMATION).subscribe((res: any) => {
        this.companyInfo = res;
        this.spinnerService.hide();
      },(error) => {
        this.spinnerService.hide();
      });
    }

}
