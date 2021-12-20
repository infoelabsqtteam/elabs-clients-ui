import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import {ModalService} from '../../../m-core/modals/modal.service';
import { ModalDirective } from 'angular-bootstrap-md';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/api/auth/auth.service';
import { EnvService } from 'src/app/services/env/env.service';


@Component({
  selector: 'app-signin-modal',
  templateUrl: './signin-modal.component.html',
  styleUrls: ['./signin-modal.component.css','../../../../assets/css/app-landing.css']
})
export class SigninModalComponent implements OnInit {
  @Input() id: string;
  @Output() signinResponce = new EventEmitter();
  @ViewChild('signinModal') public signinModal: ModalDirective; 

  
  constructor(
    private modalService: ModalService, 
    private authService:AuthService,
    private envService:EnvService
    ) { }

  ngOnInit() {
    let modal = this;
    if (!this.id) {
        console.error('modal must have an id');
        return;
    }
    this.modalService.remove(this.id);
    this.modalService.add(this);
  }
  onSignIn(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.authService.TrySignin({ username: email, password: password, appName: this.envService.getAppName() })
  }

  showModal(alert){
    this.signinModal.show()  
  }
  cancel(){
    this.close();
    this.signinResponce.emit(false);
  }
  close(){
    this.signinModal.hide();
  }
  forgotPwd(){
    this.signinResponce.emit('fgpwd');
  }
  signup(){
    this.signinResponce.emit('signup');
  }

}
