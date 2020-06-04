import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalConstants } from 'src/app/global/global-contants';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-expense-charts',
  templateUrl: './expense-charts.component.html',
  styleUrls: ['./expense-charts.component.scss'],
})
export class ExpenseChartsComponent implements OnInit {
  private expenseSplitChart: Chart;
  @ViewChild('monthlyExpense', {static: false}) expenseSplitCanvas: ElementRef;
  private expenseHistoryChart: Chart;
  @ViewChild('expenseHistory', {static: false}) expenseHistoryCanvas: ElementRef;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.route.queryParams.subscribe(
      params => {
        this.createExpenseSplit(JSON.parse(params.expenseSplit));
        this.createExpenseHistory(JSON.parse(params.expenseHistory));
      }
    );
  }

  createExpenseSplit(data) {
    console.log(data);
    const chartLabels = [];
    const chartData = [];
    const colors = [];
    let index = 0;
    data.forEach((d) => {
      chartLabels.push(d.name);
      const dataEle = d.value;
      chartData.push(dataEle);
      colors.push(GlobalConstants.COLORS.domain[index]);
      index++;
    });
    this.expenseSplitChart = new Chart(this.expenseSplitCanvas.nativeElement, {
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
          position: 'right',
          labels: {
            fontColor: '#FFFFFF'
          }
        }
      }
    });
  }

  createExpenseHistory(data) {
    const chartLabels = [];
    const chartData = [];
    const colors = [];
    let maxValue = 0;
    data.forEach((d) => {
      const labelEle = GlobalConstants.MONTHS_MMM[d._id.month - 1] + ' - ' + d._id.year;
      chartLabels.push(labelEle);
      if (d.total > maxValue) {
        maxValue = d.total;
      }
      const dataEle = d.total;
      chartData.push(dataEle);
      colors.push('rgba(111,255,233,0.5)');
    });
    const chartStepSize = maxValue / 5;
    this.expenseHistoryChart = new Chart(this.expenseHistoryCanvas.nativeElement, {
      type: 'bar',
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
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                stepSize: chartStepSize,
                fontColor: '#FFFFFF'
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                fontColor: '#FFFFFF'
              }
            }
          ]
        }
      }
    });
  }
}
