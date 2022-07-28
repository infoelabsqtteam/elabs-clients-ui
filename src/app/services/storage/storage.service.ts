import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { StorageTokenStatus } from 'src/app/shared/enums/storage-token-status.enum';
import { EnvService } from '../env/env.service';



@Injectable({
  providedIn: 'root'
})
export class StorageService {
  ID_TOKEN: string = 'ID_TOKEN';
  ACCESS_TOKEN: string = 'ACCESS_TOKEN';
  REFRESH_TOKEN: string = 'REFRESH_TOKEN';
  RESET_PASS_SESSION:string = 'RESET_PASS_SESSION';
  // EXPIRY_IN:any=86400;
  EXPIRY_IN:any= 'EXPIRY_IN';
  USER_KEY: string = 'USER';
  ACTIVE_MENU: string = 'MENU';
  MENU_TYPE: string = 'MENU_TYPE';
  ID_TOKEN_EXPIRY_TIME: string = 'ID_TOKEN_EXPIRY_TIME';
  REFRESH_TOKEN_EXPIRY_TIME:string='REFRESH_TOKEN_EXPIRY_TIME';
  userInfo: any;
  log: any;
  age:any=3540000; //59 minuts 
  refreshTokenAge:any=2505600000 //refresh token age 29 days
  appName:any = environment.appName;
  packDetails: any = {};

  HOST_NAME : string = 'HOST_NAME';
  PROJECT_FOLDER_NAME: string = 'PROJECT_FOLDER_NAME';
  TEMP_NAME:string = "TEMP_NAME";
  TEMP_THEME:string = "TEMP_THEME";
  PAGE_TITLE:string = "PAGE_TITLE";
  VERIFY_TYPE:string = "VERIFY_TYPE";
  MODULE:string = "MODULE";
  TEAM_NAME:string = "TEAM_NAME";
  USER_PREFERENCE:any;
  
  
  constructor(private http: HttpClient) { }

  setModule(module:string){
    localStorage.setItem("MODULE",module);
  }
  getModule(){
    return localStorage.getItem('MODULE');
  }
  setUserPreference(user_preference:any){
    localStorage.setItem("USER_PREFERENCE",JSON.stringify(user_preference));
  }
  getUserPreference(){
    return JSON.parse(localStorage.getItem('USER_PREFERENCE'));
  }

  setAppId(appId:string){
    localStorage.setItem('appId', appId);
  }

  getAppId(){
    const user = this.GetUserInfo();
    if(user && user.appId && user.appId != null){
      return user.appId;
    }else{
      return localStorage.getItem('appId')
    }
  }

  setExpiresIn(expiry: any){
    let expiryTime = (expiry - 300)*1000
    localStorage.setItem(this.EXPIRY_IN, JSON.stringify(expiryTime));
    this.setIdTokenExpiry();
  }
  getExpiresIn(){
    return localStorage.getItem(this.EXPIRY_IN);
  }
  SetIdToken(token: any) {
    const setTokenObj = {};
    setTokenObj[this.appName] = token
    localStorage.setItem(this.ID_TOKEN, JSON.stringify(setTokenObj))
    //this.setIdTokenExpiry();
  }
  GetIdToken() {  
    let id_token = localStorage.getItem(this.ID_TOKEN);
    if(this.IsJsonString(id_token)){
      let obj = JSON.parse(localStorage.getItem(this.ID_TOKEN));
      if(obj && obj != null && obj[this.appName]){
        return (obj[this.appName]);
      }else{
        return null;
      }
    }else{
      return null;
    }
  }
  IsJsonString(str) {
      try {
          JSON.parse(str);
      } catch (e) {
          return false;
      }
      return true;
  }
  SetAccessToken(token: any) {
    const setAccessTokenObj = {};
    setAccessTokenObj[this.appName] = token
    localStorage.setItem(this.ACCESS_TOKEN, JSON.stringify(setAccessTokenObj));
  }
  GetAccessToken() {  
    if(this.IsJsonString(localStorage.getItem(this.ACCESS_TOKEN))){ 
      let obj = JSON.parse(localStorage.getItem(this.ACCESS_TOKEN));
      if(obj && obj[this.appName]){
          return (obj[this.appName]);
      }
    }else{
      return null;
    }  
  }
  SetRefreshToken(token: string) {
    localStorage.setItem(this.REFRESH_TOKEN, token);
    this.setRefreshTokenExpiry();
  }
  GetRefreshToken() {    
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  GetIdTokenStatus(){
    let expired = 0;
    let expireTime = Number(localStorage.getItem(this.ID_TOKEN_EXPIRY_TIME));
    let currentTime = Date.now();
    let expiresIn24Hours = 0;
    
	if(expireTime > currentTime)
      expiresIn24Hours =  (((expireTime-currentTime)/1000)/3600) ;
    
	if(currentTime > expireTime){
      if(expireTime > 0){        
        return StorageTokenStatus.ID_TOKEN_EXPIRED;  // appConstant.TOKEN_STATUS.ID_TOKEN_EXPIRED; // notify, due to expired
      }
      return  StorageTokenStatus.ID_TOKEN_NOT_CREATED; //appConstant.TOKEN_STATUS.ID_TOKEN_NOT_CREATED;  // first time loading so no notify   
    } else if(expiresIn24Hours > 24){
		return StorageTokenStatus.ID_TOKEN_EXPIRED //appConstant.TOKEN_STATUS.ID_TOKEN_EXPIRED; // notify, due to expired
	}
	
    return StorageTokenStatus.ID_TOKEN_ACTIVE; //appConstant.TOKEN_STATUS.ID_TOKEN_ACTIVE; // not expired
  }

  
  
  GetRefreshTokenStatus(){
    let expired = 0;
    let expireTime = Number(localStorage.getItem(this.REFRESH_TOKEN_EXPIRY_TIME));
    let currentTime = Date.now();
    if(currentTime > expireTime){     
      if(expireTime > 0){        
        return StorageTokenStatus.REFRESH_TOKEN_EXPIRED; // appConstant.TOKEN_STATUS.REFRESH_TOKEN_EXPIRED; // notify, due to expired
      } 
      return StorageTokenStatus.REFRESH_TOKEN_NOT_CREATED; // appConstant.TOKEN_STATUS.REFRESH_TOKEN_NOT_CREATED;  // first time loading so no notify   
    }
    return StorageTokenStatus.REFRESH_TOKEN_ACTIVE; // appConstant.TOKEN_STATUS.REFRESH_TOKEN_ACTIVE; // not expired
  }

  SetUserInfo(user: any) {
    const userObj = {};
    userObj[this.appName] = user;
    localStorage.setItem(this.USER_KEY, JSON.stringify(userObj));
  }
  GetUserInfo() {
    const obj = JSON.parse(localStorage.getItem(this.USER_KEY));
    if(obj && obj[this.appName]){
      if(obj[this.appName].user){
        return obj[this.appName].user
      }
      else{
        return null;
      }
    }
    // if (user && user.user) {
    //   return user.user;
    // } else {
    //   return null;
    // }

  }
  GetPermission() {
    const obj = JSON.parse(localStorage.getItem(this.USER_KEY));
    if(obj && obj[this.appName]){
      if(obj[this.appName].permission){
        return obj[this.appName].permission
      }
      else{
        return null;
      }
    }
    // if (user && user.user) {
    //   return user.user;
    // } else {
    //   return null;
    // }

  }

  GetModules(){
    const obj = JSON.parse(localStorage.getItem(this.USER_KEY));
    if(obj && obj[this.appName]){
      if(obj[this.appName].modules){
        return obj[this.appName].modules
      }
      else{
        return null;
      }
    }    
  }
  GetMenuType(){
    // const obj = JSON.parse(localStorage.getItem(this.USER_KEY));
    // if(obj && obj[this.appName]){
    //   if(obj[this.appName].menu_type){
    //     return obj[this.appName].menu_type
    //   }
    //   else{
    //     return null;
    //   }
    // } 
    const menu_Type = JSON.parse(localStorage.getItem(this.MENU_TYPE));
    if(menu_Type){
        return menu_Type;
      }
      else{
        return null;
    }
  }


  SetMenuType(menu_Type) {
    localStorage.setItem(this.MENU_TYPE, JSON.stringify(menu_Type));
  }



  getUserLog() {
    const userObj = JSON.parse(localStorage.getItem(this.USER_KEY));
    if(userObj && userObj[this.appName]){
      const user = userObj[this.appName];
      if(user && user != null && user != undefined && user.user){
        this.userInfo = user.user;
        this.log = { userId: this.userInfo.email, appId: this.getAppId(), refCode: this.userInfo.refCode };
        return this.log;
      }else{
        return null;
      } 
    }
      

  }
  SetActiveMenu(menu: any) {
    const menuObj = {};
    menuObj[this.appName] = menu;
    localStorage.setItem(this.ACTIVE_MENU, JSON.stringify(menuObj));
  }
  GetActiveMenu() {
    let obj = JSON.parse(localStorage.getItem(this.ACTIVE_MENU));
    if(obj && obj[this.appName]){
      const menu = (obj[this.appName]);
      return menu;
    } 
    // const menu = JSON.parse(localStorage.getItem(this.ACTIVE_MENU));
    // return menu;
  }
  getRefCode() {
    const userinfo = this.GetUserInfo();
    if(userinfo && userinfo.refCode){
      return userinfo.refCode;
    }
    return null;
  }
  getUserAppId(){
    return this.userInfo.appId;
  }
  removeDataFormStorage() {
    localStorage.clear();
  }

  setIdTokenExpiry(){
    const startTime = Date.now();
    const expiry = Number(this.getExpiresIn());
    //const expiry = this.getExpiresIn();
    localStorage.setItem(this.ID_TOKEN_EXPIRY_TIME, ""+(startTime + expiry));    
  }

  setRefreshTokenExpiry(){
    const startTime = Date.now();
    localStorage.setItem(this.REFRESH_TOKEN_EXPIRY_TIME, startTime + this.refreshTokenAge);
  }
  search(url: string, term: string) {
    if (term === '') {
      return of([]);
    }
    return this.http
      .get(url + term).pipe(
        map((response) => {
          return response;
          //console.log(response);
        })
      );
  }
  setResetNewPasswordSession(session){
    localStorage.setItem('RESET_PASS_SESSION',session);
  }
  getResetNewPasswordSession(){
    const session = localStorage.getItem('RESET_PASS_SESSION');
    return session;
  }
  searchPostMethod(url: string, payload: any) {
    if (payload === '') {
      return of([]);
    }
    return this.http
      .post(url, payload).pipe(
        map((response) => {
          return response;
          //console.log(response);
        })
      );
  }
  setPackaging(cartData) {
    switch (cartData.type) {
      case 'TAB': this.packDetails.packing = 'Packing : 1 strip (' + cartData.packing + ' Tablets Each)';
        this.packDetails.unit = 'Strip(s)';
        break;
      case 'SYP': this.packDetails.packing = 'Packing : 1 Bottle (' + cartData.packing + ' Syrup Each)';
        this.packDetails.unit = 'Bottle(s)';
        break;
      case 'LOT': this.packDetails.packing = 'Packing : 1 Bottle (' + cartData.packing + ' Lotion Each)';
        this.packDetails.unit = 'Bottle(s)';
        break;
      case 'INJ': this.packDetails.packing = 'Packing : 1 Vial (' + cartData.packing + ' Injection Each)';
        this.packDetails.unit = 'Vial(s)';
        break;
      case 'POWD': this.packDetails.packing = 'Packing : 1 Box (' + cartData.packing + ' Powder Each)';
        this.packDetails.unit = 'Box(es)';
        break;
      case 'CAP': this.packDetails.packing = 'Packing : 1 strip (' + cartData.packing + ' Capsule Each)';
        this.packDetails.unit = 'Strip(s)';
        break;
      case 'SACH': this.packDetails.packing = 'Packing : 1 Packet (' + cartData.packing + ' Sachet Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'INH': this.packDetails.packing = 'Packing : 1 Box (' + cartData.packing + ' Inhaler Each)';
        this.packDetails.unit = 'Box(es)';
        break;
      case 'ROTO': this.packDetails.packing = 'Packing : 1 Box (' + cartData.packing + ' Redicaps Each)';
        this.packDetails.unit = 'Box(es)';
        break;
      case 'E/DR': this.packDetails.packing = 'Packing : 1 Packet (' + cartData.packing + ' Eye Drop Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'EDRP': this.packDetails.packing = 'Packing : 1 Packet (' + cartData.packing + ' Eye Drop Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'OINT': this.packDetails.packing = 'Packing : 1 Tube (' + cartData.packing + ' Ointment Each)';
        this.packDetails.unit = 'Tube(s)';
        break;
      case 'OIL': this.packDetails.packing = 'Packing : 1 Bottle (' + cartData.packing + ' Bottle Each)';
        this.packDetails.unit = 'Bottle(s)';
        break;
      case 'SOAP': this.packDetails.packing = 'Packing : 1 Pack (' + cartData.packing + ' Pack Each)';
        this.packDetails.unit = 'Pack(s)';
        break;
      case 'FWSH': this.packDetails.packing = 'Packing : 1 Pack (' + cartData.packing + ' Pack Each)';
        this.packDetails.unit = 'Pack(s)';
        break;
      case 'DRP': this.packDetails.packing = 'Packing : 1 Pack (' + cartData.packing + ' Pack Each)';
        this.packDetails.unit = 'Pack(s)';
        break;
      case 'JELY': this.packDetails.packing = 'Packing : 1 Packet (' + cartData.packing + ' Jelly Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'CREM': this.packDetails.packing = 'Packing : 1 Tube (' + cartData.packing + ' Cream Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'CRTG': this.packDetails.packing = 'Packing : 1 Bottle (' + cartData.packing + ' Bottle Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'CONER': this.packDetails.packing = 'Packing : 1 Pack (' + cartData.packing + ' Pack Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'CHRN': this.packDetails.packing = 'Packing : 1 Pack (' + cartData.packing + ' Pack Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'FLOS': this.packDetails.packing = 'Packing : 1 Pack (' + cartData.packing + ' Pack Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'DIAP': this.packDetails.packing = 'Packing : 1 Pack (' + cartData.packing + ' Pack Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'DRES': this.packDetails.packing = 'Packing : 1 Pack (' + cartData.packing + ' Pack Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'DRNK': this.packDetails.packing = 'Packing :1 Bottle (' + cartData.packing + ' Bottle each)';
        this.packDetails.unit = 'Bottle(s)';
        break;
      case 'DSYP': this.packDetails.packing = 'Packing : 1 Bottle (' + cartData.packing + ' Bottle Each)';
        this.packDetails.unit = 'Bottle(s)';
        break;
      case 'DPO': this.packDetails.packing = 'Packing : 1 Pack (' + cartData.packing + ' Pack Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'ENM': this.packDetails.packing = 'Packing : 1 Pack (' + cartData.packing + ' Pack Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'EXP': this.packDetails.packing = 'Packing : 1 Bottle (' + cartData.packing + ' Bottle Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'EOINT': this.packDetails.packing = 'Packing : 1 Tube (' + cartData.packing + ' Ointment Each)';
        this.packDetails.unit = 'Tube(s)';
        break;
      case 'GEL': this.packDetails.packing = 'Packing : 1 Tube (' + cartData.packing + ' Gel Each)';
        this.packDetails.unit = 'Gel(s)';
        break;
      case 'GRGL': this.packDetails.packing = 'Packing : 1 Bottle (' + cartData.packing + ' Bottle Each)';
        this.packDetails.unit = 'Bottle(s)';
        break;
      case 'GMTR': this.packDetails.packing = 'Packing : 1 Pack (' + cartData.packing + ' Pack Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'HAISER': this.packDetails.packing = 'Packing : 1 Bottle (' + cartData.packing + ' Bottle Each)';
        this.packDetails.unit = 'Bottle(s)';
        break;
      case 'HWSH': this.packDetails.packing = 'Packing : 1 Bottle (' + cartData.packing + ' Bottle Each)';
        this.packDetails.unit = 'Bottle(s)';
        break;
      case 'INFN': this.packDetails.packing = 'Packing : 1 Pack (' + cartData.packing + ' Pack Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'VWASH': this.packDetails.packing = 'Packing : 1 Pack (' + cartData.packing + ' Pack Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'JAR': this.packDetails.packing = 'Packing : 1 Pack (' + cartData.packing + ' Pack Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'JUIC': this.packDetails.packing = 'Packing : 1 Pack (' + cartData.packing + ' Pack Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'KIT': this.packDetails.packing = 'Packing : 1 Pack (' + cartData.packing + ' Kit Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'LBALM': this.packDetails.packing = 'Packing : 1 Pack (' + cartData.packing + ' Pack Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'LQD': this.packDetails.packing = 'Packing : 1 Bottle (' + cartData.packing + ' Bottle Each)';
        this.packDetails.unit = 'Bottle(s)';
        break;
      case 'MPNT': this.packDetails.packing = 'Packing : 1 Pack (' + cartData.packing + ' Pack Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'MWSH': this.packDetails.packing = 'Packing : 1 Bottle (' + cartData.packing + ' Bottle Each)';
        this.packDetails.unit = 'Bottle(s)';
        break;
      case 'NDRP': this.packDetails.packing = 'Packing : 1 Pack (' + cartData.packing + ' Pack Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'NIPLE': this.packDetails.packing = 'Packing : 1 Pack (' + cartData.packing + ' Pack Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'ODRPS': this.packDetails.packing = 'Packing : 1 Bottle (' + cartData.packing + ' Bottle Each)';
        this.packDetails.unit = 'Bottle(s)';
        break;
      case 'PKT': this.packDetails.packing = 'Packing : 1 Pack (' + cartData.packing + ' Pack Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'PFS': this.packDetails.packing = 'Packing : 1 Syringe (' + cartData.packing + ' Syringe Each)';
        this.packDetails.unit = 'Syringe(s)';
        break;
      case 'RPSLS': this.packDetails.packing = 'Packing : 1 Respule (' + cartData.packing + ' Respule Each)';
        this.packDetails.unit = 'Respule(s)';
        break;
      case 'ROLL': this.packDetails.packing = 'Packing : 1 Pack (' + cartData.packing + ' Pack Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'SACH': this.packDetails.packing = 'Packing : 1 Pack (' + cartData.packing + ' Pack Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'SCRUB': this.packDetails.packing = 'Packing : 1 Pack (' + cartData.packing + ' Pack Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'SHAMP': this.packDetails.packing = 'Packing : 1 Bottle (' + cartData.packing + ' Bottle Each)';
        this.packDetails.unit = 'Bottle(s)';
        break;
      case 'SLTN': this.packDetails.packing = 'Packing : 1 Bottle (' + cartData.packing + ' Bottle Each)';
        this.packDetails.unit = 'Bottle(s)';
        break;
      case 'SPRY': this.packDetails.packing = 'Packing : 1 Bottle (' + cartData.packing + ' Bottle Each)';
        this.packDetails.unit = 'Bottle(s)';
        break;
      case 'TPAST': this.packDetails.packing = 'Packing : 1 Paste (' + cartData.packing + ' Paste Each)';
        this.packDetails.unit = 'Paste(s)';
        break;
      case 'VACC': this.packDetails.packing = 'Packing : 1 Vaccine (' + cartData.packing + ' Pack Each)';
        this.packDetails.unit = 'Paste(s)';
        break;
      case 'VTAB': this.packDetails.packing = 'Packing : 1 Tablet (' + cartData.packing + ' Tablet Each)';
        this.packDetails.unit = 'Tablet(s)';
        break;
      case 'WIPS': this.packDetails.packing = 'Packing : 1 Wipes (' + cartData.packing + ' Wipes Each)';
        this.packDetails.unit = 'Wipe(s)';
        break;
      case 'TULL': this.packDetails.packing = 'Packing : 1 Pack (' + cartData.packing + ' Pack Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'TBAG': this.packDetails.packing = 'Packing : 1 Pack (' + cartData.packing + ' Pack Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'SYRNEE': this.packDetails.packing = 'Packing : 1 Pack Syringe (' + cartData.packing + ' Pack Syringe Each)';
        this.packDetails.unit = 'Packet(s)';
        break;
      case 'NSPRY': this.packDetails.packing = 'Packing : 1 Bottle (' + cartData.packing + ' Bottle Each)';
        this.packDetails.unit = 'Bottle(s)';
        break;
      case 'RMSRP': this.packDetails.packing = 'Packing : 1 Bottle (' + cartData.packing + ' Bottle Each)';
        this.packDetails.unit = 'Bottle(s)';
        break;

      default: this.packDetails.packing = 'Packing : 1 strip (' + cartData.packing + ' Tablets Each)';
        this.packDetails.unit = 'Strip(s)';
    }
    return this.packDetails;
  }

  setHostNameDinamically(host:string){
    localStorage.setItem(this.HOST_NAME, host);
  }

  getHostNameDinamically(){
    return localStorage.getItem(this.HOST_NAME);
  }

  setLogoPath(path:string){
    localStorage.setItem(this.PROJECT_FOLDER_NAME, path);
  }

  getLogoPath(){
    return localStorage.getItem(this.PROJECT_FOLDER_NAME);
  }


  setPageTitle(title:string){
    localStorage.setItem(this.PAGE_TITLE, title);
  }

  getPageTitle(){
    return localStorage.getItem(this.PAGE_TITLE);
  }

  setVerifyType(type){
    localStorage.setItem(this.VERIFY_TYPE, type);
  }
  getVerifyType(){
    return localStorage.getItem(this.VERIFY_TYPE);
  }


  setPageTheme(theme:string){
    localStorage.setItem(this.TEMP_THEME, theme);
  }

  getPageThmem(){
    return localStorage.getItem(this.TEMP_THEME);
  }



  setTempName(temp){
    localStorage.setItem(this.TEMP_NAME,temp);
  }
  getTemplateName(){
    const template:string=localStorage.getItem(this.TEMP_NAME);
    return template;
  }


  setTeamName(teamname:string){
    localStorage.setItem(this.TEAM_NAME, teamname);
  }

  getTeamName(){
    return localStorage.getItem(this.TEAM_NAME);
  }


}
