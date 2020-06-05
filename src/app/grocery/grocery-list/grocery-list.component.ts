import { Component, OnInit, ViewChild } from '@angular/core';
import { GroceryService } from 'src/app/services/grocery.service';
import { HelperService } from 'src/app/services/helper.service';
import { SimpleListComponent } from 'src/app/core/simple-list/simple-list.component';
import { ModalController, IonSelect } from '@ionic/angular';
import { GrocerySelectListComponent } from '../grocery-select-list/grocery-select-list.component';
import { NotificationService } from 'src/app/services/notification.service';
import { async } from '@angular/core/testing';
import { ContactService } from 'src/app/services/contact.service';
import { ContactListComponent } from 'src/app/contact/contact-list/contact-list.component';

@Component({
  selector: 'app-grocery-list',
  templateUrl: './grocery-list.component.html',
  styleUrls: ['./grocery-list.component.scss'],
})
export class GroceryListComponent implements OnInit {
  @ViewChild(SimpleListComponent, {static: true}) listCmp: SimpleListComponent;
  @ViewChild('contactSelect', {static: true}) contactSelect: IonSelect;
  contacts = [];
  groceryItems = [];
  constructor(private groceryService: GroceryService, private helperService: HelperService, private modalController: ModalController,
              private notification: NotificationService, private contactService: ContactService) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.contactService.getUserContacts().subscribe(
      (response: any) => {
        console.log(response);
        this.contacts = this.formatContactData(response.data);
      }
    );
    this.getAllGroceryItems();
  }

  getAllGroceryItems() {
    this.groceryItems = [];
    this.groceryService.getGroceryItems().subscribe(
      (response: any) => {
        console.log(response);
        this.groceryItems = this.formatData(response.groceries);
        this.listCmp.loadListData(this.groceryItems);
      }
    );
  }

  formatData(data) {
    data.forEach((d) => {
      d.name = this.helperService.convertToTitleCase(d.name);
      if (d.isOutOfStock) {
        d.noteText = 'Out of Stock';
        d.noteColor = 'danger';
      } else {
        d.noteText = 'In Stock';
        d.noteColor = 'success';
      }
    });
    return data;
  }

  formatContactData(data) {
    data.forEach((d) => {
      d.firstName = this.helperService.convertToTitleCase(d.firstName);
      d.lastName = this.helperService.convertToTitleCase(d.lastName);
      d.name = d.firstName + ' ' + d.lastName;
    });
    return data;
  }

  async onCustomButtonClicked(button) {
    switch (button.viewCode) {
      case 'GROCERY_REMOVE_FROM_STOCK': {
        const inStockItems = this.groceryItems.filter((i) => !i.isOutOfStock);
        const modal = await this.modalController.create({
          component: GrocerySelectListComponent,
          componentProps: {
            items: inStockItems,
            actionName: 'Remove from Stock',
            listTitle: 'Grocery List'
          }
        });
        modal.onDidDismiss().then((data: any) => {
          const itemIds = [];
          data.data.forEach((d) => {
            itemIds.push(d._id);
          });

          this.groceryService.consumeGrocery(itemIds).subscribe(
            (response: any) => {
              this.notification.successNotification(response.message);
              // this.getAllGroceryItems();
              this.listCmp.loadListData([]);
            }
          );
        });
        await modal.present();
        break;
      }

      case 'GROCERY_ADD_TO_STOCK': {
        const outOfStockItems = this.groceryItems.filter((i) => i.isOutOfStock);
        const modal = await this.modalController.create({
          component: GrocerySelectListComponent,
          componentProps: {
            items: outOfStockItems,
            actionName: 'Add to Stock',
            listTitle: 'Grocery List'
          }
        });
        modal.onDidDismiss().then((data: any) => {
          const itemIds = [];
          data.data.forEach((d) => {
            itemIds.push(d._id);
          });

          this.groceryService.refillGrocery(itemIds).subscribe(
            (response: any) => {
              this.notification.successNotification(response.message);
              // this.getAllGroceryItems();
            }
          );
        });
        await modal.present();
        break;
      }

      case 'GROCERY_GET_MY_LIST': {
        this.groceryService.getOutOfStockItems().subscribe(
          async (response: any) => {
            console.log(response);
            const oosGrocery = this.formatData(response.groceries);
            const modal = await this.modalController.create({
              component: GrocerySelectListComponent,
              componentProps: {
                items: oosGrocery,
                actionName: 'Send Me',
                listTitle: 'Grocery List',
                simpleList: true
              }
            });
            modal.onDidDismiss().then((data: any) => {
              this.groceryService.sendGroceryItemsList().subscribe(
                (res: any) => {
                  this.notification.successNotification(res.messsage);
                }
              );
            });
            await modal.present();
          }
        );
        break;
      }

      case 'GROCERY_SHARE_LIST': {
        this.contactSelect.open();
        break;
      }
    }
  }

  shareGroceryList() {
    this.groceryService.shareGroceryList(this.contactSelect.value).subscribe(
      (response: any) => {
        this.notification.successNotification(response.message);
      }
    );
  }

}
