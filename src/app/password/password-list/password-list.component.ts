import { Component, OnInit } from '@angular/core';
import { PasswordService } from 'src/app/services/password.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-list',
  templateUrl: './password-list.component.html',
  styleUrls: ['./password-list.component.scss'],
})
export class PasswordListComponent implements OnInit {
  passwords = [];
  constructor(private passwordService: PasswordService, private router: Router) { }

  ngOnInit() {
    this.passwordService.getAllPasswords(undefined, 0, 5).subscribe(
      (response: any) => {
        this.passwords = response.data;
      }
    );
  }

  createPassword() {
    this.router.navigate(['home/password/create']);
  }

  itemClicked(item) {
    this.router.navigate([`home/password/edit/${item._id}`]);
  }
}
