import { Component, OnInit, Input, OnDestroy, HostListener, AfterViewInit, OnChanges, SimpleChanges } from "@angular/core";
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage/storage.service';
import { PermissionService } from '../../services/permission/permission.service';
import { DataShareService } from '../../services/data-share/data-share.service';
import { ApiService } from '../../services/api/api.service';
import { ModelService } from "src/app/services/model/model.service";
import { AuthService } from "src/app/services/api/auth/auth.service";
import { StorageTokenStatus } from "src/app/shared/enums/storage-token-status.enum";
import { NotificationService } from "src/app/services/notify/notification.service";
import { EnvService } from "src/app/services/env/env.service";
import { Common } from "src/app/shared/enums/common.enum";


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
    @Input() public pageName;
    @Input() moduleIndex: any;

    subscription: any;
    menuDataSubscription;

    active_menu: any = '';
    active_menu_d: any = 'custom-template';
    main_active_menu: any = '';

    menuBoxHome: boolean = false;
    menuBoxDashboard: boolean = false;
    showUserAccount: boolean = false;
    fullHeader: boolean = false;
    loginUserIcon: boolean = false;
    getmenu: boolean = true;
    isShow: boolean = true;


    public userInfo: any;
    public userColorCode: any;
    public userName: any;
    public userEmail: any;
    public userFirstLetter: any;
    public custmizedUserName: any;
    public menuData: any = [];
    public ourSolutionDropDown: any;
    public aboutUsDropDown: any;
    currentPage: any;
    logedin: boolean = false;
    gitVersionSubscription: any;
    gitVersion: any;

    logoPath = ''
    private myData: any;

    activeclass = false;
    AllModuleList: any = [];

    @HostListener('window:keyup.alt.r') onAnyKey() {
        this.activeclass = false;
    }


    @HostListener('window:keyup.alt.h') onCtrlH() {
        this.activeclass = true;
    }


    @HostListener('window:keyup.alt.o') onCtrlO() {
        this.shortcutinfo();
    }

    @HostListener('window:keyup.alt.control.c') onCtrlChart() {
        this.chartModel();
    }

    @HostListener('window:keyup.enter') onCtrlenter() {
        if (this.activeclass) {
            this.goToMOdule();
            this.activeclass = false;
        }
    }





    constructor(
        private router: Router,
        private storageService: StorageService,
        private permissionService: PermissionService,
        private dataShareService: DataShareService,
        private apiService: ApiService,
        private modelService: ModelService,
        private authService: AuthService,
        private notificationService: NotificationService,
        public envService: EnvService
    ) {

        this.logoPath = this.storageService.getLogoPath() + "logo.png";
        this.gitVersionSubscription = this.dataShareService.gitVirsion.subscribe(data => {
            if (data && data['git.build.version']) {
                this.gitVersion = data['git.build.version'];
            }
        })

        this.subscription = this.dataShareService.currentPage.subscribe(
            (data: any) => {
                this.setpage(data);
            },
            error => {
                console.log(error)
            },
            () => console.log(this.myData)
        );
        this.menuDataSubscription = this.dataShareService.menu.subscribe(menu => {
            this.setMenuData(menu);
        })
        this.dataShareService.chartModelShowHide.subscribe(data => {
            this.isShow = data;
        });

        this.ourSolutionDropDown = [
            { name: 'Food Products', value: 'food-product' },
            { name: 'Agriculture & Chemicals Products ', value: 'agriculture-chemicals' },
            { name: 'Drugs & Pharmaceuticals', value: 'drugs-pharmaceuticals' },
            { name: 'Biological', value: 'biological' },
            { name: 'Water', value: 'water' },
            { name: 'Textile', value: 'textile' },
            { name: 'Environment Monitoring', value: 'environment-monitoring' },
            { name: 'Cosmetics', value: 'cosmetics' },
            { name: 'Construction & Building Materials', value: 'construction-buldings' },
            { name: 'Toxicology & Pharmacology (Preclinical) Division ', value: 'toxicology-pharmacology-division' },
            { name: 'Ayurvedic & Herbal medicines', value: 'ayurvedic-herbal-medicine' },
            { name: 'Helmet', value: 'helmet' },
            { name: 'Food Packaging Regulations', value: 'food-packging' },
            { name: 'Pharma Packaging Testing Solutions', value: 'pharma-packging' },
        ]

        this.aboutUsDropDown = [
            { name: 'About us', value: 'about-us' },
            { name: 'Our History', value: 'our-history' },
            { name: 'Our Capabilities', value: 'our-capabilities' },
            { name: 'Our Vision, Mission & Core Value', value: 'our-vision-mission-core-value' },
            { name: 'Our Clients & Testimonials', value: 'our-clients-testimonials' },
            { name: 'Our Quality Policy', value: 'our-quality-policy' },
            { name: 'Our Environment, Health & Safety Policy', value: 'environment-health-policy' },
            { name: 'Our Locations', value: 'our-locations' },
        ]

    }



    shortcutinfo() {
        this.modelService.open('shortcutinfo_model', {})
    }
    chartModel() {
        this.modelService.open('chart_model', {})
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        if (this.menuDataSubscription) {
            this.menuDataSubscription.unsubscribe();
        }
    }
    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.

    }
    setpage(res) {
        switch (res) {
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
            default:
                this.fullHeader = true;
                this.menuBoxHome = false;
                this.menuBoxDashboard = false;
                this.loginUserIcon = false;
                break;

        }
        if (this.loginUserIcon) {
            if (this.storageService.GetUserInfo()) {
                this.userInfo = this.storageService.GetUserInfo();
                this.userName = this.userInfo.name;
                this.userEmail = this.userInfo.email;
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
            if (this.storageService.GetIdTokenStatus() == StorageTokenStatus.ID_TOKEN_ACTIVE) {
                this.logedin = true;
            } else {
                this.logedin = false;
                const payload = {
                    appName: this.envService.getAppName(),
                    data: {
                        accessToken: this.storageService.GetAccessToken()
                    }
                }
                this.authService.SessionExpired(payload);

            }

        } else {
            this.logedin = false;
        }
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        this.getMenuByModule()
    }

    getMenuByModule() {
        this.AllModuleList = this.storageService.GetModules();
        if (this.moduleIndex != -1) {
            const module = this.AllModuleList[this.moduleIndex]
            if (module.menu_list != undefined && module.menu_list != null) {
                this.menuData = module.menu_list;
                const menu = this.menuData[0];
                if (menu && menu.submenu) {
                    this.getTemplateData(menu.submenu[0]);
                } else {
                    this.getTemplateData(menu)
                }
            } else {
                this.menuData = [];
            }
        } else {
            this.menuData = [];
        }
    }

    setMenuData(menuData) {
        if (menuData && menuData.length > 0) {
            this.menuData = menuData;
        }
    }


    onLogout() {
        this.logOut();
    }
    activeLink(activelink) {
        this.active_menu = activelink;
    }
    mainActiveMenu(activelink) {
        this.main_active_menu = activelink;
    }
    activeLinkD(link, check) {
        this.active_menu_d = link;
        if (check) {
            this.dataShareService.sendCurrentPage('DASHBOARD');
            this.router.navigate([link])
        }

    }
    getTemplateData(submenu) {
        if (this.permissionService.checkPermission(submenu.name, 'view')) {
            this.storageService.SetActiveMenu(submenu);
            if (submenu.label == "Navigation") {
                this.router.navigate(['Navigation']);
            } else if (submenu.label == "Compare") {
                this.router.navigate(['diff_html']);
            }
            else if (submenu.label == "Permissions") {
                this.router.navigate(['permissions']);
            }
            else if (submenu.name == "document_library") {
                this.router.navigate(['vdr']);
            }
            else if (submenu.name == "report") {
                this.router.navigate(['report']);
            }
            else {
                this.apiService.resetTempData();
                this.apiService.resetGridData();
                this.router.navigate(['template']);
            }
        } else {
            this.notificationService.notify("bg-danger", "Permission denied !!!");
        }
    }


    goToEditeProfile(link) {
        this.dataShareService.sendCurrentPage('DASHBOARD');
        this.router.navigate([link])
    }
    goToChangePassword()                              //Added by Gaurav Tyagi
    {
        // this.dataShareService.sendCurrentPage('createpwd');
        // this.router.navigate([link])
        this.router.navigate(['createpwd']);
    }
    navigateSigninPage() {
        // this.logoPath = '../../assets/images/logo.png';
        let loginType: any = Common.AUTH_TYPE;
        if (loginType == 'ADMIN') {
            this.router.navigate(['admin'])
        } else {
            this.router.navigate(['signin'])
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
    logOut() {
        const payload = {
            appName: this.envService.getAppName(),
            data: {
                accessToken: this.storageService.GetAccessToken()
            }
        }
        this.authService.Logout(payload);
    }

    changeOurSolution(menu) {
        this.dataShareService.sendCurrentPage('HOME2')
        this.router.navigate([menu]);
    }

    changeAboutUs(menu) {
        this.dataShareService.sendCurrentPage('HOME2')
        this.router.navigate([menu]);
    }
    goToMOdule() {
        this.dataShareService.sendCurrentPage('MODULE')
        this.menuData = [];
        this.apiService.resetMenuData();
        this.router.navigate(['/home']);
    }
    goToVdr() {
        this.router.navigate(['/vdr']);
    }

    @HostListener('window:scroll', ['$event'])

    onWindowScroll(e) {
        let element = document.querySelector('.navbar');
        if (element && element.clientHeight) {
            if (window.pageYOffset > element.clientHeight) {
                // this.logoPath = '../../assets/img/2.png';
                element.classList.add('navbar-inverse', 'shadow');
            } else {
                // this.logoPath = '../../assets/images/logo.png';
                element.classList.remove('navbar-inverse', 'shadow');
            }

        }

    }

    selectClass() {
        if (this.currentPage == 'HOME') {
            return 'home fixed-top';
        }
        else if (this.currentPage == 'HOME2') {
            let element = document.querySelector('.navbar');
            element.classList.add('navbar-inverse', 'shadow');
            //  this.logoPath = '../../assets/img/2.png';
            return 'fixed-top'
        }
        else {
            return ''
        }
    }

    gotoStaticMenu(menu) {
        if (menu == 'home_page') {
            this.dataShareService.sendCurrentPage('HOME')
            //  this.logoPath = '../../assets/images/logo.png';
            let element = document.querySelector('.navbar');
            element.classList.remove('navbar-inverse', 'shadow');
        }
        else {
            this.dataShareService.sendCurrentPage('HOME2')
        }

        this.router.navigate([menu])
    }

    onBarIconSelection() {
        let ele = document.querySelector("links");
        ele.classList.toggle('d-block')
    }
    getCurrentMenu() {
        const currentMenu = this.storageService.GetActiveMenu();
        if (currentMenu && currentMenu.name && currentMenu.name != null) {
            return currentMenu.name;
        } else {
            return;
        }
    }
    navigateDashboard() {
        this.fullHeader = false;
        this.menuBoxHome = false;
        this.menuBoxDashboard = false;
        this.loginUserIcon = false;
        this.showUserAccount = false;
        const menuType = this.storageService.GetMenuType()
        if (menuType == 'Horizontal') {
            this.router.navigate(['/home']);
        } else {
            this.router.navigate(['/dashboard']);
        }
        if (this.storageService.GetIdTokenStatus() == StorageTokenStatus.ID_TOKEN_ACTIVE) {
            const idToken = this.storageService.GetIdToken();
            this.authService.GetUserInfoFromToken(idToken);
        } else {
            const payload = {
                appName: this.envService.getAppName(),
                data: {
                    accessToken: this.storageService.GetAccessToken()
                }
            }
            this.authService.SessionExpired(payload);
        }
    }
    gitInfo() {
        this.modelService.open('git_version', {})
    }
}