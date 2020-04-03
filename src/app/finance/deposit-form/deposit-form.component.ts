import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ModelFormComponent } from 'src/app/core/model-form/model-form.component';
import { MasterDataService } from 'src/app/services/master-data.service';
import { FinanceService } from 'src/app/services/finance.service';
import { ContactService } from 'src/app/services/contact.service';
import { HelperService } from 'src/app/services/helper.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-deposit-form',
  templateUrl: './deposit-form.component.html',
  styleUrls: ['./deposit-form.component.scss'],
})
export class DepositFormComponent implements OnInit {
  @ViewChild('depositFormEle', {static: true}) modelForm: ModelFormComponent;
  formTitle = 'Deposit Form';
  formFields = [];
  depositTypes = [];
  isDepositTypeLoaded = false;
  accounts = [];
  isAccountsLoaded = false;
  transactionSubCategories = [];
  isTransactionSubCategoriesLoaded = false;
  userContacts = [];
  isContactLoaded = false;
  depositTypeCtrl = new FormControl();
  accountCtrl = new FormControl();
  amountCtrl = new FormControl('', [Validators.required]);
  depositSubCategoryCtrl = new FormControl();
  transactionDateCtrl = new FormControl('', [Validators.required]);
  transactionDetailCtrl = new FormControl();
  userContactControl = new FormControl('', [Validators.required]);
  depositForm: FormGroup = this.formBuilder.group({
    transactionSubCategory: this.depositSubCategoryCtrl,
    account: this.accountCtrl,
    transactionAmount: this.amountCtrl,
    depositType: this.depositTypeCtrl,
    transactionDate: this.transactionDateCtrl,
    transactionDetail: this.transactionDetailCtrl,
    userContact: this.userContactControl
  });
  constructor(private formBuilder: FormBuilder, private masterDataService: MasterDataService, private financeService: FinanceService,
              private contactService: ContactService, private helperService: HelperService, private notification: NotificationService) { }

  ngOnInit() {
    this.masterDataService.getMasterDataForParent('DEPOSIT_TYPE').subscribe(
      (response: any) => {
        this.depositTypes = response.data;
        this.isDepositTypeLoaded = true;
        this.preReqDataLoaded();
      }
    );

    this.masterDataService.getMasterDataForParent('DEPOSIT_CATEGORY').subscribe(
      (response: any) => {
        this.transactionSubCategories = response.data;
        this.isTransactionSubCategoriesLoaded = true;
        this.preReqDataLoaded();
      }
    );

    this.financeService.getFinancialAccounts().subscribe(
      (response: any) => {
        this.accounts = response.data;
        this.isAccountsLoaded = true;
        this.preReqDataLoaded();
      }
    );

    this.contactService.getUserContacts().subscribe(
      (response: any) => {
        this.userContacts = response.data;
        this.isContactLoaded = true;
        this.preReqDataLoaded();
      }
    );
  }

  preReqDataLoaded() {
    if (this.isDepositTypeLoaded && this.isTransactionSubCategoriesLoaded && this.isAccountsLoaded && this.isContactLoaded) {
      this.setFormFields();
    }
  }

  setFormFields() {
    this.formFields = [];
    this.formFields.push({
      label: 'Deposit Type',
      name: 'depositType',
      type: 'select',
      control: this.depositTypeCtrl,
      dataSource: this.depositTypes,
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
      label: 'Account',
      name: 'account',
      type: 'select',
      control: this.accountCtrl,
      dataSource: this.accounts,
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
      control: this.depositSubCategoryCtrl,
      dataSource: this.transactionSubCategories,
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

  depositMoney() {
    if (this.depositForm.valid) {
      this.depositForm.value.transactionDate = this.helperService.getUTCDate(new Date(this.depositForm.value.transactionDate));
      this.financeService.depositMoney(this.depositForm.value).subscribe(
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
      this.notification.errorNotification('Form contains error, please remove errors to deposit money');
    }
  }

  onSelectValueChange(params) {
    if (params.value && params.field.name === 'depositType' && params.value.configCode === 'OWN_DEPOSIT') {
      this.modelForm.removeField('userContact');
    } else if (params.value && params.field.name === 'depositType' && params.value.configCode === 'OTHER_USER_DEPOSIT') {
      this.modelForm.addField('userContact');
    }
  }
}
