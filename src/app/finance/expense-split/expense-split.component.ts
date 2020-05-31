import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-expense-split',
  templateUrl: './expense-split.component.html',
  styleUrls: ['./expense-split.component.scss'],
})
export class ExpenseSplitComponent implements OnInit {
  @Input() selectedUsers: any;
  @Input() transactionAmount: number;
  transAmountDisplay: string;
  @Output() modelDismissed: EventEmitter<any> = new EventEmitter<any>();
  constructor(private modalCtrl: ModalController, private cp: CurrencyPipe) { }

  ngOnInit() {
    this.transAmountDisplay = this.cp.transform(this.transactionAmount, 'INR', '');
    this.updateMultiUserTransAmount();
  }
  dismissModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss(this.selectedUsers);
  }

  updateMultiUserTransAmount() {
    if (this.selectedUsers && this.selectedUsers.length > 0 && this.transactionAmount) {
      let totalHeadCount = 0;
      this.selectedUsers.forEach((user) => {
        totalHeadCount += user.selectionCount;
      });
      const perHeadAmount = this.transactionAmount / totalHeadCount;

      this.selectedUsers.forEach((user) => {
        user.transactionAmount = user.selectionCount * perHeadAmount;
        user.transactionAmountDisplay = this.cp.transform(user.transactionAmount, 'INR', '');
      });
    }
  }

  addUser(user) {
    user.selectionCount++;
    this.updateMultiUserTransAmount();
  }

  removeUser(user) {
    if (user.selectionCount > 0) {
      user.selectionCount--;
      this.updateMultiUserTransAmount();
    }
  }
}
