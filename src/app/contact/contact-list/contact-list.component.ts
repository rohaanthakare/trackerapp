import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContactService } from 'src/app/services/contact.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit {
  contacts = [];
  constructor(private router: Router, private contactService: ContactService, private helperService: HelperService) { }

  ngOnInit() {
    this.contactService.getUserContacts().subscribe(
      (response: any) => {
        this.contacts = this.formatData(response.data);
      }
    );
  }

  formatData(data) {
    data.forEach((d) => {
      d.firstName = this.helperService.convertToTitleCase(d.firstName);
      d.lastName = this.helperService.convertToTitleCase(d.lastName);
    });
    return data;
  }

  createContact() {
    this.router.navigate(['home/contact/create']);
  }

  itemClicked(item) {
    this.router.navigate([`home/contact/edit/${item._id}`]);
  }

}
