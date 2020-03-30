import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent implements OnInit {
  formTitle = 'New Contact';
  fieldConfigs = [];
  firstNameCtrl = new FormControl('');
  lastNameCtrl = new FormControl('');
  mobileNoCtrl = new FormControl('');
  contactForm: FormGroup = this.formBuilder.group({
    firstName: this.firstNameCtrl,
    lastName: this.lastNameCtrl,
    mobileNo: this.mobileNoCtrl
  });
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.preReqDataLoaded();
  }

  preReqDataLoaded() {
    this.setFieldConfigs();
  }

  setFieldConfigs() {
    this.fieldConfigs = [];
    this.fieldConfigs.push({
      label: 'First Name',
      name: 'firstName',
      type: 'text',
      control: this.firstNameCtrl
    });
    this.fieldConfigs.push({
      label: 'Last Name',
      name: 'lastName',
      type: 'text',
      control: this.firstNameCtrl
    });
    this.fieldConfigs.push({
      label: 'Mobile No.',
      name: 'mobileNo',
      type: 'number',
      control: this.mobileNoCtrl
    });
  }
}
