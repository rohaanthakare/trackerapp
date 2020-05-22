import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MasterViewService } from 'src/app/services/master-view.service';
import { PopoverController, ActionSheetController } from '@ionic/angular';
import { ActionListComponent } from '../action-list/action-list.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-simple-list',
  templateUrl: './simple-list.component.html',
  styleUrls: ['./simple-list.component.scss'],
})
export class SimpleListComponent implements OnInit {
  @Input() listTitle: string;
  @Input() displayFieldName: string;
  @Input() viewCode: string;
  @Input() hasNote: boolean;
  @Input() listItems = [];
  @Input() noToolbar: boolean;
  @Input() noDetails: boolean;
  toolbarActions = [];
  hasOnlyCreateAction = true;

  @Output() dataLoaded: EventEmitter<any> = new EventEmitter<any>();
  @Output() toolbarButtonsAdded: EventEmitter<any> = new EventEmitter<any>();
  @Output() customButtonClicked: EventEmitter<any> = new EventEmitter<any>();
  constructor(private masterViewService: MasterViewService, private popoverCtrl: PopoverController, private router: Router,
              private actionSheetController: ActionSheetController) { }

  ngOnInit() {
    this.masterViewService.getToolbarActions(this.viewCode).subscribe(
      (response: any) => {
        this.toolbarActions = response.actions;
        this.toolbarActions = this.toolbarActions.filter((a) => a.viewType !== 'edit');
        if (this.toolbarActions.length > 2) {
          this.hasOnlyCreateAction = false;
        } else {
          this.hasOnlyCreateAction = true;
        }
        this.toolbarActions.forEach((action: any) => {
          if (action.viewType !== 'create') {
            action.isDisabled = true;
          }
        });
        this.toolbarButtonsAdded.emit(this.toolbarActions);
      }
    );
  }

  ionViewWillEnter() {
    console.log('Inside ionViewWillEnter of simple-list-component');
  }

  loadListData(data, count?) {
    this.listItems = data;
    this.dataLoaded.emit();
  }

  itemClicked(item) {
    console.log('Inside Item Clicked');
  }

  async showAllActionPopover(ev) {
    const popover = await this.popoverCtrl.create({
      component: ActionListComponent,
      translucent: true,
      event: ev,
      componentProps: {
        buttons: this.toolbarActions
      }
    });

    popover.onDidDismiss().then((button: any) => {
      if (button.data) {
        if (button.data.viewType !== 'custom') {
          this.router.navigate([button.data.viewRoute]);
        } else {
          this.customButtonClicked.emit(button.data);
        }
      }
    });

    popover.present();
  }

}
