import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-capture-share',
  templateUrl: './capture-share.component.html',
  styleUrls: ['./capture-share.component.scss']
})
export class CaptureShareComponent implements OnInit {

  constructor(private activeModal:NgbActiveModal) { }

  ngOnInit(): void {
  }
  
  close(){
    this.activeModal.close();
  }

}
