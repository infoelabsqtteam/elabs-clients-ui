import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  template: `
  <div style="background: url(assets/img/pexels-public-domain-pictures-60022.jpg);background-size:cover;margin:-15px;">
  <div class="account-pages pt-5 pb-5 notfound">
        <div class="justify-content-center">
            <mat-card style="text-align:center;opacity:90%;">
            <mat-card-title class="mb-3 py-3"><img src="assets/img/logo.png" alt="E-Labs logo"></mat-card-title>
                <mat-card-content>
                    <h3 class="text-uppercase text-danger">Oops! Page not found</h3>
                    <h1><span>4</span><span>0</span><span>4</span></h1>
                    <h2 class="mb-4">we are sorry, but the page you requested was not found</h2>
                    <button mat-button routerLink="/home_page">Go to Homepage</button>
                </mat-card-content>
            </mat-card>
          </div>
      </div>
  </div>
  `,
  styles: [
  ]
})
export class PageNotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
