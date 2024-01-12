import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import {TabViewModule} from 'primeng/tabview';
import { InviteDigiCompComponent } from './invite-digi-comp/invite-digi-comp.component';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {RadioButtonModule} from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { NgCircleProgressModule } from 'ng-circle-progress';
// import {ChartModule} from 'primeng/chart';
import { BulkInviteCustomerComponent } from './bulk-invite-customer/bulk-invite-customer.component';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CustomersRiskComponent } from './customers-risk/customers-risk.component';
import { SealinkDetailsComponent } from './sealink-details/sealink-details.component';
import { CapacityModalComponent } from './capacity-modal/capacity-modal.component';
import { CaptureShareComponent } from './capture-share/capture-share.component';
import { HttpClientModule } from '@angular/common/http';
import {  ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared-module/shared.module';
// import { CompanysearchComponent } from './companysearch/companysearch.component';
import {CheckboxModule} from 'primeng/checkbox';
import { InvitedVendorListComponent } from './invited-vendor-list/invited-vendor-list.component';
import { DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import {InputSwitchModule} from 'primeng/inputswitch';
import { CustomerRoutingModule } from './customer-routing.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { CustomerCreatecontactComponent } from './customer-createcontact/customer-createcontact.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {StepsModule} from 'primeng/steps';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';
import { CreateCompanyitemsComponent } from './create-companyitems/create-companyitems.component';
import { CustomerSupplierCustomerinfoComponent } from './customer-supplier-customerinfo/customer-supplier-customerinfo.component';
import { AddUsermanagmentComponent } from './add-usermanagment/add-usermanagment.component';
import { CustomerSettingComponent } from './customer-setting/customer-setting.component';
import { InformationsComponent } from './informations/informations.component';
import { SurveyComponent } from './survey/survey.component';
import { InviteSurveyComponent } from './invite-survey/invite-survey.component';
import { CustomiseComponent } from './customise/customise.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { NewQuestionnaireComponent } from './new-questionnaire/new-questionnaire.component';
import { VendorEsgComponent } from './vendor-esg/vendor-esg.component';
import { NewEsgPopupComponent } from './new-esg-popup/new-esg-popup.component';
import { RegulationsComponent } from './regulations/regulations.component';
import { CurrenciesComponent } from './currencies/currencies.component';
import { ServicesComponent } from './services/services.component';
import { ServicemodalComponent } from './servicemodal/servicemodal.component';
import { LocationsComponent } from './locations/locations.component';
import { ViewVendorComponent } from './view-vendor/view-vendor.component';
import { CustomerCompanyinformationComponent } from './customer-companyinformation/customer-companyinformation.component';
import { CustomerUploaddocumentComponent } from './customer-uploaddocument/customer-uploaddocument.component';
import { CustomerQuestionnaireComponent } from './customer-questionnaire/customer-questionnaire.component';
import { CustomerRegulationComponent } from './customer-regulation/customer-regulation.component';
import { NewCompanySearchComponent } from './company-search/company-search.component';

import { SearchResultComponent } from './search-result/search-result.component';
import { BankDashboardComponent } from './bank-dashboard/bank-dashboard.component';
import {DialogModule} from 'primeng/dialog';
import { BankComplianceComponent } from './bank-compliance/bank-compliance.component';
import { BankDirectorComponent } from './bank-director/bank-director.component';
import { BankFinancialComponent } from './bank-financial/bank-financial.component';
import { BankEsgComponent } from './bank-esg/bank-esg.component';

import { BankDirectorPopupComponent } from './bank-director-popup/bank-director-popup.component';
import { CustomerEsgComponent } from './customer-esg/customer-esg.component';
import {InputNumberModule} from 'primeng/inputnumber';
import { CustomerRfiComponent } from './customer-rfi/customer-rfi.component';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { SeawayShippingComponent } from './seaway-shipping/seaway-shipping.component';
import { SeekInformationComponent } from './seek-information/seek-information.component';
import { CustomerComplianceComponent } from './customer-compliance/customer-compliance.component';
import {CarouselModule} from 'primeng/carousel';
import { AddToDashboardComponent } from './add-to-dashboard/add-to-dashboard.component';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
@NgModule({
  declarations: [
    DashboardComponent,
    InviteDigiCompComponent,
    BulkInviteCustomerComponent,
    CustomersRiskComponent,
    SealinkDetailsComponent,
    CapacityModalComponent,
    CaptureShareComponent,
    UserManagementComponent,
    InvitedVendorListComponent,
    CustomerCreatecontactComponent,
    CreateCompanyitemsComponent,
    CustomerSupplierCustomerinfoComponent,
    AddUsermanagmentComponent,
    CustomerSettingComponent,
    InformationsComponent,
    SurveyComponent,
    InviteSurveyComponent,
    CustomiseComponent,
    QuestionnaireComponent,
    NewQuestionnaireComponent,
    VendorEsgComponent,
    NewEsgPopupComponent,
    RegulationsComponent,
    CurrenciesComponent,
    ServicesComponent,
    ServicemodalComponent,
    LocationsComponent,
    ViewVendorComponent,
    CustomerCompanyinformationComponent,
    CustomerUploaddocumentComponent,
    CustomerQuestionnaireComponent,
    CustomerRegulationComponent,
    NewCompanySearchComponent,
    SearchResultComponent,
    BankDashboardComponent,
    BankComplianceComponent,
    BankDirectorComponent,
    BankFinancialComponent,
    BankEsgComponent,
    BankDirectorPopupComponent,
    CustomerEsgComponent,
    CustomerRfiComponent,
    SeawayShippingComponent,
    SeekInformationComponent,
    CustomerComplianceComponent,
    AddToDashboardComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    FormsModule,
    TabViewModule,
    InputTextModule,
    InputTextareaModule,
    RadioButtonModule,
    // NgCircleProgressModule.forRoot(),
    // ChartModule,
    ConfirmDialogModule,
    ToastModule,
    TableModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,
    CheckboxModule,
    InputSwitchModule,
    StepsModule,
    // NgbModule,
    DropdownModule,
    CalendarModule,
    DialogModule,
    // Ng2TelInputModule,
    InputNumberModule,
    DynamicDialogModule,
    MultiSelectModule,
    CarouselModule,
    NgxEchartsModule.forRoot({
      echarts
    })
  ],
  providers: [MessageService,ConfirmationService,DialogService]
})
export class CustomerModule { }
