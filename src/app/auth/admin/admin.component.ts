import { Component,Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as appConstant from '../../shared/app.constants';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/api/auth/auth.service';



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  hide = true;
  @Input() public pageName;
  appName: string;

  constructor(
    private router: Router,
    private authService:AuthService
  ) {
    
  }


  ngOnInit() {
    
  }

  onSignIn(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.authService.TrySignin({ username: email, password: password, appName: appConstant.appName })

    
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    
    this.router.navigate(['home_page'])
  }

}
