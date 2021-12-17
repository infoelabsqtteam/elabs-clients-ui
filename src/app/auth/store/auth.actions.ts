// import { Action } from '@ngrx/store';

// export const TRY_SIGNUP = 'TRY_SIGNUP';
// export const SIGNUP_VALIDATION_ERROR = 'SIGNUP_VALIDATION_ERROR';
// export const SIGNUP = 'SIGNUP';
// export const TRY_SIGNIN = 'TRY_SIGNIN';
// export const TRY_VERIFY = 'TRY_VERIFY';

// export const SIGNIN = 'SIGNIN';
// export const LOGOUT = 'LOGOUT';
// export const SESSION_EXPIRED= 'SESSION_EXPIRED';

// export const TRY_FORGOT_PASSWORD = "TRY_FORGOT_PASSWORD";
// export const SAVE_NEW_PASSWORD = "SAVE_NEW_PASSWORD";

// export const GET_PERMISSION = "GET_PERMISSION";
// export const GET_PERMISSION_ERROR = "GET_PERMISSION_ERROR";
// export const SET_PERMISSION_ERROR = "SET_PERMISSION_ERROR";

// export const SET_PERMISSION = "SET_PERMISSION";

// export const RESET_PASS = "RESET_PASS";


// export const GET_USER_INFO_FROM_TOKEN = 'GET_USER_INFO_FROM_TOKEN';
// export const GET_AUTH_APP_NAME = "GET_AUTH_APP_NAME";
// export const GET_AUTH_APP_NAME_SUCCESS = "GET_AUTH_APP_NAME_SUCCESS";
// export const GET_AUTH_APP_NAME_ERROR = "GET_AUTH_APP_NAME_ERROR";

// export const SET_USER_PERMISSION = "SET_USER_PERMISSION";

// export const OTP_VARIFY = "OTP_VARIFY";

// export class TrySignup implements Action {
//     readonly type = TRY_SIGNUP;

//     constructor(public payload: any) { }
// }

// export class TryVerify implements Action {
//     readonly type = TRY_VERIFY;

//     constructor(public payload: { username: string, verifycode: string }) { }
// }

// export class SignupValidationError implements Action {
//     readonly type = SIGNUP_VALIDATION_ERROR;

//     constructor(public payload: { code: string, name: string, message: string }) { }
// }

// export class TrySignin implements Action {
//     readonly type = TRY_SIGNIN;

//     constructor(public payload: { username: string, password: string, appName: string }) { }
// }

// export class Signup implements Action {
//     readonly type = SIGNUP;
// }

// export class Signin implements Action {
//     readonly type = SIGNIN;
// }

// export class Logout implements Action {
//     readonly type = LOGOUT;
//     constructor(public payload: any) { }
// }
// export class SessionExpired implements Action {
//     readonly type = SESSION_EXPIRED;
//     constructor(public payload: any) { }
// }

// export class GetUserInfoFromToken implements Action {
//     readonly type = GET_USER_INFO_FROM_TOKEN;

//     constructor(public payload: any) { }
// }
// export class GetUserPermission implements Action {
//     readonly type = GET_PERMISSION;

//     constructor(public payload: any) { }
// }
// export class SetUserPermission implements Action {
//     readonly type = SET_PERMISSION;

//     constructor(public payload: any) { }
// }
// export class TryForgotPassword implements Action {
//     readonly type = TRY_FORGOT_PASSWORD;

//     constructor(public payload: any) { }
// }
// export class SaveNewPassword implements Action {
//     readonly type = SAVE_NEW_PASSWORD;

//     constructor(public payload: any) { }
// }
// export class GetAuthAppName implements Action {
//     readonly type = GET_AUTH_APP_NAME;

//     constructor(public payload: any) { }
// }
// export class GetAuthAppNameSucc implements Action {
//     readonly type = GET_AUTH_APP_NAME_SUCCESS;

//     constructor(public payload: any) { }
// }
// export class GetAuthAppNameErr implements Action {
//     readonly type = GET_AUTH_APP_NAME_ERROR;

//     constructor(public payload: any) { }
// }

// export class getUserPermission implements Action {
//     readonly type = SET_USER_PERMISSION;

//     constructor(public payload:any){}
// }

// export class ResetPass implements Action {
//     readonly type = RESET_PASS;

//     constructor(public payload:any){}
// }

// export class OtpVarify implements Action {
//     readonly type = OTP_VARIFY;

//     constructor(public payload:any){}
// }
// export type AuthActions = Signup |
//     Signin |
//     Logout |
//     TrySignup |
//     TrySignin |
//     SignupValidationError |
//     GetUserInfoFromToken |
//     GetUserPermission |
//     SetUserPermission |
//     TryForgotPassword |
//     SaveNewPassword |
//     GetAuthAppName |
//     GetAuthAppNameSucc |
//     GetAuthAppNameErr | 
//     getUserPermission |
//     SessionExpired  |
//     ResetPass|
//     OtpVarify;