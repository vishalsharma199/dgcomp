import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import {  DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PATH } from 'src/app/app.constant';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {

  inputData:any;
  disableBtn:boolean=false;
  pdfSrc = "";
  constructor(
    public ref: DynamicDialogRef,
    private dialogService: DynamicDialogConfig,
    private httpService: HttpService,
    private spinnerService: NgxSpinnerService
    ) { }

  ngOnInit(): void {
    this.inputData = this.dialogService.data;
    if(this.inputData.status=='Submitted'){
      this.disableBtn=true;
    }

    this.getPdfSource(this.inputData.fileName);
  }

  submit(){
    this.ref.close(this.inputData);
  }

  getPdfSource(filename){
    this.spinnerService.show();
    let type = this.checkDocumentType(filename);
      this.httpService.download(PATH.GET_UPLOADED_FILE+filename).subscribe((res)=>{
        var file = new Blob([res], {type: type});
        var fileURL = URL.createObjectURL(file);
        this.pdfSrc=fileURL;
        this.spinnerService.hide();
      },(err)=>{
        this.spinnerService.hide();
      })
  }

  checkDocumentType(filename){
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

}
