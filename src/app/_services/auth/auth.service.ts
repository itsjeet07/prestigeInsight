import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, Route } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../_models/user';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

	private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
  	
	constructor(private router: Router, private config: ConfigService, private http: HttpClient) { }

  
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		if (localStorage.getItem('currentUser')) {
			return true;
		} 
        else {
        //   console.log('Checking Route')
	     		this.router.navigate(['/login']);
	     		return false;
		}
  	}
	  
	  public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${this.config.apiURL}/users/authenticate`, { username, password })
		/*
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }

                return user;
            }));
		*/
    }
	
	getToken(){
		return localStorage.getItem('currentUser'); 
	}
	
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        //this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }
}
