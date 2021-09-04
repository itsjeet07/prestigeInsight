import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-widget-stacked-bar',
  templateUrl: './stacked-bar.component.html',
  styleUrls: ['./stacked-bar.component.scss']
})
export class StackedBarComponent implements OnInit, OnChanges {
  @Input() data: [];
  @Input() total_count: number;
  finalData: any;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.drawChart();
  }
  drawChart() {
    this.finalData = this.calculateAverage(this.data);
  }
  calculateAverage(data) {
    let sum = 0;
    data.map(function (v) {
      sum += v.value;
    })
    data.map(function (v) {
      if (v.value > 0) {
        v.percentage = ((100 * v.value) / sum).toFixed(0);
        v.width = (((90 * v.value) / sum) - 2).toFixed(0);
      }
      else {
        v.percentage = 0;
        v.width = 0;
      }
    })
    return data;
  }

}
