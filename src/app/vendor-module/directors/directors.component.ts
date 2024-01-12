import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import {DialogService} from 'primeng/dynamicdialog';
import { PATH } from 'src/app/app.constant';
import { HttpService } from 'src/app/services/http.service';
@Component({
  selector: 'app-directors',
  templateUrl: './directors.component.html',
  styleUrls: ['./directors.component.scss']
})
export class DirectorsComponent implements OnInit {
  @Input() companyInfo:any;
  responsiveOptions;
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  order: any = 'desc';
  col: any = 'createdDate';
  locationheaders: Array<any>;
  shareholderheader: Array<any>;
  numberOfElements:any;

  constructor(public dialogService:DialogService,
    private httpService: HttpService,
    private spinnerService: NgxSpinnerService) { 
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '768px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
  ];
  }

  ngOnInit(): void {
    this.prepareHeader();
    this.prepareShareHolder();
  }


  locationData: Array<any> = [
    {directorsName: 'Mohit Kapoor'},
    {directorsName: 'Sandeep Rana'},
    {directorsName: 'Ravi Arora'},
    {directorsName: 'Vijay Hooda'},
    {directorsName: 'Lalit Gupta'},
  ];


    prepareHeader(){
      this.locationheaders = [
        { name: 'directorsName', header: 'Directors Name', sort: false,isAsc:false},
        { name: 'identificationProof', header: 'Identification Proof', sort: false,isAsc:false},
        { name: 'addressProof', header: 'Address Proof', sort: false,isAsc:false},
      ];
    }

  shareholderdata: Array<any> = [
    {shareHolderName: 'Mohit Kapoor', percentage:'52%' },
    {shareHolderName: 'Sandeep Rana', percentage:'52%' },
    {shareHolderName: 'Ravi Arora', percentage:'52%' },
    {shareHolderName: 'Vijay Hooda', percentage:'52%' },
    {shareHolderName: 'Lalit Gupta', percentage:'52%' },
  ];


    prepareShareHolder(){
      this.shareholderheader = [
        { name: 'shareHolderName', header: ' Shareholder Name', sort: false,isAsc:false},
        { name: 'percentage', header: ' Percentage', sort: false,isAsc:false},
        { name: 'identificationProopercentage', header: 'Identification Proof', sort: false,isAsc:false},
        { name: 'addressProof', header: 'Address Proof', sort: false,isAsc:false},
      ];
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


}
