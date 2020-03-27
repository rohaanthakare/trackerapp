import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PasswordListComponent } from './password-list/password-list.component';
import { IonicModule } from '@ionic/angular';
import { PasswordFormComponent } from './password-form/password-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


const routes: Routes = [{
  path: '',
  children: [{
    path: '',
    component: PasswordListComponent
  }, {
    path: 'create',
    component: PasswordFormComponent
  }, {
    path: 'edit/:id',
    component: PasswordFormComponent
  }]
}];

@NgModule({
  declarations: [PasswordListComponent, PasswordFormComponent],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild(routes), IonicModule.forRoot()
  ]
})
export class PasswordModule { }
