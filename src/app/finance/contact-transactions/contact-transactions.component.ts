import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FinanceService } from 'src/app/services/finance.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-contact-transactions',
  templateUrl: './contact-transactions.component.html',
  styleUrls: ['./contact-transactions.component.scss'],
})
export class ContactTransactionsComponent implements OnInit {
  @Input() contact: any;
  contactTransactions = [];
  constructor(private modalCtrl: ModalController, private financeService: FinanceService, private cp: CurrencyPipe,
              private dp: DatePipe) { }

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
      d.contactTrans = d.contactTransactions.find((tr) => tr.other_contact._id === this.contact._id);
      d.contactTrans.transAmtDisplay = this.cp.transform(d.contactTrans.transactionAmount, 'INR', '');
      d.transactionAmount = this.cp.transform(d.transactionAmount, 'INR', '');
      d.transIcon = this.financeService.getTransactionClass(d.transactionCategory.configCode, d.transactionSubCategory.configCode);
      d.transClass = '';
      if (d.transactionCategory.configCode === 'DEPOSIT') {
        d.transClass = 'danger';
      } else if (d.transactionCategory.configCode === 'TRANSFER') {
        if (d.contactTransactions.length > 0) {
          d.transClass = 'success';
        } else {
          d.transClass = 'danger';
        }
      } else if (d.transactionCategory.configCode === 'EXPENSE') {
        d.transClass = 'success';
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
