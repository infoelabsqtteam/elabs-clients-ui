import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-verify-failed',
  template: `
  <div style="background: url(assets/img/pexels-public-domain-pictures-60022.jpg);height: 100vh;background-size:cover ;">
  <div class="account-pages pt-5 pb-5 notfound">
        <div class="justify-content-center">
            <mat-card style="text-align:center;opacity:90%;">
                <mat-card-title class="mb-3 py-3"><img src="assets/img/logo.png" alt="E-Labs logo"></mat-card-title>
                <mat-card-content>
                    <h3 class="text-uppercase text-danger">Oops! Verification Failed</h3>
                    <h1><span>4</span><span>0</span><span>0</span></h1>
                    <h2 class="mb-4">we are sorry, but the page your verification Failed</h2>
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
export class VerifyFailedComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
