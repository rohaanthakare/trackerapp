import { Component, OnInit } from '@angular/core';
import { FinanceService } from 'src/app/services/finance.service';
import { HelperService } from 'src/app/services/helper.service';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
})
export class AccountListComponent implements OnInit {
  accounts = [];
  constructor(private financeService: FinanceService, private cp: CurrencyPipe, private router: Router) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.financeService.getFinancialAccounts().subscribe(
      (response: any) => {
        this.accounts = this.formatData(response.data);
      }
    );
  }

  formatData(data) {
    data.forEach((d) => {
      d.balance = this.cp.transform(d.balance, 'INR', '');
    });
    return data;
  }

  createAccount() {
    this.router.navigate(['home/finance/create-account']);
  }

  itemClicked(account) {
    this.router.navigate([`home/finance/edit-account/${account._id}`]);
  }
}
