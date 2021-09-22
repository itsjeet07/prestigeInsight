import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../_services/pages/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

interface IEquipment {
  equipment_id: number,
  name: string;
  description: string;
}
@Component({
  selector: 'app-area-view',
  templateUrl: './area-view.component.html',
  styleUrls: ['./area-view.component.scss']
})
export class AreaViewComponent implements OnInit {


  activeChart: string;
  lineChartData: any;
  apiData: any;
  assetsTableData: [];
  displayedColumns: string[];
  dataSource: any;
  dataSourceEq: any;
  displayedColumnsEq: string[];

  equipmentList: IEquipment[] = [];
  selectedEquipment: any;
  currentId: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private apiService: ApiService, private route: ActivatedRoute, private _snackBar: MatSnackBar) {
    this.route.params.subscribe(params => {
      this.currentId = params['id'];
      if (this.currentId && this.currentId != null && this.currentId !== undefined) {
        this.getAssetsList(this.currentId);
      }
    });
  }

  ngOnInit() {
    this.getLineChartData();
    //this.getTableData();
    //this.getEquipmentList();
    // this.getAssetsList();
  }

  getLineChartData() {
    const res = this.apiService.getLineChartData();
    if (res && res.data) {
      this.apiData = res.data;
      this.drawTimelineChart('week')
    }
  }

  // getTableData(){
  //   this.apiService.getAssetData().subscribe(
  //     (res) => {
  //         console.log('api res', res);
  //         if(res && res.data){
  //           this.assetsTableData = res.data;      
  //           this.displayedColumns = ['asset_id', 'asset_score' ,'asset_name', 'asset_type', 'no_of_sensors', 'asset_class_type'];
  //           this.dataSource = new MatTableDataSource(this.assetsTableData);
  //           this.dataSource.paginator = this.paginator;
  //         }
  //     },
  //     (error) => {
  //       console.log('api err', error);
  //     }
  //   )
  // }
  // getEquipmentData(equipment) {
  //   this.selectedEquipment = equipment;
  //   this.getAssetsList(equipment.equipment_id)
  // }
  // getEquipmentList(areaId = null) {
  //   let dataObj = {
  //     area_id: areaId
  //   }
  //   this.apiService.getEquipmentList(dataObj).subscribe(
  //     (res) => {
  //       if (res && res.equipment_list && res.equipment_list.length > 0) {
  //         this.equipmentList = res.equipment_list;
  //         this.displayedColumnsEq = ['equipment_id', 'name', 'description'];
  //         this.dataSourceEq = new MatTableDataSource(res.equipment_list);
  //         this.dataSourceEq.paginator = this.paginator;

  //         this.selectedEquipment = res.equipment_list[0];
  //         this.getAssetsList(this.equipmentList[0].equipment_id);
  //       }
  //     },
  //     (error) => {
  //       console.log('api err', error);
  //     }
  //   )
  // }
  getAssetsList(id = null) {
    let dataObj = {
      equipment_id: id
    }
    this.apiService.getAssetList(dataObj).subscribe(
      (res) => {
        this.assetsTableData = res.data;
        this.displayedColumns = ['asset_id', 'asset_score', 'asset_name', 'asset_type', 'asset_class_type', 'no_of_sensors'];
        this.dataSource = new MatTableDataSource(this.assetsTableData);
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.log('api err', error);
      }
    )
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
          "type": "line",
          "barGap": 0,
          "emphasis": {
            "focus": "series"
          },
          "data": []
        },
        {
          "name": "Average",
          "type": "line",
          "emphasis": {
            "focus": "series"
          },
          "data": []
        },
        {
          "name": "Poor",
          "type": "line",
          "emphasis": {
            "focus": "series"
          },
          "data": []
        },
        {
          "name": "Critical",
          "type": "line",
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
      this.lineChartData = {
        chartData: chartData,
        timeline: time_stamps,
        legend: ['Good', 'Average', 'Poor', 'Critical'],
        title: 'Area Health Trend'
      }
      console.log(this.lineChartData);


    }
  }
}
