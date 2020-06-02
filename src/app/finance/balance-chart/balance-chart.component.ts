import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { GlobalConstants } from 'src/app/global/global-contants';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { FinanceService } from 'src/app/services/finance.service';

@Component({
  selector: 'app-balance-chart',
  templateUrl: './balance-chart.component.html',
  styleUrls: ['./balance-chart.component.scss'],
})
export class BalanceChartComponent implements OnInit {
  private pieChart: Chart;
  private accounts = [];
  appUrl: any;
  @ViewChild('pieCanvas', {static: false}) barCanvas: ElementRef;
  constructor(private financeService: FinanceService) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.financeService.getFinancialAccounts().subscribe(
      (response: any) => {
        this.createBalanceChart(response.data);
      }
    );
  }

  createBalanceChart(data) {
    console.log(data);
    const chartLabels = [];
    const chartData = [];
    const colors = [];
    let maxValue = 0;
    let index = 0;
    data.forEach((d) => {
      chartLabels.push(d.accountName);
      if (d.total > maxValue) {
        maxValue = d.total;
      }
      const dataEle = d.balance;
      chartData.push(dataEle);
      colors.push(GlobalConstants.COLORS.domain[index]);
      index++;
    });
    const chartStepSize = maxValue / 5;
    this.pieChart = new Chart(this.barCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: 'Monthly Expense',
            data: chartData,
            backgroundColor: colors,
            borderColor: colors,
            borderWidth: 0
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        legend: {
          display: true,
          labels: {
            fontColor: '#FFFFFF'
          }
        }
      }
    });
  }
}
