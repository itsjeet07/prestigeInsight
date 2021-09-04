import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, Routes, Router } from '@angular/router';
import { UserService } from '../../_services/user/user.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  companies: any;
  roles: any;
  registerForm: FormGroup;
	constructor(private formBuilder: FormBuilder,private router: Router, private userService: UserService, private _snackBar: MatSnackBar  ) {
		this.initializeForm();
	}

  initializeForm(){
    this.registerForm = this.formBuilder.group({
			email: ['', [Validators.required]],
			username: ['', [Validators.required]],
			password: ['', [Validators.required]],
			password2: ['', [Validators.required]],
			phone_no: ['', [Validators.required]],
			role: [1, [Validators.required]],
			org_id: [1, [Validators.required]],
		});
  }

  ngOnInit(): void {
    this.getCompanies();
    this.getRoles();
  }

  getCompanies(){
    this.userService.getCompanyList().subscribe(
      res => {
        //console.log('companies res', res);
          if(res && res.length > 0){
            this.companies = res;
          }
      },
      error => {

      }
    )
  }
  getRoles(){
    this.userService.getRoleList().subscribe(
      res => {
          if(res && res.length > 0){
            this.roles = res;
          }
      },
      error => {

      }
    )
  }
  doRegister() {
		this.userService.doRegister(this.registerForm.value).subscribe(
			res => {
			//   console.log(res);
			//   localStorage.setItem('currentUser', res.id);
			  //this._router.navigate(['']);
			  this.success(res);
			},
			error => {
				console.log('Errror');
        this.success(error);
			}
		  );
	}

	// Login success function
	success(data) {
		if (data && data.response) {
			//localStorage.setItem('currentUser', data.token);
			//this.router.navigate(['/']);
			this._snackBar.open(data.response, 'Close', {
					horizontalPosition: 'end',
					verticalPosition: 'bottom',
			});
      this.initializeForm();
		} else {
        this._snackBar.open('Some Error Occured! Please try again', 'Close', {
					horizontalPosition: 'end',
					verticalPosition: 'bottom',
				});
		}
	}

}
