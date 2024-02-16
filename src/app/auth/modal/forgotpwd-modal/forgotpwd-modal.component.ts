import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataShareService, AuthService, ModelService, CustomvalidationService} from '@core/web-core';


@Component({
  selector: 'app-forgotpwd-modal',
  templateUrl: './forgotpwd-modal.component.html',
  styleUrls: ['./forgotpwd-modal.component.css','../../../../assets/css/app-landing.css']
})

export class ForgotpwdModalComponent implements OnInit {

  hide = true;
  fForm: UntypedFormGroup;
  vForm: UntypedFormGroup;
  username: string;
  resetPwd: boolean = true;
  appName: string;

  @Input() id: string;
  @Output() forgotPwdResponce = new EventEmitter();
  @ViewChild('forgotPwdModal') public forgotPwdModal: ModalDirective; 

  authNameSubscription;

  
  constructor(
      private modalService: ModelService, 
      private el: ElementRef,
      private router: Router,
      private route: ActivatedRoute, 
      private dataShareService:DataShareService,
      private authService:AuthService,
      private customvalidationService:CustomvalidationService
    ) {
      this.authNameSubscription = this.dataShareService.appName.subscribe(appName =>{
        this.setAppName(appName);
      })
     }

  ngOnInit() {
    let modal = this;
    if (!this.id) {
        console.error('modal must have an id');
        return;
    }
    this.modalService.remove(this.id);
    this.modalService.add(this);
    this.initForm();
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.authNameSubscription){
      this.authNameSubscription.unsubscribe();
    }
  }
  setAppName(data:any){
    if (data.appName && data.appName.hasOwnProperty("appName")) {
      this.appName = data.appName["appName"]
    }
  }

  onResetPwd() {
    this.username = this.fForm.value.email;
    this.authService.TryForgotPassword(this.username)
    this.resetPwd = false;

  }

  initForm() {
    this.username = "";
    this.fForm = new UntypedFormGroup({
      'email': new UntypedFormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$')]),
    });
    this.vForm = new UntypedFormGroup({
      'verifyCode': new UntypedFormControl('', [Validators.required]),
      'password': new UntypedFormControl('', [Validators.required,this.customvalidationService.patternValidator()]),
    });
  }

  resendCode() {
    this.resetPwd = true;
  }
  onVerifyPwd() {
    const code = this.vForm.value.verifyCode;
    const password = this.vForm.value.password;
    const payload = { appName: this.appName, data: { username: this.username, verif_code: code, password: password } };
    this.authService.SaveNewPassword(payload);
    this.forgotPwdResponce.emit('signin');
  }

  showModal(alert){
    this.forgotPwdModal.show()  
  }
  cancel(){
    this.close();
    this.forgotPwdResponce.emit(false);
  }
  close(){
    this.forgotPwdModal.hide();
  }
  signin(){
    this.forgotPwdResponce.emit('signin');
  }

}
