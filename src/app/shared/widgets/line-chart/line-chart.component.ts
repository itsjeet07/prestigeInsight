import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-widget-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, OnChanges {
  chartOptions: EChartsOption
  @Input() data: any;
  showDeltaT : boolean = false;
  t1: any = '';
  t2: any = '';
  t1Selected: boolean = false;
  t2Selected: boolean = false;
  deltaTSelected: boolean = false;
  deltaT: number = 0;
  highlightData: any = {
    type :'highlight'
  };
  echartsInstance : any;
  
  onChartInit(ec) {
    this.echartsInstance = ec;
  }

  constructor() { }

  ngOnInit() {  }

  ngOnChanges(){
    if(this.data){
      this.showDeltaT = this.data.showDeltaT || false;
      this.chartOptions = {
          title: {
              text: this.data.title
          },
          tooltip: {
              trigger: 'axis'
          },
          legend: {
              data: this.data.legend
          },
          grid: {
              left: '5%',
              right: '4%',
              bottom: '18%',
              containLabel: true
          },
          textStyle: {
            fontSize: 6
          },
          toolbox: {
              feature: {
                dataZoom:{},
                saveAsImage: {},
              }
          },
          select:{
            label: {
              show: true,
            }
          },
          selectMode:true,
          xAxis: {
              name:this.data.xtitle || '',
              nameLocation: 'middle',
              nameGap:22,
              nameTextStyle: {
                fontSize:12,
              },
              type: 'category',
              boundaryGap: false,
              data: this.data.timeline,
              axisLabel: {
                  formatter: (value, index) => {
                      return parseFloat(value).toFixed(3);
                  },
              }
          },
          yAxis: {
            name:this.data.ytitle || '',
            nameLocation: 'middle',
            nameGap:30,
            nameTextStyle: {
              fontSize:12,
            },
              type: 'value',
              max: function (value) {
                  return (value.max + (value.max * 20/100)).toFixed(2);
              }
          },
          dataZoom: [
            {
              type: "slider",
              show: true,
              start: this.data.dataZoomStart || 60
            },
            {
              type: "inside",
              show: true,
              start: this.data.dataZoomStart || 60
            }
          ],
          series: this.data.chartData
      }
      if(this.data.dataZoomEndValue){
        this.chartOptions.dataZoom[0].endValue = this.data.dataZoomEndValue
        this.chartOptions.dataZoom[1].endValue = this.data.dataZoomEndValue
      }
      if(this.data.colors){
        this.chartOptions.color = this.data.colors;
      }
    }

  }
  onChartClick(ev){
    if(!this.t1Selected){
      this.t1 = ev.value;
      this.t2 = null;
      this.t1Selected = true;
      this.t2Selected = false;
    }
    else{
      this.t2 = ev.value
      this.t2Selected = true;
      this.deltaT = parseFloat((parseFloat(this.t2) - parseFloat(this.t1)).toFixed(3));
      this.deltaTSelected = true;
      this.t1Selected = false;
    }
    this.echartsInstance._api.dispatchAction({
      type: 'select',
  
      // Find  by index or id or name.
      // Can be an array to find multiple components.
      // seriesIndex?: number | number[],
      // seriesId?: string | string[],
      // seriesName?: string | string[],
  
      // data index; could assign by name attribute when not defined
       dataIndex: ev.dataIndex,
      // optional; data name; ignored when dataIndex is defined
      // name?: string | string[],
  })
  }
}
