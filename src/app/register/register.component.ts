import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective } from '@angular/forms';
import { HelperService } from '../services/helper.service';
import { NotificationService } from '../services/notification.service';
import { Roles } from '../global/global-contants';
import { UserStatus } from '../models/user.model';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  usernameCtrl = new FormControl('', [Validators.required]);
  passwordCtrl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  confirmPassCtrl = new FormControl('', [Validators.required]);
  emailCtrl = new FormControl('', [Validators.required, Validators.email]);
  mobileNoCtrl = new FormControl('', [Validators.required]);
  registrationForm = this.formBuilder.group({
    username: this.usernameCtrl,
    password: this.passwordCtrl,
    confirmPassword: this.confirmPassCtrl,
    emailId: this.emailCtrl,
    mobileNo: this.mobileNoCtrl
  }, {
    validator: this.helperService.mustMatchValidator('password', 'confirmPassword')
  });
  constructor(private formBuilder: FormBuilder, private helperService: HelperService, private notification: NotificationService,
              private userService: UserService, private router: Router) { }

  ngOnInit() {}

  register() {
    if (this.registrationForm.valid) {
      this.registrationForm.value.role = Roles.TRACKER_USER;
      this.registrationForm.value.status = UserStatus.NEW;
      this.userService.registerUser(this.registrationForm.value).subscribe(
        response => {
          this.notification.successNotification(response.message);
          this.registrationForm.reset();
          this.router.navigate([`activate-by-otp/${response.user.user._id}`]);
        },
        error => {
          const errorMsg = error.error ? error.error.message : error.statusText;
          this.notification.errorNotification(errorMsg);
        }
      );
    } else {
      this.notification.errorNotification('Form contains error, please remove errors.');
    }
  }
}
