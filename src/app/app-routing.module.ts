import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { PlantHeadComponent } from './modules/pages/plant-head/plant-head.component';
import { PostsComponent } from './modules/posts/posts.component';
import { AuthService } from './_services/auth/auth.service';
import { AreaViewComponent } from './modules/pages/area-view/area-view.component';
import { AssetViewComponent } from './modules/pages/asset-view/asset-view.component';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from './modules/register/register.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: '',
        component: PlantHeadComponent
      },
      {
        path: 'area-view/:id',
        component: AreaViewComponent
      },
      {
        path: 'asset-view',
        component: AssetViewComponent
      },
      {
        path: 'asset-view/:id',
        component: AssetViewComponent
      },
      {
        path: 'old',
        component: DashboardComponent
      },
      {
        path: 'posts',
        component: PostsComponent,
        canActivate: [AuthService]
      }
    ],
    canActivate: [AuthService]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
