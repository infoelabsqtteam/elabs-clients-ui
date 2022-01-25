// import { Effect, Actions, ofType } from '@ngrx/effects';
// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import * as AuthActions from './auth.actions';
// import { map, tap, switchMap, mergeMap, catchError } from 'rxjs/operators';
// import { Store } from '@ngrx/store';
// //import * as firebase from 'firebase';
// import { from, of } from 'rxjs';//fromPromise
// import { Auth } from 'aws-amplify';
// import { CognitoUser, CognitoUserSession, CognitoAccessToken, CognitoIdToken } from 'amazon-cognito-identity-js';
// import { CommonFunctionService } from "../../services/common-utils/common-function.service";
// import { StorageService} from '../../services/storage/storage.service';
// import * as appConstants from '../../shared/app.constants';
// import * as fromApp from '../../store/app.reducers';
// import { ApiService } from '../../services/api/api.service';
// import { EnvService } from 'src/app/services/env/env.service';
// import { DataShareService } from 'src/app/services/data-share/data-share.service';



// @Injectable()
// export class AuthEffects {

    // @Effect({ dispatch: false })
    // authLogout = this.actions$.pipe(
    //     ofType(AuthActions.LOGOUT),
    //     map(
    //         (action: AuthActions.Logout) => {
    //             return action.payload;
    //         }
    //     ),
    //     switchMap((payload) => {
    //         let api;            
    //         api = this.envService.baseUrl('AUTH_SIGNOUT')
    //         return this.http.post(api + payload.appName, this.commonFunctionService.encryptRequest(payload.data))
    //         .pipe(switchMap((respData: any) => {
    //             this.storageService.removeDataFormStorage(); 
    //             this.apiService.resetMenuData();
    //             this.apiService.resetTempData();
    //             this.commonFunctionService.resetGridData();
    //             this.commonFunctionService.setRequestType('PUBLIC');
    //             this.router.navigate(['/home_page']);
    //             this.commonFunctionService.notify("bg-info","Log out Successful.");                
    //             this.dataShareService.restSettingModule('logged_out');
    //             return []
    //         }))
    //     }),
    //     catchError(error => {
    //         this.commonFunctionService.notify("bg-danger", error.message);
    //         return []
    //     })
    // );

    // @Effect()
    // sessionExpired = this.actions$.pipe(
    //     ofType(AuthActions.SESSION_EXPIRED), 
    //     map(
    //         (action: AuthActions.SessionExpired) => {
    //             return action.payload;
    //         }
    //     ),
    //     switchMap((payload) => {
    //         let api;            
    //         api = this.envService.baseUrl('AUTH_SIGNOUT')
    //         return this.http.post(api + payload.appName, this.commonFunctionService.encryptRequest(payload.data))
    //         .pipe(switchMap((respData: any) => {
    //             this.storageService.removeDataFormStorage();                
    //             this.apiService.resetMenuData();
    //             this.apiService.resetTempData();
    //             this.commonFunctionService.resetGridData();
    //             this.commonFunctionService.setRequestType('PUBLIC');
    //             this.router.navigate(['/home_page']);
    //             this.commonFunctionService.notify("bg-info", "Session Expired, Kindly Login Again.");
    //             this.dataShareService.restSettingModule('logged_out');
    //             return []
    //         }))
    //     }),
    //     catchError(error => {
    //         this.commonFunctionService.notify("bg-danger", error.message);
    //         return []
    //     })
    // );

    // @Effect()
    // getUserInfo = this.actions$.pipe(
    //     ofType(AuthActions.GET_USER_INFO_FROM_TOKEN),
    //     map(
    //         (action: AuthActions.GetUserInfoFromToken) => {
    //             return action.payload;
    //         }
    //     ),
    //     switchMap((payload) => {
    //         const reqBody = { key: payload };
    //         let api;            
    //         api = this.envService.baseUrl('GET_USER_PERMISSION')
    //         return this.http.post(api, reqBody)
    //             .pipe(switchMap((respData: any) => {
    //                 if (respData && respData.authenticated === "true") {
    //                     this.storageService.SetUserInfo(respData);
    //                     this.storageService.GetUserInfo();
    //                     this.commonFunctionService.setRequestType('PRIVATE');
    //                     const menuType = this.storageService.GetMenuType()
    //                     this.dataShareService.restSettingModule('logged_in');
    //                     if(menuType == 'Horizontal'){
    //                         this.router.navigate(['/home']);
    //                         //this.router.navigate(['/dashboard']);
    //                         // this.router.navigate(['/scheduling-dashboard']);
    //                     }else{
    //                         this.router.navigate(['/dashboard']);
    //                     } 
                                               
    //                 } else {
    //                     this.commonFunctionService.setRequestType('PUBLIC');
    //                     this.router.navigate(['/signin']);
    //                 }

    //                 return of();
    //             })
    //             )

    //     }),
    //     catchError(error => {
    //         if(error.status == 403){
    //             this.commonFunctionService.setRequestType('PUBLIC');
    //             this.router.navigate(['/signin']); 
    //         }else{
    //             this.commonFunctionService.notify("bg-danger", error.message);
    //         }            
    //         return []
            
    //     })
    // );
    
    // @Effect()
    // forgotPwd = this.actions$.pipe(ofType(AuthActions.TRY_FORGOT_PASSWORD), map(
    //     (action: AuthActions.TryForgotPassword) => {
    //         return action.payload;
    //     }
    // ), switchMap((authData) => {
    //     //return from(firebase.auth().signInWithEmailAndPassword(authData.username, authData.password));  
    //     //return from(Auth.forgotPassword(authData.username));
    //     let api;
    //     api = this.envService.baseUrl('AUTH_FORGET_PASSWORD')
    //     return this.http.post(api + authData.appName, this.commonFunctionService.encryptRequest({ username: authData.username }))
    // })/*, tap((user)=> {console.log(user)})*/, switchMap((data) => {
    //     if (data && data.hasOwnProperty('success')) {
    //         this.commonFunctionService.notify("bg-info", "Verification Code Sent.");
    //         return [
    //             {
    //                 type: AuthActions.SIGNIN
    //             },

    //         ];
    //     } else if (data.hasOwnProperty('error')) {
    //         this.commonFunctionService.notify("bg-danger", data['message']);
    //     }
    //     //return from(firebase.auth().currentUser.getIdToken());
    // }),
    //     catchError(error => {
    //         this.commonFunctionService.notify("bg-danger", error.message);
    //         return []
    //     }));


    // @Effect()
    // saveNewPwd = this.actions$.pipe(ofType(AuthActions.SAVE_NEW_PASSWORD), map(
    //     (action: AuthActions.SaveNewPassword) => {
    //         return action.payload;
    //     }
    // ), switchMap((authData) => {
    //     //return from(Auth.forgotPasswordSubmit(authData.username, authData.code, authData.password));
    //     let api;
    //     api = this.envService.baseUrl('AUTH_RESET_PASSWORD')
    //     return this.http.post(api + authData.appName, this.commonFunctionService.encryptRequest(authData.data))
    // })/*, tap((user)=> {console.log(user)})*/, switchMap((data) => {
    //     if (data && data.hasOwnProperty('success')) {

    //         this.commonFunctionService.notify("bg-info", "New Password changed successfully.");
    //         return [
    //             {
    //                 type: AuthActions.SIGNIN
    //             },

    //         ];
    //     } else if (data.hasOwnProperty('error')) {
    //         this.commonFunctionService.notify("bg-danger", data['message']);
    //     }
    // }),
    //     catchError(error => {
    //         this.commonFunctionService.notify("bg-danger", error.message);
    //         return []
    //     }));

    // @Effect()
    // getAuthAppName = this.actions$.pipe(
    //     ofType(AuthActions.GET_AUTH_APP_NAME),
    //     map(
    //         (action: AuthActions.GetAuthAppName) => {
    //             return action.payload;
    //         }
    //     ),
    //     switchMap((payload) => {
    //         let api;            
    //         api = this.envService.baseUrl('GET_AUTH_APP')            
    //         return this.http.get(api)
    //             .pipe(switchMap(respData => {

    //                 return [
    //                     {
    //                         type: AuthActions.GET_AUTH_APP_NAME_SUCCESS,
    //                         payload: respData
    //                     }

    //                 ]

    //             }),
    //                 catchError(err => {
    //                     return [
    //                         {
    //                             type: AuthActions.GetAuthAppNameErr,
    //                             payload: { code: 200, name: "GET_AUTH_APP_NANME_ERROR", message: "Something went wrong" }
    //                         }
    //                     ]

    //                 }))

    //     })
    // )

    // @Effect()
    // signIn = this.actions$.pipe(
    //     ofType(AuthActions.TRY_SIGNIN),
    //     map(
    //         (action: AuthActions.TrySignin) => {
    //             return action.payload;
    //         }
    //     ),
    //     switchMap((authData: { username: string, password: string, appName: string }) => {
    //         let api;
    //         api = this.envService.baseUrl('AUTH_SIGNIN');
    //         return this.http.post(api + authData.appName, this.commonFunctionService.encryptRequest({ username: authData.username, password: authData.password }))
    //             .pipe(switchMap((respData) => {
    //                 if(respData && respData['success'] && respData['success'].challengeName && respData['success'].challengeName == 'NEW_PASSWORD_REQUIRED'){
    //                     this.storageService.setResetNewPasswordSession(respData['success'].session);
    //                     this.router.navigate(['/resetpwd/'+authData.username]); 
    //                 }else if (respData && respData.hasOwnProperty('success')) {
    //                     //console.log(respData["success"].authenticationResult);
    //                     const cognitoIdToken = respData["success"].authenticationResult.idToken;
    //                     const cognitoRefreshToken = respData["success"].authenticationResult.refreshToken;
    //                     const cognitoAccessToken = respData["success"].authenticationResult.accessToken;
    //                     const cognitoExpiresIn = respData["success"].authenticationResult.expiresIn;
    //                     this.storageService.setExpiresIn(cognitoExpiresIn);
    //                     this.storageService.SetIdToken(cognitoIdToken);                        
    //                     this.storageService.SetRefreshToken(cognitoRefreshToken);
    //                     this.storageService.SetAccessToken(cognitoAccessToken);
    //                     this.commonFunctionService.notify("bg-success", " Login  Successful.");
    //                     return [
    //                         {
    //                             type: AuthActions.SIGNIN
    //                         },
    //                         {
    //                             type: AuthActions.GET_USER_INFO_FROM_TOKEN,
    //                             payload: cognitoIdToken
    //                         },
    //                     ];
    //                 } else if (respData.hasOwnProperty('error')) {
    //                     if (respData["error"] == "not_confirmed") {
    //                         this.commonFunctionService.notify("bg-danger", "User Not Confirmed ");
    //                     } else if (respData["error"] == "user_name_password_does_not_match") {
    //                         this.commonFunctionService.notify("bg-danger", "Username password does not match ");
    //                     }
    //                 }
    //             }),
    //                 catchError(err => {
    //                     //console.log(err);
    //                     return [

    //                     ]

    //                 }))

    //     })
    // )
    // @Effect()
    // trySignup = this.actions$.pipe(
    //     ofType(AuthActions.TRY_SIGNUP),
    //     map(
    //         (action: AuthActions.TrySignup) => {
    //             return action.payload;
    //         }
    //     ),
    //     switchMap((payload) => {
    //         let api;
    //         api = this.envService.baseUrl('AUTH_SIGNUP') 
    //         return this.http.post(api + payload.appName, this.commonFunctionService.encryptRequest(payload.data))
    //             .pipe(switchMap(respData => {
    //                 this.commonFunctionService.notify("bg-success", "A verification link has been sent to your email account. please click on the link to verify your email and continue the registration process. ");

    //                 //console.log(respData);
    //                 return [

    //                 ];
    //             }),
    //                 catchError(err => {
    //                     //console.log(err);
    //                     return [

    //                     ]

    //                 }))

    //     })
    // )
    // @Effect()
    // resetPassword = this.actions$.pipe(
    //     ofType(AuthActions.RESET_PASS),
    //     map(
    //         (action: AuthActions.ResetPass) => {
    //             return action.payload;
    //         }
    //     ),
    //     switchMap((payload) => {
    //         let api;
    //         api = this.envService.baseUrl('RESET_PASSWORD');
    //         return this.http.post(api+'/'+payload.appId,this.commonFunctionService.encryptRequest(payload.data))
    //             .pipe(switchMap((respData) => {
    //                 console.log(respData);
    //                 if (respData && respData.hasOwnProperty('success')) {
                        
    //                     this.commonFunctionService.notify("bg-success", " New Password Set  Successfully.");
    //                     this.router.navigate(['/admin']);
    //                 } else if (respData.hasOwnProperty('error')) {
    //                     if (respData["error"] == "not_confirmed") {
    //                         this.commonFunctionService.notify("bg-danger", "User Not Confirmed ");
    //                     } else if (respData["error"] == "user_name_password_does_not_match") {
    //                         this.commonFunctionService.notify("bg-danger", "Username password does not match ");
    //                     }
    //                 }
    //                 return [

    //                 ]
                   
    //             }),
    //                 catchError(err => {
    //                     //console.log(err);
    //                     return [

    //                     ]

    //                 }))

    //     })
    // )


//    @Effect()
//     otpVarification = this.actions$.pipe(
//         ofType(AuthActions.OTP_VARIFY),
//         map(
//             (action: AuthActions.OtpVarify) => {
//                 return action.payload;
//             }
//         ),
//         switchMap((payload) => {
//             let api;
//             api = this.envService.baseUrl('OTP_VARIFICATION') 
//             return this.http.post(api + payload.appName, this.commonFunctionService.encryptRequest(payload.data))
//                 .pipe(switchMap(respData => {
//                     if(respData['success']){
//                         this.router.navigate(['/signin']);
//                     }else if(respData['error']){
//                         this.commonFunctionService.notify("bg-danger", respData['message']);
//                     }
//                     return [

//                     ];
//                 }),
//                     catchError(err => {
//                         //console.log(err);
//                         return [

//                         ]

//                     }))

//         })
//     )

//     constructor(private actions$: Actions,
//         private router: Router,
//         private http: HttpClient,
//         private storageService: StorageService,
//         private commonFunctionService: CommonFunctionService,
//         private store: Store<fromApp.AppState>,
//         private apiService:ApiService,
//         private envService:EnvService,
//         private dataShareService:DataShareService
//     ) { }

// }