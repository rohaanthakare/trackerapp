import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { PasswordService } from 'src/app/services/password.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss'],
})
export class PasswordFormComponent implements OnInit {
  passwordId: any;
  passwordDetail: any;
  formTitle = 'Create Password';
  showPassword = false;
  nameCtrl = new FormControl('', Validators.required);
  usernameCtrl = new FormControl();
  siteLinkCtrl = new FormControl();
  passwordCtrl = new FormControl('', [Validators.required]);
  passwordForm: FormGroup = this.formBuilder.group({
    name: this.nameCtrl,
    username: this.usernameCtrl,
    siteLink: this.siteLinkCtrl,
    password: this.passwordCtrl
  });
  constructor(private formBuilder: FormBuilder, private passwordService: PasswordService, private router: Router,
              private route: ActivatedRoute, private notification: NotificationService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      params => {
        this.passwordId = params.get('id');
        if (this.passwordId) {
          this.getPasswordDetails();
        }
      }
    );
  }

  getPasswordDetails() {
    this.passwordService.getPasswordDetail(this.passwordId).subscribe(
      (response: any) => {
        this.passwordDetail = response.password;
        console.log(this.passwordDetail);
        this.nameCtrl.setValue(this.passwordDetail.name);
        this.usernameCtrl.setValue(this.passwordDetail.username);
        this.siteLinkCtrl.setValue(this.passwordDetail.siteLink);
        this.passwordCtrl.setValue(this.passwordDetail.password);
        this.formTitle = this.passwordDetail.name;
      }
    );
  }

  savePassword() {
    if (this.passwordForm.valid) {
      if (this.passwordId) {

      } else {
        this.passwordService.createPassword(this.passwordForm.value).subscribe(
          (response: any) => {
            this.notification.successNotification(response.message);
            this.router.navigate(['home/password']);
          },
          error => {
            this.notification.errorNotification('Error while updating password, please try again');
          }
        );
      }
    } else {
      this.notification.errorNotification('Form contains error please correct.');
    }
  }

  revealPassword() {
    this.showPassword = (this.showPassword) ? false : true;
  }
}
