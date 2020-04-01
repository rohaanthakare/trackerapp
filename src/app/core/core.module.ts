import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelFormComponent } from './model-form/model-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AvatarListComponent } from './avatar-list/avatar-list.component';
import { SimpleListComponent } from './simple-list/simple-list.component';

@NgModule({
  declarations: [ModelFormComponent, AvatarListComponent, SimpleListComponent],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, IonicModule.forRoot()
  ],
  exports: [ModelFormComponent]
})
export class CoreModule { }
