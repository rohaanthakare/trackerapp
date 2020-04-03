import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ModelFormComponent } from 'src/app/core/model-form/model-form.component';
import { MasterDataService } from 'src/app/services/master-data.service';
import { FinanceService } from 'src/app/services/finance.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss'],
})
export class AccountFormComponent implements OnInit {
  @ViewChild('accountFormEle', {static: true}) modelForm: ModelFormComponent;
  accountId: any;
  nameCtrl = new FormControl('', Validators.required);
  accountTypeCtrl = new FormControl('', Validators.required);
  accountTypes = [];
  isAccountTypesLoaded = false;
  accountNumberCtrl = new FormControl();
  banks = [];
  isBanksLoaded = false;
  bankCtrl = new FormControl();
  branches = [];
  isBranchesLoaded = false;
  branchCtrl = new FormControl();
  balanceCtrl = new FormControl();
  formTitle = 'New Account';
  formFields = [];
  accountForm: FormGroup = this.formBuilder.group({
    accountName: this.nameCtrl,
    accountType: this.accountTypeCtrl,
    accountNumber: this.accountNumberCtrl,
    bank: this.bankCtrl,
    branch: this.branchCtrl,
    balance: this.balanceCtrl
  });
  constructor(private formBuilder: FormBuilder, private masterDataService: MasterDataService, private financeService: FinanceService,
              private notification: NotificationService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.route.paramMap.subscribe(
      params => {
        this.accountId = params.get('id');
      }
    );
    this.masterDataService.getMasterDataForParent('ACCOUNT_TYPE').subscribe(
      (response: any) => {
        this.accountTypes = response.data;
        this.isAccountTypesLoaded = true;
        this.preReqDataLoaded();
      }
    );

    this.financeService.getBanks().subscribe(
      (response: any) => {
        this.banks = response.banks;
        this.isBanksLoaded = true;
        this.preReqDataLoaded();
      }
    );

    this.financeService.getBranches().subscribe(
      (response: any) => {
        this.branches = response.branches;
        this.isBranchesLoaded = true;
        this.preReqDataLoaded();
      }
    );
  }

  preReqDataLoaded() {
    if (this.isAccountTypesLoaded && this.isBanksLoaded && this.isBranchesLoaded) {
      this.setFormFields();
      if (this.accountId) {
        this.getAccountDetails();
      }
    }
  }

  getAccountDetails() {
    this.financeService.getFinancialAccountDetails(this.accountId).subscribe(
      (response: any) => {
        this.modelForm.setValues(response.account);
      }
    );
  }

  setFormFields() {
    this.formFields = [];
    this.formFields.push({
      label: 'Account Name',
      name: 'accountName',
      type: 'text',
      control: this.nameCtrl
    });

    this.formFields.push({
      label: 'Account Type',
      name: 'accountType',
      type: 'select',
      control: this.accountTypeCtrl,
      dataSource: this.accountTypes,
      displayField: 'configName',
      valueField: '_id'
    });

    this.formFields.push({
      label: 'Account Number',
      name: 'accountNumber',
      type: 'number',
      control: this.accountNumberCtrl
    });

    this.formFields.push({
      label: 'Bank',
      name: 'bank',
      type: 'select',
      control: this.bankCtrl,
      dataSource: this.banks,
      displayField: 'bankName',
      valueField: '_id'
    });

    this.formFields.push({
      label: 'Branch',
      name: 'branch',
      type: 'select',
      control: this.branchCtrl,
      dataSource: this.branches,
      displayField: 'branchName',
      valueField: '_id'
    });

    this.formFields.push({
      label: 'Balance',
      name: 'balance',
      type: 'number',
      control: this.balanceCtrl
    });

    this.balanceCtrl.setValue(0);

    this.modelForm.setFormFields(this.formFields);
  }

  saveAccount() {
    if (this.accountTypeCtrl.valid) {
      if (this.accountId) {
        this.financeService.updateFinancialAccount(this.accountId, this.accountForm.value).subscribe(
          (response: any) => {
            this.notification.successNotification(response.message);
            this.router.navigate(['home/finance/accounts']);
          },
          error => {
            const errorMsg = error.error ? error.error.message : error.statusText;
            this.notification.errorNotification(errorMsg);
          }
        );
      } else {
        this.financeService.createFinancialAccount(this.accountForm.value).subscribe(
          (response: any) => {
            this.notification.successNotification(response.message);
            this.router.navigate(['home/finance/accounts']);
          },
          error => {
            const errorMsg = error.error ? error.error.message : error.statusText;
            this.notification.errorNotification(errorMsg);
          }
        );
      }
    } else {
      this.notification.errorNotification('Form contains errors please correct');
    }
  }
}
