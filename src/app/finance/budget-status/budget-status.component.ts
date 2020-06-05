import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-budget-status',
  templateUrl: './budget-status.component.html',
  styleUrls: ['./budget-status.component.scss'],
})
export class BudgetStatusComponent implements OnInit {
  budgetStatus: any;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.route.queryParams.subscribe(
      params => {
        console.log(params.budgetStatus);
        this.budgetStatus = JSON.parse(params.budgetStatus);
      }
    );
  }
}
