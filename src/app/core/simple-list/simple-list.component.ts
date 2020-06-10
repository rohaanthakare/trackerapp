import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
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
  @Input() hasGrouping: boolean;
  @Input() groupLabelField: string;
  @Input() idColumn: string;
  toolbarActions = [];
  hasOnlyCreateAction = true;

  @Output() dataLoaded: EventEmitter<any> = new EventEmitter<any>();
  @Output() toolbarButtonsAdded: EventEmitter<any> = new EventEmitter<any>();
  @Output() customButtonClicked: EventEmitter<any> = new EventEmitter<any>();
  constructor(private masterViewService: MasterViewService, private popoverCtrl: PopoverController, private router: Router,
              private actionSheetController: ActionSheetController, private ngZone: NgZone) { }

  ngOnInit() {
    this.masterViewService.getToolbarActions(this.viewCode).subscribe(
      (response: any) => {
        this.toolbarActions = response.actions;
        // this.toolbarActions = this.toolbarActions.filter((a) => a.viewType !== 'edit');
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
    this.ngZone.run(() => {
      if (this.hasGrouping) {
        data = this.insertGroupHeaders(data);
      }
      this.listItems = data;
      this.dataLoaded.emit();
    });
  }

  insertGroupHeaders(data) {
    const returnData = [];
    let oldGroupLabel = data[0][this.groupLabelField];
    returnData.push({
      groupHeader: oldGroupLabel
    });
    data.forEach((d) => {
      if (oldGroupLabel !== d[this.groupLabelField]) {
        oldGroupLabel = d[this.groupLabelField];
        returnData.push({
          groupHeader: oldGroupLabel
        });
      }
      returnData.push(d);
    });
    return returnData;
  }

  itemClicked(item) {
    this.idColumn = (this.idColumn) ? this.idColumn : '_id';
    this.toolbarActions.forEach((b) => {
      if (b.viewType === 'edit') {
        this.router.navigate([b.viewRoute + '/' + item[this.idColumn]]);
      }
    });
  }

  async showAllActionPopover(ev) {
    const actionButtons = [];
    actionButtons.push({
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    });

    this.toolbarActions.forEach((b) => {
      const newButton = {
        text: b.viewTitle,
        icon: b.mobileIconClass,
        handler: () => {
          if (b.viewType !== 'custom') {
            this.router.navigate([b.viewRoute]);
          } else {
            this.customButtonClicked.emit(b);
          }
        }
      };
      actionButtons.push(newButton);
    });

    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      cssClass: 'my-custom-class',
      buttons: actionButtons
    });
    await actionSheet.present();
  }

  createItem() {
    this.toolbarActions.forEach((b) => {
      if (b.viewType === 'create') {
        this.router.navigate([b.viewRoute]);
      }
    });
  }

}
