import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
    selector: 'app-widget-pie',
    templateUrl: './pie.component.html',
    styleUrls: ['./pie.component.scss']
})
export class PieComponent implements OnInit, OnChanges {
    chartOption: EChartsOption;
    @Input() data: [];
    constructor() { }

    ngOnInit() { }
    ngOnChanges() {
        if (this.data) {

            this.chartOption = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    top: '25%',
                    // right: '2%',
                    left: '70%',
                    // align: 'right'

                },
                series: [
                    {
                        type: 'pie',
                        name: 'Asset Summary',
                        radius: ['40%', '60%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '12',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: this.data
                    }
                ]
            }
        }
    }

}

