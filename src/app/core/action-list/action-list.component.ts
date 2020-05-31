import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.scss'],
})
export class ActionListComponent implements OnInit {
  @Input() buttons = [];
  constructor(private router: Router, private modalCtrl: PopoverController) { }

  ngOnInit() {}

  onButtonClick(button) {
    this.modalCtrl.dismiss(button);
  }
}
