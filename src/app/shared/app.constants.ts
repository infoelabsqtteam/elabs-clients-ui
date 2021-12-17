// = "https://pc.omoknow.com/rest/";
import { environment } from '../../environments/environment';

let serverhost;
serverhost = environment.serverhost;
//if(window.location.href.indexOf("sit-lims-elabs")>=0){
//     serverhost="https://serverelabs.omoknow.com/rest/";
//}else if(window.location.href.indexOf("uat-lims-elabs")>=0){
//     serverhost="https://serverelabs-uat.omoknow.com/rest/";
//}else{
//     serverhost="https://serverelabs.omoknow.com/rest/";
//}


export const baseUrl = serverhost;
export const appId = environment.appId;
export const appName = environment.appName;
export const apiKey = "ef1674ab-4e49-11eb-8153-0200cd936042";
export const autoGen = "/AUTOGEN"

export const otpApi = "https://2factor.in/API/V1/" + apiKey + "/SMS/";
export const verifyOtpApi = "https://2factor.in/API/V1/" + apiKey + "/SMS/VERIFY/";

export const AUTH_TYPE = 'USER';

export const varify_with_otp = false;
export const googleMapInForm = false;

export enum ApplicationAction {
    GET_USER_PERMISSION = 'user/utvn',
    SAVE_CUSTOM_TEMPLATE = 'ins/save/templates',
    SAVE_FORM_DATA = 'ins/save',
    SEND_EMAIL = 'ins/send_mail',
    GET_CUSTOM_TEMPLATE = 'rpts/sobj',
    GET_GRID_DATA = 'rpts/gd',
    GET_TEMPLATE_NAMES = 'template/names',
    // EXPORT_GRID_DATA = 'rpts/printRpt',
    EXPORT_GRID_DATA = 'downloads/excelExport',
    SAVE_NAVIGATION = 'ins/save/navigation',
    SAVE_PERMISSION = 'ins/save/permissions',
    GET_STATIC_DATA = 'rpts/gsd',
    SAVE_QUOTE = 'ins/save/request_qoute',
    AUTH_SIGNIN = 'login/si/',
    AUTH_SIGNUP = 'login/su/',
    AUTH_SIGNOUT = 'login/signOut/',
    AUTH_FORGET_PASSWORD = 'login/fp/',
    AUTH_RESET_PASSWORD = 'login/rp/',
    AUTH_CHANGE_PASSWORD = 'login/cp/',
    GET_AUTH_APP = 'user/auth/app/',
    SAVE_CONTACT_US = 'ins/save/contact_us_query',
    SAVE_CAREER_WITH_US = 'ins/save/career_with_us',
    GET_PREVIEW_HTML = 'rpts/get_html',
    GET_PARAMETER_LIST = 'qt/sobj',
    SAVE_PARAMETER_LIST = 'qt/popbranch',
    GET_PDF = 'rpts/get_pdf',
    GET_PUBLIC_PDF = 'get_pdf',
    DOWNLOAD_PDF = 'rpts/getfl',
    PATAINT_REPORT = 'get_report',
    GET_CHART_DATA = 'rpts/get_chart_data',
    GET_FORM = 'rpts/get_form',
    GET_FORM_PUBLIC = 'get_form',
    GET_FILE = 'rpts/get_file',
    RESET_PASSWORD = 'login/cnp',
    GET_DASHLET_DATA = 'rpts/get_dashlet_data',
    OTP_VARIFICATION = 'login/confirmUserWithToken/',
    GET_COMPARE_DATA = 'mig/send_menu_by_module/',
    GET_QR_CODE = 'rpts/qrGen/'
}
export enum ApplicationType {
    PUBLIC = 'public/'
}
export class BaseUrl {

    public static getBaseUrl(applicationAction) {
        return baseUrl + ApplicationAction[applicationAction]
    }
    public static getPublicBaseUrl(applicationAction) {
        return baseUrl + ApplicationType['PUBLIC'] + ApplicationAction[applicationAction]
    }
}

// export const authApi = baseUrl + "login/";

// export const getUserPerm = baseUrl + 'user/utv';

// // Custom Template Generator API
// export const saveCusTempGen = baseUrl + "ins/save/templates";
// export const saveFormData = baseUrl + "ins/save";
// export const getCusTempGen = baseUrl + "rpts/sobj";
// export const getGridData = baseUrl + "rpts/gd";
// export const getTemp = baseUrl + "rpts/template_names";
// export const exportGridData = baseUrl + "rpts/printRpt";

// export const saveNavigation = baseUrl + "ins/save/navigation"
// export const savePermission = baseUrl + "ins/save/permissions"
// export const getStaticData = baseUrl + "rpts/gsd";
// export const saveQoute = baseUrl + "ins/save/request_qoute"
// export const signin = baseUrl + "login/si/";
// export const signout = baseUrl + "login/signOut/";
// //export const refreshtoken = baseUrl + "login/refreshToken/";
// export const signup = baseUrl + "login/su/";
// export const forgetPassword = baseUrl + "login/fp/";
// export const resetPassword = baseUrl + "login/rp/";
// export const changePassword = baseUrl + "login/cp/";



// export const getAuthApp = baseUrl + "user/auth/app";

// export const saveContactUs = baseUrl + "ins/save/contact_us_query";

// export const carrerWithtUs = baseUrl + "ins/save/career_with_us";

// export const updateSelectProduct = baseUrl + "qt/popbranch";
// export const getParameterList = baseUrl + "qt/sobj";
// export const getPreviewHtml = baseUrl + "rpts/get_html";
// export const getJobSchedules = baseUrl + "rpts/gd";
// export const getDownloadPdf = baseUrl + "rpts/get_pdf";
// export const downloadFile = baseUrl + "rpts/getfl";
// export const getPatientReport = baseUrl + "public/get_report";
// export const getReport = baseUrl + "public/get_pdf";


export enum TOKEN_STATUS {
    ID_TOKEN_NOT_CREATED, ID_TOKEN_ACTIVE, ID_TOKEN_EXPIRED, REFRESH_TOKEN_NOT_CREATED, REFRESH_TOKEN_ACTIVE, REFRESH_TOKEN_EXPIRED
}
