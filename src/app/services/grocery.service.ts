import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroceryService {

  constructor(private http: HttpClient) { }

  getGroceryItems() {
    return this.http.get(`${environment.baseUrl}/api/grocery_items`);
  }

  public createGroceryItem(itemDetails) {
    return this.http.post(`${environment.baseUrl}/api/grocery_item`, itemDetails);
  }

  public getGroceryItemDetails(itemId) {
    return this.http.get(`${environment.baseUrl}/api/grocery_item/${itemId}`);
  }

  updateGroceryItem(itemId, itemDetails) {
    return this.http.put(`${environment.baseUrl}/api/grocery_item/${itemId}`, itemDetails);
  }

  deleteGroceryItem(itemId) {
    return this.http.delete(`${environment.baseUrl}/api/grocery_item/${itemId}`);
  }

  getOutOfStockItems() {
    return this.http.get(`${environment.baseUrl}/api/out_of_stock_items`);
  }

  sendGroceryItemsList() {
    return this.http.get(`${environment.baseUrl}/api/send_grocery_list`);
  }

  refillGrocery(items) {
    return this.http.put(`${environment.baseUrl}/api/refill_grocery`, items);
  }

  consumeGrocery(items) {
    return this.http.put(`${environment.baseUrl}/api/consume_grocery`, items);
  }

  shareGroceryList(contactId) {
    return this.http.get(`${environment.baseUrl}/api/share_grocery_list/${contactId}`);
  }
}
