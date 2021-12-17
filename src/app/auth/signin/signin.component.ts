import { Component, Input, OnInit } from '@angular/core';
import { NgForm,FormGroup, FormControl, Validators } from '@angular/forms';
import * as appConstant from '../../shared/app.constants';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/api/auth/auth.service';



@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  hide = true;
  @Input() public pageName;
  appName: string;
  signInForm:FormGroup;

  constructor(
    private router: Router,
    private authService:AuthService
    ) {
    
  }


  ngOnInit() {
    this.initForm();
  }
  initForm() {
    this.signInForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$')]),
      'password': new FormControl('', [Validators.required])
    });
  }

  onSignIn() {
    const value = this.signInForm.getRawValue();
    const email = value.email;
    const password = value.password;
    this.authService.TrySignin({ username: email, password: password, appName: appConstant.appName })   
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
   
    this.router.navigate(['home_page'])
  }
}
