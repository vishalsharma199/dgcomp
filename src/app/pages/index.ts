import { IndexComponent } from './index/index.component';
import { InviteEmailComponent } from './invite-email/invite-email.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { BlockcopypasteDirective } from './blockcopypaste.directive';


export const corePages = [
  LoginComponent,
  RegistrationComponent,
  IndexComponent,
  InviteEmailComponent,
  BlockcopypasteDirective
];

export * from './login/login.component';
export * from './registration/registration.component';
export * from './blockcopypaste.directive';
