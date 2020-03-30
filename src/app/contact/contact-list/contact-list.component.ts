import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
})
export class ContactListComponent implements OnInit {
  contacts = [];
  constructor(private router: Router) { }

  ngOnInit() {}

  createContact() {
    this.router.navigate(['home/contact/create']);
  }

}
