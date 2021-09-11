import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_services/pages/api.service';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

interface IdeviceRequest {
  device_id: string,
  timestamp?: string
}
interface IRMSRequest {
  device_id: string
  fromDate?: string
  toDate?: string
}
const enum CHART_FN {
  TIME = 'amplitude',
  FREQUENCY = 'frequency'
}

@Component({
  selector: 'app-asset-view',
  templateUrl: './asset-view.component.html',
  styleUrls: ['./asset-view.component.scss']
})

export class AssetViewComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  chartData: any;
  lineChartData: any;
  activeFilters = {
    parameter: 'Acceleration',
    unit: 'ms/s',
    statFunction: 'RMS'
  }
  chartColors = ['#5470c6', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];
  currentId: number;
  devices: any[] = [];
  axisList = ['x', 'y', 'z'];
  stFunctionList = {
    velocity_rms: "Velocity RMS",
    peak: "Peak",
    peak_to_peak: "Peak to Peak"
  }
  DomainList = {
    'amplitude': 'Time Waveform',
    'frequency': 'Frequency Spectrum'
  }
  selectedObj: any = {
    axis: 'x',
    device: null
  };
  chart1Selection = {
    stFunction: 'velocity_rms'
  }
  chart2Selection = {
    domain: 'amplitude'
  }
  chart3Selection = {
    domain: 'amplitude'
  }
  chart4Selection = {
    domain: 'amplitude'
  }
  apiData: any = '';
  deviceData: any;
  accelerationData: any;
  accelerationChartData: any;
  velocityData: any;
  velocityChartData: any;
  displacementData: any;
  displacementChartData: any;
  timestampList = [];
  loadingVelocity: boolean = false;
  loadingDisplacement: boolean = false;
  loadingAcceleration: boolean = false;
  RMSChartData: any;
  RMSData: any;
  isImage = true;


  domain = 'amplitude';
  tabType = 'Acceleration';

  dateFormatter(timestamp) {
    let m = timestamp.getMonth() + 1;
    let d = timestamp.getDate();
    return timestamp.getFullYear() + '-' + (m < 10 ? ('0' + m) : m) + "-" + (d < 10 ? ('0' + d) : d);
  }

  constructor(private apiService: ApiService, private route: ActivatedRoute, private _snackBar: MatSnackBar) {
    this.route.params.subscribe(params => {
      this.currentId = params['id'];
      if (this.currentId && this.currentId != null && this.currentId !== undefined) {
        // this.getVelocityRMS(this.currentId);
        // this.getAcceleration(this.currentId);
        // this.getVelocity(this.currentId);
        // this.getDisplacement(this.currentId);
        this.getAssetData(this.currentId);
      }
    });
  }

  ngOnInit() {
    // this.getAssetDetails();
  }

  // getAssetDetails() {
  //   const data = { equipment_id: this.currentId }
  //   this.apiService.getAssetDetails(data).subscribe(res => {

  //   })
  // }

  resetImg() {
    this.isImage = false;
  }

  getAssetData(id) {
    this.apiService.getAssetDeviceData(id).subscribe(
      (res) => {
        console.log('getAssetData', res)
        if (res && res.device_list && res.device_list.length > 0) {
          this.timestampList = res.timestamp_list;
          this.devices = res.device_list;
          this.selectedObj.device = res.device_id;
          // this.formatResponse(res);
          this.apiData = res;
          this.accelerationData = res.acceleration;
          this.accelerationData.timestamp_list = this.timestampList;
          this.velocityData = res.velocity;
          this.velocityData.timestamp_list = this.timestampList;
          this.displacementData = res.displacement;
          this.displacementData.timestamp_list = this.timestampList;
          this.RMSData = res.velocity_rms;
          this.drawAccelerationChart();
          this.drawDisplacementChart();
          this.drawVelocityChart();
          this.drawRMSChart();
          // this.drawRMSChart();
        }
      },
      (error) => {
        console.log('Error velocity', error);
      }
    )
  }

  rangeFilter(val) {
    let dataObj: IRMSRequest = {
      device_id: this.selectedObj.device
    }
    if (val) {
      dataObj.fromDate = this.dateFormatter(this.range.value.start);
      dataObj.toDate = this.dateFormatter(this.range.value.end)
    }
    this.apiService.getRMSRangeData(dataObj).subscribe(
      (res) => {
        console.log('getRMSRangeData', res)
        if (res && res.data) {
          this.RMSData = res.data;
          this.drawRMSChart();
        }
        if (res && res.velocity_rms) {
          this.RMSData = res.velocity_rms;
          this.drawRMSChart();
        }
      },
      (error) => {
        console.log('getRMSRangeData Error', error);
        this._snackBar.open(error.error.Message, 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
      }
    )
  }
  getAccelerationData(timestamp = null) {
    this.loadingAcceleration = true;
    let data: IdeviceRequest = {
      device_id: this.selectedObj.device
    }
    if (timestamp) {
      data.timestamp = timestamp;
    }
    this.apiService.getAccelerationAmplitude(data, this.domain).subscribe(
      (res) => {
        console.log('getAccelerationAmplitude', res)
        this.accelerationData = res;
        this.drawAccelerationChart();
      },
      (error) => {
        console.log('Error velocity', error);
      }
    )
  }
  getVelocityData(timestamp = null) {
    this.loadingVelocity = true
    let data: IdeviceRequest = {
      device_id: this.selectedObj.device
    };
    if (timestamp) {
      data.timestamp = timestamp;
    }
    this.apiService.getVelocityAmplitude(data, this.domain).subscribe(
      (res) => {
        this.velocityData = res;
        this.drawVelocityChart();
      },
      (error) => {
        console.log('Error velocity', error);
      }
    )
  }
  getDisplacementData(timestamp = null) {
    this.loadingDisplacement = true;
    let data: IdeviceRequest = {
      device_id: this.selectedObj.device
    }
    if (timestamp) {
      data.timestamp = timestamp;
    }
    this.apiService.getDisplacementAmplitude(data, this.chart4Selection.domain).subscribe(
      (res) => {
        console.log('getDisplacementAmplitude', res)
        this.displacementData = res;
        this.drawDisplacementChart();
      },
      (error) => {
        console.log('Error velocity', error);
      }
    )
  }

  formatRMSData(data) {
    this.RMSData = data;
  }
  /*
  getVelocityRMS(id){
    this.apiService.getVelocityRMSapi(id).subscribe(
      (res) => {
        console.log('velocity', res)
        if(res && res.length > 0){
          this.formatResponse(res);
          this.apiData = res;
          this.drawRMSChart();
        }
      },
      (error) => {
        console.log('Error velocity', error);
      }
    )
  }
  */
  getAcceleration(id) {
    this.apiService.getAcceleration(id).subscribe(
      (res) => {
        console.log('getAcceleration', res)
        if (res && res.length > 0) {
          this.formatAccelerationData(res);
        }
      },
      (error) => {
        console.log('Error velocity', error);
      }
    )
  }
  getVelocity(id) {
    this.apiService.getVelocity(id).subscribe(
      (res) => {
        if (res && res.length > 0) {
          this.formatVelocityData(res);
        }
      },
      (error) => {
        console.log('Error velocity', error);
      }
    )
  }
  getDisplacement(id) {
    this.apiService.getDisplacement(id).subscribe(
      (res) => {
        if (res && res.length > 0) {
          this.formatDisplacementData(res);
        }
      },
      (error) => {
        console.log('Error velocity', error);
      }
    )
  }


  getHarmonicsData(fnType) {
    console.log('getHarmonicsData', fnType)
    let waveType = this.chart4Selection.domain;
    let timeStamp = this.displacementData.timestamp;
    if (fnType === 'acceleration') {
      waveType = this.chart2Selection.domain
      timeStamp = this.accelerationData.timestamp
    }
    if (fnType === 'velocity') {
      waveType = this.chart3Selection.domain
      timeStamp = this.velocityData.timestamp
    }
    let reqObj = {
      device_id: this.selectedObj.device,
      data_type: fnType,
      wave_type: waveType,
      timestamp: timeStamp,
      axis: this.selectedObj.axis
    }
    this.apiService.getHarmonicsData(reqObj).subscribe(
      (res) => {
        if (res) {
          if (fnType === 'acceleration') {
            this.accelerationData.harmonics = res.data;
            this.drawAccelerationChart(true)
          }
          else if (fnType === 'velocity') {
            this.velocityData.harmonics = res.data;
            this.drawVelocityChart(true)
          }
          else {
            this.displacementData.harmonics = res.data;
            this.drawDisplacementChart(true)
          }
          console.log(res);
        }
      },
      (error) => {
        console.log('Error velocity', error);
      }
    )
  }

  formatResponse(res) {
    let deviceList = [];
    let deviceData = {};
    res.map(function (val, ind) {
      deviceList.push(...(Object.keys(val)));
      deviceData = { ...deviceData, ...val };
    })
    this.devices = deviceList;
    this.selectedObj.device = deviceList[0];
    this.deviceData = deviceData;
    console.log(this.deviceData);
  }
  formatAccelerationData(res) {
    let data = {};
    let deviceList = [];
    res.map(function (val, ind) {
      deviceList.push(...(Object.keys(val)));
      data = { ...data, ...val };
    })
    this.accelerationData = data;
    this.drawAccelerationChart();
  }
  formatVelocityData(res) {
    let data = {};
    let deviceList = [];
    res.map(function (val, ind) {
      deviceList.push(...(Object.keys(val)));
      data = { ...data, ...val };
    })
    this.velocityData = data;
    this.drawVelocityChart();
  }
  formatDisplacementData(res) {
    let data = {};
    let deviceList = [];
    res.map(function (val, ind) {
      deviceList.push(...(Object.keys(val)));
      data = { ...data, ...val };
    })
    this.displacementData = data;
    this.drawDisplacementChart();
  }
  changeDevice(deviceId) {
    this.selectedObj.device = deviceId;
    this.getAccelerationData();
    this.getVelocityData();
    this.getDisplacementData();
    this.rangeFilter(false);
    // this.drawRMSChart();
    // this.drawAccelerationChart();
    // this.drawDisplacementChart();
    // this.drawVelocityChart();
  }
  changeAxis(axis) {
    this.selectedObj.axis = axis;
    this.drawAccelerationChart();
    this.drawDisplacementChart();
    this.drawVelocityChart();
    this.drawRMSChart();
  }
  changeStFunction(fn_name) {
    this.chart1Selection.stFunction = fn_name;
    this.drawRMSChart();
  }
  changeAccDomain(fn_name) {
    this.chart2Selection.domain = fn_name;
    this.getAccelerationData(this.accelerationData.timestamp);
  }
  changeVelDomain(fn_name) {
    this.chart3Selection.domain = fn_name;
    this.getVelocityData(this.velocityData.timestamp);
  }
  changeDisDomain(fn_name) {
    this.chart4Selection.domain = fn_name;
    this.getDisplacementData(this.displacementData.timestamp);
  }
  changeAccTime(timestamp) {
    this.getAccelerationData(timestamp);
  }
  changeVelTime(timestamp) {
    this.getVelocityData(timestamp);
  }
  changeDisTime(timestamp) {
    this.getDisplacementData(timestamp);
  }

  changeDomain(domain) {
    this.domain = domain;
    this.chart2Selection.domain = domain;
    if (this.tabType == 'Acceleration') {
      this.changeAccDomain(domain);
    };
    if (this.tabType == 'Velocity') {
      this.changeVelDomain(domain);
    };
    if (this.tabType == 'Displacement') {
      this.changeDisDomain(domain);
    };
  };

  changeTabType(e) {
    this.tabType = e.tab.textLabel;
    if (this.tabType == 'Acceleration') {
      if (this.domain == 'frequency') {
        this.changeAccDomain('frequency');
      }
    };
    if (this.tabType == 'Velocity') {
      if (this.domain == 'frequency') {
        this.changeVelDomain('frequency');
      }
    };
    if (this.tabType == 'Displacement') {
      if (this.domain == 'frequency') {
        this.changeDisDomain('frequency');
      }
    }
  };
  // drawRMSChart(){
  //   let selectedAxis = this.selectedObj.axis;
  //   let selectedFn = this.chart1Selection.stFunction;
  //   let chartData = [
  //     {
  //       "name": "x",
  //       "type": "line",
  //       "barGap": 0,
  //       "emphasis": {
  //         "focus": "series"
  //       },
  //       "data": []
  //     },
  //     {
  //       "name": "y",
  //       "type": "line",
  //       "barGap": 0,
  //       "emphasis": {
  //         "focus": "series"
  //       },
  //       "data": []
  //     },
  //     {
  //       "name": "z",
  //       "type": "line",
  //       "barGap": 0,
  //       "emphasis": {
  //         "focus": "series"
  //       },
  //       "data": []
  //     }
  //   ];
  //   let data = this.deviceData[this.selectedObj.device];
  //   let time_stamps = Object.keys(data);
  //   time_stamps.map(function(val,ind){
  //     // let selectedAxisData =  data[val].find(function(v,i){
  //     //   return v.axis === selectedAxis;
  //     // });
  //     // chartData[0].data[ind] = selectedAxisData[selectedFn];
  //     data[val].map(function(v,i){
  //       if(v.axis === 'x'){
  //         chartData[0].data[ind] = v[selectedFn];
  //       }
  //       if(v.axis === "y"){
  //         chartData[1].data[ind] = v[selectedFn];
  //       }
  //       if(v.axis === 'z'){
  //         chartData[2].data[ind] = v[selectedFn]
  //       }
  //     })
  //   })
  //   this.lineChartData = {
  //     chartData : chartData,
  //     timeline : time_stamps,
  //     legend: ['x','y','z'],
  //     title: 'Device - ' + this.selectedObj.device //+ '-' + selectedAxis
  //   }
  // }


  unixDateFormatter(unix_timestamp) {
    return new Date(unix_timestamp * 1000).toISOString().slice(0, 19).replace('T', ' ')
  }
  drawRMSChart() {
    let selectedAxis = this.selectedObj.axis;
    let selectedRMSFn = this.chart1Selection.stFunction;
    let chartData = [];
    // for(let i=0; i < this.RMSData.length; i++){
    //   let v = this.RMSData[i];
    //   chartData.push([this.unixDateFormatter(v.timestamp), parseFloat(v[selectedAxis][selectedRMSFn])]); 
    // }
    this.RMSData.map(function (v, i) {
      chartData.push([v.timestamp, parseFloat(v[selectedAxis][selectedRMSFn])]);
    })
    this.RMSChartData = {
      chartData: chartData,
      name: this.stFunctionList[selectedRMSFn]
    }
    console.log('RMSChartData', chartData)
  }
  drawAccelerationChart(harmonics = false) {
    let selectedAxis = this.selectedObj.axis;
    let dataZoomEndValue = null;
    let chartData: any = [
      {
        "name": 'Acceleration ' + (this.chart2Selection.domain === 'frequency' ? 'Frequency' : 'Time'),
        "type": "line",
        "barGap": 0,
        "emphasis": {
          "focus": "series"
        },
        "data": [],
        "selectedMode": "multiple"
      }
    ];
    let data = this.accelerationData[selectedAxis];
    chartData[0].data = data;
    let time_stamps = this.accelerationData.samples_time ? this.accelerationData.samples_time : this.apiData.samples_time;
    if (harmonics) {
      let hmData = [];
      let freq = ['71.11111111111111',
        '142.22222222222223',
        '213.33333333333334',
        '284.44444444444446',
        '355.55555555555554',
        '426.6666666666667',
        '497.77777777777777',
        '568.8888888888889',
        '640.0',
        '711.1111111111111',
        '782.2222222222223',
        '853.3333333333334',
        '924.4444444444445',
        '995.5555555555555',
        '1066.6666666666667',
        '1137.7777777777778'];
      let amp = ['0.0',
        '0.0',
        '0.0',
        '0.0',
        '0.0',
        '0.0',
        '0.0',
        '0.0',
        '0.0',
        '0.0',
        '0.0',
        '0.0',
        '0.0007943680281447879',
        '0.0',
        '0.0',
        '0.0']
      // this.accelerationData.harmonics.amp.map((v, i) =>{
      //   hmData[time_stamps.indexOf(v)] = this.accelerationData.harmonics.freq[i];
      //   chartData[0].markLine.data.push({
      //     x: parseFloat(this.accelerationData.harmonics.freq[i])
      //   })
      // chartData[0].markLine.data.push({
      //   name: 'Markline between two points',
      //   coord: [this.accelerationData.harmonics.freq[i], v]
      // })
      //})
      freq.map((v, i) => {
        hmData[time_stamps.indexOf(v)] = amp[i];
      });
      let harmonics = {
        name: "Harmonics",
        type: "bar",
        barWidth: 10,
        barMinHeight: 10,
        barGap: 0,
        tooltip: {
          trigger: 'item'
        },
        emphasis: {
          focus: "series"
        },
        data: hmData, //this.accelerationData.harmonics.freq,
        selectedMode: "multiple"
      }
      chartData.push(harmonics)
      dataZoomEndValue = freq[freq.length - 1];
    }
    this.accelerationChartData = {
      chartData: chartData,
      timeline: time_stamps,
      legend: selectedAxis,
      title: chartData[0].name + ' - Device - ' + this.selectedObj.device + ' ' + selectedAxis + ' Axis',
      dataZoomStart: 0.001,
      xtitle: this.chart2Selection.domain === 'frequency' ? 'Frequency (HZ)' : 'Time (Sec)',
      ytitle: 'Acceleration (g)',
      showDeltaT: this.chart2Selection.domain === CHART_FN.TIME,
      dataZoomEndValue: dataZoomEndValue,
      colors: this.chartColors
    }
    this.loadingAcceleration = false;
  }
  drawVelocityChart(harmonics = false) {
    let selectedAxis = this.selectedObj.axis;
    let dataZoomEndValue = null;
    let chartData = [
      {
        "name": 'Velocity ' + (this.chart3Selection.domain === 'frequency' ? 'Frequency' : 'Time'),
        "type": "line",
        "barGap": 0,
        "emphasis": {
          "focus": "series"
        },
        "data": []
      }
    ];
    let data = this.velocityData[selectedAxis];
    chartData[0].data = data
    let time_stamps = this.velocityData.samples_time ? this.velocityData.samples_time : this.apiData.samples_time;
    if (harmonics) {
      let hmData = [];
      let freq = ['71.11111111111111',
        '142.22222222222223',
        '213.33333333333334',
        '284.44444444444446',
        '355.55555555555554',
        '426.6666666666667',
        '497.77777777777777',
        '568.8888888888889',
        '640.0',
        '711.1111111111111',
        '782.2222222222223',
        '853.3333333333334',
        '924.4444444444445',
        '995.5555555555555',
        '1066.6666666666667',
        '1137.7777777777778'];
      let amp = ['0.0',
        '0.0',
        '0.0',
        '0.0',
        '0.0',
        '0.0',
        '0.0',
        '0.0',
        '0.0',
        '0.0',
        '0.0',
        '0.0',
        '0.0007943680281447879',
        '0.0',
        '0.0',
        '0.0']
      // this.accelerationData.harmonics.amp.map((v, i) =>{
      //   hmData[time_stamps.indexOf(v)] = this.accelerationData.harmonics.freq[i];
      //   chartData[0].markLine.data.push({
      //     x: parseFloat(this.accelerationData.harmonics.freq[i])
      //   })
      // chartData[0].markLine.data.push({
      //   name: 'Markline between two points',
      //   coord: [this.accelerationData.harmonics.freq[i], v]
      // })
      //})
      freq.map((v, i) => {
        hmData[time_stamps.indexOf(v)] = amp[i];
      });
      let harmonics = {
        name: "Harmonics",
        type: "bar",
        barWidth: 10,
        barMinHeight: 10,
        barGap: 0,
        tooltip: {
          trigger: 'item'
        },
        emphasis: {
          focus: "series"
        },
        data: hmData, //this.accelerationData.harmonics.freq,
        selectedMode: "multiple"
      }
      chartData.push(harmonics)
      dataZoomEndValue = freq[freq.length - 1];
    }


    this.velocityChartData = {
      chartData: chartData,
      timeline: time_stamps,
      legend: selectedAxis,
      title: chartData[0].name + ' - Device - ' + this.selectedObj.device + ' ' + selectedAxis + ' Axis',
      dataZoomStart: 0.001,
      xtitle: this.chart3Selection.domain === 'frequency' ? 'Frequency (HZ)' : 'Time (Sec)',
      ytitle: 'Velocity (mm/sec)',
      showDeltaT: this.chart3Selection.domain === CHART_FN.TIME,
      dataZoomEndValue: dataZoomEndValue,
      colors: this.chartColors
    }
    this.loadingVelocity = false;
  }

  drawDisplacementChart(harmonics = false) {
    let selectedAxis = this.selectedObj.axis;
    let dataZoomEndValue = null;
    let chartData = [
      {
        "name": 'Displacement ' + (this.chart4Selection.domain === 'frequency' ? 'Frequency' : 'Time'),
        "type": "line",
        "barGap": 0,
        "emphasis": {
          "focus": "series"
        },
        "data": []
      }
    ];
    let data = this.displacementData[selectedAxis];
    chartData[0].data = data;
    let time_stamps = this.displacementData.samples_time ? this.displacementData.samples_time : this.apiData.samples_time;
    if (harmonics) {
      let hmData = [];
      let freq = ['71.11111111111111',
        '142.22222222222223',
        '213.33333333333334',
        '284.44444444444446',
        '355.55555555555554',
        '426.6666666666667',
        '497.77777777777777',
        '568.8888888888889',
        '640.0',
        '711.1111111111111',
        '782.2222222222223',
        '853.3333333333334',
        '924.4444444444445',
        '995.5555555555555',
        '1066.6666666666667',
        '1137.7777777777778'];
      let amp = ['0.0',
        '0.0',
        '0.0',
        '0.0',
        '0.0',
        '0.0',
        '0.0',
        '0.0',
        '0.0',
        '0.0',
        '0.0',
        '0.0',
        '0.0007943680281447879',
        '0.0',
        '0.0',
        '0.0']
      // this.accelerationData.harmonics.amp.map((v, i) =>{
      //   hmData[time_stamps.indexOf(v)] = this.accelerationData.harmonics.freq[i];
      //   chartData[0].markLine.data.push({
      //     x: parseFloat(this.accelerationData.harmonics.freq[i])
      //   })
      // chartData[0].markLine.data.push({
      //   name: 'Markline between two points',
      //   coord: [this.accelerationData.harmonics.freq[i], v]
      // })
      //})
      freq.map((v, i) => {
        hmData[time_stamps.indexOf(v)] = amp[i];
      });
      let harmonics = {
        name: "Harmonics",
        type: "bar",
        barWidth: 10,
        barMinHeight: 10,
        barGap: 0,
        tooltip: {
          trigger: 'item'
        },
        emphasis: {
          focus: "series"
        },
        data: hmData, //this.accelerationData.harmonics.freq,
        selectedMode: "multiple"
      }
      chartData.push(harmonics)
      dataZoomEndValue = freq[freq.length - 1];
    }

    this.displacementChartData = {
      chartData: chartData,
      timeline: time_stamps,
      legend: selectedAxis,
      title: chartData[0].name + ' - Device - ' + this.selectedObj.device + ' ' + selectedAxis + ' Axis',
      dataZoomStart: 0.001,
      xtitle: this.chart4Selection.domain === 'frequency' ? 'Frequency (HZ)' : 'Time (Sec)',
      ytitle: 'Displacement (Micron)',
      showDeltaT: this.chart4Selection.domain === CHART_FN.TIME,
      dataZoomEndValue: dataZoomEndValue,
      colors: this.chartColors
    }
    this.loadingDisplacement = false
  }

  drawChart() {
    let chartData = [
      {
        "name": "x",
        "type": "line",
        "barGap": 0,
        "emphasis": {
          "focus": "series"
        },
        "data": []
      },
      {
        "name": "y",
        "type": "line",
        "emphasis": {
          "focus": "series"
        },
        "data": []
      },
      {
        "name": "z",
        "type": "line",
        "emphasis": {
          "focus": "series"
        },
        "data": []
      }];
    let time_stamps = [];
    this.chartData.map(function (v, i) {
      time_stamps.push(v.time_stamp);
      v.velocity.map(function (val, ind) {
        if (val.key === 'x') {
          chartData[0].data[i] = val.value;
        }
        if (val.key === "y") {
          chartData[1].data[i] = val.value;
        }
        if (val.key === 'z') {
          chartData[2].data[i] = val.value;
        }
      });
    })
    this.lineChartData = {
      chartData: chartData,
      timeline: time_stamps,
      legend: ['x', 'y', 'z'],
      title: 'Asset Health Trend'
    }
    console.log(this.lineChartData);

  }

  drawTimelineChart(timeline: string) {
    console.log('timeline', timeline)
  }

}
