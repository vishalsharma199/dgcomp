import { SealinkDetailsComponent } from './sealink-details/sealink-details.component';
import { CustomersRiskComponent } from './customers-risk/customers-risk.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InviteDigiCompComponent } from './invite-digi-comp/invite-digi-comp.component';
import { BulkInviteCustomerComponent } from './bulk-invite-customer/bulk-invite-customer.component';
import { InvitedVendorListComponent } from './invited-vendor-list/invited-vendor-list.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { CustomerCreatecontactComponent } from './customer-createcontact/customer-createcontact.component';
import { CreateCompanyitemsComponent } from './create-companyitems/create-companyitems.component';
import { CustomerSupplierCustomerinfoComponent } from './customer-supplier-customerinfo/customer-supplier-customerinfo.component';
import { AddUsermanagmentComponent } from './add-usermanagment/add-usermanagment.component';
import { CustomerSettingComponent } from './customer-setting/customer-setting.component';
import { ViewVendorComponent } from './view-vendor/view-vendor.component';
import { CustomerUploaddocumentComponent } from './customer-uploaddocument/customer-uploaddocument.component';
import { CustomerQuestionnaireComponent } from './customer-questionnaire/customer-questionnaire.component';
import { CustomerRegulationComponent } from './customer-regulation/customer-regulation.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { NewCompanySearchComponent } from './company-search/company-search.component';
import { BankDashboardComponent } from './bank-dashboard/bank-dashboard.component';
import { CustomerEsgComponent } from './customer-esg/customer-esg.component';
import { SeawayShippingComponent } from './seaway-shipping/seaway-shipping.component';
import { CustomerComplianceComponent } from './customer-compliance/customer-compliance.component';
const routes: Routes = [
   { path: '', redirectTo: 'customer', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'invite',
    component: InviteDigiCompComponent,
  },
  {
    path: 'invite/:type/:id',
    component: InviteDigiCompComponent,
  },
  {
    path: 'bulk-invite',
    component: BulkInviteCustomerComponent,
  },
  {
    path: 'invite-customer',
    component: InvitedVendorListComponent,
  },
  {
    path: 'customersrisk/:type',
    component: CustomersRiskComponent
  },
  {
    path: 'risk/:type',
    component: SealinkDetailsComponent
  }, 
  {
    path: 'user-management',
    component: UserManagementComponent
  },
    {
    path: 'create-contract',
    component: CustomerCreatecontactComponent
  },
  
  {
    path: 'supplier-customer-information',
    component: CustomerSupplierCustomerinfoComponent
  },
 
  {
    path: 'user/:type/:id',
    component: AddUsermanagmentComponent
  },


  {
    path: 'customer-setting',
    component: CustomerSettingComponent
  },  
  {
    path: 'view-vendor/:step/:filtertype',
    component: ViewVendorComponent
  },
  {
    path: 'new-companysearch',
    component: NewCompanySearchComponent
  }, {
    path: 'seaway-shipping/:id',
    component: SeawayShippingComponent
  },
  {
    path: 'search-result/:id',
    component: SearchResultComponent
  },
  {
    path: 'bank-dashboard/:id/:cisCompanyId',
    component: BankDashboardComponent
  },
  {
    path: 'customers-compliance/:type',
    component: CustomerComplianceComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
