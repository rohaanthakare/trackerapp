import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  usernameCtrl = new FormControl('', [Validators.required]);
  passwordCtrl = new FormControl('', [Validators.required]);
  loginForm = this.formBuilder.group({
    username: this.usernameCtrl,
    password: this.passwordCtrl
  });
  constructor(private formBuilder: FormBuilder, private authService: AuthService,
              private router: Router) { }

  ngOnInit() {}

  login() {
    if (this.loginForm.valid) {
      this.authService.authenticateUser(this.loginForm.value).subscribe(
        (response: any) => {
          if (response.status) {
            this.router.navigate(['home']);
          } else {
            // this.messageService.showErrorMessage(response.message, 'center', 'top');
          }
        },
        error => {
          const errorMsg = (error.error) ? error.error : error.statusText;
          // this.messageService.showErrorMessage(errorMsg, 'center', 'top');
        }
      );
    }
  }
}
