import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MasterDataService } from '../services/master-data.service';
import { AuthService } from '../services/auth.service';
import { ModelFormComponent } from '../core/model-form/model-form.component';
import { UserService } from '../services/user.service';
import { HelperService } from '../services/helper.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('profileFormEle', {static: true}) profileFormCmp: ModelFormComponent;
  displayName: string;
  userId: any;
  personalDetailsFields = [];
  genderData = [];
  isGenderDataLoaded = false;
  usernameCtrl = new FormControl();
  firstNameCtrl = new FormControl();
  middleNameCtrl = new FormControl();
  lastNameCtrl = new FormControl();
  displayNameCtrl = new FormControl();
  dobCtrl = new FormControl();
  genderCtrl = new FormControl();
  mobileNoCtrl = new FormControl();
  emailCtrl = new FormControl();
  profileForm: FormGroup = this.formBuilder.group({
    username: this.usernameCtrl,
    firstName: this.firstNameCtrl,
    middleName: this.middleNameCtrl,
    lastName: this.lastNameCtrl,
    displayName: this.displayNameCtrl,
    dateOfBirth: this.dobCtrl,
    gender: this.genderCtrl,
    emailId: this.emailCtrl,
    mobileNo: this.mobileNoCtrl
  });
  constructor(private formBuilder: FormBuilder, private masterDataService: MasterDataService, private authService: AuthService,
              private userService: UserService, private helperService: HelperService, private notification: NotificationService) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.userId = this.authService.getCurrentUser()._id;
    this.displayName = this.helperService.getDisplayName(this.authService.getCurrentUser());
    this.masterDataService.getMasterDataForParent('GENDER').subscribe(
      (response: any) => {
        this.genderData = response.data;
        console.log('gender loader');
        console.log(this.genderData);
        this.isGenderDataLoaded = true;
        this.preRequisiteDataLoaded();
      }
    );
  }

  preRequisiteDataLoaded() {
    if (this.isGenderDataLoaded) {
      this.setPersonalDetailsFormFields();
      this.getUserProfile();
    }
  }

  getUserProfile() {
    this.userService.getUserProfile(this.userId).subscribe(
      (response: any) => {
        this.profileFormCmp.setValues(response.user);
      }
    );
  }

  setPersonalDetailsFormFields() {
    this.personalDetailsFields = [];
    this.personalDetailsFields.push({
      label: 'Username',
      name: 'username',
      type: 'text',
      control: this.usernameCtrl,
      controlName: 'username'
    });

    this.personalDetailsFields.push({
      label: 'Display Name',
      name: 'displayName',
      type: 'text',
      control: this.displayNameCtrl,
      controlName: 'displayName'
    });

    this.personalDetailsFields.push({
      label: 'First Name',
      name: 'firstName',
      type: 'text',
      control: this.firstNameCtrl,
      controlName: 'firstName'
    });

    this.personalDetailsFields.push({
      label: 'Last Name',
      name: 'lastName',
      type: 'text',
      control: this.lastNameCtrl,
      controlName: 'lastName'
    });

    this.personalDetailsFields.push({
      label: 'Date of Birth',
      name: 'dateOfBirth',
      type: 'date',
      control: this.dobCtrl,
      controlName: 'dateOfBirth'
    });
    this.personalDetailsFields.push({
      label: 'Gender',
      name: 'gender',
      type: 'select',
      dataSource: this.genderData,
      valueField: '_id',
      displayField: 'configName',
      control: this.genderCtrl,
      controlName: 'gender'
    });

    this.personalDetailsFields.push({
      label: 'Email',
      name: 'emailId',
      type: 'text',
      control: this.emailCtrl,
      controlName: 'emailId',
      disabled: true
    });

    this.personalDetailsFields.push({
      label: 'Mobile No.',
      name: 'mobileNo',
      type: 'number',
      control: this.mobileNoCtrl,
      controlName: 'mobileNo',
      disabled: true
    });
    this.profileFormCmp.setFormFields(this.personalDetailsFields);
  }

  saveProfile() {
    if (this.profileForm.valid) {
      this.profileForm.value.dateOfBirth = this.helperService.getUTCDate(new Date(this.profileForm.value.dateOfBirth));
      this.profileForm.value.gender = this.profileForm.value.gender._id;
      this.userService.updateUserProfile(this.userId, this.profileForm.value).subscribe(
        (response: any) => {
          this.notification.successNotification(response.message);
        },
        error => {
          const errorMsg = error.error ? error.error.message : error.statusText;
          this.notification.errorNotification(errorMsg);
        }
      );
    } else {
      this.notification.errorNotification('Form contains error, please correct.');
    }
  }

}
