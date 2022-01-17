import { Injectable } from '@angular/core';
import { EnvService } from '../../env/env.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ApiService } from '../api.service';
import { StorageService } from '../../storage/storage.service';
import { Router } from '@angular/router';
import { DataShareService } from '../../data-share/data-share.service';
import { NotificationService } from '../../notify/notification.service';
import { EncryptionService } from '../../encryption/encryption.service';
import { Common } from 'src/app/shared/enums/common.enum';
import { serverHostList } from '../../env/serverHostList';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http:HttpClient,
    private envService:EnvService,
    private dataShareService:DataShareService,
    private notificationService:NotificationService,
    private apiService:ApiService,
    private storageService:StorageService,
    private router:Router,
    private encryptionService:EncryptionService
  ) { }


  Logout(payload:any){
    let api = this.envService.getAuthApi('AUTH_SIGNOUT');
    this.http.post(api + payload.appName, this.encryptionService.encryptRequest(payload.data)).subscribe(
      (respData) =>{
        this.storageService.removeDataFormStorage(); 
        this.apiService.resetMenuData();
        this.apiService.resetTempData();
        this.apiService.resetGridData();
        this.envService.setRequestType('PUBLIC');
        this.logOutRedirection();
        this.notificationService.notify("bg-info","Log out Successful.");                
        this.dataShareService.restSettingModule('logged_out');
      },
      (error)=>{
        this.notificationService.notify("bg-danger", error.message);
      }
    )
  }
  SessionExpired(payload:any){
    let api = this.envService.getAuthApi('AUTH_SIGNOUT');
    this.http.post(api + payload.appName, this.encryptionService.encryptRequest(payload.data)).subscribe(
      (respData) =>{
        this.storageService.removeDataFormStorage();                
        this.apiService.resetMenuData();
        this.apiService.resetTempData();
        this.apiService.resetGridData();
        this.envService.setRequestType('PUBLIC');
        this.logOutRedirection();
        this.notificationService.notify("bg-info", "Session Expired, Kindly Login Again.");
        this.dataShareService.restSettingModule('logged_out');
      },
      (error)=>{
        this.notificationService.notify("bg-danger", error.message);
      }
    )
  }
  logOutRedirection(){
    if (this.envService.checkRedirectionUrl()) {
      window.location.href = this.envService.checkRedirectionUrl();
    }else{      
      this.router.navigate(['/signin']);
    }
  }
  GetUserInfoFromToken(payload:any){
    let api = this.envService.getAuthApi('GET_USER_PERMISSION');
    const reqBody = { key: payload };
    this.http.post(api, reqBody).subscribe(
      (respData:any) =>{
        if (respData && respData.authenticated === "true") {
          this.storageService.SetUserInfo(respData);
          this.storageService.GetUserInfo();
          this.envService.setRequestType('PRIVATE');
          const menuType = this.storageService.GetMenuType()
          this.dataShareService.restSettingModule('logged_in');
          if(menuType == 'Horizontal'){
               this.router.navigate(['/home']);
              // this.router.navigate(['/dashboard']);
              //this.router.navigate(['/scheduling-dashboard']);
          }else{
              this.router.navigate(['/dashboard']);
          } 
                                  
        } else {
            this.envService.setRequestType('PUBLIC');
            this.router.navigate(['/signin']);
        }
      },
      (error)=>{
        if(error.status == 403){
          this.envService.setRequestType('PUBLIC');
          this.router.navigate(['/signin']); 
        }else{
            this.notificationService.notify("bg-danger", error.message);
        } 
      }
    )
  }
  TrySignin(payload:any){
    let api = this.envService.getAuthApi('AUTH_SIGNIN');
    this.http.post(api + payload.appName, this.encryptionService.encryptRequest({ username: payload.username, password: payload.password })).subscribe(
      (respData:any) =>{
        if(respData && respData['success'] && respData['success'].challengeName && respData['success'].challengeName == 'NEW_PASSWORD_REQUIRED'){
          this.storageService.setResetNewPasswordSession(respData['success'].session);
          this.router.navigate(['/resetpwd/'+payload.username]); 
        }else if (respData && respData.hasOwnProperty('success')) {
            //console.log(respData["success"].authenticationResult);
            const cognitoIdToken = respData["success"].authenticationResult.idToken;
            const cognitoRefreshToken = respData["success"].authenticationResult.refreshToken;
            const cognitoAccessToken = respData["success"].authenticationResult.accessToken;
            const cognitoExpiresIn = respData["success"].authenticationResult.expiresIn;
            this.storageService.setExpiresIn(cognitoExpiresIn);
            this.storageService.SetIdToken(cognitoIdToken);                        
            this.storageService.SetRefreshToken(cognitoRefreshToken);
            this.storageService.SetAccessToken(cognitoAccessToken);
            this.notificationService.notify("bg-success", " Login  Successful.");
            this.dataShareService.setAuthentication(true);
            this.GetUserInfoFromToken(cognitoIdToken);

        } else if (respData.hasOwnProperty('error')) {
            if (respData["error"] == "not_confirmed") {
                this.notificationService.notify("bg-danger", "User Not Confirmed ");
            } else if (respData["error"] == "user_name_password_does_not_match") {
                this.notificationService.notify("bg-danger", "Username password does not match ");
            }else {
              this.notificationService.notify("bg-danger", "Username password does not match ");
            }
        }
      },
      (error)=>{
        this.notificationService.notify("bg-danger", error.message);
      }
    )
  }
  TrySignup(payload:any){
    let api = this.envService.getAuthApi('AUTH_SIGNUP');
    this.http.post(api + payload.appName, this.encryptionService.encryptRequest(payload.data)).subscribe(
      (respData) =>{
        if(respData['error']){
          this.notificationService.notify("bg-danger", respData['error']);
        }else{
            if(Common.VERIFY_WITH_OTP){
                this.notificationService.notify("bg-success", "Otp Sent to your mobile number !!!");
                const username = payload.data.username;
                this.router.navigate(['/otp_varify/'+username]);                           
            }else{
                this.notificationService.notify("bg-success", "A verification link has been sent to your email account. please click on the link to verify your email and continue the registration process. ");
                this.router.navigate(['/signin']);
            }
        }
      },
      (error)=>{
        this.notificationService.notify("bg-danger", error.message);
      }
    )
  }
  OtpVarify(payload:any){
    let api = this.envService.getAuthApi('OTP_VARIFICATION');
    this.http.post(api + payload.appName, this.encryptionService.encryptRequest(payload.data)).subscribe(
      (respData) =>{
        if(respData['success']){
          this.router.navigate(['/signin']);
        }else if(respData['error']){
            this.notificationService.notify("bg-danger", respData['message']);
        }
      },
      (error)=>{
        this.notificationService.notify("bg-danger", error.message);
      }
    )
  }
  TryForgotPassword(payload:any){
    let api = this.envService.getAuthApi('AUTH_FORGET_PASSWORD');
    this.http.post(api + payload.appName, this.encryptionService.encryptRequest({ username: payload.username })).subscribe(
      (respData) =>{
        if (respData && respData.hasOwnProperty('success')) {
          this.notificationService.notify("bg-info", "Verification Code Sent.");
          this.dataShareService.setAuthentication(true);
        } else if (respData.hasOwnProperty('error')) {
            this.notificationService.notify("bg-danger", respData['message']);
        }

      },
      (error)=>{
        this.notificationService.notify("bg-danger", error.message);
      }
    )
  }
  SaveNewPassword(payload:any){
    let api = this.envService.getAuthApi('AUTH_RESET_PASSWORD');
    this.http.post(api + payload.appName, this.encryptionService.encryptRequest(payload.data)).subscribe(
      (respData) =>{
        if (respData && respData.hasOwnProperty('success')) {
            this.notificationService.notify("bg-info", "New Password changed successfully.");
            this.dataShareService.setAuthentication(true);
        } else if (respData.hasOwnProperty('error')) {
            this.notificationService.notify("bg-danger", respData['message']);
        }
      },
      (error)=>{
        this.notificationService.notify("bg-danger", error.message);
      }
    )
  }
  ResetPass(payload:any){
    let api = this.envService.getAuthApi('RESET_PASSWORD');
    this.http.post(api+'/'+payload.appId,this.encryptionService.encryptRequest(payload.data)).subscribe(
      (respData) =>{
        if (respData && respData.hasOwnProperty('success')) {                        
            this.notificationService.notify("bg-success", " New Password Set  Successfully.");
            this.router.navigate(['/admin']);
        } else if (respData.hasOwnProperty('error')) {
            if (respData["error"] == "not_confirmed") {
                this.notificationService.notify("bg-danger", "User Not Confirmed ");
            } else if (respData["error"] == "user_name_password_does_not_match") {
                this.notificationService.notify("bg-danger", "Username password does not match ");
            }
        }
      },
      (error)=>{
        this.notificationService.notify("bg-danger", error.message);
      }
    )
  }
  GetAuthAppName(payload:any){
    let api = this.envService.getAuthApi('GET_AUTH_APP');
    this.http.post(api + payload.appName, this.encryptionService.encryptRequest(payload.data)).subscribe(
      (respData) =>{
        
      },
      (error)=>{
        this.notificationService.notify("bg-danger", error.message);
      }
    )
  }
  TryVerify(payload){
    console.log(payload);
  }
  //function created for - change password
  changePassword(authData){
    let api = this.envService.getAuthApi('AUTH_CHANGE_PASSWORD')
    this.http.post(api + authData.appName, this.encryptionService.encryptRequest({password: authData.password, new_password: authData.new_password,accessToken:authData.accessToken })).subscribe(
      (data) => {
        if (data && data.hasOwnProperty('success')) {
          this.notificationService.notify("bg-info", "Password changed successfully.");
          this.router.navigate(['signin']);
      }
       else if (data.hasOwnProperty('error'))
        {
          this.notificationService.notify("bg-danger", data['message']);
        }
        },
      (error) => {
          console.log(error);
        }
    ) 
  }

}
