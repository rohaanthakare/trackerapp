import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { MasterDataService } from '../services/master-data.service';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  accounts = [];
  budgetStatus = [];
  expenseSplit = [];
  expenseHistory = [];
  expenseCategory = [];
  totalMonthlyExpense: any;
  totalBalance: any;
  moneyToGive: any;
  moneyToTake: any;
  budgetUtilization: any;
  totalOutOfStockItems: any;

  constructor(private userService: UserService, private masterDataService: MasterDataService, private cp: CurrencyPipe,
              private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.masterDataService.getMasterDataForParent('EXPENSE_CATEGORY').subscribe(
      (response: any) => {
        this.expenseCategory = response.data;
        this.getDashboardData();
      }
    );
  }
  getDashboardData() {
    this.userService.getDashboardData().subscribe(
      (response: any) => {
        console.log('getDashboardData');
        console.log(response);
        this.accounts = response.accounts;
        this.expenseSplit = response.expenseSplit;
        this.expenseHistory = response.expenseHistory;
        this.totalOutOfStockItems = response.totalOutOfStockItems;
        this.prepareAccountBalanceChartData(response.accounts);
        this.prepareExpenseSplitData(response.expenseSplit);
        if (response.financeProfile) {
          this.prepareBudgetStatus(response.financeProfile.budgetConfig);
        }
        this.moneyToGive = this.cp.transform(response.settlements.MONEY_TO_GIVE, 'INR', '');
        this.moneyToTake = this.cp.transform(response.settlements.MONEY_TO_TAKE, 'INR', '');
      }
    );
  }

  prepareAccountBalanceChartData(data) {
    this.totalBalance = 0;
    data.forEach((d) => {
      this.totalBalance += d.balance;
    });
    this.totalBalance = this.cp.transform(this.totalBalance, 'INR', '');
  }

  prepareExpenseSplitData(data) {
    this.expenseSplit = [];
    this.totalMonthlyExpense = 0;
    data.forEach((d) => {
      this.totalMonthlyExpense += d.total;
      this.expenseSplit.push({
        name: d.expense_tps[0].configName,
        value: d.total
      });
    });
    this.totalMonthlyExpense = this.cp.transform(this.totalMonthlyExpense, 'INR', '');
  }

  calculateBudgetUtilization() {
    console.log('Inside calculate budget status');
  }

  prepareBudgetStatus(data) {
    this.budgetStatus = [];
    let totalBudget = 0;
    let totalSpent = 0;
    for (const key in data) {
      if (data[key] > 0) {
        const catg = this.expenseCategory.find((c) => c.configCode === key);
        const spentCfg = this.expenseSplit.find((c) => c.name === catg.configName);
        const spentAmt = (spentCfg) ? spentCfg.value : 0;
        totalSpent = totalSpent + spentAmt;
        totalBudget = totalBudget + data[key];
        const spentAmtLbl = this.cp.transform(spentAmt, 'INR', '');
        const allocatedLbl = this.cp.transform(data[key], 'INR', '');
        const spentPer = (data[key] - spentAmt) / data[key];
        let progressColor = 'primary';

        if (spentPer <= 0) {
          progressColor = 'dark';
        } else if (spentPer > 0 && spentPer < 0.1) {
          progressColor = 'danger';
        } else if (spentPer > 0.11 && spentPer <= 0.5) {
          progressColor = 'warning';
        } else if (spentPer > 0.51 && spentPer < 0.80) {
          progressColor = 'light';
        } else if (spentPer > 0.81) {
          progressColor = 'success';
        }
        const catgEle = {
          category: catg.configName,
          spentPercentage: spentPer,
          spentAmtString: spentAmtLbl,
          allocatedString: allocatedLbl,
          barColor: progressColor
        };
        this.budgetStatus.push(catgEle);
      }
    }

    this.budgetUtilization = ((totalSpent / totalBudget) * 100).toFixed(2);
  }

  async widgetClicked(widget) {
    switch (widget) {
      case 'balanceWidget':
        this.router.navigate(['home/finance/balance-chart'], {
          queryParams: {
            accounts: JSON.stringify(this.accounts)
          }
        });
        break;
      case 'expenseWidget':
        this.router.navigate(['home/finance/expense-charts'], {
          queryParams: {
            expenseSplit: JSON.stringify(this.expenseSplit),
            expenseHistory: JSON.stringify(this.expenseHistory)
          }
        });
        break;
      case 'settlements': {
        this.router.navigate(['home/finance/settlements']);
        break;
      }
      case 'budgetWidget': {
        this.router.navigate(['home/finance/budget-status'], {
          queryParams: {
            budgetStatus: JSON.stringify(this.budgetStatus)
          }
        });
        break;
      }
      case 'groceryWidget': {
        this.router.navigate(['home/grocery-list']);
        break;
      }
    }
  }
}
