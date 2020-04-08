import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MasterDataService } from 'src/app/services/master-data.service';
import { FinanceService } from 'src/app/services/finance.service';
import { ContactService } from 'src/app/services/contact.service';
import { ModelFormComponent } from 'src/app/core/model-form/model-form.component';
import { HelperService } from 'src/app/services/helper.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ModalController, AlertController } from '@ionic/angular';
import { ExpenseSplitComponent } from '../expense-split/expense-split.component';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss'],
})
export class ExpenseFormComponent implements OnInit {
  formTitle = 'Expense Form';
  formFields = [];
  @ViewChild('expenseFormEle', {static: true}) modelForm: ModelFormComponent;
  expenseTypes = [];
  isExpenseTypesLoaded = false;
  expenseTypeCtrl = new FormControl();
  isMultiUserExpense = false;
  userContacts = [];
  isUserContactsLoaded = false;
  userContactControl = new FormControl();
  userContactsControl = new FormControl();
  accounts = [];
  isAccountsLoaded = false;
  accountCtrl = new FormControl();
  amountCtrl = new FormControl('', [Validators.required]);
  transactionDateCtrl = new FormControl('', [Validators.required]);
  transactionDetailCtrl = new FormControl('', [Validators.required]);
  accountBalanceCtrl = new FormControl();
  expenseCategory = [];
  isExpenseCategoryLoaded = false;
  expenseCategoryCtrl = new FormControl();
  usersSelected: any;
  expenseSplitCtrl = new FormControl();
  expenseForm: FormGroup = this.formBuilder.group({
    expenseType: this.expenseTypeCtrl,
    userContact: this.userContactControl,
    userContacts: this.userContactsControl,
    account: this.accountCtrl,
    transactionAmount: this.amountCtrl,
    transactionDate: this.transactionDateCtrl,
    transactionDetail: this.transactionDetailCtrl,
    transactionSubCategory: this.expenseCategoryCtrl,
    accountBalance: this.accountBalanceCtrl,
    expenseSplit: this.expenseSplitCtrl
  });
  constructor(private formBuilder: FormBuilder, private masterDataService: MasterDataService, private financeService: FinanceService,
              private contactService: ContactService, private helperService: HelperService, private notification: NotificationService,
              private modalCtrl: ModalController) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.masterDataService.getMasterDataForParent('EXPENSE_TYPE').subscribe(
      (response: any) => {
        this.expenseTypes = response.data;
        this.isExpenseTypesLoaded = true;
        this.preReqDataLoaded();
      }
    );

    this.masterDataService.getMasterDataForParent('EXPENSE_CATEGORY').subscribe(
      (response: any) => {
        this.expenseCategory = response.data;
        this.isExpenseCategoryLoaded = true;
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
        this.isUserContactsLoaded = true;
        this.preReqDataLoaded();
      }
    );
  }

  preReqDataLoaded() {
    if (this.isExpenseTypesLoaded && this.isExpenseCategoryLoaded && this.isAccountsLoaded && this.isUserContactsLoaded) {
      this.setFormFields();
    }
  }

  setFormFields() {
    this.formFields = [];
    this.formFields.push({
      label: 'Expense Type',
      name: 'expenseType',
      type: 'select',
      control: this.expenseTypeCtrl,
      dataSource: this.expenseTypes,
      displayField: 'configName',
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
      label: 'Balance',
      name: 'accountBalance',
      type: 'number',
      control: this.accountBalanceCtrl
    });
    this.formFields.push({
      label: 'Amount',
      name: 'transactionAmount',
      type: 'number',
      control: this.amountCtrl
    });

    this.formFields.push({
      label: 'User',
      name: 'userContact',
      type: 'select',
      control: this.userContactControl,
      dataSource: this.userContacts,
      renderer: (data) => {
        if (data) {
          const firstName = this.helperService.convertToTitleCase(data.firstName);
          const lastName = this.helperService.convertToTitleCase(data.lastName);
          return firstName + ' ' + lastName;
        }
      },
      displayField: 'configName',
      valueField: '_id'
    });
    this.formFields.push({
      label: 'Users',
      name: 'userContacts',
      type: 'multiselect',
      control: this.userContactsControl,
      dataSource: this.userContacts,
      renderer: (data) => {
        if (data) {
          const firstName = this.helperService.convertToTitleCase(data.firstName);
          const lastName = this.helperService.convertToTitleCase(data.lastName);
          return firstName + ' ' + lastName;
        }
      },
      displayField: 'configName',
      valueField: '_id'
    });
    this.formFields.push({
      label: 'Split',
      name: 'expenseSplit',
      type: 'action',
      control: this.expenseSplitCtrl,
      iconClass: 'fas fa-share-alt mr-1',
      handler: (field) => {
        this.showSplitDetails();
      }
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
      control: this.expenseCategoryCtrl,
      dataSource: this.expenseCategory,
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
    this.modelForm.removeField('userContact');
    this.modelForm.removeField('userContacts');
    this.modelForm.removeField('expenseSplit');
  }

  async showSplitDetails() {
    const alert = await this.modalCtrl.create({
      component: ExpenseSplitComponent,
      componentProps: {
        selectedUsers: this.usersSelected,
        transactionAmount: this.amountCtrl.value
      }
    });

    alert.onDidDismiss().then((data: any) => {
      this.usersSelected = data.data;
    });
    await alert.present();
  }

  createExpense() {
    if (this.expenseForm.valid) {
      if (this.isMultiUserExpense) {
        this.expenseForm.value.userContacts = JSON.stringify(this.usersSelected);
      } else {
        this.expenseForm.value.userContacts = undefined;
      }
      this.expenseForm.value.transactionDate = this.helperService.getUTCDate(new Date(this.expenseForm.value.transactionDate));
      this.financeService.addExpense(this.expenseForm.value).subscribe(
        (response: any) => {
          this.expenseForm.reset();
          this.notification.successNotification(response.message);
        },
        (error: any) => {
          const errorMsg = error.error ? error.error.message : error.statusText;
          this.notification.errorNotification(errorMsg);
        }
      );
    } else {
      this.notification.errorNotification('Form contains error, please correct errors');
    }
  }

  onSelectValueChange(params) {
    if (params.value && params.field.name === 'expenseType' && params.value.configCode === 'OWN_EXPENSE') {
      this.isMultiUserExpense = false;
      this.modelForm.removeField('userContact');
      this.modelForm.removeField('userContacts');
      this.modelForm.removeField('expenseSplit');
    } else if (params.value && params.field.name === 'expenseType' && params.value.configCode === 'OTHER_USER_EXPENSE') {
      this.isMultiUserExpense = false;
      this.modelForm.addField('userContact');
      this.modelForm.removeField('userContacts');
      this.modelForm.removeField('expenseSplit');
    } else if (params.value && params.field.name === 'expenseType' && params.value.configCode === 'MULTI_USER_EXPENSE') {
      this.isMultiUserExpense = true;
      this.modelForm.addField('userContacts');
      this.modelForm.addField('expenseSplit');
      this.modelForm.removeField('userContact');
    } else if (params.value && params.field.name === 'userContacts') {
      params.value.forEach((v) => {
        v.selectionCount = 1;
      });
      this.usersSelected = params.value;
    } else if (params.value && params.field.name === 'account') {
      this.accountBalanceCtrl.setValue(params.value.balance);
    }
  }
}
