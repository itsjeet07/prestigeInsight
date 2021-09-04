import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-widget-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})
export class BarComponent implements OnInit, OnChanges {

  chartOptions:EChartsOption;
  @Input() data:any;
  constructor() { }

  ngOnInit() {
    this.setChartData();
  }
  ngOnChanges(){
    this.setChartData();  
  }
  setChartData(){
    this.chartOptions = {
      "tooltip": {
        "trigger": "axis",
        "axisPointer": {
          "type": "shadow"
        }
      },
      "legend": {
        "data": this.data.legend
      },

      // "toolbox": {
      //   "show": true,
      //   "orient": "vertical",
      //   "left": "right",
      //   "top": "center",
      //   "feature": {
      //     "mark": {
      //       "show": true
      //     },
      //     "magicType": {
      //       "show": true,
      //       "type": [
      //         "bar",
      //         "stack",
      //         "tiled"
      //       ]
      //     },
      //     "saveAsImage": {
      //       "show": true
      //     }
      //   }
      // },
      "xAxis": [
        {
          "type": "category",
          "axisTick": {
            "show": false
          },
          "data": this.data.timeline
        }
      ],
      "yAxis": [
        {
          "type": "value"
        }
      ],
      "dataZoom": [
        {
          "type": "slider",
          "show": true,
          "start": 95
        }
      ],
      "series": this.data.chartData
    }
  }

}
