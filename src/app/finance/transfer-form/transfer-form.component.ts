import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ModelFormComponent } from 'src/app/core/model-form/model-form.component';
import { MasterDataService } from 'src/app/services/master-data.service';
import { HelperService } from 'src/app/services/helper.service';
import { ContactService } from 'src/app/services/contact.service';
import { FinanceService } from 'src/app/services/finance.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-transfer-form',
  templateUrl: './transfer-form.component.html',
  styleUrls: ['./transfer-form.component.scss'],
})
export class TransferFormComponent implements OnInit {
  formTitle = 'Transfer Form';
  @ViewChild('transferFormEle', {static: true}) modelForm: ModelFormComponent;
  formFields = [];
  transferTypes = [];
  isTransfterTypesLoaded = false;
  transferTypeCtrl = new FormControl();
  userContacts = [];
  isUserContactsLoaded = false;
  userContactControl = new FormControl();
  fromAccounts = [];
  isFromAccountLoaded = false;
  fromAccountCtrl = new FormControl();
  toAccounts = [];
  isToAccountsLoaded = false;
  toAccountCtrl = new FormControl();
  amountCtrl = new FormControl();
  transactionDateCtrl = new FormControl();
  transfterSubCategories = [];
  isTransfterSubCategoriesLoaded = false;
  transferSubCategoryCtrl = new FormControl();
  transactionDetailCtrl = new FormControl();
  transferForm: FormGroup = this.formBuilder.group({
    transactionSubCategory: this.transferSubCategoryCtrl,
    fromAccount: this.fromAccountCtrl,
    toAccount: this.toAccountCtrl,
    transactionAmount: this.amountCtrl,
    transferType: this.transferTypeCtrl,
    transactionDate: this.transactionDateCtrl,
    transactionDetail: this.transactionDetailCtrl,
    userContact: this.userContactControl
  });
  constructor(private formBuilder: FormBuilder, private masterDataService: MasterDataService, private helperService: HelperService,
              private contactService: ContactService, private financeService: FinanceService, private notification: NotificationService) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.masterDataService.getMasterDataForParent('TRANSFER_TYPE').subscribe(
      (response: any) => {
        this.transferTypes = response.data;
        this.isTransfterTypesLoaded = true;
        this.preReqDataLoaded();
      }
    );

    this.masterDataService.getMasterDataForParent('TRANSFER_CATEGORY').subscribe(
      (response: any) => {
        this.transfterSubCategories = response.data;
        this.isTransfterSubCategoriesLoaded = true;
        this.preReqDataLoaded();
      }
    );

    this.financeService.getFinancialAccounts().subscribe(
      (response: any) => {
        this.fromAccounts = response.data;
        this.toAccounts = response.data;
        this.isToAccountsLoaded = true;
        this.isFromAccountLoaded = true;
        this.preReqDataLoaded();
      }
    );

    this.contactService.getUserContacts().subscribe(
      (response: any) => {
        this.userContacts = response.data;
        this.isUserContactsLoaded = true;
        this.preReqDataLoaded();
      }
    );
  }

  preReqDataLoaded() {
    if (this.isTransfterTypesLoaded && this.isTransfterSubCategoriesLoaded && this.isFromAccountLoaded
      && this.isUserContactsLoaded) {
      this.setFormFields();
    }
  }

  setFormFields() {
    this.formFields = [];
    this.formFields.push({
      label: 'Transfer Type',
      name: 'transferType',
      type: 'select',
      control: this.transferTypeCtrl,
      dataSource: this.transferTypes,
      displayField: 'configName',
      valueField: '_id'
    });
    this.formFields.push({
      label: 'User',
      name: 'userContact',
      type: 'select',
      control: this.userContactControl,
      dataSource: this.userContacts,
      displayField: 'firstName',
      valueField: '_id'
    });
    this.formFields.push({
      label: 'From Account',
      name: 'fromAccount',
      type: 'select',
      control: this.fromAccountCtrl,
      dataSource: this.fromAccounts,
      displayField: 'accountName',
      valueField: '_id'
    });
    this.formFields.push({
      label: 'To Account',
      name: 'toAccount',
      type: 'select',
      control: this.toAccountCtrl,
      dataSource: this.toAccounts,
      displayField: 'accountName',
      valueField: '_id'
    });
    this.formFields.push({
      label: 'Amount',
      name: 'transactionAmount',
      type: 'number',
      control: this.amountCtrl
    });
    this.formFields.push({
      label: 'Date',
      name: 'transactionDate',
      type: 'date',
      control: this.transactionDateCtrl
    });
    this.formFields.push({
      label: 'Category',
      name: 'transactionSubCategory',
      type: 'select',
      control: this.transferSubCategoryCtrl,
      dataSource: this.transfterSubCategories,
      displayField: 'configName',
      valueField: '_id'
    });

    this.formFields.push({
      label: 'Details',
      name: 'transactionDetail',
      type: 'text',
      control: this.transactionDetailCtrl
    });
    this.modelForm.setFormFields(this.formFields);
  }

  onSelectValueChange(params) {
    if (params.value && params.field.name === 'transferType' && params.value.configCode === 'OWN_TRANSFER') {
      this.modelForm.removeField('userContact');
    } else if (params.value && params.field.name === 'transferType' && params.value.configCode === 'OTHER_USER_TRANSFER') {
      this.modelForm.addField('userContact');
    }
  }

  transferMoney() {
    if (this.transferForm.valid) {
      this.transferForm.value.transactionDate = this.helperService.getUTCDate(new Date(this.transferForm.value.transactionDate));
      this.financeService.transferMoney(this.transferForm.value).subscribe(
        (response: any) => {
          this.notification.successNotification(response.message);
          this.modelForm.resetForm();
        },
        error => {
          const errorMsg = error.error ? error.error.message : error.statusText;
          this.notification.errorNotification(errorMsg);
        }
      );
    } else {
      this.notification.errorNotification('Form contains error, please remove errors to transfer money');
    }
  }
}
