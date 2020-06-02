import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AccountListComponent } from './account-list/account-list.component';
import { AccountFormComponent } from './account-form/account-form.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { DepositFormComponent } from './deposit-form/deposit-form.component';
import { TransferFormComponent } from './transfer-form/transfer-form.component';
import { ExpenseFormComponent } from './expense-form/expense-form.component';
import { WithdrawFormComponent } from './withdraw-form/withdraw-form.component';
import { BudgetManagerComponent } from './budget-manager/budget-manager.component';
import { SettlementListComponent } from './settlement-list/settlement-list.component';
import { ContactTransactionsComponent } from './contact-transactions/contact-transactions.component';
import { CoreModule } from '../core/core.module';
import { IonicModule } from '@ionic/angular';
import { ExpenseSplitComponent } from './expense-split/expense-split.component';
import { InvestmentFormComponent } from './investment-form/investment-form.component';
import { BalanceChartComponent } from './balance-chart/balance-chart.component';

const routes: Routes = [{
  path: '',
  children: [{
    path: '',
    component: AccountListComponent
  }, {
    path: 'accounts',
    component: AccountListComponent
  }, {
    path: 'create-account',
    component: AccountFormComponent
  }, {
    path: 'edit-account/:id',
    component: AccountFormComponent
  }, {
    path: 'passbook',
    component: TransactionListComponent
  }, {
    path: 'deposit',
    component: DepositFormComponent
  }, {
    path: 'withdraw',
    component: WithdrawFormComponent
  }, {
    path: 'transfer',
    component: TransferFormComponent
  }, {
    path: 'add-expense',
    component: ExpenseFormComponent
  }, {
    path: 'budget-manager',
    component: BudgetManagerComponent
  }, {
    path: 'settlements',
    component: SettlementListComponent
  }, {
    path: 'contact-transactions/:contact_id',
    component: ContactTransactionsComponent
  }, {
    path: 'investment',
    component: InvestmentFormComponent
  }, {
    path: 'balance-chart',
    component: BalanceChartComponent
  }]
}];

@NgModule({
  declarations: [AccountListComponent, AccountFormComponent, TransactionListComponent, DepositFormComponent, WithdrawFormComponent,
  TransferFormComponent, ExpenseFormComponent, BudgetManagerComponent, SettlementListComponent, ContactTransactionsComponent,
  ExpenseSplitComponent, InvestmentFormComponent, BalanceChartComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes), CoreModule, IonicModule.forRoot()
  ],
  entryComponents: [ExpenseSplitComponent]
})
export class FinanceModule { }
