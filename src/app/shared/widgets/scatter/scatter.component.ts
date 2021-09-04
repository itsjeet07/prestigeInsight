import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts/core';
//var ecStat = require('echarts-stat');
import ecStat from 'echarts-stat/dist/ecStat';

echarts.registerTransform(ecStat.transform.regression);
@Component({
    selector: 'app-widget-scatter-chart',
    templateUrl: './scatter.component.html',
    styleUrls: ['./scatter.component.scss']
})
export class ScatterComponent implements OnInit, OnChanges {
    chartOptions: EChartsOption;

    @Input() data: any;
    constructor() { }

    ngOnInit(): void {
    }

    dateFormatter(unix_timestamp) {
        return new Date(unix_timestamp * 1000).toISOString().slice(0, 19).replace('T', ' ')
    }
    stringToHTML = function (str) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(str, 'text/html');
        return doc.body;
    };
    ngOnChanges() {
        if (this.data) {
            this.chartOptions = {
                dataset: [{
                    source: this.data.chartData
                }, {
                    transform:
                    {
                        type: 'ecStat:regression',
                        config: { method: 'polynomial', order: 3 }
                    }
                }],
                toolbox: {
                    feature: {
                      dataZoom:{},
                      saveAsImage: {},
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    },
                    formatter: (params) => {
                            let ttp = this.dateFormatter(params[0].axisValue) + '<br/>'
                            + params[0].marker + params[0].seriesName + ':' + params[0].value[1] + '<br/>'
                            + params[1].marker + params[1].seriesName + ':' + params[1].value[1];
                            return [this.stringToHTML(ttp)];
                            }
                },
                xAxis: {
                    name:this.data.xtitle || '',
                    nameLocation: 'middle',
                    nameGap:22,
                    nameTextStyle: {
                      fontSize:12,
                    },
                    max: function (value) {
                        return value.max
                    },
                    min: function (value) {
                        return value.min
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    axisLabel: {
                        formatter: (value, index) => {
                            return this.dateFormatter(value);
                        },
                        rotate: 35,
                    }
                },
                yAxis: {
                    name:this.data.xtitle || '',
                    nameLocation: 'middle',
                    nameGap:22,
                    nameTextStyle: {
                      fontSize:12,
                    },
                    max: function (value) {
                        return (value.max + (value.max * 200/100)).toFixed(2);
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    }
                },
                series: [{
                    name: 'Value',
                    type: 'scatter'
                }, {
                    name: 'RMS',
                    type: 'line',
                    smooth: true,
                    datasetIndex: 1,
                    symbolSize: 0.1,
                    symbol: 'circle',
                    label: { show: false, fontSize: 16 },
                    labelLayout: { dx: -20 },
                    encode: { label: 2, tooltip: 1 }
                }],
                grid: {
                    bottom: "25%",
                },
                dataZoom: [
                    {
                        type: "inside",
                        show: true,
                        start: this.data.dataZoomStart || 60
                    }
                ],
            }
        }
    }


}