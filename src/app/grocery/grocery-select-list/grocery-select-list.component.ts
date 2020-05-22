import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-grocery-select-list',
  templateUrl: './grocery-select-list.component.html',
  styleUrls: ['./grocery-select-list.component.scss'],
})
export class GrocerySelectListComponent implements OnInit {
  @Input() items: any;
  @Input() actionName: string;
  @Input() listTitle: string;
  @Input() simpleList: boolean;
  @Input() singleSelect: boolean;
  selectedItems = [];
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  dismissModal() {
    console.log('Dismiss Model');
    this.modalCtrl.dismiss(this.selectedItems);
  }

  onSelectionChanged(items) {
    this.selectedItems = items;
  }

}
