import { Component, OnInit } from '@angular/core';
import { FinanceService } from 'src/app/services/finance.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActionSheetController } from '@ionic/angular';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
})
export class TransactionListComponent implements OnInit {
  transactions = [];
  constructor(private financeService: FinanceService, private cp: CurrencyPipe, private dp: DatePipe,
              private actionSheetController: ActionSheetController, private notification: NotificationService) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.getTransactions();
  }

  getTransactions() {
    this.financeService.getUserTransactions(undefined, 0, 100).subscribe(
      (response: any) => {
        this.transactions = this.formatData(response.data);
      }
    );
  }

  formatData(data) {
    data.forEach((d) => {
      d.transactionAmount = this.cp.transform(d.transactionAmount, 'INR', '');
      d.transIcon = this.financeService.getTransactionClass(d.transactionCategory.configCode, d.transactionSubCategory.configCode);
      d.transClass = '';
      if (d.transactionCategory.configCode === 'DEPOSIT') {
        d.transClass = 'success';
      } else if (d.transactionCategory.configCode === 'TRANSFER') {
        if (d.contactTransactions.length > 0) {
          d.transClass = 'danger';
        } else {
          d.transClass = 'success';
        }
      } else if (d.transactionCategory.configCode === 'EXPENSE') {
        d.transClass = 'danger';
      } else if (d.transactionCategory.configCode === 'INVESTMENT') {
        d.transClass = 'danger';
      }

      d.transactionDate = this.dp.transform(new Date(d.transactionDate), 'MMM dd, yyyy');
    });

    return data;
  }

  itemClicked(item) {
    console.log('Item clicked');
  }

  async showActionsSheet(item) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Transactions',
      buttons: [{
        text: 'Revert Transaction',
        icon: 'trash',
        handler: () => {
          this.financeService.revertTransaction(item._id).subscribe(
            response => {
              this.notification.successNotification('Transation reverted successfully');
              this.getTransactions();
            }
          );
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
}
