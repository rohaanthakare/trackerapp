import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelFormComponent } from './model-form/model-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [ModelFormComponent],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, IonicModule.forRoot()
  ],
  exports: [ModelFormComponent]
})
export class CoreModule { }
