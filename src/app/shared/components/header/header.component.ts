import { Component, OnInit, Output, EventEmitter} from '@angular/core';
import { AuthService } from '../../../_services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();
  constructor(private _authService: AuthService) { }

  ngOnInit() {
  }
  toggleSidebar(){
    this.toggleSidebarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    },300);
  }

  logout(){
    this._authService.logout();
  }

}
