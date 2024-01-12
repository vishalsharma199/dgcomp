import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ShippingDetailsComponent } from './shipping-details/shipping-details.component';
import { OwnerListComponent } from './owner-list/owner-list.component';
import { InviteNewOwnerComponent } from './invite-new-owner/invite-new-owner.component';
import { BulkInviteOwnerComponent } from './bulk-invite-owner/bulk-invite-owner.component';
import { SelfInvitedOwnerListComponent } from './self-invited-owner-list/self-invited-owner-list.component';
const routes: Routes = [
  { path: '', redirectTo: 'admin', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
  },
  {
    path: 'shippingdetails/:id',
    component: ShippingDetailsComponent,
  },
  {
    path:"owner-list",
    component:OwnerListComponent,
  },
  {
    path:"invite-owner",
    component:InviteNewOwnerComponent,
  },
  {
    path:"owner/:type/:id/:filtertype",
    component:InviteNewOwnerComponent,
  },
  {
    path:"bulk-invite",
    component:BulkInviteOwnerComponent,
  },
  {
    path:"self-invited-owners",
    component:SelfInvitedOwnerListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
