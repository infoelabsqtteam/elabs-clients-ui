import { Component, OnInit, OnDestroy, HostListener, AfterViewInit, OnChanges, SimpleChanges } from "@angular/core";
import { Router } from '@angular/router';
import { Subscription } from "rxjs";
import { FormControl } from "@angular/forms";

import { MenuOrModuleCommonService, CommonFunctionService, EnvService, AuthService, ModelService, DataShareService, StorageService, StorageTokenStatus, ApiCallService } from '@core/web-core';



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

    //menuBoxHome: boolean = false;
    menuBoxDashboard: boolean = false;
    //showUserAccount: boolean = false;
    //fullHeader: boolean = false;
    //loginUserIcon: boolean = false;
    //getmenu: boolean = true;
    isShow: boolean = true;


    // public userInfo: any;
    // public userColorCode: any;
    // public userName: any;
    // public userEmail: any;
    // public userFirstLetter: any;
    public menuData: any = [];
    currentPage: any;
    logedin: boolean = false;
    gitVersionSubscription: any;
    moduleIndexSubscription:Subscription;
    menuIndexSubscription:Subscription;
    headerMenuSubscription:Subscription;
    gitVersion: any;

    logoPath = ''
    private myData: any;

    activeclass = false;
    AllModuleList: any = [];
    filterdata:any;
    public teamname: any;
    teamNameMenu = '';
    showsearchmenu = false;

    @HostListener('window:keyup.alt.r') onAnyKey() {
        this.activeclass = false;
    }


    @HostListener('window:keyup.alt.h') onCtrlH() {
        this.activeclass = true;
        this.selected.setValue(0);
    }


    // @HostListener('window:keyup.alt.o') onCtrlO() {
    //     this.shortcutinfo();
    // }

    // @HostListener('window:keyup.alt.control.c') onCtrlChart() {
    //     this.chartModel();
    // }

    @HostListener('window:keyup.enter') onCtrlenter() {
        if (this.activeclass) {
            this.goToMOdule();
            this.activeclass = false;
        }
    }

    constructor(
        private router: Router,
        private storageService: StorageService,
        private dataShareService: DataShareService,
        private modelService: ModelService,
        private authService: AuthService,
        public envService: EnvService,
        private commonfunctionService:CommonFunctionService,
        private menuOrModuleCommounService:MenuOrModuleCommonService,
        private apiCallService:ApiCallService
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
                this.moduleIndex = index;
            }else{
                this.moduleIndex = -1;
            }
            this.getMenuByModuleIndex(index);
        })
        this.menuIndexSubscription = this.dataShareService.menuIndexs.subscribe(indexs =>{ 
            if(indexs.moduleIndex != undefined && indexs.moduleIndex != -1){
                this.moduleIndex = indexs.moduleIndex;
                this.AllModuleList = this.storageService.GetModules();
                let module = this.AllModuleList[this.moduleIndex]; 
                this.menuData = module.menu_list;
                //this.menuData = this.menuOrModuleCommounService.setDisplayInMenuWithPermission(menuList);
            }               
            const menuIndex = indexs.menuIndex;
            if(menuIndex != -1){
                this.selected.setValue(menuIndex+1);
            }else{
                this.selected.setValue(1);
            }   
            this.showsearchmenu = false;
            this.filterdata = '';   
        })
        this.headerMenuSubscription = this.dataShareService.headerMenu.subscribe(data =>{
            this.menuData=data;
        })
        


        this.AllModuleList = this.storageService.GetModules();
        if(this.AllModuleList != undefined && Array.isArray(this.AllModuleList)){
            const menuType =  this.storageService.GetMenuType();
            if(this.AllModuleList.length == 1 && menuType == 'Horizontal'){
                this.menuOrModuleCommounService.GoToSelectedModule(this.AllModuleList[0]);
            }     
        };

        // if (this.storageService.GetUserInfo()) {
        //     this.userInfo = this.storageService.GetUserInfo();
        //     this.userName = this.userInfo.name;
        //     this.userEmail = this.userInfo.email;
        //     this.teamname = this.userInfo.list1
        //     if (this.userName && this.userName != null) {
        //         this.userFirstLetter = this.userName.charAt(0).toUpperCase()
        //     } else {
        //         if (this.userInfo.email && this.userInfo.email != null) {
        //             this.userFirstLetter = this.userInfo.email.toUpperCase()
        //         }
        //     }
        // }

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

    GoToSelectedModule(module){
        this.menuOrModuleCommounService.GoToSelectedModule(module);
    }
    getTemplateData(module,menu,event){
        if(event.ctrlKey){
            const rout = 'browse/'+module.name+'/'+menu.name;
            this.storageService.setChildWindowUrl(rout);
            window.open(rout, '_blank');
        }else{
            this.menuOrModuleCommounService.getTemplateData(module,menu)
        }
    }

    // shortcutinfo() {
    //     this.modelService.open('shortcutinfo_model', {})
    // }
    // chartModel() {
    //     this.modelService.open('chart_model', {})
    // }
    
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
            case "DASHBOARD":                
                this.menuBoxDashboard = true;
                break;
            case "HOME":                
            case "EXAMTEST": 
            case "MODULE":               
            case "HOME2":                
            default:
                this.menuBoxDashboard = false;
                break;

        }
        if (this.storageService != null && this.storageService.GetIdToken() != null) {
            //const idToken = this.storageService.GetIdToken();
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
        this.apiCallService.getUserNotification(1);
    }    
    getMenuByModuleIndex(moduleIndex:any){
        if (moduleIndex != -1) {
            this.AllModuleList = this.storageService.GetModules();
            let module = this.AllModuleList[moduleIndex];         
            if (module.menu_list != undefined && module.menu_list != null) {
                this.menuData = module.menu_list;
                //this.menuData = this.menuOrModuleCommounService.setDisplayInMenuWithPermission(menuList);
                let menu = {}
                let menuWithIndex = this.menuOrModuleCommounService.getDefaultMenu(this.menuData);                              
                if(this.moduleIndex != moduleIndex){                    
                    let activeMenu = this.storageService.GetActiveMenu();
                    if(activeMenu && activeMenu.name){                        
                        menuWithIndex = this.getMenuByActiveMenu(activeMenu);
                    }else{
                        this.selected.setValue(0);
                    }
                }else if(this.moduleIndex == moduleIndex){
                    let activeMenu = this.storageService.GetActiveMenu();
                    if(activeMenu && activeMenu.name){
                        menuWithIndex = this.getMenuByActiveMenu(activeMenu);
                    }else{
                        this.selected.setValue(1);
                    }
                }  
                menu = menuWithIndex.menu; 
                let menuIndexs = menuWithIndex.indexs;               
                this.menuOrModuleCommounService.shareMenuIndex(menuIndexs.defaultmenuIndex,menuIndexs.defaultSubmenuIndex);
                this.menuOrModuleCommounService.getTemplateData(module,menu)
            } else {
                this.menuData = [];
                this.menuBoxDashboard = false;
            }
        } else {
            this.menuData = [];
            this.menuBoxDashboard = false;
        }
    }  
     
    getMenuByActiveMenu(activeMenu){
        let menu = {};
        let activeMenuIndex = 0;
        let indexs:any = {};
        if(activeMenu.menuIndex != -1){
            activeMenuIndex = activeMenu.menuIndex
            indexs['defaultmenuIndex'] = activeMenuIndex;
        }else{
            indexs['defaultmenuIndex'] = -1;
        }
        this.selected.setValue(activeMenuIndex+1); 
        let menuList = this.menuData;
        if(activeMenu.child){                        
            let subMenu = this.menuData[activeMenuIndex].submenu;
            if(subMenu && subMenu.length > 0){
                menuList = subMenu;
            }                        
        }
        let menuIndex = this.commonfunctionService.getIndexInArrayById(menuList,activeMenu.name,'name'); 
        if(activeMenu.child){
            indexs['defaultSubmenuIndex'] = menuIndex;
        }else{
            indexs['defaultSubmenuIndex'] = -1;
        }   
        menu['indexs'] = indexs;
        menu['menu'] = menuList[menuIndex]; 
        return menu;
    }  
    
    activeLinkD(link, check) {
        this.active_menu_d = link;
        if (check) {
            this.dataShareService.sendCurrentPage('DASHBOARD');
            this.router.navigate([link])
        }

    }
    
    getTemplateMenuData(submenu,menuIndex,subMenuIndex,event) {
        let module:any = {};
        if(this.moduleIndex != -1){
            module = this.AllModuleList[this.moduleIndex];
        }
        if(event.ctrlKey && module && module.name){
            const rout = 'browse/'+module.name+'/'+submenu.name;
            this.storageService.setChildWindowUrl(rout);
            window.open(rout, '_blank');
        }else{
            this.menuOrModuleCommounService.shareMenuIndex(menuIndex,subMenuIndex);
            this.menuOrModuleCommounService.getTemplateData(module,submenu);
        }
    }
        
    goToMOdule() {
        this.menuOrModuleCommounService.goToMOdule();
    }
    

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
  
    getCurrentMenu() {
        const currentMenu = this.storageService.GetActiveMenu();
        if (currentMenu && currentMenu.name && currentMenu.name != null) {
            return currentMenu.name;
        } else {
            return;
        }
    }     
    
    searchmodel(data:string) {
        this.filterdata = data;
        if(data != ''){
            this.showsearchmenu = true;
        }else {
            this.showsearchmenu = false;
        }
    }
      
}