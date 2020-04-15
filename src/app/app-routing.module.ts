import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomePage } from './home/home.page';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { ActivateComponent } from './activate/activate.component';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'activate-by-otp/:id', component: ActivateComponent},
  {
    path: 'home',
    component: HomePage,
    children: [{
      path: '',
      component: DashboardComponent
    }, {
      path: 'dashboard',
      component: DashboardComponent
    }, {
      path: 'password',
      loadChildren: () => import('./password/password.module').then( m => m.PasswordModule)
    }, {
      path: 'contact',
      loadChildren: () => import('./contact/contact.module').then( m => m.ContactModule)
    }, {
      path: 'finance',
      loadChildren: () => import('./finance/finance.module').then( m => m.FinanceModule)
    }]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
