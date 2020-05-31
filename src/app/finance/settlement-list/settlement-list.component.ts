import { Component, OnInit } from '@angular/core';
import { ContactService } from 'src/app/services/contact.service';
import { HelperService } from 'src/app/services/helper.service';
import { CurrencyPipe } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { ContactTransactionsComponent } from '../contact-transactions/contact-transactions.component';

@Component({
  selector: 'app-settlement-list',
  templateUrl: './settlement-list.component.html',
  styleUrls: ['./settlement-list.component.scss'],
})
export class SettlementListComponent implements OnInit {
  settlements = [];
  constructor(private contactService: ContactService, private helperService: HelperService, private cp: CurrencyPipe,
              private modalCtrl: ModalController) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.contactService.getUserSettlements().subscribe(
      (response: any) => {
        this.settlements = this.formatData(response.data);
      }
    );
  }

  formatData(data) {
    data.forEach((d) => {
      d.firstName = this.helperService.convertToTitleCase(d.firstName);
      d.lastName = this.helperService.convertToTitleCase(d.lastName);
      d.settlementAmtDisplay = this.cp.transform(d.settlementAmount, 'INR', '');
      if (d.settlementType.configCode === 'MONEY_TO_TAKE') {
        d.settlementText = 'Take from ';
        d.settlementColor = 'success';
      } else {
        d.settlementText = 'Give to ';
        d.settlementColor = 'danger';
      }
    });

    return data;
  }

  async itemClicked(item) {
    const modal = await this.modalCtrl.create({
      component: ContactTransactionsComponent,
      componentProps: {
        contact: item
      }
    });

    modal.present();
  }
}
