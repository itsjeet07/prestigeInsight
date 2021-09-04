import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, Routes, Router } from '@angular/router';
import { UserService } from '../../_services/user/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  	loginForm: FormGroup;
	constructor(private formBuilder: FormBuilder,private router: Router, private userService: UserService, private _snackBar: MatSnackBar ) {
		this.loginForm = this.formBuilder.group({
			username: ['', [Validators.required]],
			password: ['', [Validators.required]]
		});
	}

  ngOnInit() {
    
		if (localStorage.getItem('currentUser')) {
			this.router.navigate(['/']);
		}
  }

  
	// Initicate login
	doLogin() {
		this.userService.doLogin(this.loginForm.value).subscribe(
			res => {
			//   console.log(res);
			//   localStorage.setItem('currentUser', res.id);
			  //this._router.navigate(['']);
			  this.success(res);
			},
			error => {
				console.log('Errror');
				this._snackBar.open('Invalid Credentials', 'Close', {
					horizontalPosition: 'end',
					verticalPosition: 'bottom',
				  });
			}
		  );
	}

	// Login success function
	success(data) {
		if (data && data.token) {
			localStorage.setItem('currentUser', data.token);
			this.router.navigate(['/']);
			//this.toastr.success('Success', 'Logged In Successfully');
		} else {
			//this.toastr.error('Failed', 'Invalid Credentials');
			this._snackBar.open('Invalid Credentials', 'Close', {
				horizontalPosition: 'end',
				verticalPosition: 'bottom',
			  });
		}
	}

}
