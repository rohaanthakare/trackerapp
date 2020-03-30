import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [{
  path: '',
  children: [{
    path: '',
    component: ContactListComponent
  }, {
    path: 'create',
    component: ContactFormComponent
  }, {
    path: 'edit/:id',
    component: ContactFormComponent
  }]
}];

@NgModule({
  declarations: [ContactListComponent, ContactFormComponent],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild(routes), IonicModule.forRoot()
  ]
})
export class ContactModule { }
