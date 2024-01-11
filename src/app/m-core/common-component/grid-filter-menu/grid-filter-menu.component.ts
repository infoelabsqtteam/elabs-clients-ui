import { Component, Input , OnInit} from "@angular/core";
import { StorageService, CommonFunctionService, PermissionService, DataShareService, ApiService, NotificationService, EnvService, MenuOrModuleCommonService, ApiCallService, UserPrefrenceService} from '@core/web-core';

@Component({
  selector: 'app-grid-filter-menu',
  templateUrl: './grid-filter-menu.component.html',
  styleUrls: ['./grid-filter-menu.component.css'],
})
export class GridFilterMenuComponent implements OnInit{
  @Input() columns: any;

  constructor(
    private storageService: StorageService,
    private apiService: ApiService,
    private dataShareService: DataShareService,
    private commonFunctionService: CommonFunctionService,
    private userPrefrenceService: UserPrefrenceService,
  ) {}
  showHide(){
  }
  ngOnInit(): void {
  //   console.log("onnit");
  //   this.columns.forEach((column:any) => {
  //     if(this.checkHeadExists(column) || column?.hide ){
  //         column.display=false
  //     }
  // });
  }

  updateColumnList() {
    if (this.columns) {
      this.columns.forEach((column) => (column.display = true));
    }
  }

  createReferenceObject(obj:any){
    let ref:any = {}
    ref["_id"]=obj._id;
    ref["name"] = obj.name;
    if(obj.version != null){
      ref["version"] = obj.version
    }
    return ref;
  }

  checkHeadExists(head:any){
    let preferenceData=localStorage.getItem("preference");
    console.log("ls",preferenceData);
    if(!preferenceData){
      return false;
    }
    else{
      preferenceData=JSON.parse(localStorage.getItem("preference"))
      if(preferenceData.length>0){
        console.log(head.name, preferenceData.includes(head._id))
        return preferenceData.includes(head._id)
      }
    }
  }

  createPayload(columns: any[]){
    console.log(columns)
    const checkedFields=columns.filter(col=>col.display==true);
    const checkedFieldsIds=checkedFields.map(col=>col._id);
    const uncheckedFields=columns.filter(col=>col.display==false);
    const uncheckedFieldsIds= uncheckedFields.map(col=>col._id)
    // localStorage.setItem("preference",JSON.stringify(uncheckedFieldsId))
    // this.storageService.setUserPreference(uncheckedFieldsId);
    // const fieldArray=checkedFields(col=>{
    //   field_name:col.name,
    //   "display":col.display
    // });
    let {menuIndex, submenuIndex, moduleIndex}= this.dataShareService.getMenuOrSubmenuIndexs();
    const allModuleData=this.storageService.GetModules();
    // console.log("Module",allModuleData[moduleIndex]);


    let selectedModule= allModuleData[moduleIndex];
    let selectedMenu= allModuleData[moduleIndex]?.["menu_list"][menuIndex];
    let selectedSubMenu= null;
    let allTempleteTabs= this.dataShareService.getTempData()[0]?.["templateTabs"];
    let activeMenu=this.storageService.GetActiveMenu() ///get active tab 
    let selectedTab= allTempleteTabs?.find((tab)=>tab.tab_name== activeMenu?.name);
    let selectedGrid= selectedTab.grid
    // console.log("uncheck",uncheckedFieldsIds);
    this.checkAndSetPreference2(uncheckedFieldsIds,checkedFieldsIds)

    if(submenuIndex!= -1){
       selectedSubMenu= allModuleData[moduleIndex]?.["menu_list"][menuIndex]?.["submenu"][submenuIndex];
    }

    const payloads= {
      module: selectedModule,
      menu: selectedMenu,
      submenu: selectedSubMenu,
      templeteTab: allTempleteTabs,
      tab: selectedTab,
      activeField: checkedFields
    }
    let preference;
    if(submenuIndex != -1){
      preference={
        [selectedModule["name"]]:{
          reference : this.createReferenceObject(selectedModule),
          menus:{
               [selectedMenu["name"]]:{
               reference : this.createReferenceObject(selectedMenu),
               submenus: {
                  [selectedSubMenu["name"]]: {
                    reference: this.createReferenceObject(selectedSubMenu),
                    templateTabs:{
                      [selectedTab["tab_name"]]:{
                        reference : {
                          _id:selectedTab["_id"],
                          name: selectedTab["tab_name"]
                        },
                        grids:{
                          [selectedGrid["name"]]:{
                            reference : {...this.createReferenceObject(selectedGrid),allSelected:true},
                            "fields":checkedFields.map(col =>{
                              return { field_name: col.field_name,
                                        // display: col.display  
                              }
                            })
                          }
        
                        }
                     }
                    }
                  }
               }
         }
        }
      }
    }
    }
    else{
      preference={
        [selectedModule["name"]]:{
          reference : this.createReferenceObject(selectedModule),
          menus:{
               [selectedMenu["name"]]:{
               reference : this.createReferenceObject(selectedMenu),
               templateTabs:{
                [selectedTab["tab_name"]]:{
                  reference : {
                    _id:selectedTab["_id"],
                    name: selectedTab["tab_name"]
                  },
                  grids:{
                    [selectedGrid["name"]]:{
                      reference : {...this.createReferenceObject(selectedGrid),allSelected:true},
                      "fields":checkedFields.map(col =>{
                        return { field_name: col.field_name,
                                  // display: col.display  
                        }
                      })
                    }
  
                  }
               }
              }
         }
        }
      }
    }
    }
  let userRef = this.createReferenceObject(
    this.storageService.GetUserInfo()
  );

  // let result=this.checkPreference(preference);
  let payload={
    preference : preference,
    userId: userRef
  }
    // console.log("preference",preference);
    // this.storageService.setUserPreference(payload);
    this.updateUserPreference(payload,"preference");
    console.log("preference",payload);
  }

  updateUserPreference(data: object, fieldName: string, parent?: string) {
    let payloadData;
    switch (fieldName) {
      // case 'favouriteMenus':
      //   payloadData = this.modifiedMenuObj(data, fieldName, parent);
      //   break;
      // case 'tab':
      //   payloadData = this.addOrRemoveTabs(data);
      //   break;
      case 'preference':
        payloadData = data
        break;;
      default:
        payloadData = this.storageService.getUserPreference();
        break;
    }
    let payload = {
      curTemp: 'user_preference',
      data: payloadData,
    };
    this.apiService.SaveFormData(payload);
  }
  
  checkAndSetPreference(uncheckedFieldsIds:any[],checkedFieldsIds:any[]){
    let existingUserPreferences = this.storageService.getUserPreference();
    console.log(existingUserPreferences);
    if (!existingUserPreferences) {
      let uref: any = {};
      let userRef = this.createReferenceObject(
        this.storageService.GetUserInfo()
      );
      uref['userId'] = userRef;
      uref['preference'] = uncheckedFieldsIds;
      existingUserPreferences = uref;
      this.storageService.setUserPreference(existingUserPreferences);
    }
    else if(Object.keys(existingUserPreferences).length > 0){

      if(existingUserPreferences.hasOwnProperty("preference")){
        let oldPreference=existingUserPreferences.preference;

        //removing duplicate of uncheckedFieldId from newpreference
        let newpreference=[...new Set([...oldPreference,...uncheckedFieldsIds])];

        //removing checkedFieldsIds which present in newpreference
        newpreference=newpreference.filter(element=> !checkedFieldsIds.includes(element))
        
        existingUserPreferences['preference']=newpreference;
        this.storageService.setUserPreference(existingUserPreferences);
      }else{

        existingUserPreferences["preference"]=uncheckedFieldsIds;
        this.storageService.setUserPreference(existingUserPreferences);

      }

    }
    
    
  }
  checkAndSetPreference2(uncheckedFieldsIds:any[],checkedFieldsIds:any[]){
    let existingUserPreferences = sessionStorage.getItem("PREFERENCE");
    console.log(existingUserPreferences);
    if (!existingUserPreferences) {
      let uref: any = {};
      let userRef = this.createReferenceObject(
        this.storageService.GetUserInfo()
      );
      uref['userId'] = userRef;
      uref['preference'] = uncheckedFieldsIds;
      existingUserPreferences = uref;
      sessionStorage.setItem("PREFERENCE",JSON.stringify(existingUserPreferences));
    }
    else if(Object.keys(existingUserPreferences).length > 0){
      existingUserPreferences = JSON.parse(sessionStorage.getItem("PREFERENCE"))
      if(existingUserPreferences.hasOwnProperty("preference")){
        let oldPreference=existingUserPreferences["preference"];

        //removing duplicate of uncheckedFieldId from newpreference
        let newpreference=[...new Set([...oldPreference,...uncheckedFieldsIds])];

        //removing checkedFieldsIds which present in newpreference
        newpreference=newpreference.filter(element=> !checkedFieldsIds.includes(element))
        
        existingUserPreferences['preference']=newpreference;
        sessionStorage.setItem("PREFERENCE",JSON.stringify(existingUserPreferences));
      }else{

        existingUserPreferences["preference"]=uncheckedFieldsIds;
        sessionStorage.setItem("PREFERENCE",JSON.stringify(existingUserPreferences));

      }

    }
    
    
  }

  mergeNestedObjects(obj1, obj2) {
    const result = {};
  
    for (const key in obj1) {
      if (obj1.hasOwnProperty(key)) {
        if(key == "fields"){
            result[key]=obj2[key]
        }
        else if (typeof obj1[key] === 'object' && obj1[key] !== null && obj2.hasOwnProperty(key) && key != "reference") {
          // If both objects have the same key and the value is an object, recursively merge them
          result[key] = this.mergeNestedObjects(obj1[key], obj2[key]);
        } 
        // else if(key == "dis" && key != "name" && key != "_id"){
        //     console.log("jvjvhviv",key )
        //     result[key]= obj2[key]
        // }
        else {
          // If only obj1 has the key or the value is not an object in both objects, use obj1's value
          result[key] = obj1[key];
        }
      }
    }
    // && key != "name" && key != "_id"
    // Add keys from obj2 that are not present in obj1
    for (const key in obj2) {
      if (obj2.hasOwnProperty(key) && !obj1.hasOwnProperty(key)) {
        result[key] = obj2[key];
      }
    }
  
    return result;
  }

}


