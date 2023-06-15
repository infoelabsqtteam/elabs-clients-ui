import { Component,Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, EnvService} from '@core/service-lib';


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
    private authService:AuthService,
    private envService:EnvService
  ) {
    
  }


  ngOnInit() {
    
  }

  onSignIn(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.authService.Signin({ email: email, password: password })

    
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    
    this.router.navigate(['home_page'])
  }

}
