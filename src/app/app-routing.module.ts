import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomePage } from './home/home.page';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
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
