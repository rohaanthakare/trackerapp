import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MasterDataService } from 'src/app/services/master-data.service';
import { ContactService } from 'src/app/services/contact.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModelFormComponent } from 'src/app/core/model-form/model-form.component';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent implements OnInit {
  formTitle = 'New Contact';
  contactId: any;
  fieldConfigs = [];
  @ViewChild('contactForm1', {static: true}) modelForm: ModelFormComponent;
  titles = [];
  isTitleLoaded = false;
  selectedTitle: any;
  titleCtrl = new FormControl('');
  firstNameCtrl = new FormControl('');
  lastNameCtrl = new FormControl('');
  mobileNoCtrl = new FormControl('');
  emailCtrl = new FormControl('');
  contactForm: FormGroup = this.formBuilder.group({
    title: this.titleCtrl,
    firstName: this.firstNameCtrl,
    lastName: this.lastNameCtrl,
    mobileNo: this.mobileNoCtrl,
    email: this.emailCtrl
  });
  constructor(private formBuilder: FormBuilder, private masterDataService: MasterDataService, private contactService: ContactService,
              private notificationService: NotificationService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.masterDataService.getMasterDataForParent('TITLE').subscribe(
      (response: any) => {
        this.titles = response.data;
        this.isTitleLoaded = true;
        this.preReqDataLoaded();
      }
    );
    this.route.paramMap.subscribe(
      params => {
        this.contactId = params.get('id');
        if (this.contactId) {
          this.getContactDetails();
        }
      }
    );
  }

  getContactDetails() {
    this.contactService.getContactDetail(this.contactId).subscribe(
      (response: any) => {
        this.modelForm.setValues(response.contact);
      }
    );
  }
  preReqDataLoaded() {
    if (this.isTitleLoaded) {
      this.setFieldConfigs();
    }
  }

  setFieldConfigs() {
    this.fieldConfigs = [];
    this.fieldConfigs.push({
      label: 'Title',
      name: 'title',
      type: 'select',
      control: this.titleCtrl,
      dataSource: this.titles,
      displayField: 'configName',
      valueField: '_id'
    });
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
      control: this.lastNameCtrl
    });
    this.fieldConfigs.push({
      label: 'Mobile No.',
      name: 'mobileNo',
      type: 'tel',
      control: this.mobileNoCtrl
    });
    this.fieldConfigs.push({
      label: 'Email',
      name: 'email',
      type: 'email',
      control: this.emailCtrl
    });

    this.modelForm.setFormFields(this.fieldConfigs);
  }

  saveContact() {
    if (this.contactForm.valid) {
      if (this.contactId) {
        this.contactService.updateUserContact(this.contactId, this.contactForm.value).subscribe(
          (response: any) => {
            this.notificationService.successNotification(response.message);
            this.router.navigate(['home/contact']);
          },
          error => {
            const errorMsg = error.error ? error.error.message : error.statusText;
            this.notificationService.errorNotification(errorMsg);
          }
        );
      } else {
        this.contactService.createUserContact(this.contactForm.value).subscribe(
          (response: any) => {
            this.notificationService.successNotification(response.message);
            this.contactForm.reset();
            this.router.navigate(['home/contact']);
          },
          error => {
            const errorMsg = error.error ? error.error.message : error.statusText;
            this.notificationService.errorNotification(errorMsg);
          }
        );
      }
    }
  }
}
