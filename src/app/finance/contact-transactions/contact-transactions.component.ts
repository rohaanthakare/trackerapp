import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FinanceService } from 'src/app/services/finance.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-contact-transactions',
  templateUrl: './contact-transactions.component.html',
  styleUrls: ['./contact-transactions.component.scss'],
})
export class ContactTransactionsComponent implements OnInit {
  @Input() contact: any;
  contactTransactions = [];
  currentUser: any = this.authService.getCurrentUser();
  constructor(private modalCtrl: ModalController, private financeService: FinanceService, private cp: CurrencyPipe,
              private dp: DatePipe, private authService: AuthService) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.contactTransactions = [];
    this.financeService.getContactTransactions(this.contact._id).subscribe(
      (response: any) => {
        this.contactTransactions = this.formatData(response.data);
      }
    );
  }

  formatData(data) {
    data.forEach((d) => {
      d.contactTrans = d.contactTransactions.find((c) => {
        if ((c.trans_user === this.currentUser._id
          && c.other_contact && c.other_contact._id === this.contact._id) ||
          (c.other_user === this.currentUser._id
            && c.trans_contact && c.trans_contact._id === this.contact._id)) {
          return true;
        } else {
          return false;
        }
      });
      d.contactTrans.transAmtDisplay = this.cp.transform(d.contactTrans.transactionAmount, 'INR', '');
      d.transactionAmount = this.cp.transform(d.transactionAmount, 'INR', '');
      d.transIcon = this.financeService.getTransactionClass(d.transactionCategory.configCode, d.transactionSubCategory.configCode);
      d.transClass = '';
      if ((d.transactionCategory.configCode === 'DEPOSIT' && d.contactTrans.trans_contact._id === this.contact._id)
        || (d.transactionCategory.configCode === 'EXPENSE' && d.contactTrans.other_contact._id === this.contact._id)
        || (d.transactionCategory.configCode === 'TRANSFER' && d.contactTrans.other_contact._id === this.contact._id)) {
          d.transClass = 'success';
      } else {
        d.transClass = 'danger';
      }

      d.transactionDate = this.dp.transform(new Date(d.transactionDate), 'MMM dd, yyyy');
    });

    return data;
  }

  dismissModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss();
  }
}
