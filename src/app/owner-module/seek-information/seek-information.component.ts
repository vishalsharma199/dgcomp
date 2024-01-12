import { Component, Input, OnInit,Output,EventEmitter } from '@angular/core';


@Component({
  selector: 'app-seek-information',
  templateUrl: './seek-information.component.html',
  styleUrls: ['./seek-information.component.scss']
})
export class SeekInformationComponent implements OnInit {
  @Input() type;
  @Input() message;
  dialogFor:string;
  @Output() sendData: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
    this.dialogFor = this.type;
  }

  financeData(data){
    this.sendData.emit(data);
   }
}
