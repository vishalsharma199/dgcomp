import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { PATH } from 'src/app/app.constant';
import { AppCookieService } from 'src/app/services/cookieService';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { UntypedFormBuilder, Validators, } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedDataService } from 'src/app/services/shared-data.service';
@Component({
  selector: 'app-switch-profile',
  templateUrl: './switch-profile.component.html',
  styleUrls: ['./switch-profile.component.scss']
})
export class SwitchProfileComponent implements OnInit {

  user:any={};
  assocationData:any;
  entityNameList:any=[];
  profileForm:any;
  formSubmitAttempt:boolean=false;
  entityTypeList:any=[];
  constructor(  private httpService: HttpService,
                private appCookieService: AppCookieService,
                private ref: DynamicDialogRef,
                private router: Router,
                private formbuilder: UntypedFormBuilder,
                private spinnerService: NgxSpinnerService,
                private sharedDataService:SharedDataService) { }

  ngOnInit(): void {
    this.user = JSON.parse(this.appCookieService.get('digiUser'));
    this.prepareProfileForm();
    this.getAssociation();
    this.assocationData=[];
  }
  
  prepareProfileForm(){
      this.profileForm = this.formbuilder.group({
      entityType:['',[Validators.required]],
      entityId:['',[Validators.required]],
    })

    this.entityTypeList=[
      {entityType:'OWNER'},
      {entityType:'VENDOR'},
    ]
  }

  get f(){
    return this.profileForm.controls
  }


  getAssociation(){
    this.httpService.getData(PATH.GET_ASSOCIATION).subscribe((res:any)=>{
      console.log(res);
      this.assocationData=res;
      this.profileForm.patchValue({
        entityType:''
      })
      this.spinnerService.hide();
      
    });
  }

  entityTypeChange(itm) {
    let selectedEntity = this.assocationData.filter((o) => {
      return o.entityType == itm.target.value;
    });
    this.entityNameList=selectedEntity;
    this.profileForm.patchValue({
      entityId:''
    })
    // this.entityNameList = this.entityNameList.map(elm => { return { label: elm.entityName, value: elm.name } });
  }

  entityNameChange(itm){
   
  }

  close(){
    this.ref.close();
  }

  submit(){
  
    this.profileForm.markAllAsTouched();
    this.formSubmitAttempt=true;
    if(this.profileForm.invalid){
      return;
    }
    let payload=this.profileForm.value
    let selectedProfile = this.assocationData.filter((o) => {
      return o.entityId == payload.entityId;
    });
    this.user.entityType=selectedProfile[0].entityType;
    this.user.entityId=selectedProfile[0].entityId;
    this.user.eroles=selectedProfile[0].eroles;
    this.appCookieService.set('digiUser', JSON.stringify(this.user));
   
    if(payload.entityType=='OWNER'){
      this.router.navigate(['/customer','dashboard']);
    }
    if(payload.entityType=='VENDOR'){
      this.router.navigate(['/vendor', 'vendor-info']);
    }
    this.sharedDataService.callSidenav('switch-profile');
    this.ref.close();
  }
}
