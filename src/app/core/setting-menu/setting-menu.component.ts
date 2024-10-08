import { Component, OnInit, Input, OnDestroy, HostListener, AfterViewInit, OnChanges, SimpleChanges, Inject } from "@angular/core";
import { Router } from '@angular/router';
import { Subscription } from "rxjs";

import { StorageService, PermissionService, DataShareService, ApiService, ModelService, AuthService, NotificationService, EnvService, MenuOrModuleCommonService,StorageTokenStatus,Common, ApiCallService, AuthDataShareService, CookiesService } from '@core/web-core';
import { MatSidenav } from "@angular/material/sidenav";


@Component({
  selector: 'app-setting-menu',
  templateUrl: './setting-menu.component.html',
  styles: [
  ]
})
export class SettingMenuComponent implements OnInit, OnDestroy {

    @Input() rightsidenav : MatSidenav;

    isPageLoading:boolean = false;
    public profileMenuItemList: any = [];
    public userInfo: any;
    public userName: any;
    public userEmail: any;
    gitVersion: any;
    
    headerNotificationList:any=[];
    notificationlist = []

    gitVersionSubscription: Subscription;
    userNotificationSettingSubscription:Subscription;
    saveResponceSubscription:Subscription;
    // subscription: Subscription;
    // menuDataSubscription:Subscription;

    
    // @Input() public pageName;
    // @Input() moduleIndex: any;
    // active_menu: any = '';
    // active_menu_d: any = 'custom-template';
    // main_active_menu: any = '';

    // menuBoxHome: boolean = false;
    // menuBoxDashboard: boolean = false;
    // showUserAccount: boolean = false;
    // fullHeader: boolean = false;
    // loginUserIcon: boolean = false;
    // getmenu: boolean = true;
    // isShow: boolean = true;
    // showsearchmenu = false;
    // filterdata = '';
    


    
    // public userColorCode: any;
    
    // public userFirstLetter: any;
   // public custmizedUserName: any;
    // public menuData: any = [];
    // public ourSolutionDropDown: any;
    // public aboutUsDropDown: any;
    // currentPage: any;
    // logedin: boolean = false;
    
    

    // logoPath = ''
    // private myData: any;

    // activeclass = false;
    // AllModuleList: any = [];
    
    // public teamname: any;
    // teamNameMenu = '';
    // getTemplateByMenu:boolean=false;
    
    // module:boolean=true;
    

    
    

    // @HostListener('window:keyup.alt.r') onAnyKey() {
    //     this.activeclass = false;
    // }


    // @HostListener('window:keyup.alt.h') onCtrlH() {
    //     this.activeclass = true;
    // }


    @HostListener('window:keyup.alt.o') onCtrlO() {
        this.shortcutinfo();
    }

    @HostListener('window:keyup.alt.control.c') onCtrlChart() {
        this.chartModel();
    }

    // @HostListener('window:keyup.enter') onCtrlenter() {
    //     if (this.activeclass) {
    //         this.goToMOdule();
    //         this.activeclass = false;
    //     }
    // }





    constructor(
        private router: Router,
        private storageService: StorageService,
        // private permissionService: PermissionService,
        private dataShareService: DataShareService,
        private apiService: ApiService,
        private modelService: ModelService,
        private authService: AuthService,
        private notificationService: NotificationService,
        public envService: EnvService,
        private menuOrModuleCommounService:MenuOrModuleCommonService,
        private apiCallService:ApiCallService,
        private authDataService:AuthDataShareService,
        private cookiesService:CookiesService
    ) {

        // this.logoPath = this.storageService.getLogoPath() + "logo.png";
        // this.teamNameMenu = this.storageService.getTeamName();
        this.gitVersionSubscription = this.dataShareService.gitVirsion.subscribe(data => {
            if (data && data['git.build.version']) {
                this.gitVersion = data['git.build.version'];
            }
        });
        this.userNotificationSettingSubscription=this.dataShareService.userNotificationSetting.subscribe((res)=>{
            if(res){
                this.isPageLoading =false;
                if(this.rightsidenav?.opened){
                    this.rightsidenav.toggle();
                }
            }     
        })
        


        // this.AllModuleList = this.storageService.GetModules();
        // if(this.AllModuleList != undefined && Array.isArray(this.AllModuleList)){
        //   if(this.AllModuleList.length == 1){
        //     this.GoToSelectedModule(this.AllModuleList[0]);
        //   }      
        // };

        if (this.storageService.GetUserInfo()) {
            this.userInfo = this.storageService.GetUserInfo();
            this.userName = this.userInfo.name;
            this.userEmail = this.userInfo.email;
            //this.teamname = this.userInfo.list1
            // if (this.userName && this.userName != null) {
            //     this.userFirstLetter = this.userName.charAt(0).toUpperCase()
            // } else {
            //     if (this.userInfo.email && this.userInfo.email != null) {
            //         this.userFirstLetter = this.userInfo.email.toUpperCase()
            //     }
            // }
            // this.roleList = this.storageService.GetRoleList();
            // if(this.roleList && this.roleList.length > 0){
            //     this.activeRole = this.roleList[0];
            //     this.storageService.setActiveRole(this.activeRole);
            // }
        }

        // this.subscription = this.dataShareService.currentPage.subscribe(
        //     (data: any) => {
        //         this.setpage(data);
        //     },
        //     error => {
        //         console.log(error)
        //     },
        //     () => console.log(this.myData)
        // );
        // this.menuDataSubscription = this.dataShareService.menu.subscribe(menu => {
        //     this.setMenuData(menu);
        // })
        // this.dataShareService.chartModelShowHide.subscribe(data => {
        //     this.isShow = data;
        // });

        this.dataShareService.S3Url.subscribe(url=>{
            this.openPdf(url);
        })

        // this.ourSolutionDropDown = [
        //     { name: 'Food Products', value: 'food-product' },
        //     { name: 'Agriculture & Chemicals Products ', value: 'agriculture-chemicals' },
        //     { name: 'Drugs & Pharmaceuticals', value: 'drugs-pharmaceuticals' },
        //     { name: 'Biological', value: 'biological' },
        //     { name: 'Water', value: 'water' },
        //     { name: 'Textile', value: 'textile' },
        //     { name: 'Environment Monitoring', value: 'environment-monitoring' },
        //     { name: 'Cosmetics', value: 'cosmetics' },
        //     { name: 'Construction & Building Materials', value: 'construction-buldings' },
        //     { name: 'Toxicology & Pharmacology (Preclinical) Division ', value: 'toxicology-pharmacology-division' },
        //     { name: 'Ayurvedic & Herbal medicines', value: 'ayurvedic-herbal-medicine' },
        //     { name: 'Helmet', value: 'helmet' },
        //     { name: 'Food Packaging Regulations', value: 'food-packging' },
        //     { name: 'Pharma Packaging Testing Solutions', value: 'pharma-packging' },
        // ]

        // this.aboutUsDropDown = [
        //     { name: 'About us', value: 'about-us' },
        //     { name: 'Our History', value: 'our-history' },
        //     { name: 'Our Capabilities', value: 'our-capabilities' },
        //     { name: 'Our Vision, Mission & Core Value', value: 'our-vision-mission-core-value' },
        //     { name: 'Our Clients & Testimonials', value: 'our-clients-testimonials' },
        //     { name: 'Our Quality Policy', value: 'our-quality-policy' },
        //     { name: 'Our Environment, Health & Safety Policy', value: 'environment-health-policy' },
        //     { name: 'Our Locations', value: 'our-locations' },
        // ]

        this.profileMenuItemList = this.storageService.getApplicationValueByKey("profileMenuItemList");
    }



    shortcutinfo() {
        this.modelService.open('shortcutinfo_model', {})
    }
    chartModel() {
        this.modelService.open('chart_model', {})
    }
    saveCallSubscribe(){
        this.saveResponceSubscription = this.dataShareService.saveResponceData.subscribe(responce => {
          this.setSaveResponce(responce);
        })
      }
      unsubscribe(variable){
        if(variable){
          variable.unsubscribe();
        }
      }
    

    ngOnDestroy() {
        this.unsubscribe(this.userNotificationSettingSubscription);
    }
    setSaveResponce(saveFromDataRsponce){
        if (saveFromDataRsponce) {
            if (saveFromDataRsponce.success && saveFromDataRsponce.success != '') {
                if (saveFromDataRsponce.success == 'success') {
                    this.apiCallService.getUserNotification(1);
                }
            }
        }
        this.unsubscribe(this.saveResponceSubscription);

    }
    // ngAfterViewInit(): void {
    //     //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //     //Add 'implements AfterViewInit' to the class.

    // }
    // setpage(res) {
    //     switch (res) {
    //         case "HOME":
    //             this.fullHeader = true;
    //             this.menuBoxHome = true;
    //             this.menuBoxDashboard = false;
    //             this.loginUserIcon = false;
    //             this.showUserAccount = false;
    //             break;
    //         case "EXAMTEST":
    //             this.fullHeader = true;
    //             this.menuBoxHome = false;
    //             this.menuBoxDashboard = false;
    //             this.loginUserIcon = true;
    //             this.showUserAccount = false;
    //             break;
    //         case "DASHBOARD":
    //             if (this.getmenu) {
    //                 this.getmenu = false;

    //             }
    //             this.fullHeader = true;
    //             this.menuBoxHome = false;
    //             this.menuBoxDashboard = true;
    //             this.loginUserIcon = true;
    //             this.showUserAccount = true;
    //             break;
    //         case "MODULE":
    //             this.fullHeader = true;
    //             this.menuBoxHome = false;
    //             this.menuBoxDashboard = false;
    //             this.loginUserIcon = true;
    //             this.showUserAccount = true;
    //             break;
    //         case "HOME2":
    //             this.fullHeader = true;
    //             this.menuBoxHome = true;
    //             this.menuBoxDashboard = false;
    //             this.loginUserIcon = false;
    //             this.showUserAccount = false;
    //             break;
    //         default:
    //             this.fullHeader = true;
    //             this.menuBoxHome = false;
    //             this.menuBoxDashboard = false;
    //             this.loginUserIcon = false;
    //             break;

    //     }
    //     if (this.storageService != null && this.storageService.GetIdToken() != null) {
    //         const idToken = this.storageService.GetIdToken();
    //         if (this.storageService.GetIdTokenStatus() == StorageTokenStatus.ID_TOKEN_ACTIVE) {
    //             this.logedin = true;
    //         } else {
    //             this.logedin = false;
    //             const payload = {
    //                 appName: this.envService.getAppName(),
    //                 data: {
    //                     accessToken: this.storageService.GetAccessToken()
    //                 }
    //             }
    //             this.authService.SessionExpired(payload);

    //         }

    //     } else {
    //         this.logedin = false;
    //     }
    // }

    ngOnInit() {
    }

    // ngOnChanges(changes: SimpleChanges) {
    //     this.getMenuByModule();
    //     this.apiCallService.getUserNotification(1);
    // }

    // getMenuByModule() {
    //     this.AllModuleList = this.storageService.GetModules();
    //     if (this.moduleIndex && this.moduleIndex != -1) {
    //         const module = this.AllModuleList[this.moduleIndex]
    //         if (module && module.menu_list) {
    //             this.menuData = module.menu_list;
    //             const menu = this.menuData[0];
    //             if (menu && menu.submenu) {
    //                 this.getTemplateData(module, menu.submenu[0]);
    //             } else {
    //                 this.getTemplateData(module,menu)
    //             }
    //         } else {
    //             this.menuData = [];
    //         }
    //     } else {
    //         this.menuData = [];
    //     }
    // }

    // setMenuData(menuData) {
    //     if (menuData && menuData.length > 0) {
    //         this.menuData = menuData;
    //         if(this.getTemplateByMenu){
    //             let defaultmenuIndex = 0;
    //             for (let index = 0; index <  this.menuData.length; index++) {
    //               if(this.menuData[index].defaultMenu){
    //                 defaultmenuIndex = index;
    //                 break;
    //               }            
    //             }
    //             let defaultSubmenuIndex = -1;
    //             const defaultMenu =this.menuData[defaultmenuIndex];
    //             if(defaultMenu.submenu && defaultMenu.submenu.length > 0){
    //               for (let index = 0; index < defaultMenu.submenu.length; index++) {
    //                 if(defaultMenu.submenu[index].defaultMenu){
    //                   defaultSubmenuIndex = index;
    //                   break;
    //                 }              
    //               }
    //               if(defaultSubmenuIndex == -1){
    //                 defaultSubmenuIndex = 0;
    //               }
    //             }
    //             if(defaultSubmenuIndex > -1){
    //               this.storageService.SetActiveMenu(this.menuData[defaultmenuIndex].submenu[defaultSubmenuIndex]);              
    //               this.apiService.resetTempData();
    //               this.apiService.resetGridData();            
    //               this.router.navigate(['template']);
    //             }else{
    //               const menu = this.menuData[defaultmenuIndex];
    //               if(menu.name == "document_library"){
    //                 this.router.navigate(['vdr']);
    //               }else if(menu.name == "report"){
    //                 this.router.navigate(['report']);
    //               }
    //               else{
    //                 this.storageService.SetActiveMenu(this.menuData[defaultmenuIndex]);              
    //                 this.apiService.resetTempData();
    //                 this.apiService.resetGridData();
    //                 this.router.navigate(['template']);
    //               }
    //             }          
    //           }
    //         this.getTemplateByMenu = false;
    //     }
    // }
    setUserNotification(data){
        this.notificationlist = data;
        this.headerNotificationList = [];
        if(this.notificationlist && this.notificationlist.length > 0){
            for (let index = 0; index < this.notificationlist.length; index++) {
                const element = this.notificationlist[index];
                if(index == 10){
                    break;
                }
                this.headerNotificationList.push(element);                
            }
        }

    }
    getUnreadNotificationLength(){
        let length = 0;
        if(this.notificationlist && this.notificationlist.length > 0){
            this.notificationlist.forEach(element => {
                if(element.notificationStatus == 'UNREAD'){
                    length = length + 1;
                }
            });
        }
        return length;
    }

    readNotification(index){
        let notification = JSON.parse(JSON.stringify(this.notificationlist[index]));
        let url = notification.url;
        let rout = "notification/"+url;
        let list = rout.split("/");
        let moduleId = list[1];
        let menuId = list[2];
        let submenuId = list[3];
        let moduleIndex = this.menuOrModuleCommounService.getModuleIndexById(moduleId);
        //this.dataShareService.setModuleIndex(moduleIndex);
        if(moduleIndex != undefined){
            let moduleList = this.storageService.GetModules();
            let module = moduleList[moduleIndex];
            let menuName = this.menuOrModuleCommounService.getMenuNameById(module,menuId,submenuId);
            let menu = {
                "name" : menuName.name
            }
            if(menuName.subMenuIndex){
                menu['child'] = true;
                menu['menuIndex'] = menuName.subMenuIndex;
            }else{
                menu['child'] = false;
                menu['menuIndex'] = menuName.menuIndex;
            }
            this.storageService.SetActiveMenu(menu);
            this.menuOrModuleCommounService.setModuleName(module.name);
            this.dataShareService.sendCurrentPage('DASHBOARD')             
            if(moduleIndex != -1){
                this.dataShareService.setModuleIndex(moduleIndex);    
            } 
            this.router.navigate([rout]); 
        }
        if(notification.notificationStatus == 'UNREAD'){
            notification['notificationStatus'] = 'READ';
            const payload = {
                'curTemp' : 'user_notification',
                'data' : notification
            }
            this.apiService.SaveFormData(payload);
            this.saveCallSubscribe();
        }
        
    }

    // onLogout() {
    //     this.logOut();
    // }
    // activeLink(activelink) {
    //     this.active_menu = activelink;
    // }
    // mainActiveMenu(activelink) {
    //     this.main_active_menu = activelink;
    // }
    // activeLinkD(link, check) {
    //     this.active_menu_d = link;
    //     if (check) {
    //         this.dataShareService.sendCurrentPage('DASHBOARD');
    //         this.router.navigate([link])
    //     }

    // }
    // getTemplateData(module,submenu) {
    //     if(this.permissionService.checkPermission(submenu.name,'view')){
    //         this.storageService.SetActiveMenu(submenu);
    //         if (submenu.label == "Navigation") {
    //             this.router.navigate(['Navigation']);
    //         }
    //         else if (submenu.label == "Permissions") {
    //             this.router.navigate(['permissions']);
    //         }
    //         else {
    //           const menu = submenu;
    //           if(menu.name == "document_library"){
    //             this.router.navigate(['vdr']);
    //           }else if(menu.name == "report"){
    //             this.router.navigate(['report']);
    //           }
    //           else{
    //             this.apiService.resetTempData();
    //             this.apiService.resetGridData();
    //             this.GoToSelectedModule(module);
    //             this.router.navigate(['template']);  
    //           }           
    //         }
    //     }else{
    //         this.notificationService.notify("bg-danger", "Permission denied !!!");
    //     }
    // }




    // getTemplateMenuData(submenu) {
    //     if(this.permissionService.checkPermission(submenu.name,'view')){
    //         this.storageService.SetActiveMenu(submenu);
    //         if (submenu.label == "Navigation") {
    //             this.router.navigate(['Navigation']);
    //         }
    //         else if (submenu.label == "Permissions") {
    //             this.router.navigate(['permissions']);
    //         }
    //         else {
    //           const menu = submenu;
    //           if(menu.name == "document_library"){
    //             this.router.navigate(['vdr']);
    //           }else if(menu.name == "report"){
    //             this.router.navigate(['report']);
    //           }
    //           else{
    //             this.apiService.resetTempData();
    //             this.apiService.resetGridData();
    //             this.router.navigate(['template']);  
    //           }           
    //         }
    //     }else{
    //         this.notificationService.notify("bg-danger", "Permission denied !!!");
    //     }
    // }







    // goToEditeProfile(link) {
    //     this.dataShareService.sendCurrentPage('DASHBOARD');
    //     this.router.navigate([link])
    // }
    // goToChangePassword(){
    //     this.router.navigate(['createpwd']);
    // }
    // navigateSigninPage() {
    //     let loginType: any = Common.AUTH_TYPE;
    //     if (loginType == 'ADMIN') {
    //         this.router.navigate(['admin'])
    //     } else {
    //         this.router.navigate(['signin'])
    //     }

    // }
    // getUserColorCode(n) {
    //     switch (n) {
    //         case "A":
    //             this.userColorCode = "#ff4444";
    //             break;
    //         case "B":
    //             this.userColorCode = "#ffbb33";
    //             break;
    //         case "C":
    //             this.userColorCode = "#00C851";
    //             break;
    //         case "D":
    //             this.userColorCode = "#33b5e5";
    //             break;
    //         case "E":
    //             this.userColorCode = "#2BBBAD";
    //             break;
    //         case "F":
    //             this.userColorCode = "#4285F4";
    //             break;
    //         case "G":
    //             this.userColorCode = "#aa66cc";
    //             break;
    //         case "H":
    //             this.userColorCode = "#ef5350";
    //             break;
    //         case "I":
    //             this.userColorCode = "#ec407a";
    //             break;
    //         case "J":
    //             this.userColorCode = "#ab47bc";
    //             break;
    //         case "K":
    //             this.userColorCode = "#7e57c2";
    //             break;
    //         case "L":
    //             this.userColorCode = "#5c6bc0";
    //             break;
    //         case "M":
    //             this.userColorCode = "#42a5f5";
    //             break;
    //         case "N":
    //             this.userColorCode = "#29b6f6";
    //             break;
    //         case "O":
    //             this.userColorCode = "#26c6da";
    //             break;
    //         case "P":
    //             this.userColorCode = "#26a69a";
    //             break;
    //         case "Q":
    //             this.userColorCode = "#00b0ff";
    //             break;
    //         case "R":
    //             this.userColorCode = "#43a047";
    //             break;
    //         case "S":
    //             this.userColorCode = "#7cb342";
    //             break;
    //         case "T":
    //             this.userColorCode = "#c0ca33";
    //             break;
    //         case "U":
    //             this.userColorCode = "#00c853";
    //             break;
    //         case "V":
    //             this.userColorCode = "#64dd17";
    //             break;
    //         case "W":
    //             this.userColorCode = "#fb8c00";
    //             break;
    //         case "X":
    //             this.userColorCode = "#ffab00";
    //             break;
    //         case "Y":
    //             this.userColorCode = "#f4511e";
    //             break;
    //         default:
    //             this.userColorCode = "#dd2c00";
    //             break;
    //     }
    // }
    logOut() {
        const payload = {
            appName: this.envService.getAppName(),
            data: {
                accessToken: this.storageService.GetAccessToken()
            }
        }
        this.authService.Logout(payload);
    }

    // changeOurSolution(menu) {
    //     this.dataShareService.sendCurrentPage('HOME2')
    //     this.router.navigate([menu]);
    // }

    // changeAboutUs(menu) {
    //     this.dataShareService.sendCurrentPage('HOME2')
    //     this.router.navigate([menu]);
    // }
    // goToMOdule() {
    //     this.dataShareService.sendCurrentPage('MODULE')
    //     //this.menuData = [];
    //     this.apiService.resetMenuData();
    //     const menuType = this.storageService.GetMenuType()
    //     if (menuType == 'Horizontal') {
    //         this.router.navigate(['/home']);
    //     } else {
    //         this.router.navigate(['/dashboard']);
    //     }
    // }
    // goToVdr() {
    //     this.router.navigate(['/vdr']);
    // }

    // @HostListener('window:scroll', ['$event'])

    // onWindowScroll(e) {
    //     let element = document.querySelector('.navbar');
    //     if (element && element.clientHeight) {
    //         if (window.pageYOffset > element.clientHeight) {
    //             element.classList.add('navbar-inverse', 'shadow');
    //         } else {
    //             element.classList.remove('navbar-inverse', 'shadow');
    //         }

    //     }

    // }

    // selectClass() {
    //     if (this.currentPage == 'HOME') {
    //         return 'home fixed-top';
    //     }
    //     else if (this.currentPage == 'HOME2') {
    //         let element = document.querySelector('.navbar');
    //         element.classList.add('navbar-inverse', 'shadow');
    //         return 'fixed-top'
    //     }
    //     else {
    //         return ''
    //     }
    // }

    // gotoStaticMenu(menu) {
    //     if (menu == 'home_page') {
    //         this.dataShareService.sendCurrentPage('HOME')
    //         let element = document.querySelector('.navbar');
    //         element.classList.remove('navbar-inverse', 'shadow');
    //     }
    //     else {
    //         this.dataShareService.sendCurrentPage('HOME2')
    //     }

    //     this.router.navigate([menu])
    // }

    // onBarIconSelection() {
    //     let ele = document.querySelector("links");
    //     ele.classList.toggle('d-block')
    // }
    // getCurrentMenu() {
    //     const currentMenu = this.storageService.GetActiveMenu();
    //     if (currentMenu && currentMenu.name && currentMenu.name != null) {
    //         return currentMenu.name;
    //     } else {
    //         return;
    //     }
    // }
    // navigateDashboard() {
    //     this.fullHeader = false;
    //     this.menuBoxHome = false;
    //     this.menuBoxDashboard = false;
    //     this.loginUserIcon = false;
    //     this.showUserAccount = false;
    //     const menuType = this.storageService.GetMenuType()
    //     if (menuType == 'Horizontal') {
    //         this.router.navigate(['/home']);
    //     } else {
    //         this.router.navigate(['/dashboard']);
    //     }
    //     if (this.storageService.GetIdTokenStatus() == StorageTokenStatus.ID_TOKEN_ACTIVE) {
    //         const idToken = this.storageService.GetIdToken();
    //         this.authService.GetUserInfoFromToken(idToken);
    //     } else {
    //         const payload = {
    //             appName: this.envService.getAppName(),
    //             data: {
    //                 accessToken: this.storageService.GetAccessToken()
    //             }
    //         }
    //         this.authService.SessionExpired(payload);
    //     }
    // }
    gitInfo() {
        this.modelService.open('git_version', {})
    }
    feedback() {
        this.modelService.open('feedback_model', {})
     }
    // GoToSelectedModule(item){
    //     this.storageService.setModule(item.name); 
    //     this.dataShareService.sendCurrentPage('DASHBOARD')
    //     const menuSearchModule = { "value": "menu", key2: item.name }
    //     const criteria = "appId;eq;"+item.name+";STATIC";
    //     const payload = this.apiCallService.getPaylodWithCriteria('menu','',[criteria],{});
    //     this.apiService.GetTempMenu(payload)
    //     this.getTemplateByMenu = true;
    //     this.showsearchmenu = false;
    //     this.filterdata = '';
    // }
    // searchmodel() {
    //     if(this.filterdata != ''){
    //         this.showsearchmenu = true;
    //     }else {
    //         this.showsearchmenu = false;
    //     }
    // }

    toggle = false;
    notifymenu() {
        this.toggle = !this.toggle;
    }

    downloadpdf(){
        let keys: any= this.storageService.getApplicationValueByKey('keys');
        let key='';
        let bucket= '';
        if  (keys.user_manual) key= keys.user_manual; 
        if  (keys.bucket) bucket= keys.bucket; 
        if  (key != '' && bucket != ''){
            let payLoad={
                bucketName: bucket,
                key:key
            }
            this.apiService.getDownloadManual(payLoad);
        }
        else{
            this.notificationService.notify("bg-danger", " BucketName Or Key Not Exists !!!");
        } 
    }

    openPdf(url){
        this.modelService.open('pdf_model', {url});
    }

    profileMenu(menu) {
        if (menu && menu.value && menu.value != ''){
            const value = menu.value;
            this.router.navigate([value]);
        }
    }
    updateUserData(){
        this.isPageLoading = true;
        // this.apiService.resetGridData();
        let userToken = this.storageService.GetIdToken();
        let list = ["TEMPLATE_INDEX","ALL_TEMPLATE","USER"];
        list.forEach((key:string)=>{
            this.storageService.removeKeyFromStorage(key);
        })
        this.authService.GetUserInfoFromToken(userToken);
        this.subscribeGetUserInfo();
    }

    subscribeGetUserInfo(){
        this.authDataService.userInfo.subscribe(data =>{
        this.isPageLoading = false;
        this.notificationService.notify("bg-success", "User Data successfully updated !!!");
        this.rightsidenav.toggle();
        location.reload();
        })
    }

    notificationSetting(){
        this.isPageLoading = true;
        this.apiCallService.getUserNotificationSetting();
        this.router.navigate(["notification-setting"]);     
    }

    gotoNotificationPage(){
        if(this.rightsidenav?.opened){
            this.rightsidenav.toggle();
        }
        this.router.navigate(["browse/NOTIFY/notification_settings/user_notification_master"]);  
    }
    refreshEndpoint(){
        this.cookiesService.deleteCookieByName(this.envService.getHostName('hostname'))
        this.dataShareService.getServerEndPoint(true);
    }

}
