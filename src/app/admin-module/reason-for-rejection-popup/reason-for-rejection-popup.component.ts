import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { ValidatorsServiceService } from 'src/app/services/validators-service.service';
@Component({
  selector: 'app-reason-for-rejection-popup',
  templateUrl: './reason-for-rejection-popup.component.html',
  styleUrls: ['./reason-for-rejection-popup.component.scss']
})
export class ReasonForRejectionPopupComponent implements OnInit {

  formSubmitAttempt: boolean = false


  public instructionForm = this.formbuilder.group({

    message: ['', Validators.required],

  })
  get f() {
    return this.instructionForm.controls
  }
  postData() {
    this.formSubmitAttempt = true
    if (this.instructionForm.invalid) {
      return;
    } else {
  
      this.formSubmitAttempt = false;
      this.instructionForm.reset();
    }
  }

  constructor(private formbuilder: UntypedFormBuilder, public ref: DynamicDialogRef,
     public dialogService: DialogService, public validators:ValidatorsServiceService) {

  }
  ngOnInit(): void {
  }
  close() {
    this.ref.destroy();
    this.formSubmitAttempt = false;
    this.instructionForm.reset();
  }

}
