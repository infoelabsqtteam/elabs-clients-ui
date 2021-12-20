import { Component, OnInit, Input, OnDestroy, HostListener } from "@angular/core";
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage/storage.service';
import { PermissionService } from '../../services/permission/permission.service';
import { CommonFunctionService } from '../../services/common-utils/common-function.service';
import {ModalService} from '../../m-core/modals/modal.service';
import { solution } from './menu';
import { DataShareService } from '../../services/data-share/data-share.service';
import { AuthService } from "src/app/services/api/auth/auth.service";
import { StorageTokenStatus } from "src/app/shared/enums/storage-token-status.enum";
import { EnvService } from "src/app/services/env/env.service";

@Component({
  selector: 'app-header-landing-page',
  templateUrl: './header-landing-page.component.html',
  styleUrls: ['./header-landing-page.component.css']
})
export class HeaderLandingPageComponent implements OnInit {

      

    @Input() public pageName;
    solutions:any=[];
    active_menu: any = '';
    active_menu_d: any = 'custom-template';
    main_active_menu: any = '';

    menuBoxHome: boolean = false;
    menuBoxDashboard: boolean = false;
    showUserAccount:boolean = false;
    fullHeader: boolean = false;
    loginUserIcon: boolean = false;
    getmenu: boolean = true;


    public userInfo: any;
    public userColorCode: any;
    public userName: any;
    public userFirstLetter: any;
    public custmizedUserName: any;
    public menuData: any=[];
    public ourSolutionDropDown: any;
    public aboutUsDropDown: any;
    currentPage:any;
    subscription: any;
    menuDataSubscription;
    logoPath = '../../assets/images/logo.png'
    
    logedin:boolean=false;

  constructor(
    private router: Router, 
    private storageService: StorageService,
    private modalService: ModalService,
    private dataShareService:DataShareService,
    private authService:AuthService,
    private envService:EnvService
    ) {
        this.subscription =  this.dataShareService.currentPage.subscribe(
        (data: any) => {
            this.setpage(data);
        },
        error => {
            console.log(error)
        },
        () => console.log('')
        );
        this.menuDataSubscription = this.dataShareService.menu.subscribe(menu =>{
            this.setMenuData(menu);
        })
        this.solutions = solution;
    }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    if(this.menuDataSubscription){
        this.menuDataSubscription.unsubscribe();
    }
}
  navigateSigninPage() {
    // this.openModal('signin-modal');
    // this.pageName = 'SIGNIN';
    // this.store.dispatch(
    //     new AppActions.SetCurrentPageName(this.pageName)
    // )
    this.router.navigate(['signin'])
  }
  setpage(res){
    switch(res){
        case "HOME":
            this.fullHeader = true;
            this.menuBoxHome = true;
            this.menuBoxDashboard = false;
            this.loginUserIcon = false;
            this.showUserAccount = false;
            break;
        case "EXAMTEST":
            this.fullHeader = true;
            this.menuBoxHome = false;
            this.menuBoxDashboard = false;
            this.loginUserIcon = true;
            this.showUserAccount = false;
            break;
        case "DASHBOARD":
            if (this.getmenu) {
                this.getmenu = false;

            }
            this.fullHeader = true;
            this.menuBoxHome = false;
            this.menuBoxDashboard = true;
            this.loginUserIcon = true;
            this.showUserAccount = true;
            break;
        case "MODULE":
            this.fullHeader = true;
            this.menuBoxHome = false;
            this.menuBoxDashboard = false;
            this.loginUserIcon = true;
            this.showUserAccount = true;
            break;
        case "HOME2":
            this.fullHeader = true;
            this.menuBoxHome = true;
            this.menuBoxDashboard = false;
            this.loginUserIcon = false;
            this.showUserAccount = false;
            break;
        default :
            this.fullHeader = true;
            this.menuBoxHome = false;
            this.menuBoxDashboard = false;
            this.loginUserIcon = false;
            break;
            
    }
    if (this.loginUserIcon) {
        if (this.storageService.GetUserInfo()) {
            this.userInfo = this.storageService.GetUserInfo();
            this.userName = this.userInfo.first_name;
            if (this.userName && this.userName != null) {
                this.userFirstLetter = this.userName.charAt(0).toUpperCase()
            } else {
                if (this.userInfo.email && this.userInfo.email != null) {
                    this.userFirstLetter = this.userInfo.email.toUpperCase()
                }
            }
            this.getUserColorCode(this.userFirstLetter);
        }
    }
    if (this.storageService != null && this.storageService.GetIdToken() != null) {
        const idToken = this.storageService.GetIdToken();
        if(this.storageService.GetIdTokenStatus() == StorageTokenStatus.ID_TOKEN_ACTIVE){                
            this.logedin = true;
        }else{
            this.logedin = false;       
            const payload = {
            appName: this.envService.getAppName(),
            data:{
                accessToken:this.storageService.GetAccessToken()
            }
            }
            this.authService.SessionExpired(payload);
            
        }
    
    }else{
        this.logedin = false;
    }
}
setMenuData(menuData){
  if (menuData && menuData.length > 0) {
      this.menuData = menuData;
  }  
}
  openModal(id){
    let gridModalData = {};
    this.modalService.open(id, gridModalData);
  }
  closeModal(id){
    this.modalService.close(id);
  }
  signinResponce(responce){
    switch (responce) {
      case "signup":
        this.closeModal("signin-modal");
        this.openModal("signup-modal")
        break;   
      case "fgpwd":
        this.closeModal("signin-modal");
        this.openModal("fgpwd-modal")
        break; 
      default:
        break;
    }
  }
  signupResponce(responce){
    switch (responce) {
      case "signin":
        this.closeModal("signup-modal");
        this.openModal("signin-modal")
        break;    
      default:
        break;
    }
  }
  forgotPwdResponce(responce){
    switch (responce) {
      case "signin":
        this.closeModal("fgpwd-modal");
        this.openModal('signin-modal')
        break;    
      default:
        break;
    }
  }

  service(value){
    this.router.navigate(['/home_page']);
    this.dataShareService.shareData(value);

  }
  navigateDashboard(){       
    this.fullHeader = false;
    this.menuBoxHome = false;
    this.menuBoxDashboard = false;
    this.loginUserIcon = false;
    this.showUserAccount = false;  
    const menuType = this.storageService.GetMenuType()
    if(menuType == 'Horizontal'){
        this.router.navigate(['/home']);
    }else{
        this.router.navigate(['/dashboard']);
    }      
    if(this.storageService.GetIdTokenStatus() == StorageTokenStatus.ID_TOKEN_ACTIVE){
        const idToken = this.storageService.GetIdToken();
        this.authService.GetUserInfoFromToken(idToken);
    }else{        
        const payload = {
        appName: this.envService.getAppName(),
        data:{
            accessToken:this.storageService.GetAccessToken()
        }
        }
        this.authService.SessionExpired(payload);
    }
} 
getUserColorCode(n) {
  switch (n) {
      case "A":
          this.userColorCode = "#ff4444";
          break;
      case "B":
          this.userColorCode = "#ffbb33";
          break;
      case "C":
          this.userColorCode = "#00C851";
          break;
      case "D":
          this.userColorCode = "#33b5e5";
          break;
      case "E":
          this.userColorCode = "#2BBBAD";
          break;
      case "F":
          this.userColorCode = "#4285F4";
          break;
      case "G":
          this.userColorCode = "#aa66cc";
          break;
      case "H":
          this.userColorCode = "#ef5350";
          break;
      case "I":
          this.userColorCode = "#ec407a";
          break;
      case "J":
          this.userColorCode = "#ab47bc";
          break;
      case "K":
          this.userColorCode = "#7e57c2";
          break;
      case "L":
          this.userColorCode = "#5c6bc0";
          break;
      case "M":
          this.userColorCode = "#42a5f5";
          break;
      case "N":
          this.userColorCode = "#29b6f6";
          break;
      case "O":
          this.userColorCode = "#26c6da";
          break;
      case "P":
          this.userColorCode = "#26a69a";
          break;
      case "Q":
          this.userColorCode = "#00b0ff";
          break;
      case "R":
          this.userColorCode = "#43a047";
          break;
      case "S":
          this.userColorCode = "#7cb342";
          break;
      case "T":
          this.userColorCode = "#c0ca33";
          break;
      case "U":
          this.userColorCode = "#00c853";
          break;
      case "V":
          this.userColorCode = "#64dd17";
          break;
      case "W":
          this.userColorCode = "#fb8c00";
          break;
      case "X":
          this.userColorCode = "#ffab00";
          break;
      case "Y":
          this.userColorCode = "#f4511e";
          break;
      default:
          this.userColorCode = "#dd2c00";
          break;
  }
}





@HostListener('window:scroll', ['$event'])

  onWindowScroll(e) {
    let element = document.querySelector('.navbar');
    if(element && element.clientHeight){
        if (window.pageYOffset > element.clientHeight) {
            this.logoPath = '../../assets/img/2.png';
            element.classList.add('navbar-inverse', 'shadow');
        } else {
            this.logoPath = '../../assets/images/logo.png';
            element.classList.remove('navbar-inverse', 'shadow');
        }

    }
    
  }

  selectClass(){
      if(this.currentPage == 'HOME'){
          return 'home fixed-top';
      }
      else if(this.currentPage == 'HOME2'){
        let element = document.querySelector('.navbar');
        element.classList.add('navbar-inverse', 'shadow');
        this.logoPath = '../../assets/img/2.png';
        return 'fixed-top'
      }
      else{
          return ''
      }
  }

    gotoStaticMenu(menu) {
        if (menu == 'home_page') {
            this.dataShareService.sendCurrentPage('HOME')
            this.logoPath = '../../assets/images/logo.png';
            let element = document.querySelector('.navbar');
            element.classList.remove('navbar-inverse', 'shadow');
        }
        else {
            this.dataShareService.sendCurrentPage('HOME2')
        }

        this.router.navigate([menu])
    }








}
