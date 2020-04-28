import { Component, OnInit, ViewChild } from '@angular/core';
import { ModelFormComponent } from 'src/app/core/model-form/model-form.component';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MasterDataService } from 'src/app/services/master-data.service';
import { FinanceService } from 'src/app/services/finance.service';
import { NotificationService } from 'src/app/services/notification.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-investment-form',
  templateUrl: './investment-form.component.html',
  styleUrls: ['./investment-form.component.scss'],
})
export class InvestmentFormComponent implements OnInit {
  @ViewChild('investmentFormEle', {static: true}) modelForm: ModelFormComponent;
  formFields = [];
  accounts = [];
  isAccountsLoaded = false;
  transactionSubCategories = [];
  isTransactionSubCategoriesLoaded = false;
  accountCtrl = new FormControl();
  amountCtrl = new FormControl('', [Validators.required]);
  investmentSubCategoryCtrl = new FormControl();
  transactionDateCtrl = new FormControl('', [Validators.required]);
  transactionDetailCtrl = new FormControl();
  investmentForm: FormGroup = this.formBuilder.group({
    transactionSubCategory: this.investmentSubCategoryCtrl,
    account: this.accountCtrl,
    transactionAmount: this.amountCtrl,
    transactionDate: this.transactionDateCtrl,
    transactionDetail: this.transactionDetailCtrl
  });
  constructor(private formBuilder: FormBuilder, private masterDataService: MasterDataService, private financeService: FinanceService,
              private helperService: HelperService, private notification: NotificationService) { }

  ngOnInit() {
    this.masterDataService.getMasterDataForParent('INVESTMENT_CATEGORY').subscribe(
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
  }

  preReqDataLoaded() {
    if (this.isTransactionSubCategoriesLoaded && this.isAccountsLoaded) {
      this.setFormFields();
    }
  }

  setFormFields() {
    this.formFields = [];

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
      control: this.investmentSubCategoryCtrl,
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

  createInvestment() {
    if (this.investmentForm.valid) {
      this.investmentForm.value.transactionDate = this.helperService.getUTCDate(new Date(this.investmentForm.value.transactionDate));
      this.financeService.addInvestment(this.investmentForm.value).subscribe(
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
}
