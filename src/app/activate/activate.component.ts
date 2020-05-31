import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { UserService } from '../services/user.service';
import { NotificationService } from '../services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss'],
})
export class ActivateComponent implements OnInit {
  activationForm: FormGroup = this.formBuilder.group({
    key1: new FormControl(),
    key2: new FormControl(),
    key3: new FormControl(),
    key4: new FormControl(),
    key5: new FormControl(),
    key6: new FormControl()
  });
  userId: any;
  constructor(private formBuilder: FormBuilder, private userService: UserService, private notification: NotificationService,
              private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.route.paramMap.subscribe(
      params => {
        this.userId = params.get('id');
        if (!this.userId) {
          this.router.navigate(['']);
        }
      }
    );
  }

  moveFocus(nextElement) {
    nextElement.setFocus();
  }

  activate() {
    if (this.activationForm.valid) {
      let userOtp = '';
      for (const key in this.activationForm.value) {
        if (key) {
          userOtp += this.activationForm.value[key];
        }
      }

      this.userService.activateUserByOtp(this.userId, parseInt(userOtp, null)).subscribe(
        response => {
          this.notification.successNotification(response.message);
          this.activationForm.reset();
          this.router.navigate(['login']);
        },
        error => {
          const errorMsg = error.error ? error.error.message : error.statusText;
          this.notification.errorNotification(errorMsg);
          this.activationForm.reset();
        }
      );
    } else {
      this.notification.successNotification('Please enter OTP');
    }
  }
}
