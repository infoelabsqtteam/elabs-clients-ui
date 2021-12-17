// import * as AuthActions from './auth.actions';

// export interface ValidationMessage {
//     code: string;
//     name: string;
//     message: string;
// }

// export interface State {
//     authenticated: boolean;
//     validationMessage: ValidationMessage;
//     userInfo: any;
//     appName: any;
//     userPermission:any;
// }

// const initialState: State = {
//     authenticated: false,
//     validationMessage: { code: null, name: null, message: null, },
//     userInfo: null,
//     appName: null,
//     userPermission:{}
// };

// export function authReducer(state = initialState, action: AuthActions.AuthActions) {
//     switch (action.type) {
//         case (AuthActions.SIGNUP):
//         case (AuthActions.SIGNIN):
//             return {
//                 ...state,
//                 authenticated: true
//             }
//         case (AuthActions.SESSION_EXPIRED):
//         case (AuthActions.LOGOUT):
//             return {
//                 ...state,
//                 authenticated: false,
//                 userInfo:null
//             }
//         case (AuthActions.SIGNUP_VALIDATION_ERROR):
//             return {
//                 ...state,
//                 authenticated: false,
//                 validationMessage: { code: action.payload.code, name: action.payload.name, message: action.payload.message }
//             }
//         case (AuthActions.GET_USER_INFO_FROM_TOKEN):
//             return {
//                 ...state,
//                 userInfo: action.payload
//             }
//         case (AuthActions.GET_AUTH_APP_NAME_SUCCESS):
//             return {
//                 ...state,
//                 appName: action.payload
//             }
//         case (AuthActions.SET_USER_PERMISSION):
//             return {
//                 ...state,
//                 userPermission: action.payload
//             }
//         default:
//             return state;
//     }

// }