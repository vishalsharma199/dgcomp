import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ShippingDetailsComponent } from './shipping-details/shipping-details.component';
import { FormsModule } from '@angular/forms';
import {TableModule} from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {InputSwitchModule} from 'primeng/inputswitch';

import {InputTextareaModule} from 'primeng/inputtextarea';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ToastModule} from 'primeng/toast';
import { TableSettingComponent } from './table-setting/table-setting.component';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { OwnerListComponent } from './owner-list/owner-list.component';
import { DialogService } from 'primeng/dynamicdialog';
import { InviteNewOwnerComponent } from './invite-new-owner/invite-new-owner.component';
import { SharedModule } from '../shared-module/shared.module';
import { InputTextModule } from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import { ReasonForRejectionPopupComponent } from './reason-for-rejection-popup/reason-for-rejection-popup.component';
import {InputNumberModule} from 'primeng/inputnumber';

import { BulkInviteOwnerComponent } from './bulk-invite-owner/bulk-invite-owner.component';
import {TooltipModule} from 'primeng/tooltip';
import { SelfInvitedOwnerListComponent } from './self-invited-owner-list/self-invited-owner-list.component';
import { LazyLoadEvent } from 'primeng/api';
@NgModule({
  declarations: [
    AdminDashboardComponent,
    ShippingDetailsComponent,
    TableSettingComponent,
    OwnerListComponent,
    InviteNewOwnerComponent,
    ReasonForRejectionPopupComponent,
    BulkInviteOwnerComponent,
    SelfInvitedOwnerListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    // Ng2TelInputModule,
    AdminRoutingModule,
    TableModule,
    MultiSelectModule,
    DialogModule,
    ButtonModule,
    // NgbModule,
    ConfirmDialogModule,
    ToastModule,
    SharedModule,
    InputTextModule,
    InputSwitchModule,
    DropdownModule,
    InputTextareaModule,
    InputNumberModule,
    TooltipModule,
  ],
  providers: [MessageService,ConfirmationService,DialogService]
})
export class AdminModule { }
