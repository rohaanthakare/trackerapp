import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

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
              private router: Router, private toastCtrl: ToastController) { }

  ngOnInit() {}

  login() {
    if (this.loginForm.valid) {
      this.authService.authenticateUser(this.loginForm.value).subscribe(
        async (response: any) => {
          if (response.status) {
            this.router.navigate(['home']);
          } else {
            const msgBox = await this.toastCtrl.create({
              color: 'danger',
              duration: 2000,
              showCloseButton: true,
              message: response.message,
              position: 'top'
            });
            await msgBox.present();
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
