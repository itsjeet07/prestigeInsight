import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { AreaComponent } from './widgets/area/area.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { CardComponent } from './widgets/card/card.component';
import { PieComponent } from './widgets/pie/pie.component';
import { GuageComponent } from './widgets/guage/guage.component';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { BarComponent } from './widgets/bar/bar.component';
import { DemoMaterialModule } from '../_modules/material-module';
import { StackedBarComponent } from './widgets/stacked-bar/stacked-bar.component';
import { LineChartComponent } from './widgets/line-chart/line-chart.component';
import { ScatterComponent } from './widgets/scatter/scatter.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    AreaComponent,
    CardComponent,
    PieComponent,
    GuageComponent,
    BarComponent,
    StackedBarComponent,
    LineChartComponent,
    ScatterComponent
  ],
  imports: [
    CommonModule,
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatMenuModule,
    MatListModule,
    RouterModule,
    HighchartsChartModule,
    DemoMaterialModule,
    NgxEchartsModule.forRoot({
      /**
       * This will import all modules from echarts.
       * If you only need custom modules,
       * please refer to [Custom Build] section.
       */
      //echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
      echarts
    }),
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    AreaComponent,
    CardComponent,
    PieComponent,
    GuageComponent,
    BarComponent,
    StackedBarComponent,
    LineChartComponent,
    ScatterComponent,
    DemoMaterialModule
  ]
})
export class SharedModule { }
