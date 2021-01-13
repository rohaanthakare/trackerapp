import { Component, OnInit } from '@angular/core';
import { FinanceService } from 'src/app/services/finance.service';
import { environment } from 'src/environments/environment';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
})
export class AccountListComponent implements OnInit {
  accounts = [];
  appUrl: any;
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

  getBankLogo(account) {
    if (account.bank) {
      this.appUrl = `${environment.baseUrl}/api/bank-logo/${account.bank.bankCode}.png`;
    } else if (account.accountType.configCode === 'WALLET') {
      this.appUrl = 'assets/icon/wallet-primary.png';
    }
    return this.appUrl;
  }
}