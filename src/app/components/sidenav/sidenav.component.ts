import { Router } from '@angular/router';
import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import { AppCookieService } from 'src/app/services/cookieService';
import { HttpService } from 'src/app/services/http.service';
import { PATH } from 'src/app/app.constant';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedDataService } from 'src/app/services/shared-data.service';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html'
})
export class SidenavComponent implements OnInit {
  collapsed:boolean=true;
  isAdmin:boolean=false;
  isVendor:boolean=false;
  isCustomer:boolean=false;
  user:any;
  dashboardStep:any;
  isCompanyRes:boolean=false;

  constructor(private appCookieService:AppCookieService,
    private router: Router,
    private httpService: HttpService,
    private spinnerService: NgxSpinnerService,
    private sharedDataService:SharedDataService,
    ) { }

  @Output() sendData: EventEmitter<any> = new EventEmitter();
 
  ngOnInit(): void {
   if(localStorage.getItem('dashboardStep')){
    this.dashboardStep = localStorage.getItem('dashboardStep');
   }
    this.user = JSON.parse(this.appCookieService.get('digiUser'));
    if(this.user.eroles[0]=='ROLE_ADMIN'){
      this.isAdmin = true;
    }
    if(this.user.eroles[0]=='ROLE_VENDOR'){
      this.isVendor = true;
    }
    if(this.user.eroles[0]=='ROLE_OWNER'){
      this.isCustomer = true;
    }
    if(this.isVendor){
      this.getCompanyInfo();
    }
    this.swithcProfile();
  }

  swithcProfile(){
    this.sharedDataService.sidenav.subscribe((value) => {
      if(value=='switch-profile'){
        this.isAdmin=false;
        this.isVendor=false;
        this.isCustomer=false;
        this.ngOnInit();
      }
    });
  }

  getCompanyInfo(){
    this.spinnerService.show();
    this.httpService.getData(PATH.COMPANY_INFORMATION).subscribe((res: any) => {
      if(res){
        this.isCompanyRes=true;
        localStorage.setItem('dashboardStep', res.step);
        this.spinnerService.hide();
      }
    },(err)=>{
      this.isCompanyRes=true;
      localStorage.setItem('dashboardStep', '0');
      this.spinnerService.hide();
    });
  }

  toggleSidebar() {
    this.collapsed = !this.collapsed;
    if(this.collapsed){
      this.sendData.emit('collapsed');
    }
    else
    {
      this.sendData.emit('Not collapsed');
    } 
  }


  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  goToAdmin(){
    this.sharedDataService.setOwnerStatus('ALL');
  }

}
