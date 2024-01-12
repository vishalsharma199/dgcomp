import { Component, OnInit,Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-table-setting',
  templateUrl: './table-setting.component.html',
  styleUrls: ['./table-setting.component.scss']
})
export class TableSettingComponent implements OnInit {
  @Input() type:any;
  isRating:boolean=false;
  isTableSetting:boolean=false;
  constructor(private modal:NgbActiveModal) { }

  ngOnInit(): void {
    this.type=='rating'?this.isRating=true:this.isTableSetting=true;
  }

  close(){
    this.modal.dismiss();
  }

}
