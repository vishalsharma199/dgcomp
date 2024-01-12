import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PATH } from 'src/app/app.constant';
import { HttpService } from 'src/app/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import * as _ from 'lodash';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { SuccessDialogComponent } from 'src/app/components/success-dialog/success-dialog.component';
import { email, noExtraWhiteSpace, noSpecialCharAllow, noWhitespace, onlyCharacters } from 'src/app/services/custom.validations';
import { ValidatorsServiceService } from 'src/app/services/validators-service.service';
@Component({
  selector: 'app-add-vendor-user-managment',
  templateUrl: './add-vendor-user-managment.component.html',
  styleUrls: ['./add-vendor-user-managment.component.scss']
})
export class AddVendorUserManagmentComponent implements OnInit {

  checked: boolean = false;
  // userForm:any;
  countryCode='in';
  hasError: boolean=false;
  type:string;
  editMode:boolean=false;
  userId;

  locations:any=[
    {label:'All', value:'All',check:''},
    {label:'APAC',value:'APAC',check:''},
    {label:'USA',value:'USA',check:''},
    {label:'North America',value:'North America',check:''},
    {label:'South America',value:'South America',check:''},
    {label:'Africa',value:'Africa',check:''}
  ]
 
  roles:any=[
    {label:'All', value:'All',check:''},
    {label:'Approve',value:'ROLE_VENDOR_APPROVE',check:''},
    {label:'Upload',value:'ROLE_VENDOR_UPLOAD',check:''},   
    {label:'Read',value:'ROLE_VENDOR_READ',check:''},
    {label:'Add Users',value:'ROLE_VENDOR_ADD_USERS',check:''},
    {label:'Reports',value:'ROLE_VENDOR_REPORTS',check:''}
]
  departments:any=[
    {label:'All', value:'All',check:''},
    {label:'Administration',value:'Administration',check:''},
    {label:'Finance',value:'Finance',check:''},
    {label:'Management',value:'Management',check:''},
    {label:'Human Resource',value:'Human Resource',check:''},
    {label:'Marketing',value:'Marketing',check:''},
    {label:'Sales',value:'Sales',check:''}
  ]
 
  constructor(
    private formBuilder:UntypedFormBuilder,
    private httpService: HttpService,
    private toastrService: ToastrService,
    private modalService:NgbModal,
    private spinnerService: NgxSpinnerService,
    private route: ActivatedRoute,
    public validators:ValidatorsServiceService) { }

  userForm=this.formBuilder.group({
    firstName:["",[Validators.required,noSpecialCharAllow,Validators.minLength(2),Validators.maxLength(50),onlyCharacters,noExtraWhiteSpace]],
    email:["",[Validators.required,email,noExtraWhiteSpace,Validators.maxLength(80)]],
    mobileNumber:['',[Validators.required]],
    lastName:['',[Validators.required,noSpecialCharAllow,Validators.minLength(2),Validators.maxLength(50),onlyCharacters,noExtraWhiteSpace]],
    roles:this.formBuilder.array([]),
    departments:this.formBuilder.array([]),
    locations:this.formBuilder.array([]),
   
    })

  ngOnInit(): void {
    this.prepareUserForm();
    this.route.params.subscribe((res) => {      
      if (res.id) {
        this.editMode = true;
        this.onError(true);
        this.spinnerService.show();
        this.httpService.getData(PATH.GET_USER+'/user?id='+res.id).subscribe((res:any)=>{
        if(res.locations){
          res.locations.forEach(element => {
          
            this.editCheckBox(element,'location');
            });
            if(res.locations.length>=5){
              for(var i=0;i<this.locations.length;i++){
                if(this.locations[i].value=='All'){
                  this.locations[i].check=true;
                }
              }
            }
          }
          if(res.roles){
            res.roles.forEach(element => {
              this.editCheckBox(element,'roles');
            });
            if(res.roles.length>=5){
              for(var i=0;i<this.roles.length;i++){
                if(this.roles[i].value=='All'){
                  this.roles[i].check=true;
                }
              }
            }
          }
          if(res.departments){
            res.departments.forEach(element => {
              this.editCheckBox(element,'departments');
              });
              if(res.departments.length>=5){
                for(var i=0;i<this.departments.length;i++){
                  if(this.departments[i].value=='All'){
                    this.departments[i].check=true;
                  }
                }
              }
          }
          this.userId = res.email;
          this.userForm.patchValue(res);
          this.countryCode=res.countryCode;
          this.spinnerService.hide();
        })
        this.userForm.controls['email'].disable();
      }
      if (res.type) {
        this.type = res.type;
      }
    })
  }

  prepareUserForm(){
    }

  get f() {
    return this.userForm.controls;
  }

  editCheckBox(e,type) {
    if(type == 'location'){
    this.locations.forEach(element => {
     if(element.value == e){
       element.check = true;
     } 
      
    });
    const checkArray: UntypedFormArray = this.userForm.get('locations') as UntypedFormArray;
      checkArray.push(new UntypedFormControl(e));
  }
  
if(type == 'roles'){
  this.roles.forEach(element => {
    if(element.value == e){
      element.check = true;
     }  
   });
  const checkArray: UntypedFormArray = this.userForm.get('roles') as UntypedFormArray;
  checkArray.push(new UntypedFormControl(e));
  }

  if(type =='departments'){
    this.departments.forEach(element => {
      if(element.value == e){
        element.check = true;
       }  
     });
    const checkArray: UntypedFormArray = this.userForm.get('departments') as UntypedFormArray;
    checkArray.push(new UntypedFormControl(e));
   
  }
  }
  
  
  onLocationChange(e) {
    const checkArray: UntypedFormArray = this.userForm.get('locations') as UntypedFormArray;
    if (e.target.checked) {
      if(e.target.value=='All'){
        this.checkedAll('location');
        return
      }
      else{
        checkArray.push(new UntypedFormControl(e.target.value));
      }
      
    } 
    else {
      if(e.target.value=='All'){
        this.uncheckedAll('location');
      }
      else{
        let i: number = 0;
        checkArray.controls.forEach((item: UntypedFormControl) => {  
          if (item.value == e.target.value) {
            checkArray.removeAt(i);
            for(var j=0;j<this.locations.length;j++){
              if(this.locations[j].value=='All'){
                this.locations[j].check=false;
              }
            }
            return;
            
          }
          i++;
        });
      }
  
    }
  }
 
  onAccessChange(e){
    const checkArray: UntypedFormArray = this.userForm.get('roles') as UntypedFormArray;
    if (e.target.checked) {
      if(e.target.value=='All'){
        this.checkedAll('access');
      }
      else{
        checkArray.push(new UntypedFormControl(e.target.value));
      }
    } 
    else {
      if(e.target.value=='All'){
        this.uncheckedAll('access');
      }
      else{
        let i: number = 0;
        checkArray.controls.forEach((item: UntypedFormControl) => {  
          if (item.value == e.target.value) {
            checkArray.removeAt(i);
            for(var j=0;j<this.roles.length;j++){
              if(this.roles[j].value=='All'){
                this.roles[j].check=false;
              }
            }
            return;
            
          }
          i++;
        });
      }
  
    }
  
  }
  onDepartmentsChange(e){
    const checkArray: UntypedFormArray = this.userForm.get('departments') as UntypedFormArray;
    if (e.target.checked) {
      if(e.target.value=='All'){
        this.checkedAll('departments');
      }
      else{
        checkArray.push(new UntypedFormControl(e.target.value));
      }
    } 
    else {
      if(e.target.value=='All'){
        this.uncheckedAll('departments');
      }
      else{
        let i: number = 0;
        checkArray.controls.forEach((item: UntypedFormControl) => {  
          if (item.value == e.target.value) {
            checkArray.removeAt(i);
            for(var j=0;j<this.departments.length;j++){
              if(this.departments[j].value=='All'){
                this.departments[j].check=false;
              }
            }
            return;
            
          }
          i++;
        });
      }
  
    }
  }
  
  
  checkedAll(type){
    if(type=='location'){
      const checkArray: UntypedFormArray = this.userForm.get('locations') as UntypedFormArray;
      checkArray.controls=[];
      checkArray.setValue([]);
      for(var i=0;i<this.locations.length;i++){
        this.locations[i].check=true;
        if(this.locations[i].value!='All'){
          checkArray.push(new UntypedFormControl(this.locations[i].value));
        }
      }
    }
    if(type=='access'){
      const checkArray: UntypedFormArray = this.userForm.get('roles') as UntypedFormArray;
      checkArray.controls=[];
      checkArray.setValue([]);
      for(var i=0;i<this.roles.length;i++){
        if(this.roles[i].value!='All'){
        checkArray.push(new UntypedFormControl(this.roles[i].value));
        }
        this.roles[i].check=true;
      }
    }
    if(type=='departments'){
      const checkArray: UntypedFormArray = this.userForm.get('departments') as UntypedFormArray;
      checkArray.controls=[];
      checkArray.setValue([]);
      for(var i=0;i<this.departments.length;i++){
        if(this.departments[i].value!='All'){
        checkArray.push(new UntypedFormControl(this.departments[i].value));
        }
        this.departments[i].check=true;
      }
    }
   
  }
  uncheckedAll(type){
    if(type=='location'){
      const checkArray: UntypedFormArray = this.userForm.get('locations') as UntypedFormArray;
      checkArray.controls=[];
      checkArray.setValue([]);
      for(var i=0;i<this.locations.length;i++){
        this.locations[i].check=false;
      }
    }
    if(type=='access'){
      const checkArray: UntypedFormArray = this.userForm.get('roles') as UntypedFormArray;
      checkArray.controls=[];
      checkArray.setValue([]);
      for(var i=0;i<this.roles.length;i++){
        this.roles[i].check=false;
      }
    }
    if(type=='departments'){
      const checkArray: UntypedFormArray = this.userForm.get('departments') as UntypedFormArray;
      checkArray.controls=[];
      checkArray.setValue([]);
      for(var i=0;i<this.departments.length;i++){
        this.departments[i].check=false;
      }
    }
    
  }
  
  submit(){
    this.userForm.markAllAsTouched();
    if (this.userForm.invalid) {
      this.toastrService.error('Please fill all the required fields');
      return
    }
    if (this.userForm.value.locations.length==0) {
      this.toastrService.error('Please select at least one location');
      return
    }  
    if (this.userForm.value.roles.length==0) {
      this.toastrService.error('Please select at least one role');
      return
    }  
    if (this.userForm.value.departments.length==0) {
      this.toastrService.error('Please select at least one department');
      return
    } 
    if(!this.hasError){
      return
    }
    
    this.spinnerService.show();
    let payload = this.userForm.value;
    payload.countryCode=this.countryCode
    payload.email=payload.email.toLowerCase();
      if(this.type=='edit'){
        delete payload.email;
      }
      const req = this.editMode ? this.httpService.patchData(PATH.UPDATE_USER+'/user/'+this.userId, payload):
      this.httpService.postData(PATH.VENDOR_USER_MANAGEMENT, payload);
      req.subscribe((res) => {
        this.spinnerService.hide();
        this.openSuccessModel(); 
      },(err) => {
        this.spinnerService.hide();
        this.toastrService.error(err.message.message);
      })
  }

  openSuccessModel(){
    let modelRef=this.modalService.open(SuccessDialogComponent,{
      ariaLabelledBy: "modal-basic-title",
      windowClass: "center",
    })
    modelRef.componentInstance.type = 'addVendorUser';
    modelRef.componentInstance.message = 'User Created Successfully!';
    modelRef.componentInstance.message = 'User Updated Successfully!';
   }

  onError(obj) {
    this.hasError = obj;
  }

  onCountryChange(obj){
    this.countryCode = obj.iso2
  }

  numberOnly(event:any){   
    const regexpNumber = /[0-9]/;
    let inputCharacter = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !regexpNumber.test(inputCharacter)) {
      event.preventDefault();
    }
  }

  characterOnly(event:any){  
    const regexpNumber = /^([a-zA-Z]*)$/;
    let inputCharacter = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !regexpNumber.test(inputCharacter)) {
      event.preventDefault();
    }
  }

  cancelClick(){
    if(this.editMode){
      this.ngOnInit();
    }
    else{
      this.userForm.reset();
    }

  }

}

