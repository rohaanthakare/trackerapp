import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-select-list',
  templateUrl: './select-list.component.html',
  styleUrls: ['./select-list.component.scss'],
})
export class SelectListComponent implements OnInit {
  @Input() listItems = [];
  @Input() listHasHeader = false;
  @Input() displayFieldName: string;
  @Input() valueFieldName: string;
  @Input() singleSelect: boolean;
  selectedItems = [];
  @Output() selectionChanged: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {}

  isSelected(item) {
    const itemIndex = this.selectedItems.findIndex((i) => i[this.valueFieldName] === item[this.valueFieldName]);
    if (itemIndex < 0) {
      return false;
    } else {
      return true;
    }
  }

  itemSelectionToggle(item) {
    if (this.singleSelect) {
      this.selectedItems = [];
      this.selectedItems.push(item);
    } else {
      const itemIndex = this.selectedItems.findIndex((i) => i[this.valueFieldName] === item[this.valueFieldName]);
      if (itemIndex < 0) {
        this.selectedItems.push(item);
      } else {
        this.selectedItems.splice(itemIndex, 1);
      }
    }

    this.selectionChanged.emit(this.selectedItems);
  }

}
