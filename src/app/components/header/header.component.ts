import { AppCookieService } from 'src/app/services/cookieService';
import { SharedService } from './../../services/shared.service';
import { Component,Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { PATH } from 'src/app/app.constant';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import {TooltipModule} from 'primeng/tooltip';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { SwitchProfileComponent } from '../switch-profile/switch-profile.component';
import { DialogService } from 'primeng/dynamicdialog';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  @Input() collapsed:any;
  user: any;
  companyLogo:any;
  showRfi= true;
  notificationLength:0;
  notification:boolean=false;
  imgUrl;
  companyInfo:any={};
  isVendor:boolean=false;
  isOwner:boolean=false;
  constructor(
    private router: Router,
    private sharedService: SharedService,
    private httpService: HttpService,
    private appCookieService: AppCookieService,
    private toastrService: ToastrService,
    private spinnerService: NgxSpinnerService,
    private sharedDataService:SharedDataService,
    public dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(this.appCookieService.get('digiUser'));
    if(this.user?.eroles == 'ROLE_VENDOR'){
      this.getCompanyInfo();
      this.getRFI();
    }
    if(this.user?.eroles == 'ROLE_OWNER'){
      this.customerInfo();
    }
    // this.getCompanyInfo();
    this.getLogo();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
    if(this.user?.eroles != 'ROLE_ADMIN'){
      this.getCustomerCompanyImg();
      this.getAssociation();
    }
  }

  getCustomerCompanyImg(){
    this.sharedDataService.customObservable.subscribe((res) => {
      if(res.imgUrl && res.companyLogo){
        this.imgUrl=res.imgUrl;
        this.companyLogo=res.companyLogo;
      }
    });
  }



  getCompanyInfo() {
    this.spinnerService.show();
    this.httpService.getData(PATH.COMPANY_INFORMATION).subscribe((res: any) => {
          this.companyInfo = res;
          this.companyLogo=res.companyLogo
          this.getFile(this.companyInfo?.companyLogo)
          this.spinnerService.hide();
          },
        (error) => {
          this.spinnerService.hide();
        }
      );
  }


  getFile(data){
    this.httpService.getImage(PATH.GET_UPLOADED_FILE+data).subscribe((res)=>{
      this.imgUrl = res;
      this.spinnerService.hide();
      // console.log(this.imgUrl);
    })
  }

  getLogo() {
    let file = JSON.parse(this.appCookieService.get('digiLogo'));
    if(file){
      this.httpService
      .getData(PATH.GET_FILE + file.fileName)
      .subscribe((res: string) => {
        this.companyLogo = res;
      });
      this.spinnerService.hide();
    }
    
  }
  
  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

 
  getRFI() {
    this.spinnerService.show();
    this.httpService.getData(PATH.RFI).subscribe((res: any) => {
      this.notificationLength = res.length; 
      this.notification = true; 
      this.spinnerService.hide();
    },(error) => {
        this.spinnerService.hide();
        // this.toastrService.error(error.message?.error);
      }
    )
  }
  
  goToCompanyInfo(){
    this.router.navigate(['/vendor/vendor-info/1']);
  }
 
  customerInfo(){
    this.httpService.getData(PATH.COMPANY_BASIC_DETAILS).subscribe((res:any)=>{
      this.companyInfo = res;
      this.companyLogo=res.companyLogo
      this.getFile(this.companyInfo?.companyLogo);
    },(error) => {
      this.spinnerService.hide();
    });
  }

  chooseProfile(){
    const ref = this.dialogService.open(SwitchProfileComponent, {
      header: 'Switch Profile',
      width: '40%',
  });
  }

  getAssociation(){
    this.httpService.getData(PATH.GET_ASSOCIATION).subscribe((res:any)=>{
      console.log(res);
      for(var i=0;i<res.length;i++){
        if(res[i]['eroles']=='ROLE_VENDOR'){
          this.isVendor=true;
        }
        if(res[i]['eroles']=='ROLE_OWNER'){
          this.isOwner=true;
        }
      }
        this.spinnerService.hide();
      
    });
  }
}










































