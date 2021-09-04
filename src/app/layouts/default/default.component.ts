import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  sidebarOpen = true;
  showVibrationMenu = true;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  changeOfRoutes(){
    if(this.router.url.includes('asset-view')){
      this.showVibrationMenu = true;
    }
    else{
      this.showVibrationMenu = false;
    }
  }
  
  sidebarToggler(event: any){
    this.sidebarOpen = !this.sidebarOpen;
  }

}
