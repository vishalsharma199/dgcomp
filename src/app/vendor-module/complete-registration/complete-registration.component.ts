import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { PATH } from 'src/app/app.constant';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-complete-registration',
  templateUrl: './complete-registration.component.html',
  styleUrls: ['./complete-registration.component.scss']
})
export class CompleteRegistrationComponent implements OnInit {

  companyName:string;

  constructor(private httpService: HttpService, private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.getCompanyDetails();
  }

  getCompanyDetails(){
    this.spinnerService.show();
    this.httpService.getData(PATH.GET_VENDOR_DETAILS).subscribe((res: any) => {
      this.companyName = res.name;
      this.spinnerService.hide();
    },(error) => {
          this.spinnerService.hide();
    })
  }

}
