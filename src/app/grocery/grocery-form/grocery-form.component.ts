import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModelFormComponent } from 'src/app/core/model-form/model-form.component';
import { GroceryService } from 'src/app/services/grocery.service';
import { MasterDataService } from 'src/app/services/master-data.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-grocery-form',
  templateUrl: './grocery-form.component.html',
  styleUrls: ['./grocery-form.component.scss'],
})
export class GroceryFormComponent implements OnInit {
  @ViewChild(ModelFormComponent, {static: false}) modelForm: ModelFormComponent;
  itemId: any;
  actionType: string;
  formFields = [];
  itemDetails: any;
  nameCtrl = new FormControl('', [Validators.required]);
  categories = [];
  isCategoryLoaded = false;
  categoryCtrl = new FormControl('');
  isOutOfStockCtrl = new FormControl(false);
  groceryItemForm: FormGroup = this.formBuilder.group({
    name: this.nameCtrl,
    category: this. categoryCtrl,
    isOutOfStock: this.isOutOfStockCtrl
  });

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private groceryService: GroceryService,
              private masterDataService: MasterDataService, private notification: NotificationService) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.route.paramMap.subscribe(
      params => {
        this.itemId = params.get('id');
        if (this.itemId) {
          this.actionType = 'edit';
          this.getItemDetails();
        }
      }
    );

    this.masterDataService.getMasterDataForParent('GROCERY_CATEGORY').subscribe(
      (response: any) => {
        this.categories = response.data;
        this.isCategoryLoaded = true;
        this.preReqDataLoaded();
      }
    );
  }

  getItemDetails() {
    this.groceryService.getGroceryItemDetails(this.itemId).subscribe(
      (response: any) => {
        this.itemDetails = response.item;
      }
    );
  }

  preReqDataLoaded() {
    if (this.isCategoryLoaded) {
      this.setFormFields();
    }
  }

  setFormFields() {
    this.formFields = [];
    this.formFields.push({
      label: 'Name',
      name: 'name',
      type: 'text',
      control: this.nameCtrl,
      controlName: 'name'
    });

    this.formFields.push({
      label: 'Category',
      name: 'category',
      type: 'select',
      dataSource: this.categories,
      valueField: '_id',
      displayField: 'configName',
      control: this.categoryCtrl,
      controlName: 'category'
    });

    this.formFields.push({
      label: 'Out of Stock?',
      name: 'isOutOfStock',
      type: 'slide-toggle',
      control: this.isOutOfStockCtrl,
      controlName: 'isOutOfStock'
    });

    this.modelForm.setFormFields(this.formFields);
    if (this.actionType === 'edit') {
      this.modelForm.setValues(this.itemDetails);
    }
  }

  saveGroceryItem() {
    if (this.groceryItemForm.valid) {
      if (this.itemId) {
        this.groceryService.updateGroceryItem(this.itemId, this.groceryItemForm.value).subscribe(
          (response: any) => {
            this.notification.successNotification(response.message);
          }
        );
      } else {
        this.groceryService.createGroceryItem(this.groceryItemForm.value).subscribe(
          (response: any) => {
            this.notification.successNotification(response.message);
            this.groceryItemForm.reset();
          }
        );
      }
    } else {
      this.notification.errorNotification('Form contains error, please correct those');
    }
  }

}
