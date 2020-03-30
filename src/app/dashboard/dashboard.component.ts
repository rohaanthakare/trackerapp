import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { MasterDataService } from '../services/master-data.service';
import { CurrencyPipe } from '@angular/common';
import { MasterViewService } from '../services/master-view.service';
import { MenuController } from '@ionic/angular';
import { Chart } from 'chart.js';
import { GlobalConstants } from '../global/global-contants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('barCanvas', {static: false}) barCanvas: ElementRef;
  private barChart: Chart;
  budgetStatus = [];
  expenseSplit = [];
  expenseCategory = [];
  totalMonthlyExpense: any;
  totalBalance: any;
  moneyToGive: any;
  moneyToTake: any;

  constructor(private userService: UserService, private masterDataService: MasterDataService, private cp: CurrencyPipe) { }

  ngOnInit() {
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
        this.prepareAccountBalanceChartData(response.accounts);
        this.createBalanceChart(response.expenseHistory);
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

  prepareBudgetStatus(data) {
    this.budgetStatus = [];
    for (const key in data) {
      if (data[key] > 0) {
        const catg = this.expenseCategory.find((c) => c.configCode === key);
        const spentCfg = this.expenseSplit.find((c) => c.name === catg.configName);
        const spentAmt = (spentCfg) ? spentCfg.value : 0;
        const spentAmtLbl = this.cp.transform(spentAmt, 'INR', '');
        const allocatedLbl = this.cp.transform(data[key], 'INR', '');
        const spentPer = (data[key] - spentAmt) / data[key];
        let progressColor = 'primary';

        if (spentPer <= 0) {
          progressColor = 'dark';
        } else if (spentPer > 0 && spentPer < 0.1) {
          progressColor = 'danger';
        } else if (spentPer > 0.11 && spentPer < 0.5) {
          progressColor = 'warning';
        } else if (spentPer > 0.51 && spentPer < 0.80) {
          progressColor = 'primary';
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
  }

  createBalanceChart(data) {
    const chartLabels = [];
    const chartData = [];
    const colors = [];
    data.forEach((d) => {
      const labelEle = GlobalConstants.MONTHS_MMM[d._id.month - 1] + ' - ' + d._id.year;
      chartLabels.push(labelEle);
      const dataEle = d.total;
      chartData.push(dataEle);
      colors.push(GlobalConstants.SINGLE_COLOR.domain);
    });
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: 'Monthly Expense',
            data: chartData,
            backgroundColor: colors,
            borderColor: colors,
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  }
}
