import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelFormComponent } from './model-form/model-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AvatarListComponent } from './avatar-list/avatar-list.component';
import { SimpleListComponent } from './simple-list/simple-list.component';
import { ActionListComponent } from './action-list/action-list.component';
import { SelectListComponent } from './select-list/select-list.component';

@NgModule({
  entryComponents: [ActionListComponent],
  declarations: [ModelFormComponent, AvatarListComponent, SimpleListComponent, ActionListComponent, SelectListComponent],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, IonicModule.forRoot()
  ],
  exports: [ModelFormComponent, SimpleListComponent, SelectListComponent]
})
export class CoreModule { }
