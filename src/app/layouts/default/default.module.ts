import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { DashboardComponent } from 'src/app/modules/dashboard/dashboard.component';
import { PlantHeadComponent } from 'src/app/modules/pages/plant-head/plant-head.component';
import { AreaViewComponent } from 'src/app/modules/pages/area-view/area-view.component';
import { AssetViewComponent } from 'src/app/modules/pages/asset-view/asset-view.component';
import { RouterModule } from '@angular/router';
import { PostsComponent } from 'src/app/modules/posts/posts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardService } from 'src/app/modules/dashboard.service';
import { DemoMaterialModule } from '../../_modules/material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    DefaultComponent,
    DashboardComponent,
    PostsComponent,
    PlantHeadComponent,
    AreaViewComponent,
    AssetViewComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatSidenavModule,
    MatDividerModule,
    FlexLayoutModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    DemoMaterialModule
  ],
  providers:[
    DashboardService
  ]
})
export class DefaultModule { }
