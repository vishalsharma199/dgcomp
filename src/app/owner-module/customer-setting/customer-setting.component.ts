import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-setting',
  templateUrl: './customer-setting.component.html',
  styleUrls: ['./customer-setting.component.scss']
})
export class CustomerSettingComponent implements OnInit {
  index=0;
  constructor() { }

  ngOnInit(): void {
  }

  getCustomise(itm){    
    if(itm.index==2){
      this.index=itm;
    }
  }

}
