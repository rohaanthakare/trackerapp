import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  module = 'Contact';
  constructor(private http: HttpClient) { }

  getUserContacts(filterParams?, startIndex?, pageSize?) {
    return this.http.get(`${environment.baseUrl}/api/get_user_contacts`, {
      params: {
        start: startIndex,
        limit: pageSize
      }
    });
  }

  getUserSettlements() {
    return this.http.get(`${environment.baseUrl}/api/get_user_settlements`);
  }

  getContactDetail(conatctId) {
    return this.http.get(`${environment.baseUrl}/api/get_contact_detail/${conatctId}`);
  }

  createUserContact(contactDetails) {
    return this.http.post(`${environment.baseUrl}/api/create_contact`, contactDetails);
  }

  updateUserContact(contactId, contactDetails) {
    return this.http.put(`${environment.baseUrl}/api/update_contact/${contactId}`, contactDetails);
  }
}
