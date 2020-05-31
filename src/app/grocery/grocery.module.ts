import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { GroceryListComponent } from './grocery-list/grocery-list.component';
import { GroceryFormComponent } from './grocery-form/grocery-form.component';
import { IonicModule } from '@ionic/angular';
import { CoreModule } from '../core/core.module';
import { GrocerySelectListComponent } from './grocery-select-list/grocery-select-list.component';

const routes: Routes = [{
  path: '',
  component: GroceryListComponent
}, {
  path: 'create',
  component: GroceryFormComponent
}, {
  path: 'edit/:id',
  component: GroceryFormComponent
}];

@NgModule({
  entryComponents: [GrocerySelectListComponent],
  declarations: [GroceryListComponent, GroceryFormComponent, GrocerySelectListComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes), IonicModule.forRoot(), CoreModule
  ]
})
export class GroceryModule { }
