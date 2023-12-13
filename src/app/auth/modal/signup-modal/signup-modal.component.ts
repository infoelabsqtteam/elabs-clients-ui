import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthDataShareService, AuthService, CustomvalidationService, DataShareService, ModelService, NotificationService } from '@core/web-core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup-modal',
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.css','../../../../assets/css/app-landing.css']
})
export class SignupModalComponent implements OnInit {

  loading = false;
  hide = true;
  signUpForm: FormGroup;
  appName: string;

  @Input() id: string;
  @Output() signupResponce = new EventEmitter();
  @ViewChild('signupModal') public signupModal: ModalDirective; 
  appNameSubscription:Subscription;
  signUpInfoSubscribe:Subscription;
  
  constructor(
    private modalService: ModelService, 
    private el: ElementRef,
    private router: Router,
    private route: ActivatedRoute,
    private authService:AuthService,
    private dataShareService:DataShareService,
    private authDataShareService: AuthDataShareService,
    private notificationService: NotificationService,
    private customvalidationService:CustomvalidationService
    ) {
      this.appNameSubscription = this.dataShareService.appName.subscribe( data =>{
        this.setAppName(data);
      })
      this.signUpInfoSubscribe = this.authDataShareService.signUpResponse.subscribe(res =>{
        this.loading = false;
        this.signUpForm.reset();
        this.notificationService.notify(res.class, res.msg);
        if(res.status == 'success') {
          this.authService.redirectToSignPage();
        }
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
  setAppName(data){
    if (data.appName && data.appName.hasOwnProperty("appName")) {
      this.appName = data.appName["appName"]
    }
  }

  onSignUp() {
    
    this.loading = true;
    const email = this.signUpForm.value.email;
    const password = this.signUpForm.value.password;
    const name = this.signUpForm.value.name;
    const mobile = "+91" + this.signUpForm.value.mobile;
    const payload = { appName: this.appName, data: { username: email, email: email, password: password, name: name, phone_number: mobile } }
    this.authService.Signup(payload);
    this.router.navigate(['/signin']);
  }

  initForm() {
    this.signUpForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$')]),
      'mobile': new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
      'password': new FormControl('', [Validators.required, ,this.customvalidationService.patternValidator()]),
      'name': new FormControl('', Validators.required),
    });
  }

  showModal(alert){
    this.signupModal.show()  
  }
  cancel(){
    this.close();
    this.signupResponce.emit(false);
  }
  close(){
    this.signupModal.hide();
  }
  signin(){
    this.signupResponce.emit('signin');
  }

}
