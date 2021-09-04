
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';

@Injectable()
export class UserService {
    apiUrl: string;
	loginUrl: string;
	userApiUrl: string;
	constructor(private http: HttpClient, private config: ConfigService) {
        this.apiUrl = this.config.apiURL;
		this.loginUrl = this.config.apiURL + 'login/';
	}

	doLogin(data) {
		console.log('data', data)
		console.log('api url', this.config.apiURL);
		return this.http.post<any>(this.loginUrl, data);
	}
	doRegister(data) {
		return this.http.post(this.apiUrl + 'register/', data);
	}
    getCompanyList(){
		return this.http.get<any>(this.apiUrl + 'companies/' );
    }
    getRoleList(){
		return this.http.get<any>(this.apiUrl + 'roles/' );
    }

	// getMyDetails(id) {
	// 	return this.http.get<any>(`${this.userApiUrl}/` + id + '/accessTokens');
	// }
}
