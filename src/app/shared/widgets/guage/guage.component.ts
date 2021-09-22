import { Component, OnInit, Input } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
    selector: 'app-widget-guage',
    templateUrl: './guage.component.html',
    styleUrls: ['./guage.component.scss']
})
export class GuageComponent implements OnInit {
    @Input() score: number;
    chartOption: EChartsOption;
    ngOnInit() {
        this.chartOption = {
            series: [{
                type: 'gauge',
                startAngle: 180,
                endAngle: 0,
                axisLine: {
                    lineStyle: {
                        width: 10,
                        color: [
                            [0.25, '#EE6666'],
                            [0.5, '#FAC858'],
                            //[0.75, '#58D9F9'],
                            [0.75, '#91CC75'],
                            [1, '#5470C6']
                        ]
                    }
                },
                pointer: {
                    icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                    length: '8%',
                    width: 10,
                    offsetCenter: [0, '-80%'],
                    itemStyle: {
                        color: 'auto'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    distance: 0,
                    formatter: function (value) {
                        if (value === 0 || value === 10) {
                            return value + '';
                        }
                    }
                },
                detail: {
                    valueAnimation: true,
                    offsetCenter: [0, '0%'],
                    formatter: '{value}',
                    color: 'auto'
                },
                min: 0,
                max: 10,
                data: [{
                    name: "\n Plant Score",
                    value: this.score
                }]
            }]
        };
    }


    /*
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    },300);
  
    */

}
