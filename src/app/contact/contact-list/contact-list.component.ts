import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ContactService } from 'src/app/services/contact.service';
import { HelperService } from 'src/app/services/helper.service';
import { SimpleListComponent } from 'src/app/core/simple-list/simple-list.component';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit {
  @ViewChild(SimpleListComponent, {static: true}) contactList: SimpleListComponent;
  contacts = [];
  constructor(private router: Router, private contactService: ContactService, private helperService: HelperService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.contactService.getUserContacts().subscribe(
      (response: any) => {
        this.contacts = this.formatData(response.data);
        this.contactList.loadListData(this.contacts);
      }
    );
  }

  formatData(data) {
    data.forEach((d) => {
      d.firstName = this.helperService.convertToTitleCase(d.firstName);
      d.lastName = this.helperService.convertToTitleCase(d.lastName);
      d.displayName = d.firstName + ' ' + d.lastName;
      d.groupField = d.firstName.charAt(0);
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
