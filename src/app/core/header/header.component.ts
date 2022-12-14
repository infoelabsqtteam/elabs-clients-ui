import { Component, OnInit, OnDestroy, HostListener, AfterViewInit, OnChanges, SimpleChanges } from "@angular/core";
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
import { CommonFunctionService } from "src/app/services/common-utils/common-function.service";
import { Subscription } from "rxjs";
import { MenuOrModuleCommonService } from "src/app/services/menu-or-module-common/menu-or-module-common.service";
import { FormControl } from "@angular/forms";


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {    
    
    selected = new FormControl(0);
    subscription: any;    
    active_menu_d: any = 'custom-template';
    moduleIndex:any=-1;

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
    public menuData: any = [];
    currentPage: any;
    logedin: boolean = false;
    gitVersionSubscription: any;
    moduleIndexSubscription:Subscription;
    gitVersion: any;

    logoPath = ''
    private myData: any;

    activeclass = false;
    AllModuleList: any = [];
    filterdata = '';
    public teamname: any;
    teamNameMenu = '';
    showsearchmenu = false;

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
        public envService: EnvService,
        private commonfunctionService:CommonFunctionService,
        private menuOrModuleCommounService:MenuOrModuleCommonService
    ) {

        this.logoPath = this.storageService.getLogoPath() + "logo.png";
        this.teamNameMenu = this.storageService.getTeamName();
        this.gitVersionSubscription = this.dataShareService.gitVirsion.subscribe(data => {
            if (data && data['git.build.version']) {
                this.gitVersion = data['git.build.version'];
            }
        });
        this.moduleIndexSubscription = this.dataShareService.moduleIndex.subscribe(index =>{
            if(index != -1){
                this.getMenuByModuleIndex(index);
                this.moduleIndex = index;
            }else{
                this.moduleIndex = -1;
            }
        })
        


        this.AllModuleList = this.storageService.GetModules();
        if(this.AllModuleList != undefined && Array.isArray(this.AllModuleList)){
          const menuType =  this.storageService.GetMenuType();
          if(this.AllModuleList.length == 1 && menuType == 'Horizontal'){
            this.GoToSelectedModule(this.AllModuleList[0]);
          }      
        };

        if (this.storageService.GetUserInfo()) {
            this.userInfo = this.storageService.GetUserInfo();
            this.userName = this.userInfo.name;
            this.userEmail = this.userInfo.email;
            this.teamname = this.userInfo.list1
            if (this.userName && this.userName != null) {
                this.userFirstLetter = this.userName.charAt(0).toUpperCase()
            } else {
                if (this.userInfo.email && this.userInfo.email != null) {
                    this.userFirstLetter = this.userInfo.email.toUpperCase()
                }
            }
        }

        this.subscription = this.dataShareService.currentPage.subscribe(
            (data: any) => {
                this.setpage(data);
            },
            error => {
                console.log(error)
            },
            () => console.log(this.myData)
        );        
        this.dataShareService.chartModelShowHide.subscribe(data => {
            this.isShow = data;
        });
    }



    shortcutinfo() {
        this.modelService.open('shortcutinfo_model', {})
    }
    chartModel() {
        this.modelService.open('chart_model', {})
    }
    
    unsubscribe(variable){
        if(variable){
            variable.unsubscribe();
        }
    }   

    ngOnDestroy() {
        this.subscription.unsubscribe();
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
        this.commonfunctionService.getUserNotification(1);
    }    
    getMenuByModuleIndex(moduleIndex:any){
        if (moduleIndex != -1) {
            const module = this.AllModuleList[moduleIndex]
            if (module.menu_list != undefined && module.menu_list != null) {
                let menuList = module.menu_list;
                this.menuData = this.menuOrModuleCommounService.setDisplayInMenuWithPermission(menuList);
                let menu = this.menuOrModuleCommounService.getDefaultMenu(this.menuData);
                this.getTemplateData(module,menu)
            } else {
                this.menuData = [];
            }
        } else {
            this.menuData = [];
        }
    }     
    
    activeLinkD(link, check) {
        this.active_menu_d = link;
        if (check) {
            this.dataShareService.sendCurrentPage('DASHBOARD');
            this.router.navigate([link])
        }

    }
    getTemplateData(module,submenu) {
        if(this.permissionService.checkPermission(submenu.name,'view')){
            this.storageService.SetActiveMenu(submenu);
            if (submenu.label == "Navigation") {
                this.router.navigate(['Navigation']);
            }
            else if (submenu.label == "Permissions") {
                this.router.navigate(['permissions']);
            }
            else {
              const menu = submenu;
              if(menu.name == "document_library"){
                this.router.navigate(['vdr']);
              }else if(menu.name == "report"){
                this.router.navigate(['report']);
              }
              else{
                this.apiService.resetTempData();
                this.apiService.resetGridData();
                this.GoToSelectedModule(module);
                this.router.navigate(['template']);  
              }           
            }
        }else{
            this.notificationService.notify("bg-danger", "Permission denied !!!");
        }
    }
    getTemplateMenuData(submenu) {
        let module = {};
        this.getTemplateData(module,submenu);
    }
        
    goToMOdule() {
        this.dataShareService.sendCurrentPage('MODULE');
        this.menuData = []; 
        this.dataShareService.setModuleIndex(-1);       
        const menuType = this.storageService.GetMenuType()
        if (menuType == 'Horizontal') {
            this.router.navigate(['/home']);
        } else {
            this.router.navigate(['/dashboard']);
        }
    }
    

    @HostListener('window:scroll', ['$event'])

    onWindowScroll(e) {
        let element = document.querySelector('.navbar');
        if (element && element.clientHeight) {
            if (window.pageYOffset > element.clientHeight) {
                element.classList.add('navbar-inverse', 'shadow');
            } else {
                element.classList.remove('navbar-inverse', 'shadow');
            }

        }

    }
  
    getCurrentMenu() {
        const currentMenu = this.storageService.GetActiveMenu();
        if (currentMenu && currentMenu.name && currentMenu.name != null) {
            return currentMenu.name;
        } else {
            return;
        }
    }  
    
    GoToSelectedModule(item){        
        if(item && item.name){
            this.selected = new FormControl(1);
            this.menuOrModuleCommounService.setModuleName(item.name);
        }
        this.dataShareService.sendCurrentPage('DASHBOARD');
        this.showsearchmenu = false;
        this.filterdata = '';
    }
    searchmodel() {
        if(this.filterdata != ''){
            this.showsearchmenu = true;
        }else {
            this.showsearchmenu = false;
        }
    }
      
}