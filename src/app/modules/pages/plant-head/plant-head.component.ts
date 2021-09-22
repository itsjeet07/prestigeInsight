import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../_services/pages/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { TableSorting } from 'src/app/_services/common/tableSort';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-plant-head',
  templateUrl: './plant-head.component.html',
  styleUrls: ['./plant-head.component.scss']
})
export class PlantHeadComponent implements OnInit {
  pieCharts: any;
  pieChartData: any;
  barChartData: any;
  plantScore: number;
  apiData: any;
  activeChart: string;
  tableData: any;
  dataSource: any;
  displayedColumns: string[];
  ELEMENT_DATA: PeriodicElement[] = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
    { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
    { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
    { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
    { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
    { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
    { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
    { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
    { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
    { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
    { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
  ];
  dataSourceEq: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  thisClass: string = 'none';
  equipmentList: any;
  displayedColumnsEq: string[];
  selectedArea: any;
  newColor = false;
  constructor(private apiService: ApiService, protected tableSort: TableSorting,) {

  }

  ngOnInit() {

    //this.getAssetConditions();
    this.getAssetConditionsV2();
    // this.getTableData();
    this.getAreaList();
  }

  getAssetConditionsV2() {
    var dataObj = {
      "company_id": 16
    }
    let self = this;
    this.apiService.getDeviceStatus(dataObj).subscribe(
      (res) => {
        if (res && res.health_list && res.health_list.length > 0) {
          self.drawAssetSummary(res.health_list);
        }
      },
      (err) => {

      }
    )
  }
  getAssetConditions() {
    const res = this.apiService.getPlantAssetConditions();
    if (res.data) {
      this.apiData = res.data;
      this.plantScore = res.data.plant_score;
      this.drawTimelineChart('week');
    }
    this.pieCharts = res.data;

  }
  getAreaList(locationId = 6) {
    let dataObj = {
      location_id: locationId
    }
    this.apiService.getAreaList(dataObj).subscribe(
      (res) => {
        if (res && res.data) {
          this.tableData = res.data;
          this.displayedColumns = ['health_score', 'area_name', 'rating_breakup', 'no_assets'];
          this.dataSource = new MatTableDataSource(this.tableData);
          if (this.tableData.length) {
            this.selectedArea = this.tableData[0];
            this.getEquipmentList(this.selectedArea.area_id);
          }
          this.dataSource.paginator = this.paginator;
          if (res.plant_details) {
            this.apiData = res.plant_details;
            this.plantScore = res.plant_details.plant_score.toFixed(1);
          }
        }
      },
      (err) => {

      }
    )
  }

  getEquipmentData(eqp) {
    const id = 'area-' + eqp.area_id;
    const a = document.getElementById(id)
    a.style.background = 'yellow';
    setTimeout(() => {
      a.style.backgroundColor = 'white';
    }, 150)
    this.selectedArea = eqp;
    // this.selectedEquipment = equipment;
    this.getEquipmentList(eqp.area_id)
  }

  setEqpBtn(eqp) {
    const id = 'eqp-' + eqp.equipment_id;
    const a = document.getElementById(id)
    a.style.background = 'yellow';
    setTimeout(() => {
      a.style.backgroundColor = 'white';
    }, 100)
  }

  getEquipmentList(areaId = null) {
    let dataObj = {
      area_id: areaId
    }
    this.apiService.getEquipmentList(dataObj).subscribe(
      (res) => {
        if (res && res.equipment_list && res.equipment_list.length > 0) {
          this.equipmentList = res.equipment_list;
          this.displayedColumnsEq = ['equipment_id', 'name', 'description'];
          this.dataSourceEq = new MatTableDataSource(this.equipmentList);
          // this.selectedEquipment = res.equipment_list[0];
          // this.getAssetsList(this.equipmentList[0].equipment_id);
        }
      },
      (error) => {
        console.log('api err', error);
      }
    )
  }

  sortHandler(column, tableName) {
    if (tableName == 'area') {
      const sortedData = this.tableSort.Sort(column, this.dataSource['data']);
      this.dataSource = new MatTableDataSource(sortedData);
    };
    if (tableName == 'equipment') {
      const sortedData = this.tableSort.Sort(column, this.dataSourceEq['data']);
      this.dataSourceEq = new MatTableDataSource(sortedData);
    };
  }

  formatStackData(data) {
    let keys = Object.keys(data);
    let chartData = [];
    if (keys.length > 0) {
      chartData = [{
        name: 'Good',
      },
      {
        name: 'satisfactory',
      },
      {
        name: 'unsatisfactory',
      },
      {
        name: 'unacceptable',
      }];
      chartData[0].value = data.good;
      chartData[1].value = data.satisfactory;
      chartData[2].value = data.unsatisfactory;
      chartData[3].value = data.unacceptable;
    }
    return chartData;
  }

  getTableData() {
    const res = this.apiService.getTableData()
    if (res && res.data) {
      this.tableData = res.data;
      this.displayedColumns = ['area_score', 'area_name', 'area_details', 'total_assets'];
      this.dataSource = new MatTableDataSource(this.tableData);
      this.dataSource.paginator = this.paginator;
    }
  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  drawAssetSummary(data: any) {
    let val = [];
    let self = this;
    data.map(function (v: any) {
      val.push({
        name: self.capitalizeFirstLetter(v.key),
        value: v.value,
        color: 'inherit'
      });
    })
    this.pieChartData = val;
  }

  drawTimelineChart(timeline: string) {
    if (this.apiData.timeline_data && this.apiData.timeline_data[timeline]) {
      //console.log(timeline, this.apiData.timeline_data[timeline]);
      switch (timeline) {
        case 'week':
          this.activeChart = 'Weekly';
          break
        case 'month':
          this.activeChart = 'Monthly';
          break
        case 'quater':
          this.activeChart = 'Quaterly';
          break
      }

      let data = this.apiData.timeline_data[timeline];
      let chartData = [
        {
          "name": "Good",
          "type": "bar",
          "barGap": 0,
          "label": {
            "show": true,
            "position": "insideBottom",
            "distance": 15,
            "align": "left",
            "verticalAlign": "middle",
            "rotate": 90,
            "formatter": "{c}  {name|{a}}",
            "fontSize": 16,
            "rich": {
              "name": {}
            }
          },
          "emphasis": {
            "focus": "series"
          },
          "data": []
        },
        {
          "name": "Average",
          "type": "bar",
          "label": {
            "show": true,
            "position": "insideBottom",
            "distance": 15,
            "align": "left",
            "verticalAlign": "middle",
            "rotate": 90,
            "formatter": "{c}  {name|{a}}",
            "fontSize": 16,
            "rich": {
              "name": {}
            }
          },
          "emphasis": {
            "focus": "series"
          },
          "data": []
        },
        {
          "name": "Poor",
          "type": "bar",
          "label": {
            "show": true,
            "position": "insideBottom",
            "distance": 15,
            "align": "left",
            "verticalAlign": "middle",
            "rotate": 90,
            "formatter": "{c}  {name|{a}}",
            "fontSize": 16,
            "rich": {
              "name": {}
            }
          },
          "emphasis": {
            "focus": "series"
          },
          "data": []
        },
        {
          "name": "Critical",
          "type": "bar",
          "label": {
            "show": true,
            "position": "insideBottom",
            "distance": 15,
            "align": "left",
            "verticalAlign": "middle",
            "rotate": 90,
            "formatter": "{c}  {name|{a}}",
            "fontSize": 16,
            "rich": {
              "name": {}
            }
          },
          "emphasis": {
            "focus": "series"
          },
          "data": []
        }];
      let time_stamps = [];
      data.map(function (v, i) {
        time_stamps.push(v.time_stamp);
        v.assets.map(function (val, ind) {
          if (val.key === 'Good') {
            chartData[0].data[i] = val.value;
          }
          if (val.key === "Average") {
            chartData[1].data[i] = val.value;
          }
          if (val.key === 'Poor') {
            chartData[2].data[i] = val.value;
          }
          if (val.key === "Critical") {
            chartData[3].data[i] = val.value;
          }
        });
      })
      this.barChartData = {
        chartData: chartData,
        timeline: time_stamps,
        legend: ['Good', 'Average', 'Poor', 'Critical']
      }


    }
  }

}
