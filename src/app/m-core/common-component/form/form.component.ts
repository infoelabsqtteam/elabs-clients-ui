import { Component, OnInit, OnChanges, Input, Output, EventEmitter, OnDestroy, SimpleChanges, ViewChild, Inject, AfterViewInit,SimpleChange, ElementRef,NgZone, HostListener} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators,FormGroupDirective,FormControlDirective,FormControlName } from '@angular/forms';
import { DOCUMENT, DatePipe, CurrencyPipe, TitleCasePipe } from '@angular/common'; 
import { ModalDirective } from 'angular-bootstrap-md';
import { Router, NavigationEnd,ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {COMMA, ENTER, TAB, SPACE, F} from '@angular/cdk/keycodes';
import { Common } from 'src/app/shared/enums/common.enum';
import { Observable, Subscription } from 'rxjs';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
// import { HttpClient } from '@angular/common/http';
import { StorageService, CommonFunctionService, ApiService, PermissionService, ModelService, DataShareService, NotificationService, EnvService, CoreFunctionService, CustomvalidationService, MenuOrModuleCommonService, GridCommonFunctionService, LimsCalculationsService} from '@core/web-core';


declare var tinymce: any;


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {

  //https://www.npmjs.com/package/@kolkov/angular-editor
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '100px',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [],
      ['fontSize', 'insertImage', 'insertVideo',]
    ]
  };

  minieditorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '100px',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [],
      ['fontSize',
      'textColor',
      'backgroundColor',
      'customClasses',
      'link',
      'unlink',
      'insertImage',
      'insertVideo',
      'insertHorizontalRule',
      'toggleEditorMode',
      'justifyLeft',
      'justifyCenter',
      'justifyRight',
      'justifyFull',
      'indent',
      'outdent',
      'insertUnorderedList',
      'insertOrderedList',
      'heading',
      'fontName',
      'removeFormat',      
      'strikeThrough']
    ]
  };
  htmlViewConfig:AngularEditorConfig = {
    editable: false,
    showToolbar: false,
  }
  tinymceConfig = {}
  

  templateForm: FormGroup;

  @Output() filledFormData = new EventEmitter();
  @Output() addAndUpdateResponce = new EventEmitter();
  @Output() formDetails = new EventEmitter();
  @Input() tabIndex: number;
  @Input() editedRowIndex: number;
  @Input() formName: string;
  @Input() id: string;
  @Input() selectContact: string;
  @ViewChild('formModal') public formModal: ModalDirective;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @ViewChild('stepper') stepper;
  @ViewChild('search') public searchElementRef: ElementRef;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  @ViewChild(GoogleMap) public map!: GoogleMap;
  @ViewChild('templateFormRef') templateFormRef: ElementRef;
  @Input() isBulkUpdate:boolean;
  @Input() bulkDataList:any;
  bulkupdates:boolean = false;

  objectKeys = Object.keys;
  updateAddNew:boolean = false;
  hide = true;
  showSidebar:boolean = false;
  isLinear:boolean=true;
  isStepper:boolean = false;
  showNotify: boolean = false;
  currentMenu: any;
  formSaveBtn: boolean = false;
  formUpdateBtn: boolean = false;
  formDeleteBtn: boolean = false;
  formResetBtn: boolean = false;
  list_of_fields: any = [];
  getSavePayload:boolean=false;
  updateMode: boolean = false;
  nextFormUpdateMode:boolean = false;
  complete_object_payload_mode:boolean = false;
  close_form_on_success:boolean=false;
  nextIndex:boolean = false;
  createFormgroup: boolean = true;
  getTableField:boolean = true;
  enableNextButton:boolean = false;
  checkBoxFieldListValue: any = [];
  tab: any = {};
  elements: any = [];
  tabFilterData:any=[];
  tableFields: any = [];
  filePreviewFields:any=[];
  showIfFieldList:any=[];
  disableIfFieldList:any=[];
  mendetoryIfFieldList:any=[];
  editorTypeFieldList:any=[];
  gridSelectionMendetoryList:any=[];
  canUpdateIfFieldList:any=[];
  buttonIfList:any = [];
  pageLoading: boolean = true;
  formFieldButtons: any = [];
  staticData: any = {};
  selectedRow: any={};
  selectedRowIndex: any = -1;
  userInfo: any;
  custmizedFormValue: any = {};
  modifyCustmizedFormValue: any = {};
  customEntryData:any={};
  typeAheadData: string[] = [];
  public tempVal = {};
  listOfFieldUpdateMode:boolean=false;
  listOfFieldsUpdateIndex:any = -1;
  public deleteIndex:any = '';
  public deletefieldName = {};
  public alertData = {};

  public curTreeViewField: any = {};
  curFormField:any={};
  curParentFormField:any={};
  treeViewData: any = {};
  dataSaveInProgress: boolean = true;
  submitted:boolean=false;
  forms:any={};
  form:any={};
  formIndex:number=0;
  pdfViewLink:any='';
  pdfViewListData:any=[];
  curFileUploadField:any={}
  curFileUploadFieldparentfield:any={};
  dataListForUpload:any = {};
  uploadFilesList:any = []
  clickFieldName:any={};
  downloadClick='';
  grid_view_mode:any='';
  minDate: Date;
  maxDate: Date;
  dinamic_form:any={};
  checkForDownloadReport:boolean = false;
  currentActionButton:any={};
  saveResponceData:any={};

  latitude: number = 0;
  longitude: number = 0;
  zoom: number = 10;
  center: google.maps.LatLngLiteral = {lat: 0, lng: 0};

  address: string;
  private geoCoder;
  checkFormFieldAutfocus:boolean=false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;  
  public multipleFormCollection:any=[];
  public donotResetFieldLists:any={};
  public fieldApiValidaton:string = '';
  public fieldApiValMsg:string='';
  public nextFormData:any ={};
  public onchangeNextForm:boolean = false;

  public style:string  = 'width: 100px, height: 100px, backgroundColor: cornflowerblue';

  staticDataSubscriber:Subscription;
  gridDataSubscription:Subscription;
  tempDataSubscription:Subscription;
  saveResponceSubscription:Subscription;
  deleteGridRowResponceSubscription:Subscription;
  gridFilterDataSubscription:Subscription;
  typeaheadDataSubscription:Subscription;
  dinamicFormSubscription:Subscription;
  nestedFormSubscription:Subscription;
  navigationSubscription:Subscription;
  fileDataSubscription:Subscription;
  fileDownloadUrlSubscription:Subscription;
  gridSelectionOpenOrNotSubscription:Subscription;
  dinamicFieldApiSubscription:Subscription;
  validationConditionSubscription:Subscription;
  nextFormSubscription:Subscription;
  requestResponceSubscription:Subscription;
  isGridSelectionOpen: boolean = true;
  deleteGridRowData: boolean = false;
  filterdata = '';
  term:any={};
  pageNo:any={};
  pageSize:any=100;
  showGridData:any={};
  serverReq:boolean = false;
  actionButtonNameList:any=["save","update","updateandnext","send_email"];
  getLocation:boolean = false;
  mapsAPILoaded: Observable<boolean>;

  // @HostListener('document:click') clickout() {
  //   this.term = {};
  // }

  constructor(
    private formBuilder: FormBuilder, 
    private storageService: StorageService,
    private permissionService:PermissionService,
    private commonFunctionService:CommonFunctionService, 
    private modalService: ModelService, 
    private router: Router,
    private routers: ActivatedRoute,
    @Inject(DOCUMENT) document,
    private datePipe: DatePipe,
    private apiService:ApiService,
    private dataShareService:DataShareService,
    private notificationService:NotificationService,
    private envService:EnvService,
    private coreFunctionService:CoreFunctionService,
    private customValidationService:CustomvalidationService,
    private menuOrModuleCommounService:MenuOrModuleCommonService,
    private gridCommonFunctionService:GridCommonFunctionService,
    private ngZone: NgZone,
    private limsCalculationsService:LimsCalculationsService
) {

    this.tinymceConfig = {
      height: 500,
      menubar: false,
      branding: false,
      plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code help wordcount'
      ],
      toolbar:
        'undo redo | formatselect | bold italic backcolor | \
        alignleft aligncenter alignright alignjustify | \
        bullist numlist outdent indent | \ table tabledelete | image | code | removeformat | help',
      image_title: true,
      automatic_uploads: true,
      file_picker_types: 'image',
      file_picker_callback: function (cb, value, meta) {
        let input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
    
        /*
          Note: In modern browsers input[type="file"] is functional without
          even adding it to the DOM, but that might not be the case in some older
          or quirky browsers like IE, so you might want to add it to the DOM
          just in case, and visually hide it. And do not forget do remove it
          once you do not need it anymore.
        */
    
        input.onchange = function () {
          var file = this.files[0];
    
          var reader:any = new FileReader();
          reader.onload = function () {
            /*
              Note: Now we need to register the blob in TinyMCEs image blob
              registry. In the next release this part hopefully won't be
              necessary, as we are looking to handle it internally.
            */
            var id = 'blobid' + (new Date()).getTime();
            var blobCache =  tinymce.activeEditor.editorUpload.blobCache;
            var base64 = reader.result.split(',')[1];
            var blobInfo = blobCache.create(id, file, base64);
            blobCache.add(blobInfo);
    
            /* call the callback and populate the Title field with the file name */
            cb(blobInfo.blobUri(), { title: file.name });
          };
          reader.readAsDataURL(file);
        };
    
        input.click();
      },
      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
    }
    this.staticDataSubscriber = this.dataShareService.staticData.subscribe(data =>{
      this.setStaticData(data);
    })
    this.gridDataSubscription = this.dataShareService.gridData.subscribe(data =>{
      this.setGridData(data);
    })
    this.tempDataSubscription = this.dataShareService.tempData.subscribe( temp => {
      this.setTempData(temp);
    })   
    this.requestResponceSubscription = this.dataShareService.requestResponce.subscribe(responce =>{      
      this.serverReq = responce;
      this.checkFormFieldIfCondition();
    }) 
    this.deleteGridRowResponceSubscription = this.dataShareService.deleteGridRowResponceData.subscribe(responce =>{
      this.setGridRowDeleteResponce(responce);
    })
    this.gridFilterDataSubscription = this.dataShareService.gridFilterData.subscribe(data =>{
      this.setGridFilterData(data);
    })
    this.typeaheadDataSubscription = this.dataShareService.typeAheadData.subscribe(data =>{
      this.setTypeaheadData(data);
    })
    this.dinamicFormSubscription = this.dataShareService.form.subscribe(form =>{
      this.setDinamicForm(form);
    })
    this.nestedFormSubscription = this.dataShareService.nestedForm.subscribe(form => {
      //console.log(form);
      this.loadNextForm(form);
    })
    this.fileDataSubscription = this.dataShareService.getfileData.subscribe(data =>{
      this.setFileData(data);
    })
    this.fileDownloadUrlSubscription = this.dataShareService.fileDownloadUrl.subscribe(data =>{
      this.setFileDownloadUrl(data);
    })
    this.gridSelectionOpenOrNotSubscription = this.dataShareService.getIsGridSelectionOpen.subscribe(data =>{
        this.isGridSelectionOpen= data;
    })
    this.nextFormSubscription = this.dataShareService.nextFormData.subscribe(data => {
      if(!this.enableNextButton && !this.onchangeNextForm && data && data.data && data.data.length > 0){
        this.enableNextButton = true;
        this.nextFormData = data.data[0];
      }else if(this.onchangeNextForm && data && data.data && data.data.length > 0){
        this.onchangeNextForm = false;        
        this.nextFormData = data.data[0];
        this.openNextForm(false);
      }
    })
    if(this.dataShareService && this.dataShareService.fieldDinamicResponce){
    this.dinamicFieldApiSubscription = this.dataShareService.fieldDinamicResponce.subscribe(data =>{
      this.setDinamicApiResponce(data);
    })
  }

  if(this.dataShareService && this.dataShareService.checkValidation){
    this.validationConditionSubscription = this.dataShareService.checkValidation.subscribe( data =>{
      if(data.name == "gst_number"){
        const objectValue = this.templateForm.getRawValue();
        for (let x in objectValue) {
          const value = objectValue[x];
          if(data.value == value){
            for (let index = 0; index < this.tableFields.length; index++) {
              let element = this.tableFields[index]
              if(element.field_name == x){
                this.dinamicApiCall(element,data.value);
                break;
              }
            }
            break;
          }
          if(typeof value == 'object'){
            for (let y in value) {
              const childValue = value[y];
              if(data.value == childValue){
                for (let index = 0; index < this.tableFields.length; index++) {
                  let element = this.tableFields[index]                  
                  if(element.type == "list_of_fields" && element.list_of_fields && element.list_of_fields.length > 0){
                    for (let index = 0; index < element.list_of_fields.length; index++) {
                      let child = element.list_of_fields[index]
                      if(child.field_name == y){
                        this.dinamicApiCall(child,data.value);
                        break;
                      }
                    }
                  }
                }
                break;
              }
            }
          }
        }
      }else if(data.name == 'invalid'){
        this.fieldApiValidaton = '';
        this.fieldApiValMsg ='';
      }
    })
  }
    this.currentMenu = this.storageService.GetActiveMenu();
    this.userInfo = this.storageService.GetUserInfo();
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.tableFields = [];
        this.showIfFieldList=[];
        this.buttonIfList=[];
        this.disableIfFieldList=[];
        this.mendetoryIfFieldList = [];
        this.gridSelectionMendetoryList=[];
        this.customValidationFiels = [];
        this.canUpdateIfFieldList=[];
        this.formFieldButtons=[];
        this.list_of_fields = [];
        this.createFormgroup = true;
        this.getTableField = true;
        this.pageLoading = true;
        this.dataSaveInProgress = true;
        this.isLinear=true;
        this.isStepper = false;
        this.showSidebar = false;
        this.saveResponceData = {};
        this.listOfFieldUpdateMode=false;
        this.listOfFieldsUpdateIndex = -1;
        this.ngOnInit();  
        const tempData = this.dataShareService.getTempData();
        this.setTempData(tempData); 
      }
    });
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 100, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31); 

  }



  @HostListener('window:keyup.alt.u') onCrtlU() {
    this.saveFormData()
  }

  @HostListener('window:keyup.alt.s') onCtrlS() {
    this.saveFormData()
  }

  @HostListener('window:keyup.alt.r') onCtrlR(){
    this.resetForm()
  }

  @HostListener('window:keyup.alt.c') onCtrlC() {
    this.cancel();
    this.closeModal();
  }

  saveCallSubscribe(){
    this.saveResponceSubscription = this.dataShareService.saveResponceData.subscribe(responce =>{
      this.setSaveResponce(responce);
    })
  }
  unsubscribe(variable){
    if(variable){
      variable.unsubscribe();
    }
  }
  moreformResponce(responce) {

  }

  ngOnDestroy() {
    // this.tableFields = [];
    // this.formFieldButtons=[];
    // this.elements = [];
    // this.tabFilterData = [];
    // this.custmizedFormValue = {};
    // this.saveResponceData = {};
    if(this.staticDataSubscriber){
      this.staticDataSubscriber.unsubscribe();
    }
    if(this.gridDataSubscription){
      this.gridDataSubscription.unsubscribe();
    }
    if(this.tempDataSubscription){
      this.tempDataSubscription.unsubscribe();
    }
    if(this.saveResponceSubscription){
      this.saveResponceSubscription.unsubscribe();
    }
    if(this.gridFilterDataSubscription){
      this.gridFilterDataSubscription.unsubscribe();
    }
    if(this.typeaheadDataSubscription){
      this.typeaheadDataSubscription.unsubscribe();
    }
    if(this.dinamicFormSubscription){
      this.dinamicFormSubscription.unsubscribe();
    }
    if(this.nestedFormSubscription){
      this.nestedFormSubscription.unsubscribe();
    }
    if(this.templateForm){
      this.templateForm.reset(); 
    }
    if(this.fileDataSubscription){
      this.fileDataSubscription.unsubscribe();
    }
    if(this.fileDownloadUrlSubscription){
      this.fileDownloadUrlSubscription.unsubscribe();
    } 
    if(this.gridSelectionOpenOrNotSubscription){
      this.gridSelectionOpenOrNotSubscription.unsubscribe();
    } 
    if(this.dinamicFieldApiSubscription){
      this.dinamicFieldApiSubscription.unsubscribe();
    }
    if(this.validationConditionSubscription){
      this.validationConditionSubscription.unsubscribe();
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    this.formIndex=0;   
    this.saveResponceData = {};
    if(this.currentMenu == undefined){
      this.currentMenu = this.storageService.GetActiveMenu();
    }    
    this.changeForm();    
  }
  ngAfterViewInit() {
    // this.mapsApiLoaded();
    this.gmapSearchPlaces();    
  }
  changeForm(){
    this.resetFlagForOnchage();
    this.resetFlagsForNewForm();
    const form = this.dataShareService.getDinamicForm();
    this.setDinamicForm(form)
    const tempData = this.dataShareService.getTempData();  
    this.setTempData(tempData); 
    this.ngOnInit();         
  }
  resetFlagsForNewForm(){    
    //this.tableFields = [];
    this.showIfFieldList=[];
    this.buttonIfList=[];
    this.disableIfFieldList=[];
    this.mendetoryIfFieldList = [];
    this.gridSelectionMendetoryList=[];
    this.customValidationFiels = [];
    this.canUpdateIfFieldList=[];
    this.custmizedFormValue = {};
    this.modifyCustmizedFormValue = {};
    this.dataListForUpload = {};
    this.checkBoxFieldListValue = [];
    this.selectedRow = {}
    this.formFieldButtons=[];
    this.list_of_fields = [];
    this.typeAheadData = [];
    this.createFormgroup = true;    
    this.getTableField = true;
    this.pageLoading = true;
    this.dataSaveInProgress = true; 
    this.isLinear=true;
    this.isStepper = false;  
    this.showSidebar = false;  
    this.checkFormFieldAutfocus = true;
    this.filePreviewFields = [];    
    this.nextFormUpdateMode = false;    
    this.focusFieldParent={};
    this.term={};
  }
  resetFlagForOnchage(){
    this.listOfFieldUpdateMode=false; 
    this.listOfFieldsUpdateIndex = -1; 
    this.serverReq = false;
    this.updateAddNew = false;
  }


  ngOnInit(): void {  
    if (this.editedRowIndex >= 0) {
      this.selectedRowIndex = this.editedRowIndex;
      if(this.elements.length > 0){
        this.editedRowData(this.elements[this.editedRowIndex]);
      }
      //this.handleDisabeIf();     
    }else{
      this.selectedRowIndex = -1;
      //this.handleDisabeIf();
    }
      
    //this.formControlChanges();
    if(this.form && this.form.tableFields && this.form.tableFields.length > 0){
      this.funCallOnFormLoad(this.form.tableFields)
    }

    this.getGooglepMapCurrentPosition();

  }
  async getGooglepMapCurrentPosition(){
    if(navigator?.geolocation){
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.zoom = 10;
      });
    }
  }
  // async mapsApiLoaded(){
  //   // let apiKey:any = this.storageService.getApplicationValueByKey('google_map_apikey');
  //   let apiKey:any = Common.GOOGLE_API_KEY;
  //   this.mapsAPILoaded = this.httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key='+ apiKey +'&libraries=places', 'callback')
  //       .pipe(
  //         map(() => true),
  //         catchError(() => of(false)),
  //       );
  // }
  async gmapSearchPlaces(inputData?:any,field?:any){
    if(inputData?.target?.value){
      if(this.searchElementRef != undefined){
        this.searchElementRef.nativeElement.value  = inputData?.target?.value;
      }
    }
    let loadGoogleMap:boolean = false;
    if(typeof Common.GOOGLE_MAP_IN_FORM == "string"){
      if(Common.GOOGLE_MAP_IN_FORM == "true"){
        loadGoogleMap = true;
      }
    }else{
      if(Common.GOOGLE_MAP_IN_FORM){
        loadGoogleMap = true;
      }
    }
    if(loadGoogleMap){
      // if(this.mapsAPILoaded){
        this.geoCoder = new google.maps.Geocoder;
        if(this.longitude == 0 && this.latitude == 0){
          await this.setCurrentLocation();
        }
        this.center = {
          "lat": this.latitude,
          "lng": this.longitude
        }

        if(this.searchElementRef != undefined){
          let autocomplete = new google.maps.places.Autocomplete(
            this.searchElementRef.nativeElement
          );
          autocomplete.addListener('place_changed', () => {
            this.ngZone.run(() => {
              let place: google.maps.places.PlaceResult = autocomplete?.getPlace();
              if (place.geometry === undefined || place.geometry === null) {
                return;
              }
              this.searchElementRef.nativeElement.value = place.name;
              this.address = place.formatted_address;
              this.latitude = place.geometry.location.lat();
              this.longitude = place.geometry.location.lng();
              this.center = {
                "lat": this.latitude,
                "lng": this.longitude
              }
              this.zoom = 17;
              this.setAddressOnForm(field);
              // this.getAddress(this.latitude, this.longitude);
            });
          });
        }
      // }
    }
  }
  async mapClick(event: google.maps.MapMouseEvent,field?:any) {
    this.zoom = 17;
    this.center = (event.latLng.toJSON());
    await this.getAddress(this.center.lat, this.center.lng);
    this.setAddressOnForm(field);
  }
  openInfoWindow(marker: MapMarker) {
    this.infoWindow.open(marker);
  }
  setAddressOnForm(field:any){
    if(this.templateForm?.get(field?.field_name)){
      this.templateForm.get(field?.field_name).setValue(this.address);
    }else if(this.templateForm?.get('address')){
      this.templateForm.get('address').setValue(this.address);
    }
  }
  setGridData(gridData){
    if (gridData) {
      if (gridData.data && gridData.data.length > 0) {
        this.elements = gridData.data
        if(this.updateAddNew){
          this.updateAddNew=false;
          this.editedRowData(this.elements[0]);
          this.apiService.resetGridData();
        }
      }
    }
    if(this.updateAddNew){
      this.updateAddNew=false;
    }
  }
  setTempData(tempData){
    if (tempData && tempData.length > 0 && this.getTableField) {
      this.tab = tempData[0].templateTabs[this.tabIndex];
      if (this.tab && this.tab.tab_name != "" && this.tab.tab_name != null && this.tab.tab_name != undefined) {
        if(this.currentMenu && this.currentMenu.name && this.currentMenu.name != undefined && this.currentMenu.name != null){
          const menu = {"name":this.tab.tab_name};
          this.storageService.SetActiveMenu(menu);
          this.currentMenu.name = this.tab.tab_name;
        }          
      }
      if(this.tab  && this.tab.grid != null && this.tab.grid != undefined ){
        if(this.tab.grid.grid_view != null && this.tab.grid.grid_view != undefined && this.tab.grid.grid_view != ''){
          this.grid_view_mode=this.tab.grid.grid_view; 
        }else{
          this.grid_view_mode='tableView';
        }
      }
      
      if(this.tab && this.formName != ''){
        if(this.formName == 'DINAMIC_FORM'){
          this.form = this.dinamic_form
        }else if(this.tab.forms != null && this.tab.forms != undefined ){            
          this.forms = this.tab.forms;
          let gridActionButtons = [];
          if(this.tab.grid && this.tab.grid.action_buttons){
            gridActionButtons = this.tab.grid.action_buttons;
          }
          this.form = this.commonFunctionService.getForm(this.forms,this.formName,gridActionButtons)
          if(this.formName == 'clone_object'){
            this.form['api_params'] = "QTMP:CLONE_OBJECT";
          }
          this.setForm();         
        }else{
          this.form = {};
        }    
      }else{
        this.tableFields = [];
        this.formFieldButtons = [];
      }    
    }
  }
  setForm(){
    if(this.form && this.form.details && this.form.details.collection_name && this.form.details.collection_name != '' && (this.currentMenu != undefined || this.envService.getRequestType() == 'PUBLIC')){
      if(this.currentMenu == undefined){
        this.currentMenu = {};
      }
      this.currentMenu['name'] = this.form.details.collection_name;
    }
    if(this.form){
      if(this.form.details && this.form.details.bulk_update){
        this.bulkupdates = true;
      }else{
        this.bulkupdates = false;
      }
      this.formDetails.emit(this.form);
    }
    if(this.form && this.form.getLocation){
      this.getLocation = this.form.getLocation;
    }else{
      this.getLocation = false;
    }
    if(this.form && this.form['tableFields'] && this.form['tableFields'] != undefined && this.form['tableFields'] != null){
      this.tableFields = JSON.parse(JSON.stringify(this.form['tableFields']));
      this.getTableField = false;
    }else{
      this.tableFields = [];
    }  
    if(this.form && this.form.tab_list_buttons && this.form.tab_list_buttons != undefined && this.form.tab_list_buttons.length > 0){
      this.formFieldButtons = this.form.tab_list_buttons; 
    } 
    this.showIfFieldList=[];
    this.buttonIfList=[];
    this.disableIfFieldList=[];
    this.mendetoryIfFieldList = [];
    this.gridSelectionMendetoryList=[];
    this.customValidationFiels = [];
    this.editorTypeFieldList = [];
    if (this.tableFields.length > 0 && this.createFormgroup) {
      this.createFormgroup = false;
      const forControl = {};
      this.checkBoxFieldListValue = []
      let staticModal=[];
      this.filePreviewFields=[];
      for (let index = 0; index < this.tableFields.length; index++) {
        const element = this.tableFields[index];
        if(element == null){
          this.notifyFieldValueIsNull(this.form.name,index+1);
          break;
        }
        if(element.type == 'pdf_view'){
          const object = this.elements[this.selectedRowIndex];
          staticModal.push(this.commonFunctionService.getPaylodWithCriteria(element.onchange_api_params,element.onchange_call_back_field,element.onchange_api_params_criteria,object));
          this.editorTypeFieldList.push(element);
        }
        if(element.type == 'info_html' || element.type == 'html_view') {
          this.editorTypeFieldList.push(element);
          this.filePreviewFields.push(element);
        }
        if(element.field_name && element.field_name != ''){             
          switch (element.type) {
            case "list_of_checkbox":
              this.commonFunctionService.createFormControl(forControl, element, [], "list")
              this.checkBoxFieldListValue.push(element);
              break;
            case "checkbox":
              this.commonFunctionService.createFormControl(forControl, element, false, "checkbox")
              break; 
            case "date":
              let currentYear = new Date().getFullYear();
              let value:any = "";
              if(element.defaultValue && element.defaultValue != null && element.defaultValue != ''){
                value = this.setDefaultDate(element);
              }
              if(element.datatype == 'object'){
                this.minDate = new Date();
                if(element.etc_fields && element.etc_fields != null){
                  if(element.etc_fields.minDate){
                    if(element.etc_fields.minDate == '-1'){
                      this.minDate = new Date(currentYear - 100, 0, 1);
                    }else{
                      this.minDate.setDate(new Date().getDate() - Number(element.etc_fields.minDate));
                    }
                  }
                }
                this.maxDate = new Date();
                if(element.etc_fields && element.etc_fields != null){
                  if(element.etc_fields.maxDate){
                    if(element.etc_fields.maxDate == '-1'){
                      this.maxDate = new Date(currentYear + 1, 11, 31);
                    }else{
                      this.maxDate.setDate(new Date().getDate() + Number(element.etc_fields.maxDate));
                    }
                  }
                }
              }else{
                this.minDate = new Date(currentYear - 100, 0, 1);
                this.maxDate = new Date(currentYear + 1, 11, 31);
              }                  
              element['minDate'] = this.minDate
              element['maxDate'] = this.maxDate;
              this.commonFunctionService.createFormControl(forControl, element, value, "text")
              break; 
            case "daterange":
              const date_range = {};
              let list_of_dates = [
                {field_name : 'start'},
                {field_name : 'end'}
              ]
              if (list_of_dates.length > 0) {
                list_of_dates.forEach((data) => {                  
                  this.commonFunctionService.createFormControl(date_range, data, '', "text")
                });
              }
              this.commonFunctionService.createFormControl(forControl, element, date_range, "group")                                    
              break;            
            case "list_of_fields":
            case "group_of_fields":
              const list_of_fields = {};
              if(element){
                if (element.list_of_fields && element.list_of_fields.length > 0) {
                  for (let j = 0; j < element.list_of_fields.length; j++) {
                    const data = element.list_of_fields[j];                   
                    if(data == null){
                      this.notifyFieldValueIsNull(element.name,j+1);
                      break;
                    }
                    if(element.type == 'list_of_fields' && element.datatype != 'key_value'){
                      data['notDisplay'] = false;
                    }
                    let modifyData = JSON.parse(JSON.stringify(data));
                    modifyData['parent'] = element.field_name;                    
                    //show if handling
                    if(data.show_if && data.show_if != ''){
                      modifyData['parentIndex'] = index;
                      modifyData['currentIndex'] = j;
                      this.showIfFieldList.push(modifyData);
                    }
                    //Mendetory If handling
                    if(data.mandatory_if && data.mandatory_if != ''){
                      this.mendetoryIfFieldList.push(modifyData);
                    }
                    //disable if handling
                    if((data.disable_if && data.disable_if != '') || (data.disable_on_update && data.disable_on_update != '' && data.disable_on_update != undefined && data.disable_on_update != null) || (data.disable_on_add && data.disable_on_add != '' && data.disable_on_add != undefined && data.disable_on_add != null)){                          
                      this.disableIfFieldList.push(modifyData);
                    }                      
                    if(element.type == 'list_of_fields'){
                      modifyData.is_mandatory=false;
                    }
                    if(data.field_name && data.field_name != '' && element.datatype != "list_of_object_with_popup"){
                      switch (data.type) {
                        case "list_of_checkbox":
                          this.commonFunctionService.createFormControl(list_of_fields, modifyData, [], "list")
                          this.checkBoxFieldListValue.push(modifyData);
                          break;
                        case "checkbox":
                          this.commonFunctionService.createFormControl(list_of_fields, modifyData, false, "checkbox")
                          break;
                        case "date":
                          let currentYear = new Date().getFullYear();
                          if(data.datatype == 'object'){
                            this.minDate = new Date();
                            if(data.etc_fields && data.etc_fields != null){
                              if(data.etc_fields.minDate){
                                if(data.etc_fields.minDate == '-1'){
                                  this.minDate = new Date(currentYear - 100, 0, 1);
                                }else{
                                  this.minDate.setDate(new Date().getDate() - Number(data.etc_fields.minDate));
                                }
                              }
                            }
                            this.maxDate = new Date();
                            if(data.etc_fields && data.etc_fields != null){
                              if(data.etc_fields.maxDate){
                                if(data.etc_fields.maxDate == '-1'){
                                  this.maxDate = new Date(currentYear + 1, 11, 31);
                                }else{
                                  this.maxDate.setDate(new Date().getDate() + Number(data.etc_fields.maxDate));
                                }
                              }
                            }
                          }else{
                            this.minDate = new Date(currentYear - 100, 0, 1);
                            this.maxDate = new Date(currentYear + 1, 11, 31);
                          }                  
                          data['minDate'] = this.minDate
                          data['maxDate'] = this.maxDate;
                          this.commonFunctionService.createFormControl(list_of_fields, modifyData, '', "text")
                          break; 
                        default:
                          this.commonFunctionService.createFormControl(list_of_fields, modifyData, '', "text")
                          break;
                      } 
                    }  
                    data.field_class = this.commonFunctionService.getDivClass(data,(this.tableFields.length + element.list_of_fields.length));               
                  }
                }
              }
              this.commonFunctionService.createFormControl(forControl, element, list_of_fields, "group")
              if(element.type == 'list_of_fields'){
                this.list_of_fields.push(element);
              }                  
              break;
            // case 'html_view':
            //   const field = {
            //     field_name : 'html_view_1'
            //   }
            //   this.commonFunctionService.createFormControl(forControl, element, '', "text")
            //   break;
            case "stepper":                  
              if(element.list_of_fields && element.list_of_fields.length > 0) {
                element.list_of_fields.forEach((step) => {                      
                  if(step.list_of_fields != undefined && step.list_of_fields.length > 0){
                    const stepper_of_fields = {};
                    step.list_of_fields.forEach((data) =>{
                      let modifyData = JSON.parse(JSON.stringify(data));
                      modifyData.parent = step.field_name;
                      //show if handling
                      if(data.show_if && data.show_if != ''){
                        this.showIfFieldList.push(modifyData);
                      }
                      //mendetory if handling
                      if(data.mandatory_if && data.mandatory_if != ''){
                        this.mendetoryIfFieldList.push(modifyData);
                      }
                      //disable if handling
                      if((data.disable_if && data.disable_if != '') || (data.disable_on_update && data.disable_on_update != '' && data.disable_on_update != undefined && data.disable_on_update != null) || (data.disable_on_add && data.disable_on_add != '' && data.disable_on_add != undefined && data.disable_on_add != null)){                          
                        this.disableIfFieldList.push(modifyData);
                      }                     
                      
                      this.commonFunctionService.createFormControl(stepper_of_fields, modifyData, '', "text")
                      if(data.tree_view_object && data.tree_view_object.field_name != ""){
                        let treeModifyData = JSON.parse(JSON.stringify(data.tree_view_object));                
                        treeModifyData.is_mandatory=false;
                        this.commonFunctionService.createFormControl(stepper_of_fields, treeModifyData , '', "text")
                      }
                    });
                    this.commonFunctionService.createFormControl(forControl, step, stepper_of_fields, "group")
                  } 
                }); 
                this.isStepper = true;
              }                    
              break;
            case "pdf_view" : 
              if(this.selectedRowIndex && this.selectedRowIndex != -1 && this.elements && this.elements.length > 0){
                const object = this.elements[this.selectedRowIndex];
                staticModal.push(this.commonFunctionService.getPaylodWithCriteria(element.onchange_api_params,element.onchange_call_back_field,element.onchange_api_params_criteria,object));
              }
              break;
            case "input_with_uploadfile":
              element.is_disabled = true;
              this.commonFunctionService.createFormControl(forControl, element, '', "text")
              break;
            case "grid_selection":
              if(element && element.gridColumns && element.gridColumns.length > 0){
                let colParField = JSON.parse(JSON.stringify(element));
                colParField['mendetory_fields'] = [];
                element.gridColumns.forEach(colField => {
                  if(colField && colField.is_mandatory){
                    colParField['mendetory_fields'].push(colField);
                  }
                });
                if(colParField && colParField['mendetory_fields'] && colParField['mendetory_fields'].length > 0){
                  this.gridSelectionMendetoryList.push(colParField);
                  element['mendetory_fields'] = colParField['mendetory_fields'];
                }
                this.showGridData[element.field_name] = true;
              }
              if(element && element.addNewButtonIf && element.addNewButtonIf != ''){
                this.buttonIfList.push(element);                
                element['fieldIndex'] = index;
              }
              element['showButton'] = this.checkGridSelectionButtonCondition(element,'add');
              this.commonFunctionService.createFormControl(forControl, element, '', "text");
              break;
            default:
              this.commonFunctionService.createFormControl(forControl, element, '', "text")
              break;
          }
          if(element.tree_view_object && element.tree_view_object.field_name != ""){
            let treeModifyData = JSON.parse(JSON.stringify(element.tree_view_object));                
            treeModifyData.is_mandatory=false;
            this.commonFunctionService.createFormControl(forControl, treeModifyData , '', "text")
          }
        }
        //show if handling
        if(element.show_if && element.show_if != ''){
          this.showIfFieldList.push(element);
        }
        //mendatory if handling
        if(element.mandatory_if && element.mandatory_if != ''){
          this.mendetoryIfFieldList.push(element);
        }
        //Customvalidation handling
        if(element.compareFieldName && element.compareFieldName != ''){
          this.customValidationFiels.push(element);
        }
        //disable if handling
        if((element.disable_if && element.disable_if != '') || (element.disable_on_update && element.disable_on_update != '' && element.disable_on_update != undefined && element.disable_on_update != null) || (element.disable_on_add && element.disable_on_add != '' && element.disable_on_add != undefined && element.disable_on_add != null)){                  
          this.disableIfFieldList.push(element);
        }
        element.field_class = this.commonFunctionService.getDivClass(element,this.tableFields.length);
      }
      if(this.formFieldButtons && this.formFieldButtons.length > 0){
        this.formFieldButtons.forEach(element => {
          if(element.field_name && element.field_name != ''){              
            switch (element.type) {
              case "dropdown":
                this.commonFunctionService.createFormControl(forControl, element, '', "text")
                break;
              default:
                break;
            }
          }
          if(element.show_if && element.show_if != ''){
            this.showIfFieldList.push(element);
          }
          if(element.mandatory_if && element.mandatory_if != ''){
            this.mendetoryIfFieldList.push(element);
          }
          if((element.disable_if && element.disable_if != '') || (element.disable_on_update && element.disable_on_update != '' && element.disable_on_update != undefined && element.disable_on_update != null) || (element.disable_on_add && element.disable_on_add != '' && element.disable_on_add != undefined && element.disable_on_add != null)){                  
            this.disableIfFieldList.push(element);
          }
        });
      }
      if (forControl && Object.keys(forControl).length > 0 && this.tableFields.length > 0) {
        let validators = {};
        validators['validator'] = [];
        if(this.customValidationFiels && this.customValidationFiels.length > 0){
          this.customValidationFiels.forEach(field => {
            switch (field.type) {
              case 'date':
                validators['validator'].push(this.customValidationService.checkDates(field.field_name,field.compareFieldName));
                break;
              default:
                break;
            }
          });
        }
        this.templateForm = this.formBuilder.group(forControl,validators);
        if(this.nextIndex){
          this.nextIndex = false;
          this.next();
        }
      }
      let formValueWithCustomData = this.getFormValue(true);
      let fromValue = this.getFormValue(false);
      if(this.selectContact != '' && this.tabFilterData && this.tabFilterData.length > 0 && this.tableFields && this.tableFields.length > 0){
        let selectContactObject = this.selectContact;
        let account={};
        let contact={};            
        let payload = {};
        this.tabFilterData.forEach(element => {
          if(element && element._id){
            if(element._id == this.selectContact){
              selectContactObject = element;
            }
          }          
        });
        if(selectContactObject && selectContactObject['_id']){
          contact = {
            "_id":selectContactObject['_id'],
            "name":selectContactObject['name'],
            "code":selectContactObject['serialId']
          }
          if(selectContactObject['lead']){
            account = selectContactObject['lead'];
          }
        }
        this.tableFields.forEach(element => { 
          if(element && element.field_name && element.field_name != ''){  
            let fieldName = element.field_name;       
            if(fieldName == 'account'){
              this.templateForm.get('account').setValue(account);
              if (element.onchange_api_params && element.onchange_call_back_field && !element.do_not_auto_trigger_on_edit) {
                payload = this.commonFunctionService.getPaylodWithCriteria(element.onchange_api_params, element.onchange_call_back_field, element.onchange_api_params_criteria, formValueWithCustomData) 
                if(element.onchange_api_params.indexOf("FORM_GROUP") >= 0 || element.onchange_api_params.indexOf("QTMP") >= 0){
                  payload["data"]=formValueWithCustomData;
                } 
                staticModal.push(payload);
              }
            }
            if(element.field_name == 'contact'){
              this.templateForm.get('contact').setValue(contact);
              if (element.onchange_api_params && element.onchange_call_back_field && !element.do_not_auto_trigger_on_edit) { 
                payload = this.commonFunctionService.getPaylodWithCriteria(element.onchange_api_params, element.onchange_call_back_field, element.onchange_api_params_criteria, formValueWithCustomData) 
                if(element.onchange_api_params.indexOf("FORM_GROUP") >= 0 || element.onchange_api_params.indexOf("QTMP") >= 0){
                  payload["data"]=formValueWithCustomData;
                }                  
                staticModal.push(payload);
              }
            } 
            if(element.type == 'stepper' && element.list_of_fields && element.list_of_fields.length > 0){
              element.list_of_fields.forEach(stepData => {
                if(stepData && stepData.list_of_fields && stepData.list_of_fields.length > 0){
                  stepData.list_of_fields.forEach(data => {
                    if(data.field_name == 'account'){
                      this.templateForm.get(stepData.field_name).get('account').setValue(account);
                      if (data.onchange_api_params && data.onchange_call_back_field && !data.do_not_auto_trigger_on_edit) { 
                        payload = this.commonFunctionService.getPaylodWithCriteria(data.onchange_api_params, data.onchange_call_back_field, data.onchange_api_params_criteria, formValueWithCustomData) 
                        if(data.onchange_api_params.indexOf("FORM_GROUP") >= 0 || data.onchange_api_params.indexOf("QTMP") >= 0){
                          payload["data"]=formValueWithCustomData;
                        }  
                        staticModal.push(payload);
                      }
                    }
                    if(data.field_name == 'contact'){
                      if (data.onchange_api_params && data.onchange_call_back_field && !data.do_not_auto_trigger_on_edit) { 
                        payload = this.commonFunctionService.getPaylodWithCriteria(data.onchange_api_params, data.onchange_call_back_field, data.onchange_api_params_criteria, formValueWithCustomData) 
                        if(data.onchange_api_params.indexOf("FORM_GROUP") >= 0 || data.onchange_api_params.indexOf("QTMP") >= 0){
                          payload["data"]=formValueWithCustomData;
                        }  
                        staticModal.push(payload);
                      }
                    } 
                  });
                }
              });
            }   
          }          
        });            
      }
      if(this.tableFields.length > 0 && this.editedRowIndex == -1){
        this.getStaticData(staticModal,formValueWithCustomData,fromValue);               
      }
    }    
    if (this.tableFields.length > 0 && this.pageLoading) {
      this.tableFields.forEach(element => {
        switch (element.type) {
          case "typeahead":
            if (element.datatype == 'list_of_object') {
              this.tempVal[element.field_name + "_add_button"] = true;
            }
            break;
          case "list_of_string":
            this.tempVal[element.field_name + "_add_button"] = true;
            break;
          case "list_of_fields":
          case "group_of_fields":
            if(element.list_of_fields != undefined && element.list_of_fields != null && element.list_of_fields.length > 0){
              element.list_of_fields.forEach(child => {
                if(child && child != null){
                  switch (child.type) {
                    case "typeahead":
                      if (child.datatype == 'list_of_object') {
                        this.tempVal[element.field_name + '_' + child.field_name + "_add_button"] = true;
                      }
                      break;
                    case "list_of_string":
                      this.tempVal[element.field_name + '_' + child.field_name + "_add_button"] = true;
                      break;                  
                    default:
                      break;
                  }
                }
              });
            }
            break;
          case "stepper":
            if(element.list_of_fields != undefined && element.list_of_fields != null && element.list_of_fields.length > 0){
              element.list_of_fields.forEach(step => {
                if(step.list_of_fields != undefined && step.list_of_fields != null && step.list_of_fields.length > 0){
                  step.list_of_fields.forEach(child => {
                    switch (child.type) {
                      case "typeahead":
                        if (child.datatype == 'list_of_object') {
                          this.tempVal[step.field_name + '_' + child.field_name + "_add_button"] = true;
                        }
                        break;
                      case "list_of_string":
                        this.tempVal[step.field_name + '_' + child.field_name + "_add_button"] = true;
                        break;                  
                      default:
                        break;
                    }
                  });
                }                  
              });
            }
            break;
          default:
            break;
        }
      });
      this.pageLoading = false;
    }    
  }
  setDefaultDate(element){
    let value:any = "";
    let today = new Date();
    today.setHours(0,0,0,0);
    let yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0,0,0,0);
    switch (element.defaultValue) {
      case "Today":
        value = today;
        break;
      case "Yesterday":
        value = yesterday;
        break;
      default:
        break;
    }
    return value;
  }
  notifyFieldValueIsNull(formName,fieldNo){
    let msg = "Field No. "+ fieldNo + " value is null";
    this.notificationService.notify("bg-danger",msg);
    this.tableFields = [];
    this.closeModal();
  }
  customValidationFiels=[];
  setStaticData(staticDatas){   
    if(staticDatas && Object.keys(staticDatas).length > 0) {
      Object.keys(staticDatas).forEach(key => {  
        let staticData = {};
        staticData[key] = staticDatas[key];   
        if(staticData['staticDataMessgae'] != null && staticData['staticDataMessgae'] != ''){
          this.notificationService.notify("bg-danger", staticData['staticDataMessgae']);
          // const fieldName = {
          //   "field" : "staticDataMessgae"
          // }
          // this.apiService.ResetStaticData(fieldName);
        }        
        if(key && key != 'null' && key != 'FORM_GROUP' && key != 'CHILD_OBJECT' && key != 'COMPLETE_OBJECT' && key != 'FORM_GROUP_FIELDS'){
          if(staticData[key]) { 
            this.staticData[key] = JSON.parse(JSON.stringify(staticData[key]));
          }
        }        
        if(this.editorTypeFieldList && this.editorTypeFieldList.length > 0){
          this.editorTypeFieldList.forEach(element => {
            switch (element.type) {              
              case 'pdf_view':
                if(Array.isArray(staticData[element.ddn_field]) && staticData[element.ddn_field] != null){
                  const data = staticData[element.ddn_field][0];
                  if(data['bytes'] && data['bytes'] != '' && data['bytes'] != null){
                    const arrayBuffer = data['bytes'];
                    this.pdfViewLink = arrayBuffer;
                    this.pdfViewListData = JSON.parse(JSON.stringify(staticData[element.ddn_field]))
                  }
                }else{
                  this.pdfViewLink = '';
                }             
                break;
              case 'info_html':              
                if(staticData[element.ddn_field] && staticData[element.ddn_field] != null){
                  this.templateForm.controls[element.field_name].setValue(staticData[element.ddn_field]);
                  if(this.filePreviewFields && this.filePreviewFields.length > 0){
                    this.showSidebar = true;
                  }
                }
                break;
              case 'html_view':
                if(staticData[element.ddn_field] && staticData[element.ddn_field] != null){
                  this.templateForm.controls[element.field_name].setValue(staticData[element.ddn_field])
                }
                break;
              default:              
                break;
            }
          }) 
        } 
        if(staticData["FORM_GROUP"] && staticData["FORM_GROUP"] != null){          
          this.updateDataOnFormField(staticData["FORM_GROUP"]);      
        }

        if(staticData["CHILD_OBJECT"] && staticData["CHILD_OBJECT"] != null){
          this.updateDataOnFormField(staticData["CHILD_OBJECT"]); 
        }

        if(staticData["COMPLETE_OBJECT"] && staticData["COMPLETE_OBJECT"] != null){
          if(this.curFormField && this.curFormField.resetFormAfterQtmp){
            this.resetForm();
            this.curFormField = {};
            this.curParentFormField = {};
          }
          this.updateDataOnFormField(staticData["COMPLETE_OBJECT"]);          
          this.selectedRow = staticData["COMPLETE_OBJECT"];
          this.complete_object_payload_mode = true;      
        }

        if(staticData["FORM_GROUP_FIELDS"] && staticData["FORM_GROUP_FIELDS"] != null){
          this.updateDataOnFormField(staticData["FORM_GROUP_FIELDS"]);
        }
        if (this.checkBoxFieldListValue.length > 0 && Object.keys(staticData).length > 0) {
          this.setCheckboxFileListValue();
        }
      });
    }
  }
  setCheckboxFileListValue() {
    this.checkBoxFieldListValue.forEach(element => {
      let checkCreatControl: any;
      if (element.parent) {
        checkCreatControl = this.templateForm.get(element.parent).get(element.field_name);
      } else {
        checkCreatControl = this.templateForm.get(element.field_name);
      }
      if (this.staticData[element.ddn_field] && checkCreatControl.controls && checkCreatControl.controls.length == 0) {
        let checkArray: FormArray;
        if (element.parent) {
          checkArray = this.templateForm.get(element.parent).get(element.field_name) as FormArray;
        } else {
          checkArray = this.templateForm.get(element.field_name) as FormArray;
        }
        this.staticData[element.ddn_field].forEach((data, i) => {
          if (this.updateMode) {
            let arrayData;
            if (element.parent) {
              arrayData = this.selectedRow[element.parent][element.field_name];
            } else {
              arrayData = this.selectedRow[element.field_name];
            }
            let selected = false;
            if (arrayData != undefined && arrayData != null) {
              for (let index = 0; index < arrayData.length; index++) {
                if (this.checkObjecOrString(data) == this.checkObjecOrString(arrayData[index])) {
                  selected = true;
                  break;
                }
              }
            }
            if (selected) {
              checkArray.push(new FormControl(true));
            } else {
              checkArray.push(new FormControl(false));
            }
          } else {
            checkArray.push(new FormControl(false));
          }
        });
      }
    });
  }

  setGridRowDeleteResponce(responce){
    if(responce && responce['success']){
      this.notificationService.notify("bg-success", responce["success"]+" Data deleted successfull !!!");
      this.dataSaveInProgress = true;
    }
  }

  setSaveResponce(saveFromDataRsponce){
    if (saveFromDataRsponce) {
      if (saveFromDataRsponce.success && saveFromDataRsponce.success != '' && this.showNotify) {
        if (saveFromDataRsponce.success == 'success' && !this.updateMode) {
          if(this.currentActionButton && this.currentActionButton.onclick && this.currentActionButton.onclick.success_msg && this.currentActionButton.onclick.success_msg != ''){
            this.notificationService.notify("bg-success", this.currentActionButton.onclick.success_msg);
          }else if(saveFromDataRsponce.success_msg && saveFromDataRsponce.success_msg != ''){
            this.notificationService.notify("bg-success", saveFromDataRsponce.success_msg);
          }else{
            this.notificationService.notify("bg-success", " Form Data Save successfull !!!");
          }
          
          this.checkBeforeResetForm();
          this.dataListForUpload = {}
          this.saveResponceData = saveFromDataRsponce.data;
        } else if (saveFromDataRsponce.success == 'success' && this.updateMode) {
          if(this.currentActionButton && this.currentActionButton.onclick && this.currentActionButton.onclick.success_msg && this.currentActionButton.onclick.success_msg != ''){
            this.notificationService.notify("bg-success", this.currentActionButton.onclick.success_msg);
          }else if(saveFromDataRsponce.success_msg && saveFromDataRsponce.success_msg != ''){
            this.notificationService.notify("bg-success", saveFromDataRsponce.success_msg);
          }else{
            this.notificationService.notify("bg-success", " Form Data Update successfull !!!");
          }
          if(this.nextIndex){              
            this.next();
          }else{
            this.checkBeforeResetForm();
            this.updateMode = false;
          }                     
          this.custmizedFormValue = {};  
          this.modifyCustmizedFormValue = {};
          this.dataListForUpload = {} 
          this.saveResponceData = saveFromDataRsponce.data;
        }        
        if(this.isStepper){
          this.stepper.reset();
        }
        if(this.envService.getRequestType() == 'PUBLIC'){
          this.complete_object_payload_mode = false;
          let _id = this.saveResponceData["_id"];
          if(this.coreFunctionService.isNotBlank(this.form["details"]) && this.coreFunctionService.isNotBlank(this.form["details"]["on_success_url_key"] != "")){
            let public_key = this.form["details"]["on_success_url_key"]
            const data = {
              "obj":public_key,
              "key":_id,
              "key1": "key2",
              "key2" : "key3",
            }
            let payloaddata = {};
            this.storageService.removeDataFormStorage();
            const getFormData = {
              data: payloaddata,
              _id:_id
            }
            getFormData.data=data;
            this.apiService.GetForm(getFormData);
            let navigation_url = "pbl/"+public_key+"/"+_id+"/ie09/cnf00v";
            this.router.navigate([navigation_url]);
          }else{
            this.router.navigate(["home_page"]);
          }
         
        }
        this.showNotify = false;
        this.dataSaveInProgress = true;
        this.apiService.ResetSaveResponce()
        this.checkOnSuccessAction();
      }
      else if (saveFromDataRsponce.error && saveFromDataRsponce.error != '' && this.showNotify) {
        this.notificationService.notify("bg-danger", saveFromDataRsponce.error);
        this.showNotify = false;
        this.dataSaveInProgress = true;
        this.apiService.ResetSaveResponce()
      }
      else{
        this.notificationService.notify("bg-danger", "No data return");
        this.dataSaveInProgress = true;
      }
    }
    // this.unsubscribe(this.saveResponceSubscription);
    this.saveResponceSubscription.unsubscribe();
  }
  setGridFilterData(gridFilterData){
    if (gridFilterData) {
      if (gridFilterData.data && gridFilterData.data.length > 0) {
        this.tabFilterData = JSON.parse(JSON.stringify(gridFilterData.data));          
      } else {
        this.tabFilterData = [];
      }
    }
  }
  setTypeaheadData(typeAheadData){
    if (typeAheadData && typeAheadData.length > 0) {
      this.typeAheadData = typeAheadData;
    } else {
      this.typeAheadData = [];
    }
  }
  setDinamicForm(form){
    if(form && form.DINAMIC_FORM){
      this.dinamic_form = form.DINAMIC_FORM;
      if(this.formName == 'DINAMIC_FORM' && this.getTableField){
        this.grid_view_mode = this.dinamic_form.view_mode
        this.form = this.dinamic_form
        this.setForm();
      }        
    }
  }
  setFileData(getfileData){
    if (getfileData != '' && getfileData != null && this.checkForDownloadReport) {
      let link = document.createElement('a');
      link.setAttribute('type', 'hidden');

      const file = new Blob([getfileData.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(file);
      link.href = url;
      link.download = getfileData.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      // this.downloadPdfCheck = '';
      this.dataSaveInProgress = true;
      this.checkForDownloadReport = false;
      this.dataSaveInProgress = true;
      this.apiService.ResetFileData();
    }
  }
  setFileDownloadUrl(fileDownloadUrl){
    if (fileDownloadUrl != '' && fileDownloadUrl != null && this.downloadClick != '') {
      let link = document.createElement('a');
      link.setAttribute('type', 'hidden');
      // const file = new Blob([exportExcelLink], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      // const url = window.URL.createObjectURL(file);
      link.href = fileDownloadUrl;
      link.download = this.downloadClick;
      document.body.appendChild(link);
      link.click();
      link.remove();
      this.downloadClick = '';
      this.dataSaveInProgress = true;
      this.apiService.ResetDownloadUrl();
    }
  }
  setDinamicApiResponce(responce){
    if(responce){
      const companyResult = responce.result
      if(companyResult){
        this.fieldApiValidaton = companyResult.sts
      }else{
        this.fieldApiValidaton = "inactive"
      }   
      this.fieldApiValMsg = responce.message;
    }
  }
  formControlChanges(){
    if(this.templateForm && this.templateForm.valueChanges && this.templateForm.valueChanges != null){
      this.templateForm.valueChanges.subscribe(val => {
        this.handleDisabeIf();
      });
    }    
  }
  focusField(parent,key){
    const  id = key._id + "_" + key.field_name;
    let field:any = {};
    if(parent == ''){
      if(this.focusFieldParent && this.focusFieldParent.field_name && this.focusFieldParent.field_name != ''){
        parent = this.focusFieldParent;
      }
    }
    if(parent != ""){
      field = this.templateForm.get(parent.field_name).get(key.field_name);
    }else{
      field = this.templateForm.get(key.field_name);
    }
    if(field && field.touched){
      this.checkFormFieldAutfocus = false;
      if(this.previousFormFocusField && this.previousFormFocusField._id){
        this.previousFormFocusField = {};
        this.focusFieldParent={};
      }
    }else if(field == undefined){
      this.previousFormFocusField = {};
      this.focusFieldParent={};
    }
    const invalidControl = document.getElementById(id);
    if(invalidControl != null){
      invalidControl.focus();
      this.checkFormFieldAutfocus = false;
      if(this.previousFormFocusField && this.previousFormFocusField.type == 'list_of_fields' && this.previousFormFocusField.datatype == 'list_of_object_with_popup'){
        this.previousFormFocusField = {};
      }
    }
  }
  handleDisabeIf(){
    this.getFocusFieldAndFocus();
    this.checkFormFieldIfCondition(); 
  }
  getFocusFieldAndFocus(){
    if(this.checkFormFieldAutfocus && this.tableFields.length > 0){
      if(this.previousFormFocusField && this.previousFormFocusField._id){
        this.focusField("",this.previousFormFocusField)        
      }else{
        if(this.previousFormFocusField == undefined || this.previousFormFocusField._id == undefined){
          for (const key of this.tableFields) {
            if(key.type == "stepper"){
              if(key.list_of_fields && key.list_of_fields != null && key.list_of_fields.length > 0){
                for (const step of key.list_of_fields) {
                  if(step.list_of_fields && step.list_of_fields != null && step.list_of_fields.length > 0){
                    for (const field of step.list_of_fields) {
                      if (field.field_name) {
                        this.focusField(step,field);  
                        break;
                      }
                    }
                  }                
                }
              }
            }else if (key.field_name) {
              if(key.type == 'text'){
                this.focusField("",key);                                
                break;
              }else{
                this.checkFormFieldAutfocus = false;
                break;
              }
            }            
          }
        }
      }
    }
  }
  checkFormFieldIfCondition(){
    if(this.buttonIfList.length > 0){
      this.buttonIfList.forEach(element => {
        let fieldIndex = element['fieldIndex'];
        this.tableFields[fieldIndex]['showButton'] = this.checkGridSelectionButtonCondition(element,'add');
      });
    }
    if(this.disableIfFieldList.length > 0){
      this.disableIfFieldList.forEach(element => {
        if(element.parent && element.parent != undefined && element.parent != '' && element.parent != null ){
          this.isDisable(element.parent,element);
        }else{
          this.isDisable('',element)
        }
      });
    }
    if(this.mendetoryIfFieldList.length > 0){
      this.mendetoryIfFieldList.forEach(element => {
        if(element.parent && element.parent != undefined && element.parent != '' && element.parent != null ){
          this.isMendetory(element.parent,element);
        }else{
          this.isMendetory('',element)
        }
      });
    }
    if(this.showIfFieldList.length > 0){
      this.showIfFieldList.forEach(element => {
        let id = '';
        let parentFieldName = '';
        let parentIndex = -1;
        let fieldIndex = -1;
        if(element.parent && element.parent != undefined && element.parent != '' && element.parent != null ){
          id = element._id;
          parentFieldName = element.parent;
          parentIndex = element.parentIndex;
          fieldIndex = element.currentIndex;
          this.tableFields[parentIndex].list_of_fields[fieldIndex]['notDisplay'] = this.checkShowIfListOfFiedlds(parentFieldName,element);
        }else{
          id = element._id;
        }
        let elementDetails = document.getElementById(id);
        if(!this.showIf(element)){          
          if(elementDetails && elementDetails != null){
            const classes = Array.from(elementDetails.classList)
            if(!classes.includes('d-none')){
              this.removeClass(elementDetails,' d-inline-block');
              elementDetails.className += " d-none";
              element['show'] = false;
              const objectValue = this.templateForm.getRawValue();
              if(element.type != "group_of_fields" && element.type != "list_of_fields" && objectValue[element.field_name] && objectValue[element.field_name] != ''){
                this.templateForm.get(element.field_name).setValue('');
              } 
              if(element.type == "group_of_fields" || element.type == "list_of_fields"){
                this.templateForm.get(element.field_name).reset();
                element.list_of_fields.forEach(field => {
                  if(field.type == 'list_of_string' || field.datatype == "list_of_object" || element.datatype == "chips" || element.datatype == "chips_with_mask"){
                    const custmizedKey = this.commonFunctionService.custmizedKey(element);            
                    if (this.custmizedFormValue[custmizedKey]){ 
                      if (this.custmizedFormValue[custmizedKey][field.field_name]) this.custmizedFormValue[custmizedKey][field.field_name] = [];
                    }
                  }
                });
              }  
              if(element.type == 'list_of_string' || element.datatype == "list_of_object" || element.datatype == "chips" || element.datatype == "chips_with_mask"){
                if (this.custmizedFormValue[element.field_name]) this.custmizedFormValue[element.field_name] = [];
              }         
              if(element.is_mandatory){
                if(this.templateFormControl[element.field_name].status == 'INVALID'){
                  this.templateForm.get(element.field_name).clearValidators();
                  this.templateForm.get(element.field_name).updateValueAndValidity();
                }              
              }
            }            
          }                
        }else{          
          if(elementDetails && elementDetails != null){
            const classes = Array.from(elementDetails.classList)
            if(!classes.includes('d-inline-block')){
              this.removeClass(elementDetails,' d-none');
              elementDetails.className += " d-inline-block"; 
              element['show'] = true;
              if(element.is_mandatory){
                if(this.templateFormControl[element.field_name].status == 'VALID'){
                  this.templateForm.get(element.field_name).setValidators([Validators.required]);
                  this.templateForm.get(element.field_name).updateValueAndValidity();
                }              
              }
            }            
          }
        }
      });
      return true;
    }      
    if(this.disableIfFieldList.length == 0 && this.showIfFieldList.length == 0){
      return true;
    } 
  }
  removeClass = (element, name) => {    
    element.className = element.className.replace(name, "");
  }
  modifiedGridColumns(gridColumns){
    if(gridColumns.length > 0){     
      gridColumns.forEach(field => {
        if(this.coreFunctionService.isNotBlank(field.show_if)){
          if(!this.showIf(field)){
            field['display'] = false;
          }else{
            field['display'] = true;
          }                
        }else{
          field['display'] = true;
        }
      });
    }
    return gridColumns;
  }

  checkDataAlreadyAddedInListOrNot(field,incomingData,alreadyDataAddedlist,i?){
    if(field && field.type == "date"){
      incomingData = ""+incomingData;
    }
    let checkStatus = {
      status : false,
      msg : ""
    };
    if(field && field.allowDuplicacy){
      checkStatus.status = false;
      return checkStatus;
    }else{
      let primary_key = field.field_name
      let criteria = primary_key+"#eq#"+incomingData;
      let primaryCriteriaList=[];
      primaryCriteriaList.push(criteria);
      if(field && field.primaryKeyCriteria && Array.isArray(field.primaryKeyCriteria) && field.primaryKeyCriteria.length > 0){
        field.primaryKeyCriteria.forEach(criteria => {          
          const crList = criteria.split("#");
          const cr = crList[0]+"#"+crList[1]+"#"+incomingData;
          primaryCriteriaList.push(cr);
        });
      }
      if(alreadyDataAddedlist == undefined){
        alreadyDataAddedlist = [];
      }
      let alreadyExist = false;
      if(typeof incomingData == 'object'){
        alreadyDataAddedlist.forEach(element => {
          if(element._id == incomingData._id){
            alreadyExist =  true;
          }
        });
      }
      else if(typeof incomingData == 'string'){
        for (let index = 0; index < alreadyDataAddedlist.length; index++) {
          const element = alreadyDataAddedlist[index];
          if(i == undefined || i == -1){
            if(typeof element == 'string'){
              if(element == incomingData){
                alreadyExist =  true;
              }
            }else{
              if(primaryCriteriaList && primaryCriteriaList.length > 0){
                for (let index = 0; index < primaryCriteriaList.length; index++) {
                  const cri = primaryCriteriaList[index];
                  alreadyExist = this.commonFunctionService.checkIfCondition(cri,element,field.type);
                  if(alreadyExist){
                    const crList = cri.split("#");
                    switch (crList[1]) {
                      case "lte":
                        checkStatus.msg = "Entered value for "+field.label+" is gretter then to "+crList[0]+". !!!";
                        break;
                      case "gte":
                        checkStatus.msg = "Entered value for "+field.label+" is less then to "+crList[0]+". !!!";
                        break;                  
                      default:
                        checkStatus.msg = "Entered value for "+field.label+" is already added. !!!";
                        break;
                    }
                    break;
                  }                
                }
              }
            }
            if(alreadyExist){
              break;
            } 
          }else{
            break;
          }       
        };
      }else{
        alreadyExist =  false;
      }
      if(alreadyExist){
        checkStatus.status = true;
        return checkStatus;
      }else{
        checkStatus.status = false;
        return checkStatus;
      }
    }
    
  }
  
  setValue(parentfield,field, add,event?) {

    let formValue = this.templateForm.getRawValue();
    let formValueWithoutCustomData = this.getFormValue(false);
    let formValueWithCustomData = this.getFormValue(true);
    this.curFormField = field;
    this.curParentFormField = parentfield; 
    switch (field.type) {
      case "list_of_string":
        if (add) {
          if(parentfield != ''){
            const custmizedKey = this.commonFunctionService.custmizedKey(parentfield);   
            const value = formValue[parentfield.field_name][field.field_name]
            const checkDublic = this.checkDataAlreadyAddedInListOrNot(field,value, this.custmizedFormValue[custmizedKey]?.[field.field_name] ?? undefined);
            if(this.custmizedFormValue[custmizedKey] && this.custmizedFormValue[custmizedKey][field.field_name] && checkDublic.status){
              this.notificationService.notify('bg-danger','Entered value for '+field.label+' is already added. !!!');
            }else{
              if (!this.custmizedFormValue[custmizedKey]) this.custmizedFormValue[custmizedKey] = {};
              if (!this.custmizedFormValue[custmizedKey][field.field_name]) this.custmizedFormValue[custmizedKey][field.field_name] = [];
              const custmizedFormValueParant = Object.assign([],this.custmizedFormValue[custmizedKey][field.field_name])
              if(value != '' && value != null){
                custmizedFormValueParant.push(value)            
                this.custmizedFormValue[custmizedKey][field.field_name] = custmizedFormValueParant;
              }
              if(event){
                event.value = '';
              }
              this.templateForm.get(parentfield.field_name).get(field.field_name).setValue("");
              //(<FormGroup>this.templateForm.controls[parentfield.field_name]).controls[field.field_name].patchValue("");
              this.tempVal[parentfield.field_name + '_' + field.field_name + "_add_button"] = true;
            }
            
          }else{
            const value = formValue[field.field_name];
            const checkDublic = this.checkDataAlreadyAddedInListOrNot(field,value,this.custmizedFormValue[field.field_name]);
            if(this.custmizedFormValue[field.field_name] && checkDublic.status){
              this.notificationService.notify('bg-danger','Entered value for '+field.label+' is already added. !!!');
            }else{
              if (!this.custmizedFormValue[field.field_name]) this.custmizedFormValue[field.field_name] = [];
              const custmizedFormValue = Object.assign([],this.custmizedFormValue[field.field_name])
              if(formValue[field.field_name] != '' && formValue[field.field_name] != null){
                custmizedFormValue.push(formValue[field.field_name])
                this.custmizedFormValue[field.field_name] = custmizedFormValue;
              }
              if(event){
                event.value = '';
              }
              this.templateForm.controls[field.field_name].setValue("");
              this.tempVal[field.field_name + "_add_button"] = true;
            }
          }  
        } else {
          if(parentfield != ''){
            if(formValue && formValue[parentfield.field_name] && formValue[parentfield.field_name][field.field_name].length > 0){
              this.tempVal[parentfield.field_name + '_' + field.field_name + "_add_button"] = false;
            }else{
              this.tempVal[parentfield.field_name + '_' + field.field_name + "_add_button"] = true;
            }            
          }else{
            if(formValue && formValue[field.field_name] && formValue[field.field_name].length > 0){
              this.tempVal[field.field_name + "_add_button"] = false;
            }else{
              this.tempVal[field.field_name + "_add_button"] = true;
            }
          } 
        }
        break;
      case "typeahead":
        if(field.datatype == 'list_of_object' || field.datatype == 'chips' || field.datatype == 'object'){
          if (add) {
            if(parentfield != ''){
              const value = formValue[parentfield.field_name][field.field_name]
              const custmizedKey = this.commonFunctionService.custmizedKey(parentfield);
              const checkDublic = this.checkDataAlreadyAddedInListOrNot(field,value, this.custmizedFormValue[custmizedKey]?.[field.field_name] ?? undefined);
              if(this.custmizedFormValue[custmizedKey] && this.custmizedFormValue[custmizedKey][field.field_name] && checkDublic.status){
                this.notificationService.notify('bg-danger','Entered value for '+field.label+' is already added. !!!');
              }else{
                if (!this.custmizedFormValue[custmizedKey]) this.custmizedFormValue[custmizedKey] = {};
                if (!this.custmizedFormValue[custmizedKey][field.field_name]) this.custmizedFormValue[custmizedKey][field.field_name] = [];
                const custmizedFormValueParant = Object.assign([],this.custmizedFormValue[custmizedKey][field.field_name])
                custmizedFormValueParant.push(value)            
                this.custmizedFormValue[custmizedKey][field.field_name] = custmizedFormValueParant;
                if(event){
                  event.value = '';
                }
                this.templateForm.get(parentfield.field_name).get(field.field_name).setValue("");
                //(<FormGroup>this.templateForm.controls[parentfield.field_name]).controls[field.field_name].patchValue("");
                this.tempVal[parentfield.field_name + '_' + field.field_name + "_add_button"] = true;
              }
              
            }else{
              const value = formValue[field.field_name];
              const checkDublic = this.checkDataAlreadyAddedInListOrNot(field,value,this.custmizedFormValue[field.field_name]);
                if(this.custmizedFormValue[field.field_name] && checkDublic.status){
                  this.notificationService.notify('bg-danger','Entered value for '+field.label+' is already added. !!!');
                }else{
                  if (!this.custmizedFormValue[field.field_name]) this.custmizedFormValue[field.field_name] = [];
                  const custmizedFormValue = Object.assign([],this.custmizedFormValue[field.field_name])
                  custmizedFormValue.push(value)
                  this.custmizedFormValue[field.field_name] = custmizedFormValue;
                  if(event){
                    event.value = '';
                  }             
                  this.templateForm.controls[field.field_name].setValue('');
                  this.tempVal[field.field_name + "_add_button"] = true;
                }
            }  
          }else {
            if(parentfield != ''){
              const value = formValue[parentfield.field_name][field.field_name]  
              if(value == "add_new"){
                this.templateForm.get(parentfield.field_name).get(field.field_name).setValue("");
                //(<FormGroup>this.templateForm.controls[parentfield.field_name]).controls[field.field_name].patchValue("");
                this.storeFormDetails(parentfield,field);
              }else{            
                this.tempVal[parentfield.field_name + '_' + field.field_name + "_add_button"] = false;
              }
            }else{  
              const value = formValue[field.field_name]; 
              if(value == "add_new"){
                this.templateForm.controls[field.field_name].setValue('');
                this.storeFormDetails(parentfield,field);
              }else if(field.datatype == 'object' && field.onchange_get_next_form){
                this.onchangeNextForm = true;
                const reqCriteria = ["_id;eq;" + value._id + ";STATIC"];
                const reqParams = field.api_params;
                this.getDataForNextForm(reqParams,reqCriteria);
                this.tempVal[field.field_name + "_add_button"] = false;
              }else{           
                this.tempVal[field.field_name + "_add_button"] = false;
              }
            }          
          }
        }else if(field.datatype == 'text'){
          let typeaheadTextControl:any = {}
          if(parentfield != ''){
            typeaheadTextControl = this.templateForm.get(parentfield.field_name).get(field.field_name);    
          }else{
            typeaheadTextControl = this.templateForm.controls[field.field_name];
          } 
          typeaheadTextControl.setErrors(null);
        }
        break;
      case "dropdown":
        if(!add){
          let value:any='';
          if(parentfield != ''){            
            if(field.multi_select){
              const fValue:any = formValue[parentfield.field_name][field.field_name];
              if(fValue && fValue.length > 0){
                fValue.forEach(element => {
                  if(element == "add_new"){
                    value = "add_new";
                  }
                });
              }
            }else{
              if(field.datatype == 'object'){
                value = formValue[parentfield.field_name][field.field_name]['value'];               

              }else{
                value = formValue[parentfield.field_name][field.field_name];
              }
            } 
            if(value == "add_new"){
              this.storeFormDetails(parentfield,field);
              this.templateForm.get(parentfield.field_name).get(field.field_name).setValue("");
              //(<FormGroup>this.templateForm.controls[parentfield.field_name]).controls[field.field_name].patchValue("");              
            }             
          }else{ 
            if(field.multi_select){
              const fValue:any = formValue[field.field_name];
              if(fValue && fValue.length > 0){
                fValue.forEach(element => {
                  if(element == "add_new"){
                    value = "add_new";
                  }
                });
              }
            }else{
              if(field.datatype == 'object'){
                value = formValue[field.field_name]['value'];               

              }else{
                value = formValue[field.field_name];
              }
            } 
            if(value == "add_new"){
              this.storeFormDetails(parentfield,field);
              this.templateForm.controls[field.field_name].setValue('');              
            }            
          }
        }
        break;
      case "list_of_fields":
        let list = [];
        if(this.custmizedFormValue[field.field_name]){
          list = this.custmizedFormValue[field.field_name];
        }
        let checkDublicate = this.checkDublicateOnForm(field.list_of_fields,formValue[field.field_name],list,this.listOfFieldsUpdateIndex,field);
        if (!checkDublicate.status) {
          if(this.listOfFieldsUpdateIndex != -1){
              let updateCustmizedValue = JSON.parse(JSON.stringify(this.custmizedFormValue[field.field_name]))
              Object.keys(formValue[field.field_name]).forEach(key => {
                updateCustmizedValue[this.listOfFieldsUpdateIndex][key] = formValue[field.field_name][key];
              })
              let keyName = this.commonFunctionService.custmizedKey(field);
              if(this.custmizedFormValue[keyName]){
                Object.keys(this.custmizedFormValue[keyName]).forEach(childkey => {
                  updateCustmizedValue[this.listOfFieldsUpdateIndex][childkey] = this.custmizedFormValue[keyName][childkey];
                })
              }
              if(this.dataListForUpload[keyName]){
                Object.keys(this.dataListForUpload[keyName]).forEach(childkey => {                  
                  updateCustmizedValue[this.listOfFieldsUpdateIndex][childkey] = this.modifyUploadFiles(this.dataListForUpload[keyName][childkey]);;
                })
              }
              if (this.checkBoxFieldListValue.length > 0 && Object.keys(this.staticData).length > 0) {
                this.checkBoxFieldListValue.forEach(listofcheckboxfield => {
                  const fieldName = listofcheckboxfield.field_name;
                  if (this.staticData[listofcheckboxfield.ddn_field] && formValue[field.field_name][fieldName]) {                    
                    const listOfCheckboxData = [];
                    let data = formValue[field.field_name][fieldName];                    
                    let currentData = this.staticData[listofcheckboxfield.ddn_field];
                    if(data && data.length > 0){
                      data.forEach((data, i) => {
                        if (data) {
                          listOfCheckboxData.push(currentData[i]);
                        }
                      });
                    }
                    updateCustmizedValue[this.listOfFieldsUpdateIndex][fieldName] = listOfCheckboxData;                    
                  }
                });
              }
              this.custmizedFormValue[field.field_name] =   updateCustmizedValue; 

              // This code for add list of field object modify for user view

              const modifyCustmizedFormValue = Object.assign([],this.modifyCustmizedFormValue[field.field_name]);
              let updateObject = updateCustmizedValue[this.listOfFieldsUpdateIndex];
              let modifyObject = this.gridCommonFunctionService.getModifyListOfFieldsObject(field,updateObject,field.list_of_fields);
              modifyCustmizedFormValue[this.listOfFieldsUpdateIndex] = modifyObject;
              this.modifyCustmizedFormValue[field.field_name] = modifyCustmizedFormValue;

              // This code for add list of field object modify for user view

              this.custmizedFormValue[keyName] = {};
              this.dataListForUpload[keyName] = {};
            this.refreshListofField(field,false);            
          }else{
            if(field.datatype == 'key_value'){
              if (!this.custmizedFormValue[field.field_name]) this.custmizedFormValue[field.field_name] = {};
              const listOfFieldData = formValue[field.field_name]
              if(listOfFieldData.key && listOfFieldData.key != '' && listOfFieldData.value && listOfFieldData.value != ''){
                this.custmizedFormValue[field.field_name][listOfFieldData.key] = listOfFieldData.value;
              }              
            }else{
              if (!this.custmizedFormValue[field.field_name]) this.custmizedFormValue[field.field_name] = [];
              const custmizedFormValue = Object.assign([],this.custmizedFormValue[field.field_name])
              const listOfFieldData = JSON.parse(JSON.stringify(formValue[field.field_name]))
              const keyName=field.field_name+'_'+field.type;
              if(this.custmizedFormValue[keyName]){
                Object.keys(this.custmizedFormValue[keyName]).forEach(childkey => {
                  listOfFieldData[childkey] = this.custmizedFormValue[keyName][childkey];
                })
              }
              if(this.dataListForUpload[keyName]){
                Object.keys(this.dataListForUpload[keyName]).forEach(childkey => {                 
                  listOfFieldData[childkey] = this.modifyUploadFiles(this.dataListForUpload[keyName][childkey]);
                })
              }
              if (this.checkBoxFieldListValue.length > 0 && Object.keys(this.staticData).length > 0) {
                this.checkBoxFieldListValue.forEach(listofcheckboxfield => {
                  const fieldName = listofcheckboxfield.field_name;
                  if (this.staticData[listofcheckboxfield.ddn_field] && formValue[field.field_name][fieldName]) {                    
                    const listOfCheckboxData = [];
                    let data = formValue[field.field_name][fieldName];                    
                    let currentData = this.staticData[listofcheckboxfield.ddn_field];
                    if(data && data.length > 0){
                      data.forEach((data, i) => {
                        if (data) {
                          listOfCheckboxData.push(currentData[i]);
                        }
                      });
                    }
                    listOfFieldData[fieldName] = listOfCheckboxData;                    
                  }
                });
              }
              
              custmizedFormValue.push(listOfFieldData);
              this.custmizedFormValue[field.field_name] = custmizedFormValue;

              // This code for add list of field object modify for user view
              const modifyCustmizedFormValue = Object.assign([],this.modifyCustmizedFormValue[field.field_name]);
              let modifyObject = this.gridCommonFunctionService.getModifyListOfFieldsObject(field,listOfFieldData,field.list_of_fields);
              modifyCustmizedFormValue.push(modifyObject);
              this.modifyCustmizedFormValue[field.field_name] = modifyCustmizedFormValue;
              // This code for add list of field object modify for user view

              this.custmizedFormValue[keyName] = {}              
            }
            this.refreshListofField(field,true);
          }
          if(field.do_not_refresh_on_add && this.listOfFieldsUpdateIndex == -1){
            this.tableFields.forEach(tablefield => {
              if(tablefield.field_name == field.field_name){
                tablefield.list_of_fields.forEach(fld => {
                  if(!fld.do_not_refresh_on_add){
                    this.templateForm.get(tablefield.field_name).get(fld.field_name).setValue('');
                  }
                });
              }
            });
          }else{
            this.templateForm.get(field.field_name).reset(); 
          }         
        }else{
          this.notificationService.notify('bg-danger',checkDublicate.msg);
        }
        break;
      case 'grid_selection':
      case 'grid_selection_vertical':
        //----------------------this is for confirm modal to add or remove (form component confirm modal) when grid selection field is open.
        this.dataShareService.setIsGridSelectionOpenOrNot(false);
        // -------------------------------
        this.curTreeViewField = JSON.parse(JSON.stringify(field));
        this.currentTreeViewFieldParent = JSON.parse(JSON.stringify(parentfield));
        if (!this.custmizedFormValue[field.field_name]) this.custmizedFormValue[field.field_name] = [];
        let selectedData = this.getGridSelectedData(this.custmizedFormValue[field.field_name],field);
        const gridModalData = {
          "field": this.curTreeViewField,
          "selectedData":selectedData,
          "object": formValueWithCustomData
        }
        this.modalService.open('grid-selection-modal', gridModalData);
        break;
      case 'tree_view':
        this.curTreeViewField = JSON.parse(JSON.stringify(field));     
        const treeViewData = {
          "field": this.curTreeViewField,
          "selectedData":{},
          "object": formValueWithCustomData
        }
        this.modalService.open('tree-view', treeViewData);
        break;
      default:
        break;
    }
    
    if (field.onchange_api_params && field.onchange_call_back_field) {
        let multiCollection = JSON.parse(JSON.stringify(this.multipleFormCollection));
        let formValue = this.commonFunctionService.getFormDataInMultiformCollection(multiCollection,formValueWithoutCustomData);
        this.changeDropdown(field, formValue,field.onchange_data_template);
    }

    if (field.onchange_function && field.onchange_function_param && field.onchange_function_param != "") {
      switch (field.onchange_function_param) {        
          case 'autopopulateFields':
            this.limsCalculationsService.autopopulateFields(this.templateForm);
            break;
        default:
          this.inputOnChangeFunc('',field);
      }
    }
    let objectValue:string = "";
    let supporting_field_type = "";
    if(typeof formValue[field.field_name] == 'object'){
      if('COMPLETE_OBJECT' in formValue[field.field_name]){
        objectValue =formValue[field.field_name]["COMPLETE_OBJECT"];
        delete formValue[field.field_name]["COMPLETE_OBJECT"]
        this.selectedRow = objectValue;
        this.complete_object_payload_mode = true;
        supporting_field_type = "COMPLETE_OBJECT";
      } 
      if('FORM_FIELDS' in formValue[field.field_name]){
        objectValue =formValue[field.field_name]["FORM_FIELDS"];
        delete formValue[field.field_name]["FORM_FIELDS"]
      }
      if('STATIC_FIELDS' in formValue[field.field_name]){
        objectValue =formValue[field.field_name]["STATIC_FIELDS"];
        delete formValue[field.field_name]["STATIC_FIELDS"]
      }
      if(objectValue != '' && typeof objectValue == 'object'){
        this.updateDataOnFormField(objectValue);   
        if(supporting_field_type == "COMPLETE_OBJECT") {
          this.getStaticDataWithDependentData();     
        }    
      }      
    }  
    else if(parentfield && typeof formValue[parentfield.field_name][field.field_name] == 'object'){
      if('COMPLETE_OBJECT' in formValue[parentfield.field_name][field.field_name]){
        objectValue =formValue[parentfield.field_name][field.field_name]["COMPLETE_OBJECT"];
        delete formValue[parentfield.field_name][field.field_name]["COMPLETE_OBJECT"]
        this.selectedRow = objectValue;
        this.complete_object_payload_mode = true;
      } 
      if('FORM_FIELDS' in formValue[parentfield.field_name][field.field_name]){
        objectValue =formValue[parentfield.field_name][field.field_name]["FORM_FIELDS"];
        delete formValue[parentfield.field_name][field.field_name]["FORM_FIELDS"]
      }
     if(objectValue != '' && typeof objectValue == 'object'){

      Object.keys(objectValue).forEach(key => {
        this.templateForm.get(parentfield.field_name).get(key).setValue(objectValue[key]);
      });    
      }      
    }  
 
    if (field.type == 'typeahead') {
      this.clearTypeaheadData();
    }
    this.term = {};
    this.checkFormFieldIfCondition();
  } 
  getGridSelectedData(data,field){
    let gridSelectedData = [];
    if (!this.customEntryData[field.field_name]) this.customEntryData[field.field_name] = [];
    this.customEntryData[field.field_name] = []
    if(data && data.length > 0 && field.add_new_enabled){
      data.forEach(grid => {
        if(grid && grid.customEntry){
          this.customEntryData[field.field_name].push(grid);
        }else{
          gridSelectedData.push(grid);
        }
      });
    }else {
      gridSelectedData = data;
    }
    return gridSelectedData;
  }
  checkFieldShowOrHide(field){    
    for (let index = 0; index < this.showIfFieldList.length; index++) {
      const element = this.showIfFieldList[index];
      if(element.field_name == field.field_name){
        if(element.show){
          return true;
        }else{
          return false;
        }
      }
      
    }
  } 
  refreshListofField(field,updatemode){    
    if(field.do_not_refresh_on_add && updatemode){
      this.tableFields.forEach(tablefield => {
        if(tablefield.field_name == field.field_name){
          tablefield.list_of_fields.forEach(fld => {
            if(!fld.do_not_refresh_on_add){
              this.templateForm.get(tablefield.field_name).get(fld.field_name).setValue('');
            }
          });
        }
      });
    }else{
      this.templateForm.get(field.field_name).reset(); 
    } 
    this.listOfFieldsUpdateIndex = -1
    this.listOfFieldUpdateMode = false;
  }
  
  inputOnChangeFunc(parent,field) {
    if(parent && parent != '' && parent.field_name && parent.field_name != ""){
      field['parent'] = parent.field_name;
    }
    if(field.type == 'checkbox' || field.type == 'date'){
      if (field.onchange_api_params && field.onchange_call_back_field) {        
        let formValue = this.getFormValue(false);
        this.changeDropdown(field,  formValue,field.data_template);       
      }
    }
    if (field.onchange_function && field.onchange_function_param && field.onchange_function_param != "") {
      let toatl = 0;
      let update_field = "";
      let tamplateFormValue = this.getFormValue(true);
      let tamplateFormValue1 = this.getFormValue(false);
      let tamplateFormValue3 = this.custmizedFormValue;
      let multipleCollection = JSON.parse(JSON.stringify(this.multipleFormCollection));
      let multiFormValue = this.commonFunctionService.getFormDataInMultiformCollection(multipleCollection,tamplateFormValue)
      let calFormValue = {};
      let list_of_populated_fields = [];
      switch (field.onchange_function_param) {        
        case 'calculate_quote_amount':          
          calFormValue = this.limsCalculationsService.calculate_quotation(tamplateFormValue,"standard", field);
          this.updateDataOnFormField(calFormValue);
          break;
        case 'calculate_automotive_quotation':          
          calFormValue = this.limsCalculationsService.calculate_quotation(tamplateFormValue,"automotive" ,field);
          this.updateDataOnFormField(calFormValue);
          break;
        case 'calculate_po_row_item':          
          calFormValue = this.limsCalculationsService.calculate_po_row_item(tamplateFormValue1,"automotive" ,field);
          this.updateDataOnFormField(calFormValue);
          break;
        case 'calculate_manual_row_item':          
          calFormValue = this.limsCalculationsService.calculate_manual_row_item(tamplateFormValue1,"automotive" ,field);
          this.updateDataOnFormField(calFormValue);
          break;
        case 'update_invoice_total_on_custom_field':          
          calFormValue = this.limsCalculationsService.update_invoice_total_on_custom_field(tamplateFormValue,"automotive" ,field);
          this.updateDataOnFormField(calFormValue);
          break;      
        case 'calculate_lims_invoice':          
          calFormValue = this.limsCalculationsService.calculate_lims_invoice(tamplateFormValue,"automotive" ,field);
          this.updateDataOnFormField(calFormValue);
          break;      
        case 'calculate_lims_invoice_with_po_items':
          let val = this.limsCalculationsService.calculate_lims_invoice_with_po_items(tamplateFormValue,"","");
          this.updateDataOnFormField(val);
          break; 
        case 'calculate_lims_invoice_with_manual_items':
          let val1 = this.limsCalculationsService.calculate_lims_invoice_with_manual_items(tamplateFormValue,"",field);
          this.updateDataOnFormField(val1);
          break;         
        case 'getDateInStringFunction':
          calFormValue = this.commonFunctionService.getDateInStringFunction(tamplateFormValue);
          this.updateDataOnFormField(calFormValue); 
          break;
        case 'getTaWithCalculation':
          calFormValue = this.limsCalculationsService.getTaWithCalculation(tamplateFormValue1);
          this.updateDataOnFormField(calFormValue); 
          calFormValue = this.limsCalculationsService.calculateTotalFair(this.templateForm.getRawValue());
          this.updateDataOnFormField(calFormValue); 
          break;
        case 'funModeTravelChange':
          calFormValue = this.commonFunctionService.funModeTravelChange(tamplateFormValue1);
          this.updateDataOnFormField(calFormValue);
          calFormValue = this.limsCalculationsService.calculateTotalFair(this.templateForm.getRawValue());
          this.updateDataOnFormField(calFormValue);
          break;

      //   case 'quote_amount_via_sample_no':
      //       calFormValue = this.commonFunctionService.quote_amount_via_sample_no(tamplateFormValue,this.custmizedFormValue['quotation_param_methods']);
      //       this.updateDataOnFormField(calFormValue);
      //       break;
      //  case 'quote_amount_via_discount_percent':
      //       calFormValue = this.commonFunctionService.quote_amount_via_discount_percent(this.custmizedFormValue['quotation_param_methods'], tamplateFormValue);
      //       this.updateDataOnFormField(calFormValue);
      //       break;
        case 'samplingAmountAddition':          
            calFormValue = this.limsCalculationsService.samplingAmountAddition(tamplateFormValue);
            this.updateDataOnFormField(calFormValue);          
            break;       
        case 'populate_fields':
          list_of_populated_fields = [
            {"from":"fax","to":"billing_fax"},
            {"from":"mobile","to":"billing_mobile"},
            {"from":"phone","to":"billing_tel"},
            {"from":"city","to":"billing_city"},
            {"from":"state","to":"billing_state"},
            {"from":"country","to":"billing_country"},
            {"from":"address_line2","to":"billing_address_line2"},
            {"from":"gst_no","to":"billing_gst"},
            {"from":"email","to":"billing_contact_person_email"},
            {"from":"address_line1","to":"billing_address"},
            {"from":"pincode","to":"billing_pincode"},
            {"from":"first_name+last_name+ ","to":"billing_contact_person"},
            {"from":"account.name","to":"billing_company"},
        
          ]
          calFormValue = this.commonFunctionService.populatefields(this.templateForm.getRawValue(), list_of_populated_fields,field);
          this.updateDataOnFormField(calFormValue); 
          break;
        case 'job_card_series':
          list_of_populated_fields=[
            {"from":"tl_name.name+service_line.name+parent_company.name+/","to":"job_card_name"},
          ]
          calFormValue = this.commonFunctionService.populatefields(this.templateForm.getRawValue(), list_of_populated_fields,field);
          this.updateDataOnFormField(calFormValue); 
          break;
        case 'calculation_travel_claim_sheet':
          calFormValue = this.limsCalculationsService.calculateTotalFair(this.templateForm.getRawValue());
          this.updateDataOnFormField(calFormValue); 
          break;     
        case 'populate_fields_for_direct_order':
          list_of_populated_fields = [
            {"from":"fax","to":"billing_fax"},
            {"from":"mobile","to":"billing_mobile"},
            {"from":"phone","to":"billing_tel"},
            {"from":"city","to":"billing_city"},
            {"from":"state","to":"billing_state"},
            {"from":"country","to":"billing_country"},
            {"from":"address_line2","to":"billing_address_line2"},
            {"from":"gst_no","to":"billing_gst"},
            {"from":"email","to":"billing_contact_person_email"},
            {"from":"address_line1","to":"billing_address"},
            {"from":"pincode","to":"billing_pincode"},
            {"from":"contact.name","to":"billing_contact_person"},
            {"from":"account.name","to":"billing_company"},
        
          ]
          calFormValue = this.commonFunctionService.populatefields(this.templateForm.getRawValue(), list_of_populated_fields,field);
          this.updateDataOnFormField(calFormValue); 
          break;
        case 'populate_fields_for_new_order_flow':
          list_of_populated_fields = [
            {"from":"fax","to":"billing_fax"},
            {"from":"mobile","to":"billing_mobile"},
            {"from":"phone","to":"billing_tel"},
            {"from":"city","to":"billing_city"},
            {"from":"state","to":"billing_state"},
            {"from":"country","to":"billing_country"},
            {"from":"address_line2","to":"billing_address_line2"},
            {"from":"gst_no","to":"billing_gst"},
            {"from":"email","to":"billing_contact_person_email"},
            {"from":"address_line1","to":"billing_address"},
            {"from":"pincode","to":"billing_pincode"},
            {"from":"first_name+last_name+ ","to":"billing_contact_person"},
            {"from":"sample_booking.name","to":"billing_company"},

          ]
          calFormValue = this.commonFunctionService.populatefields(this.templateForm.getRawValue(), list_of_populated_fields,field);
          this.updateDataOnFormField(calFormValue); 
          break;
        case 'populate_fields_for_report':
          list_of_populated_fields = [
            {"from":"mobile","to":"reporting_mobile"},
            {"from":"phone","to":"reporting_tel"},
            {"from":"city","to":"reporting_city"},
            {"from":"state","to":"reporting_state"},
            {"from":"country","to":"reporting_country"},
            {"from":"gst_no","to":"reporting_gst"},
            {"from":"email","to":"reporting_contact_person_email"},
            {"from":"address_line1","to":"reporting_address"},
            {"from":"address_line2","to":"reporting_address_line2"},
            {"from":"pincode","to":"reporting_pincode"},
            {"from":"first_name+last_name+ ","to":"reporting_contact_person"},
            {"from":"account.name","to":"reporting_company"},
          ]
          calFormValue = this.commonFunctionService.populatefields(this.templateForm.getRawValue(), list_of_populated_fields,field);
          this.updateDataOnFormField(calFormValue); 
          // this.commonFunctionService.populate_fields_for_report(this.templateForm);
          break;
        case 'populate_fields_for_report_direct_order':
          list_of_populated_fields = [
            {"from":"mobile","to":"reporting_mobile"},
            {"from":"phone","to":"reporting_tel"},
            {"from":"city","to":"reporting_city"},
            {"from":"state","to":"reporting_state"},
            {"from":"country","to":"reporting_country"},
            {"from":"gst_no","to":"reporting_gst"},
            {"from":"email","to":"reporting_contact_person_email"},
            {"from":"address_line1","to":"reporting_address"},
            {"from":"address_line2","to":"reporting_address_line2"},
            {"from":"pincode","to":"reporting_pincode"},
            {"from":"contact.name","to":"reporting_contact_person"},
            {"from":"account.name","to":"reporting_company"},
          ]
          calFormValue = this.commonFunctionService.populatefields(this.templateForm.getRawValue(), list_of_populated_fields,field);
          this.updateDataOnFormField(calFormValue); 
          // this.commonFunctionService.populate_fields_for_report(this.templateForm);
          break;
        case 'populate_fields_for_report_for_new_order_flow':
          list_of_populated_fields = [
            {"from":"mobile","to":"reporting_mobile"},
            {"from":"phone","to":"reporting_tel"},
            {"from":"city","to":"reporting_city"},
            {"from":"state","to":"reporting_state"},
            {"from":"country","to":"reporting_country"},
            {"from":"gst_no","to":"reporting_gst"},
            {"from":"email","to":"reporting_contact_person_email"},
            {"from":"address_line1","to":"reporting_address"},
            {"from":"address_line2","to":"reporting_address_line2"},
            {"from":"pincode","to":"reporting_pincode"},
            {"from":"first_name+last_name+ ","to":"reporting_contact_person"},
            {"from":"sample_booking.name","to":"reporting_company"},
          ]
          calFormValue = this.commonFunctionService.populatefields(this.templateForm.getRawValue(), list_of_populated_fields,field);
          this.updateDataOnFormField(calFormValue);
          // this.commonFunctionService.populate_fields_for_report(this.templateForm);
          break;
        case 'manufactured_as_customer':
          if(field.listOfPopulatedFields && field.listOfPopulatedFields.length > 0){
            let keysList = ["from","to"]
            let seprator = ":";
            list_of_populated_fields = this.commonFunctionService.convertListOfStringToListObject(field.listOfPopulatedFields,keysList,seprator);
          }else{
            list_of_populated_fields = [
              {"from":"account.name", "to":"sample_details.mfg_by"}
            ]
          }
          let multiCollection = JSON.parse(JSON.stringify(this.multipleFormCollection));
          calFormValue = this.commonFunctionService.populatefields(this.templateForm.getRawValue(), list_of_populated_fields,field,multiCollection);
          this.updateDataOnFormField(calFormValue);
          // this.commonFunctionService.manufactured_as_customer(this.templateForm);
          break;
        case 'manufactured_as_customer_for_new_order_flow':
          list_of_populated_fields = [
            {"from":"sample_booking.name", "to":"sample_details.mfg_by"}
          ]
          calFormValue = this.commonFunctionService.populatefields(this.templateForm.getRawValue(), list_of_populated_fields,field);
          this.updateDataOnFormField(calFormValue);
          // this.commonFunctionService.manufactured_as_customer(this.templateForm);
          break;
        case 'supplied_as_customer':
          if(field.listOfPopulatedFields && field.listOfPopulatedFields.length > 0){
            let keysList = ["from","to"];
            let seprator = ":";
            list_of_populated_fields = this.commonFunctionService.convertListOfStringToListObject(field.listOfPopulatedFields,keysList,seprator);
          }else{
            list_of_populated_fields = [
              {"from":"account.name", "to":"sample_details.supplied_by"}
            ]
          }
            let multiCollection1 = JSON.parse(JSON.stringify(this.multipleFormCollection));
          calFormValue = this.commonFunctionService.populatefields(this.templateForm.getRawValue(), list_of_populated_fields,field,multiCollection1);
          this.updateDataOnFormField(calFormValue);
          // this.commonFunctionService.supplied_as_customer(this.templateForm);
          break;
        case 'supplied_as_customer_for_new_order_flow':
          list_of_populated_fields = [
            {"from":"sample_booking.name", "to":"sample_details.supplied_by"}
          ]
          calFormValue = this.commonFunctionService.populatefields(this.templateForm.getRawValue(), list_of_populated_fields,field);
          this.updateDataOnFormField(calFormValue);
          // this.commonFunctionService.supplied_as_customer(this.templateForm);
          break;
        case 'buggetForcastCalc':
          this.limsCalculationsService.buggetForcastCalc(this.templateForm);
          break;
        case 'calculate_next_calibration_due_date':
          this.limsCalculationsService.calculate_next_calibration_due_date(this.templateForm);
          break;
        case 'get_percent':
          calFormValue = this.limsCalculationsService.getPercent(this.templateForm.getRawValue(),parent, field);
          this.updateDataOnFormField(calFormValue);
          break;
        case 'CALCULATE_TOTAL_AMOUNT':
            calFormValue = this.limsCalculationsService.calculateTotalAmount(tamplateFormValue)
            this.updateDataOnFormField(calFormValue);
            break;   
        case 'checkSampleQuantity':          
          if(field && field.onchange_function_param_criteria && field.onchange_function_param_criteria != ''){
            let check = true;
            let object = {}
            let fieldName = field.field_name;
            if(this.multipleFormCollection.length > 0){
              let multipleCollection = JSON.parse(JSON.stringify(this.multipleFormCollection));
              object = this.commonFunctionService.getFormDataInMultiformCollection(multipleCollection,tamplateFormValue)
            }else{
              object = tamplateFormValue;
            }
            let value = this.commonFunctionService.getObjectValue(fieldName,object);
            if(value && value != null && value != ""){
              if(field.onchange_function_param_criteria.length > 0){
                for (let index = 0; index < field.onchange_function_param_criteria.length; index++) {
                  const cr = field.onchange_function_param_criteria[index];
                  let crList = cr.split("#");            
                  let listValue = this.commonFunctionService.getObjectValue(crList[2],object);            
                  if(listValue && listValue != null && Array.isArray(listValue) && listValue.length > 0){
                    listValue.forEach(listData => {
                      const val = +this.commonFunctionService.getObjectValue(fieldName,listData);
                      value = value + val;
                    });
                  }
                  let criteria = crList[0]+"#"+crList[1]+"#"+value;
                  check = this.commonFunctionService.checkIfCondition(criteria,object);
                  if(!check){
                    break;
                  } 
                }              
              }         
              let fieldControl = this.templateForm.controls[fieldName];
              if(!check){              
                fieldControl.setErrors({ notValid : true });
                this.notificationService.notify("bg-danger","Error! Please update the sample Qty as all samples has consumed.");
              }else{
                fieldControl.setErrors(null);
              }
            }
          }          
          break;  
        case "calculate_balance_amount_engagement_letter":
          calFormValue = this.limsCalculationsService.calculateBalanceAmountEngLetter(tamplateFormValue,multiFormValue);
          this.updateDataOnFormField(calFormValue); 
        break;

        default:
          break;
      }
    }
    this.checkFormFieldIfCondition();
  }  
  changeDropdown(field, object,data_template) {
    let params = field.onchange_api_params;
    let callback = field.onchange_call_back_field;
    let criteria = field.onchange_api_params_criteria;
    const paramlist = params.split(";");
    let multiCollection = JSON.parse(JSON.stringify(this.multipleFormCollection));
    let completeObject = this.commonFunctionService.getFormDataInMultiformCollection(multiCollection,object);
    if(paramlist.length>1){
      
    }else{
      const payloads = []      
      if( params.indexOf("CLTFN") >= 0){
        const calculatedCost =  this.limsCalculationsService.calculateAdditionalCost(this.getFormValue(true));
        this.updateDataOnFormField(calculatedCost);
      }
      else{
        payloads.push(this.checkQtmpApi(params,field,this.commonFunctionService.getPaylodWithCriteria(params, callback, criteria, completeObject,data_template))); 
        this.callStaticData(payloads);
      }
   }
  }
  checkQtmpApi(params,field,payload){
    if(params.indexOf("FORM_GROUP") >= 0 || params.indexOf("QTMP") >= 0){
      let multiCollection = JSON.parse(JSON.stringify(this.multipleFormCollection));
      if(field && field.formValueAsObjectForQtmp){            
        let formValue = this.commonFunctionService.getFormDataInMultiformCollection(multiCollection,this.getFormValue(false));
        payload["data"]=formValue;
      }else{
        let formValue = this.commonFunctionService.getFormDataInMultiformCollection(multiCollection,this.getFormValue(true));
        payload["data"]=formValue;
      }
    }
    return payload;
  }
  clearTypeaheadData() {
    this.apiService.clearTypeaheadData();
  }
  public addNewRecord:boolean = false;
  public lastTypeaheadTypeValue="";
  updateData(event, parentfield, field) {
    if(event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 13 || event.keyCode == 27 || event.keyCode == 9){
      return false;
    }    
    let objectValue = this.getFormValue(false); 
    const fieldValue = this.commonFunctionService.getObjectValue(field.field_name,objectValue)
    this.lastTypeaheadTypeValue = fieldValue;
    if(fieldValue != ''){
      this.addNewRecord = true;
    }else{
      this.addNewRecord = false;
    }
    if(field.datatype == 'text'){
      let typeaheadTextControl:any = {}
      if(parentfield != ''){
        typeaheadTextControl = this.templateForm.get(parentfield.field_name).get(field.field_name);    
      }else{
        typeaheadTextControl = this.templateForm.controls[field.field_name];
      }  
      if(objectValue[field.field_name] == null || objectValue[field.field_name] == '' || objectValue[field.field_name] == undefined){
        if(field.is_mandatory){
          typeaheadTextControl.setErrors({ required: true });
        }else{
          typeaheadTextControl.setErrors(null);
        }        
      }else{        
        typeaheadTextControl.setErrors({ validDataText: true });
      }      
    }
    this.callTypeaheadData(field,objectValue);        
    if(parentfield != ''){
      this.tempVal[parentfield.field_name + '_' + field.field_name + "_add_button"] = true;      
    }else{
      this.tempVal[field.field_name + "_add_button"] = true;
    }     

  }
  callTypeaheadData(field,objectValue){
    this.clearTypeaheadData();   
    const payload = [];
    const params = field.api_params;
    const criteria = field.api_params_criteria;
    payload.push(this.commonFunctionService.getPaylodWithCriteria(params, '', criteria, objectValue,field.data_template));
    this.apiService.GetTypeaheadData(payload);    
  }

  getOptionText(option) {
    if (option && option.name) {
      return option.name;
    }else{
      return option;
    }
  }

  openModal(id, index, parent,child, data, alertType) {
    this.deleteIndex = index;
    if(parent != ''){
      this.deletefieldName['parent'] = parent;
      this.deletefieldName['child'] = child;
    }else{
      this.deletefieldName['child'] = child;
    }
    this.commonFunctionService.openAlertModal(id,alertType,'Are You Sure ?','Delete This record.');
  }

  alertResponce(responce) {
    if (responce) {
      if(this.deletefieldName['child'] && (this.deletefieldName['child'].type == 'file' || this.deletefieldName['child'].type == 'file')){
        this.removeAttachedDataFromList(this.deletefieldName['parent'],this.deletefieldName['child'],this.deleteIndex)
      }else{
        this.deleteitem()
      }      
    } else {
      this.cancel();
    }
  }
  deleteitem() {
      const custmizedKeyChild = this.deletefieldName['child'].field_name;
      if(this.deletefieldName['parent'] != undefined && this.deletefieldName['parent'] != null && this.deletefieldName['parent'] != ''){
        const custmizedKeyParent = this.commonFunctionService.custmizedKey(this.deletefieldName['parent']) 
        let deleteCustmizedValue = JSON.parse(JSON.stringify(this.custmizedFormValue[custmizedKeyParent][custmizedKeyChild]))
        deleteCustmizedValue.splice(this.deleteIndex, 1);
        if(this.modifyCustmizedFormValue[custmizedKeyParent] && this.modifyCustmizedFormValue[custmizedKeyParent][custmizedKeyChild]) this.modifyCustmizedFormValue[custmizedKeyParent][custmizedKeyChild].splice(this.deleteIndex,1);
        this.custmizedFormValue[custmizedKeyParent][custmizedKeyChild] = deleteCustmizedValue;
      }else{

        if(this.deletefieldName['child'].datatype == 'key_value'){
          delete this.custmizedFormValue[custmizedKeyChild][this.deleteIndex];
          delete this.modifyCustmizedFormValue[custmizedKeyChild][this.deleteIndex];
        }else{
          let deleteCustmizedValue = JSON.parse(JSON.stringify(this.custmizedFormValue[custmizedKeyChild]))
          deleteCustmizedValue.splice(this.deleteIndex, 1);
          if(this.modifyCustmizedFormValue[custmizedKeyChild]) this.modifyCustmizedFormValue[custmizedKeyChild].splice(this.deleteIndex,1);
          this.custmizedFormValue[custmizedKeyChild] = deleteCustmizedValue;
          const field = this.deletefieldName['child']
          if(field.onchange_api_params != null && field.onchange_api_params != ''){
            if( field.onchange_api_params.indexOf("CLTFN") >= 0){
              const calculatedCost = this.limsCalculationsService.calculateAdditionalCost(this.getFormValue(true));
              this.updateDataOnFormField(calculatedCost);
            }
            if (field.onchange_call_back_field != '') {
              switch (field.type) {
                case 'list_of_fields':
                  let formValue = this.getFormValue(true);
                  this.changeDropdown(field, formValue,field.onchange_data_template);
                  break;              
                default:
                  break;
              }
            }
          }
          if(field.onchange_function && field.onchange_function_param && field.onchange_function_param != ""){
           this.inputOnChangeFunc('',field);
          }
          
        }        
      }
    
    // }
    this.cancel()
  }
  cancel() {    
    this.deleteIndex = "";
    this.deletefieldName = {};
    this.alertData = {};
  }
  
  getFormValue(check){    
    let formValue = this.templateForm.getRawValue();
    let selectedRow = { ...this.selectedRow };     
    let modifyFormValue = {};   
    let valueOfForm = {};
    if (this.updateMode || this.complete_object_payload_mode){      
      this.tableFields.forEach(element => {
        switch (element.type) {
          case 'stepper':
            element.list_of_fields.forEach(step => {
              if(step.list_of_fields && step.list_of_fields != null && step.list_of_fields.length > 0){
                step.list_of_fields.forEach(data => {
                  selectedRow[data.field_name] = formValue[step.field_name][data.field_name]
                  if(data.tree_view_object && data.tree_view_object.field_name != ""){                  
                    const treeViewField = data.tree_view_object.field_name;
                    selectedRow[treeViewField] = formValue[step.field_name][treeViewField]
                  }
                });
              }
            });
            break;
          case 'group_of_fields':
            element.list_of_fields.forEach(data => {
              switch (data.type) {
                case 'date':
                  if(data && data.date_format && data.date_format != ''){
                    if(typeof formValue[element.field_name][data.field_name] != 'string'){
                      selectedRow[element.field_name][data.field_name] = this.datePipe.transform(formValue[element.field_name][data.field_name],'dd/MM/yyyy');
                    }else{
                      selectedRow[element.field_name] = formValue[element.field_name];
                    }
                  }else{
                    selectedRow[element.field_name] = formValue[element.field_name];
                  }            
                  break;
              
                default:
                  selectedRow[element.field_name] = formValue[element.field_name];
                  break;
              }
            });
            break;
          case 'gmap':
          case "gmapview":
            selectedRow['latitude'] = this.latitude;
            selectedRow['longitude'] = this.longitude;
            selectedRow['address'] = this.address;
            break;
          case 'date':
            if(element && element.date_format && element.date_format != ''){
              selectedRow[element.field_name] = this.datePipe.transform(selectedRow[element.field_name],'dd/MM/yyyy');
            } else {
              selectedRow[element.field_name] = formValue[element.field_name];
            }            
            break;
          default:
            selectedRow[element.field_name] = formValue[element.field_name];
            break;
        }
      });
    }else{
      this.tableFields.forEach(element => {
        switch (element.type) {
          case 'stepper':
            element.list_of_fields.forEach(step => {
              if(step.list_of_fields && step.list_of_fields != null && step.list_of_fields.length > 0){
                step.list_of_fields.forEach(data => {
                  modifyFormValue[data.field_name] = formValue[step.field_name][data.field_name]
                  if(data.tree_view_object && data.tree_view_object.field_name != ""){                  
                    const treeViewField = data.tree_view_object.field_name;
                    modifyFormValue[treeViewField] = formValue[step.field_name][treeViewField]
                  }
                });
              }
            });
            break;
          case 'group_of_fields':
            modifyFormValue[element.field_name] = formValue[element.field_name];
            element.list_of_fields.forEach(data => {
              switch (data.type) {
                case 'date':
                  if(data && data.date_format && data.date_format != ''){
                    modifyFormValue[element.field_name][data.field_name] = this.datePipe.transform(formValue[element.field_name][data.field_name],'dd/MM/yyyy');
                  }  else {
                    modifyFormValue[element.field_name][data.field_name] = formValue[element.field_name][data.field_name];
                  }         
                  break;
              
                default:
                  modifyFormValue[element.field_name][data.field_name] = formValue[element.field_name][data.field_name];
                  break;
              }
            });
            break;
          case 'gmap':
          case "gmapview":
            modifyFormValue['latitude'] = this.latitude;
            modifyFormValue['longitude'] = this.longitude;
            modifyFormValue['address'] = this.address;
            break;
          case 'date':
            if(element && element.date_format && element.date_format != ''){
              modifyFormValue[element.field_name] = this.datePipe.transform(formValue[element.field_name],'dd/MM/yyyy');
            } else {
              modifyFormValue[element.field_name] = formValue[element.field_name];
            }           
            break;
          default:
            modifyFormValue[element.field_name] = formValue[element.field_name];
            //modifyFormValue = formValue;
            break;
        }
      });
    }
    if(check){
      Object.keys(this.custmizedFormValue).forEach(key => {
        if (this.updateMode || this.complete_object_payload_mode) {
          if(this.custmizedFormValue[key] && this.custmizedFormValue[key] != null && !Array.isArray(this.custmizedFormValue[key]) && typeof this.custmizedFormValue[key] === "object"){
            this.tableFields.forEach(element => {            
              if(element.field_name == key){
                if(element.datatype && element.datatype != null && element.datatype == 'key_value'){
                  selectedRow[key] = this.custmizedFormValue[key];
                }else{
                  Object.keys(this.custmizedFormValue[key]).forEach(child =>{
                    selectedRow[key][child] = this.custmizedFormValue[key][child];
                  })
                }
              }
            });          
          }else{
              selectedRow[key] = this.custmizedFormValue[key];
          }
        } else {
          if(this.custmizedFormValue[key] && this.custmizedFormValue[key] != null && !Array.isArray(this.custmizedFormValue[key]) && typeof this.custmizedFormValue[key] === "object"){
            this.tableFields.forEach(element => {
              if(element.field_name == key){
                if(element.datatype && element.datatype != null && element.datatype == 'key_value'){
                  modifyFormValue[key] = this.custmizedFormValue[key];
                }else{
                  Object.keys(this.custmizedFormValue[key]).forEach(child =>{
                    modifyFormValue[key][child] = this.custmizedFormValue[key][child];
                  })
                }
              }
            });          
          }else{
            modifyFormValue[key] = this.custmizedFormValue[key];
          }       
          
        }
      })
      if (this.checkBoxFieldListValue.length > 0 && Object.keys(this.staticData).length > 0) {
        this.checkBoxFieldListValue.forEach(element => {
          if (this.staticData[element.ddn_field]) {
            const listOfCheckboxData = [];
            let data = [];
            if(this.updateMode || this.complete_object_payload_mode){
              if(element.parent){
                data = selectedRow[element.parent][element.field_name];
              }else{
                data = selectedRow[element.field_name];
              }
            }else{
              if(element.parent){
                data = modifyFormValue[element.parent][element.field_name];
              }else{
                data = modifyFormValue[element.field_name];
              }
            }
            let currentData = this.staticData[element.ddn_field];
            if(data && data.length > 0){
              data.forEach((data, i) => {
                if (data) {
                  listOfCheckboxData.push(currentData[i]);
                }
              });
            }
            if (this.updateMode || this.complete_object_payload_mode) {
              if(element.parent){
                selectedRow[element.parent][element.field_name] = listOfCheckboxData;
              }else{
                selectedRow[element.field_name] = listOfCheckboxData;
              }
            } else {
              if(element.parent){
                modifyFormValue[element.parent][element.field_name] = listOfCheckboxData;
              }else{
                modifyFormValue[element.field_name] = listOfCheckboxData
              }
            }
          }
        });
      }
      Object.keys(this.dataListForUpload).forEach(key => {
        if (this.updateMode || this.complete_object_payload_mode) {
          if(this.dataListForUpload[key] && this.dataListForUpload[key] != null && !Array.isArray(this.dataListForUpload[key]) && typeof this.dataListForUpload[key] === "object"){
            this.tableFields.forEach(element => {            
              if(element.field_name == key){                
                Object.keys(this.dataListForUpload[key]).forEach(child =>{
                  selectedRow[key][child] = this.modifyUploadFiles(this.dataListForUpload[key][child]);
                })
              }
            });          
          }else{
              selectedRow[key] = this.modifyUploadFiles(this.dataListForUpload[key]);
          }
        } else {
          if(this.dataListForUpload[key] && this.dataListForUpload[key] != null && !Array.isArray(this.dataListForUpload[key]) && typeof this.dataListForUpload[key] === "object"){
            this.tableFields.forEach(element => {
              if(element.field_name == key){                
                Object.keys(this.dataListForUpload[key]).forEach(child =>{
                  modifyFormValue[key][child] = this.modifyUploadFiles(this.dataListForUpload[key][child]);
                })
              }
            });          
          }else{
            modifyFormValue[key] = this.modifyUploadFiles(this.dataListForUpload[key]);
          }       
          
        }
      })
    } 
    if(this.selectContact != '' && this.selectContact != undefined){
      let selectContactObject = {}
      let account={};
      let contact={};
      this.tabFilterData.forEach(element => {
        if(element._id == this.selectContact){
          selectContactObject = element;
        }
      });
      if(selectContactObject['_id']){
        contact = {
          "_id":selectContactObject['_id'],
          "name":selectContactObject['name'],
          "code":selectContactObject['serialId']
        }
        if(selectContactObject['lead']){
          account = selectContactObject['lead'];
        }
      }
      if(this.updateMode || this.complete_object_payload_mode){
        selectedRow['account'] = account;
        selectedRow['contact'] = contact;
      }else{
        modifyFormValue['account'] = account;
        modifyFormValue['contact'] = contact;
      }
    }
       
    valueOfForm = this.updateMode || this.complete_object_payload_mode ? selectedRow : modifyFormValue;
    if(this.routers.snapshot.params["key1"] && !this.complete_object_payload_mode){
      const index = JSON.stringify(this.routers.snapshot.params["key1"]);
      if(index != ''){
        valueOfForm['obj'] = this.routers.snapshot.params["action"];
        valueOfForm['key'] = this.routers.snapshot.params["key1"];
        valueOfForm['key1'] = this.routers.snapshot.params["key2"];
        valueOfForm['key2'] = this.routers.snapshot.params["key3"];      
        
      }
    }
    if(this.getLocation){
      if(this.center !=null && this.center.lat !=null){
        valueOfForm['locationDetail'] = {
          'latitude' : this.center.lat,
          'longitude' : this.center.lng
        }
      }
    }   
    return valueOfForm;
  }
  getSavePayloadData() {
    this.getSavePayload = false;
    this.submitted = true;
    let hasPermission;
    if(this.currentMenu && this.currentMenu.name){
      hasPermission = this.permissionService.checkPermission(this.currentMenu.name.toLowerCase( ),'add')
    }
    if(this.updateMode){
      hasPermission = this.permissionService.checkPermission(this.currentMenu.name.toLowerCase( ),'edit')
    }
    if(this.envService.getRequestType() == 'PUBLIC'){
      hasPermission = true;
    }
    let formValue;
    if(this.deleteGridRowData){
      formValue = this.templateForm.getRawValue();
    }else{
      formValue = this.commonFunctionService.sanitizeObject(this.tableFields,this.getFormValue(true),false);
    }
    this.deleteGridRowData = false;
       
    if(hasPermission){ 
      let gridSelectionValidation:any = this.checkGridSelectionMendetory();     
      if(this.templateForm.valid && gridSelectionValidation.status){
        if(this.commonFunctionService.checkCustmizedValuValidation(this.tableFields,formValue)){
          if (this.dataSaveInProgress) {
            this.showNotify = true;
            this.dataSaveInProgress = false;            
            formValue['log'] = this.storageService.getUserLog();
            if(!formValue['refCode'] || formValue['refCode'] == '' || formValue['refCode'] == null){
              formValue['refCode'] = this.commonFunctionService.getRefcode();
            } 
            if(!formValue['appId'] || formValue['appId'] == '' || formValue['appId'] == null){
              formValue['appId'] = this.commonFunctionService.getAppId();
            }
            if (this.updateMode) {              
              if(this.formName == 'cancel'){
                formValue['status'] = 'CANCELLED';
              }                                          
            }              

            const saveFromData = {
              curTemp: this.currentMenu.name,
              data: formValue
            }
            this.getSavePayload = true;
            return saveFromData;
            
          }
        }else{
          this.getSavePayload = false;
        }
      }else{
        this.getSavePayload = false;
        if(gridSelectionValidation.msg && gridSelectionValidation.msg != ''){
          this.notificationService.notify("bg-info", gridSelectionValidation.msg);
        }else{
          this.notificationService.notify("bg-danger", "Some fields are mendatory");
        }        
      }
    }else{
      this.getSavePayload = false;
      this.menuOrModuleCommounService.checkTokenStatusForPermission();
    }
  }
  saveFormData(){
    let checkValidatiaon = this.commonFunctionService.sanitizeObject(this.tableFields,this.getFormValue(false),true,this.getFormValue(true));
    if(typeof checkValidatiaon != 'object'){
      const saveFromData = this.getSavePayloadData();
      if(this.bulkupdates){
        saveFromData.data['data'] = this.bulkDataList;
        saveFromData.data['bulk_update'] = true;
      }
      if(this.getSavePayload){
        if(this.currentActionButton && this.currentActionButton.onclick && this.currentActionButton.onclick != null && this.currentActionButton.onclick.api && this.currentActionButton.onclick.api != null && this.currentActionButton.onclick.api.toLowerCase() == 'send_email'){
          this.apiService.SendEmail(saveFromData)
          this.saveCallSubscribe();
        }else{
          this.apiService.SaveFormData(saveFromData);
          this.saveCallSubscribe();
        }        
      }
    }else{
      this.notificationService.notify('bg-danger',checkValidatiaon.msg);
    }     
  }  
  checkGridSelectionMendetory(){
    let validation = {
      'status' : true,
      'msg' : ''
    }
    if(this.gridSelectionMendetoryList && this.gridSelectionMendetoryList.length > 0){
      let check = 0;
      this.gridSelectionMendetoryList.forEach(field => {        
        let data:any = [];
        if(this.custmizedFormValue[field.field_name]){
          data = this.custmizedFormValue[field.field_name];
        }
        if(field.mendetory_fields && field.mendetory_fields.length > 0){
          field.mendetory_fields = this.modifiedGridColumns(field.mendetory_fields)
          if(data && data.length > 0){
            field.mendetory_fields.forEach(mField => {
              const fieldName = mField.field_name;
              if(mField.display){
                data.forEach(row => {
                  if(row && row[fieldName] == undefined || row[fieldName] == '' || row[fieldName] == null){
                    if(validation.msg == ''){
                      validation.msg = mField.label + ' of ' + field.label+' is required.';
                    }
                    check = 1;
                  }
                });
              }
            });
          }
        }     
      });
      if(check != 0){
        validation.status = false;
        return validation;
      }else{
        return validation
      }
    }else{
      return validation;
    }
  }
  deleteGridData(){
    let checkValidatiaon = this.commonFunctionService.sanitizeObject(this.tableFields,this.getFormValue(false),true,this.getFormValue(true));
    if(typeof checkValidatiaon != 'object'){
      this.deleteGridRowData = true;
      const saveFromData = this.getSavePayloadData();
      if(this.getSavePayload){
          this.apiService.deleteGridRow(saveFromData);
      }
    }else{
      this.notificationService.notify('bg-danger',checkValidatiaon.msg);
    } 
  }
  downloadReport(){
    const downloadReportFromData = this.getSavePayloadData();
    if(downloadReportFromData != null){
      downloadReportFromData['_id'] = this.elements[this.editedRowIndex]._id;
    }
    this.checkForDownloadReport = true;
    this.apiService.GetFileData(downloadReportFromData);
  }
  downloadPdfFileFromFormdata(){
    const downloadPdfFileFromFormData = this.getSavePayloadData();
    this.saveCallSubscribe();
    if(downloadPdfFileFromFormData != null){
      downloadPdfFileFromFormData.data['_id'] = downloadPdfFileFromFormData.curTemp;
      let fileName = this.commonFunctionService.downloadPdf(downloadPdfFileFromFormData.data,downloadPdfFileFromFormData.curTemp);
      this.dataShareService.sharePdfFileName(fileName);      
    }
  }
  publicDownloadReport(){
    this.checkForDownloadReport = true;
    let publicDownloadReportFromData = {};
    let payload = {};
    if(this.coreFunctionService.isNotBlank(this.selectedRow["_id"]) && this.coreFunctionService.isNotBlank(this.selectedRow["value"])){
      publicDownloadReportFromData["_id"] = this.selectedRow["_id"];
      publicDownloadReportFromData["value"] = this.selectedRow["value"];
      payload["_id"] = this.selectedRow["_id"];
      payload["data"] = publicDownloadReportFromData;
      this.apiService.GetFileData(payload);
    }
  }
  editedRowData(object) {
    this.selectedRow = JSON.parse(JSON.stringify(object)); 
    this.updateMode = true;
    this.updateDataOnFormField(this.selectedRow);
    this.getStaticDataWithDependentData();      
    if (this.checkBoxFieldListValue.length > 0 && Object.keys(this.staticData).length > 0) {
      this.setCheckboxFileListValue();
    }
  }
  getStaticDataWithDependentData(){
    const staticModal = []
    let formValueWithCustomData = this.getFormValue(true)
    let formValue = this.getFormValue(false)
    if(this.tableFields && this.tableFields.length > 0){
      this.tableFields.forEach(element => {
        if(element.field_name && element.field_name != ''){
          if (element.onchange_api_params && element.onchange_call_back_field && !element.do_not_auto_trigger_on_edit) {
            const checkFormGroup = element.onchange_call_back_field.indexOf("FORM_GROUP");
            const checkCLTFN = element.onchange_api_params.indexOf('CLTFN')
            if(checkFormGroup == -1 && checkCLTFN == -1){

              const payload = this.commonFunctionService.getPaylodWithCriteria(element.onchange_api_params, element.onchange_call_back_field, element.onchange_api_params_criteria, formValueWithCustomData)
              if(element.onchange_api_params.indexOf('QTMP') >= 0){
                if(element && element.formValueAsObjectForQtmp){
                  payload["data"]=formValue;
                }else{
                  payload["data"]=formValueWithCustomData;
                }
              } 
              staticModal.push(payload);
            }
          }
          switch (element.type) {
            case "stepper":
              if (element.list_of_fields.length > 0) {
                element.list_of_fields.forEach((step) => {                
                  if (step.list_of_fields.length > 0) {
                    step.list_of_fields.forEach((data) => {
                      if (data.onchange_api_params && data.onchange_call_back_field && !data.do_not_auto_trigger_on_edit) {
                        const checkFormGroup = data.onchange_call_back_field.indexOf("FORM_GROUP");
                        if(checkFormGroup == -1){
              
                          const payload = this.commonFunctionService.getPaylodWithCriteria(data.onchange_api_params, data.onchange_call_back_field, data.onchange_api_params_criteria, formValueWithCustomData)
                          if(data.onchange_api_params.indexOf('QTMP') >= 0){
                            if(element && element.formValueAsObjectForQtmp){
                              payload["data"]=formValue;
                            }else{
                              payload["data"]=formValueWithCustomData;
                            }
                          } 
                          staticModal.push(payload);
                        }
                      }
                      if(data.tree_view_object && data.tree_view_object.field_name != ""){
                        let editeTreeModifyData = JSON.parse(JSON.stringify(data.tree_view_object));
                        if (editeTreeModifyData.onchange_api_params && editeTreeModifyData.onchange_call_back_field) {
                          staticModal.push(this.commonFunctionService.getPaylodWithCriteria(editeTreeModifyData.onchange_api_params, editeTreeModifyData.onchange_call_back_field, editeTreeModifyData.onchange_api_params_criteria, formValueWithCustomData));
                        }
                      }
                    });
                  }
                });
              }
              break;
          }
          if(element.tree_view_object && element.tree_view_object.field_name != ""){
            let editeTreeModifyData = JSON.parse(JSON.stringify(element.tree_view_object));
            if (editeTreeModifyData.onchange_api_params && editeTreeModifyData.onchange_call_back_field) {
              staticModal.push(this.commonFunctionService.getPaylodWithCriteria(editeTreeModifyData.onchange_api_params, editeTreeModifyData.onchange_call_back_field, editeTreeModifyData.onchange_api_params_criteria, formValueWithCustomData));
            }
          }
        }
        if(element.type && element.type == 'pdf_view'){
          staticModal.push(this.commonFunctionService.getPaylodWithCriteria(element.onchange_api_params,element.onchange_call_back_field,element.onchange_api_params_criteria,formValueWithCustomData))
        }
      });
    }
    this.getStaticData(staticModal,formValueWithCustomData,formValue);    
  }
  getStaticData(staticModal,object,formDataObject){
    let formValue = object;
    if(this.multipleFormCollection && this.multipleFormCollection.length > 0){
      let multiCollection = JSON.parse(JSON.stringify(this.multipleFormCollection));
      formValue = this.commonFunctionService.getFormDataInMultiformCollection(multiCollection,object);
    }
    let staticModalG = this.commonFunctionService.commanApiPayload([],this.tableFields,this.formFieldButtons,formValue);
    if(staticModalG && staticModalG.length > 0){
      staticModalG.forEach(element => {
        staticModal.push(element);
      });
    }
    if(this.tab && this.tab.api_params && this.tab.api_params != null && this.tab.api_params != "" && this.tab.api_params != undefined){      
      let criteria = [];
      if(this.tab.api_params_criteria && this.tab.api_params_criteria != null){
        criteria=this.tab.api_params_criteria
      }
      staticModal.push(this.commonFunctionService.getPaylodWithCriteria(this.tab.api_params,this.tab.call_back_field,criteria,{}))
      
    }
    if(this.form && this.form.api_params && this.form.api_params != null && this.form.api_params != "" && this.form.api_params != undefined){         
      if(this.form.api_params == 'QTMP:EMAIL_WITH_TEMP:QUOTATION_LETTER'){
        object = this.saveResponceData;
      }          
      let criteria = [];
      if(this.form.api_params_criteria && this.form.api_params_criteria != null){
        criteria=this.form.api_params_criteria
      }
      if(this.editedRowIndex > -1){
        formDataObject = formValue;
      }
      staticModal.push(this.commonFunctionService.getPaylodWithCriteria(this.form.api_params,this.form.call_back_field,criteria,formDataObject))      
    }
    this.callStaticData(staticModal);
  }
  callStaticData(payloads){
    if(payloads.length > 0){
      this.apiService.getStatiData(payloads);        
    }else{      
      this.checkFormFieldIfCondition();      
    }
  }
  checkObjecOrString(data){
    if(data._id){
      return data._id;
    }else{
      return data;
    }
  }  
  updateRowData() {
    let formValue = this.templateForm.getRawValue();
    Object.keys(this.custmizedFormValue).forEach(key => {
      this.elements[this.selectedRowIndex][key] = this.custmizedFormValue[key];
    })
    this.tableFields.forEach(element => {
      this.elements[this.selectedRowIndex][element.field_name] = formValue[element.field_name]
    });
    const updateFromData = {
      curTemp: this.currentMenu.name,
      data: this.elements[this.selectedRowIndex]
    }
    this.apiService.SaveFormData(updateFromData);
    this.saveCallSubscribe();
  }
  candelForm() {    
    if(this.updateMode && this.custmizedFormValue && Object.keys(this.custmizedFormValue).length > 0){      
      Object.keys(this.custmizedFormValue).forEach(key => {
        if(this.custmizedFormValue[key] != null && this.custmizedFormValue[key].length > 0){
          this.custmizedFormValue[key].forEach(element => {
            if(element.status == 'I'){
              element.status = 'A';
            }
          });
        }
      });
    }else{
      this.custmizedFormValue = {};
      this.modifyCustmizedFormValue = {};
    }
    this.updateMode=false;
    this.addAndUpdateResponce.emit('close');    
  }
  compareObjects(o1: any, o2: any): boolean {
    if(o1 != null && o2 != null){
      return o1._id === o2._id;
    }else{
      return false;
    }    
  }  
  currentTreeViewFieldParent:any='';
  openTreeView(parent,field) {
    let fieldName;
    if( field && field.tree_view_object && field.tree_view_object.field_name){
      fieldName = field.tree_view_object;
    }else{
      fieldName = field;
    }
    if(parent != ''){
      this.currentTreeViewFieldParent = parent;
    }
    if(field.type == "dropdown_on_tree_view_selection"){
      const field = {
        "field" : fieldName.onchange_call_back_field
      }
      this.apiService.ResetStaticData(field);
    }
    if (!this.treeViewData[fieldName.field_name]) this.treeViewData[fieldName.field_name] = [];
    this.treeViewData[fieldName.field_name] = [];
    this.curTreeViewField = fieldName;
    const staticModalGroup = [];
    if (fieldName.api_params && fieldName.api_params != '') {
      staticModalGroup.push(this.commonFunctionService.getPaylodWithCriteria(fieldName.api_params, fieldName.call_back_field, fieldName.api_params_criteria, this.templateForm.getRawValue()));
    }
    this.callStaticData(staticModalGroup);   
    this.commonFunctionService.openTreeModal(fieldName.label, fieldName.ddn_field, 'tree-view-modal');   
  }
  treeViewResponce(event) {
    const obj = {}
    Object.keys(event).forEach(key => {
      if (key != 'add_on_click') {
        if (key != 'children') {
          obj[key] = event[key];
        }
      }
    });    
    if(this.currentTreeViewFieldParent && this.currentTreeViewFieldParent != '' && this.currentTreeViewFieldParent.field_name && this.currentTreeViewFieldParent.field_name != ''){
      if (!this.treeViewData[this.currentTreeViewFieldParent.field_name]) this.treeViewData[this.currentTreeViewFieldParent.field_name] = {}
      if (!this.treeViewData[this.currentTreeViewFieldParent.field_name][this.curTreeViewField.field_name]) this.treeViewData[this.currentTreeViewFieldParent.field_name][this.curTreeViewField.field_name] = [];      
      this.templateForm.get([this.currentTreeViewFieldParent.field_name]).get([this.curTreeViewField.field_name]).setValue(obj);
      this.setValue(this.currentTreeViewFieldParent,this.curTreeViewField,false);    
      this.treeViewData[this.currentTreeViewFieldParent.field_name][this.curTreeViewField.field_name].push(obj);
      this.curTreeViewField = {};
      this.currentTreeViewFieldParent='';
    }else{
      if (!this.treeViewData[this.curTreeViewField.field_name]) this.treeViewData[this.curTreeViewField.field_name] = [];      
      this.templateForm.get([this.curTreeViewField.field_name]).setValue(obj);
      this.setValue('',this.curTreeViewField,false);    
      this.treeViewData[this.curTreeViewField.field_name].push(obj);
      this.curTreeViewField = {};
    }
  }
  treeViewOptionData(parent,child):Array<any>{
    let treeViewData = [];
    if(parent != ""){
      if(this.treeViewData && this.treeViewData[parent.field_name]){
        let parentData = this.treeViewData[parent.field_name];
        if(parentData && parentData[child.field_name]){
          treeViewData = parentData[child.field_name];
        }
      }
    }else{
      if(this.treeViewData && this.treeViewData[child.field_name]){
        treeViewData = this.treeViewData[child.field_name];
      }
    }
    return treeViewData;
  }
  
  showListOfFieldData(field,index,item){
    let value={};
    let parentObject = this.custmizedFormValue[field.field_name];
    let listOfField = parentObject[index];
    value['data'] = listOfField[item.field_name];
    let editemode = false; 
    switch (item.type) {
      case "typeahead":
        if(item.datatype == "list_of_object"){        
          this.viewModal('form_basic-modal', value, item,false);
        }          
        break;
      case "list_of_string":
      case "list_of_checkbox":
      case "grid_selection":
      case "list_of_fields":
      case "info":
        if(item["gridColumns"] && item["gridColumns"].length > 0){
          value['gridColumns']=item.gridColumns;
        }else if(item["fields"] && item["fields"].length > 0){
          value['gridColumns']=item.fields;
        }
        this.viewModal('form_basic-modal', value, item,false);
        break;
      case "file":
        if (value['data'] && value['data'] != '') {
          this.viewModal('fileview-grid-modal', value, item, editemode);
        };
        break;      
      default:
        break;
    } 
  }
  viewModal(id, object, field,editemode) {
    this.commonFunctionService.viewModal(id, object, field, this.currentMenu,editemode)
  }
  responceData(data) {
    if(this.clickFieldName.type){
      switch (this.clickFieldName.type) {
        case "grid_selection":
        case 'grid_selection_vertical':
          if(this.clickFieldName.datatype == 'grid_review'){
            this.custmizedFormValue[this.clickFieldName.field_name] = data;
          }          
          break;      
        default:
          break;
      }
    }
    this.clickFieldName = {};
  }
  showIf(field){
    const  objectc = this.selectedRow?this.selectedRow:{}
    const object = JSON.parse(JSON.stringify(objectc));
    if(this.templateForm){
      Object.keys(this.templateForm.getRawValue()).forEach(key => {
        object[key] = this.templateForm.getRawValue()[key];
      })
    }
    const display = this.commonFunctionService.showIf(field,object);
    const modifiedField = JSON.parse(JSON.stringify(field));
    modifiedField['display'] = display; 
    field = modifiedField;
    return display;
  }
  checkGridSelectionButtonCondition(field,button){
    let check = true;
    switch (button) {
      case 'add':
        if(field && field.addNewButtonIf && field.addNewButtonIf != ''){
          let modifyedField:any = {};
          modifyedField['show_if'] = field.addNewButtonIf;
          check = this.showIf(modifyedField);
        }
        break;    
      default:
        break;
    }
    return check;
  }
  editListOfFiedls(index,field){
    let parentList = this.custmizedFormValue[field.field_name];
    let object = parentList[index];
    this.listOfFieldUpdateMode = true;
    this.listOfFieldsUpdateIndex = index;
    if(this.tableFields && this.tableFields.length > 0){
      this.tableFields.forEach(element => {
        switch (element.type) {        
          case "list_of_fields":
            if(element.field_name == field.field_name){
              this.templateForm.get(element.field_name).reset(); 
              if (element.list_of_fields.length > 0) {
                element.list_of_fields.forEach((data) => {
                  switch (data.type) {                
                    case "list_of_string":
                      const custmisedKey = this.commonFunctionService.custmizedKey(element);
                      if (!this.custmizedFormValue[custmisedKey]) this.custmizedFormValue[custmisedKey] = {};
                      this.custmizedFormValue[custmisedKey][data.field_name] = object[data.field_name];
                      break;
                    case "typeahead":
                      if (data.datatype == 'list_of_object') {
                        const custmisedKey = this.commonFunctionService.custmizedKey(element);
                        if (!this.custmizedFormValue[custmisedKey]) this.custmizedFormValue[custmisedKey] = {};
                        this.custmizedFormValue[custmisedKey][data.field_name] = object[data.field_name];    
                      } else {
                        this.templateForm.get(element.field_name).get(data.field_name).setValue(object[data.field_name]);
                      }
                      break;
                    case "list_of_checkbox":
                      let checkboxListValue = [];
                      if(this.staticData && this.staticData[data.ddn_field] && this.staticData[data.ddn_field].length > 0){
                        this.staticData[data.ddn_field].forEach((value, i) => {                      
                          let arrayData = object[data.field_name];                        
                          let selected = false;
                          if (arrayData != undefined && arrayData != null) {
                            for (let index = 0; index < arrayData.length; index++) {
                              if (this.checkObjecOrString(value) == this.checkObjecOrString(arrayData[index])) {
                                selected = true;
                                break;
                              }
                            }
                          }
                          if (selected) {
                            checkboxListValue.push(true);
                          } else {
                            checkboxListValue.push(false);
                          }               
                        });
                      }
                      this.templateForm.get(element.field_name).get(data.field_name).setValue(checkboxListValue);
                      break; 
                    case "file":
                    case "input_with_uploadfile":
                      if(object[data.field_name] != null && object[data.field_name] != undefined){
                        let custmizedKey = this.commonFunctionService.custmizedKey(element);
                        if (!this.dataListForUpload[custmizedKey]) this.dataListForUpload[custmizedKey] = {};
                        if (!this.dataListForUpload[custmizedKey][data.field_name]) this.dataListForUpload[custmizedKey][data.field_name] = [];
                        this.dataListForUpload[custmizedKey][data.field_name] = JSON.parse(JSON.stringify(object[data.field_name]));
                        const value = this.modifyFileSetValue(object[data.field_name]);
                        this.templateForm.get(element.field_name).get(data.field_name).setValue(value);
                      }
                      break;               
                    default:
                      this.templateForm.get(element.field_name).get(data.field_name).setValue(object[data.field_name]);
                      break;
                  }              
                })
              }
            }
            break;
          default:          
            break;
        }
      });
    }
  }
  gridSelectionResponce(responce){ 
    const fieldName = this.curTreeViewField.field_name;    
    if (!this.custmizedFormValue[fieldName]) this.custmizedFormValue[fieldName] = [];
    this.custmizedFormValue[fieldName] = JSON.parse(JSON.stringify(responce));
    if(this.customEntryData[fieldName] && this.customEntryData[fieldName].length > 0){
      this.customEntryData[fieldName].forEach(data => {
        this.custmizedFormValue[fieldName].push(data);
      });
      this.customEntryData[fieldName] = [];
    }
    
    if(this.curTreeViewField && this.curTreeViewField.onchange_function && this.curTreeViewField.onchange_function_param){
      let function_name = this.curTreeViewField.onchange_function_param;
      let formValueWithCustomData = this.getFormValue(true);
      switch(function_name){
        case "calculation_of_script_for_tds":
          const payload = this.commonFunctionService[this.curTreeViewField.onchange_function_param](formValueWithCustomData, this.curTreeViewField);   
          this.apiService.getStatiData(payload);
          break;
        case "calculateQquoteAmount":
          this.custmizedFormValue[this.curTreeViewField.field_name].forEach(element => {
            element["qty"] = formValueWithCustomData["qty"];
            this.limsCalculationsService.calculateNetAmount(element, {field_name: "qty"},"legacyQuotationParameterCalculation");
          });
          this.updateDataOnFormField(this.commonFunctionService[this.curTreeViewField.onchange_function_param](formValueWithCustomData, this.curTreeViewField)); 
          break;
        case "calculateAutomotiveLimsQuotation":
          this.custmizedFormValue[this.curTreeViewField.field_name].forEach(element => {
            // element["qty"] = formValueWithCustomData["qty"];
            this.limsCalculationsService.calculateNetAmount(element, {field_name: "qty"},"calculateQuotationParameterAmountForAutomotiveLims");
          });
          // this.updateDataOnFormField(this.commonFunctionService[this.curTreeViewField.onchange_function_param](formValueWithCustomData, this.curTreeViewField)); 
          this.updateDataOnFormField(this.limsCalculationsService.calculate_quotation(formValueWithCustomData,"automotive" ,{field_name:"parameter_array"}));
          break;
        case "calculateLimsQuotation":
          this.custmizedFormValue[this.curTreeViewField.field_name].forEach(element => {
            element["qty"] = formValueWithCustomData["qty"];
            this.limsCalculationsService.calculateNetAmount(element, {field_name: "qty"}, "calculateQuotationParameterAmountForLims");
          });
          // this.updateDataOnFormField(this.commonFunctionService[this.curTreeViewField.onchange_function_param](formValueWithCustomData, this.curTreeViewField)); 
          this.updateDataOnFormField(this.limsCalculationsService.calculate_quotation(formValueWithCustomData,"standard" ,{field_name:"parameter_array"}));
          break;    
        case 'quote_amount_via_sample_no':
          let val = this.limsCalculationsService.quote_amount_via_sample_no(formValueWithCustomData,this.custmizedFormValue['quotation_param_methods']);
          this.updateDataOnFormField(val);
          break;
        case 'calculation_invoice_totalAmount':
          let value = this.limsCalculationsService.calculateInvoiceTotalAmount(formValueWithCustomData,this.custmizedFormValue['invoiceInfos']);
          this.updateDataOnFormField(value);
          break;
        case 'calculate_lims_invoice':
          let calculate_on_field = "";
          if(this.curTreeViewField.calculate_on_field != null && this.curTreeViewField.calculate_on_field != ''){
            calculate_on_field = this.curTreeViewField.calculate_on_field
          }
          let val1 = this.limsCalculationsService.calculate_lims_invoice(formValueWithCustomData,'',calculate_on_field);
          this.updateDataOnFormField(val1);
          break;
        default:
          if(this.commonFunctionService[this.curTreeViewField.onchange_function_param]){      
            this.templateForm = this.commonFunctionService[this.curTreeViewField.onchange_function_param](this.templateForm, this.curTreeViewField);
            const calTemplateValue= this.templateForm.getRawValue()
            this.updateDataOnFormField(calTemplateValue);
          }
          break;
      }
    }
    
    if(this.curTreeViewField && this.curTreeViewField.onchange_function_param != '' && this.curTreeViewField.onchange_function_param != null){
      if(this.curTreeViewField.onchange_function_param.indexOf('QTMP') >= 0){
        const payloads = [];
        payloads.push(this.commonFunctionService.getPaylodWithCriteria(this.curTreeViewField.onchange_function_param,'',[],this.getFormValue(true)));
        this.callStaticData(payloads);
      }
    }    
    this.modifyCustmizedValue(fieldName);
    this.curTreeViewField = {};
    this.currentTreeViewFieldParent = {};
  }
  modifyCustmizedValue(fieldName){
    let modifyObject = this.gridCommonFunctionService.gridDataModify(this.modifyCustmizedFormValue,this.custmizedFormValue,this.tableFields,fieldName,'grid_selection',this.getFormValue(true));
    this.modifyCustmizedFormValue = modifyObject.modifyData;
    this.tableFields = modifyObject.fields;
  }
  isDisable(parent,chield){
    const  formValue = this.getFormValue(true);  
    let tobedesabled;
    if(parent == ''){
      tobedesabled = this.commonFunctionService.isDisable(chield,this.updateMode,formValue)
      if(tobedesabled){
        if(!this.templateForm.get(chield.field_name).disabled){
          this.templateForm.get(chield.field_name).disable()
        }        
      }else{
        if(this.templateForm.get(chield.field_name).disabled){
          this.templateForm.get(chield.field_name).enable()
        }        
      }
    }else{
      tobedesabled = this.commonFunctionService.isDisable(chield,this.updateMode,formValue)
      if(tobedesabled){
        this.templateForm.get(parent).get(chield.field_name).disable()
      }else{
        this.templateForm.get(parent).get(chield.field_name).enable()
      }
    }       
    return tobedesabled;
  }  
  isMendetory(parent,chield){
    const  formValue = this.getFormValue(true);   
    let tobedesabled;
    if(parent == ''){
      tobedesabled = this.commonFunctionService.isMendetory(chield,formValue)
      if(tobedesabled){
        if(this.templateFormControl[chield.field_name].status == 'VALID'){
          this.templateForm.get(chield.field_name).setValidators([Validators.required]);
          this.templateForm.get(chield.field_name).updateValueAndValidity();
        }       
      }else{
        if(this.templateFormControl[chield.field_name].status == 'INVALID'){
          this.templateForm.get(chield.field_name).clearValidators();
          this.templateForm.get(chield.field_name).updateValueAndValidity();
        }        
      }
    }else{
      tobedesabled = this.commonFunctionService.isMendetory(chield,formValue)
      if(tobedesabled){
        if(this.templateFormControl[parent][chield.field_name].status == 'VALID'){
          this.templateForm.get(parent).get(chield.field_name).setValidators([Validators.required]);
          this.templateForm.get(parent).get(chield.field_name).updateValueAndValidity();
        } 
      }else{
        if(this.templateFormControl[parent][chield.field_name].status == 'INVALID'){
          this.templateForm.get(parent).get(chield.field_name).clearValidators();
          this.templateForm.get(parent).get(chield.field_name).updateValueAndValidity();
        } 
      }
    }       
    return tobedesabled;
  }
  showModal(object){
    this.custmizedFormValue = {}    
    this.modifyCustmizedFormValue = {};
    this.formModal.show();
  }
  closeModal(){
    if(this.updateMode && this.multipleFormCollection.length > 0){      
      Object.keys(this.custmizedFormValue).forEach(key => {
        if(this.custmizedFormValue[key] != null && Array.isArray(this.custmizedFormValue[key])){
          this.custmizedFormValue[key].forEach(element => {
            if(element.status == 'I'){
              element.status = 'A';
            }
          });
        }
      });
    }else{
      this.custmizedFormValue = {};
      this.modifyCustmizedFormValue = {};
    }
    if(this.multipleFormCollection.length > 0){
      this.setPreviousFormTargetFieldData();
    }
    this.updateMode=false;
    this.dataListForUpload = []
    this.filePreviewFields = [];
    this.close();
  }  
  close(){
    this.staticData = {};
    this.typeAheadData = [];
    this.selectedRow = {};
    this.showGridData={};
    this.latitude = 0;
    this.longitude = 0;
    this.address = "";
    this.checkFormAfterCloseModel();
  }
  checkFormAfterCloseModel(){
    if(this.multipleFormCollection.length > 0){
      this.loadPreviousForm();
    }else{
      this.addAndUpdateResponce.emit('close');
      if(this.templateForm && this.templateForm.controls){
        this.templateForm.reset();
      }      
    }
  }
  donotResetField(){
    if(this.tableFields.length > 0){
      let FormValue = this.getFormValue(true);
      this.tableFields.forEach(tablefield => {
        if(tablefield.do_not_refresh_on_add && tablefield.type != "list_of_fields" && tablefield.type != "group_of_fields" && tablefield.type != "stepper"){
          this.donotResetFieldLists[tablefield.field_name] = FormValue[tablefield.field_name];
        }else if(tablefield.type == "group_of_fields"){
          if(tablefield.list_of_fields && tablefield.list_of_fields.length > 0){
            tablefield.list_of_fields.forEach(field => {
              if(field.do_not_refresh_on_add){
                this.donotResetFieldLists[tablefield.field_name][field.field_name] = FormValue[tablefield.field_name][field.field_name];
              }
            });
          }
        }else if(tablefield.type == "stepper"){
          if(tablefield.list_of_fields && tablefield.list_of_fields.length > 0){
            tablefield.list_of_fields.forEach(step => {
              if(step.list_of_fields && step.list_of_fields.length > 0){
                step.list_of_fields.forEach(field => {
                  if(field.do_not_refresh_on_add){
                    this.donotResetFieldLists[step.field_name][field.field_name] = FormValue[step.field_name][field.field_name];
                  }
                });
              }
            });
          }
        }
      });
    }
  }
  checkBeforeResetForm(){
    if(this.close_form_on_success){
      this.close_form_on_success=false;
      this.close();
    }else if(this.multipleFormCollection.length > 0){
      this.close();
    }else{
      this.resetForm()
    }
  }
  resetForm(){
    if(this.multipleFormCollection.length > 0){
      this.setPreviousFormTargetFieldData();
    }
    this.donotResetField();
    if(this.templateForm && this.templateForm.controls){
      this.templateForm.reset()
    }
    if(Object.keys(this.donotResetFieldLists).length > 0){
      this.custmizedFormValue = {};
      this.modifyCustmizedFormValue = {};
      this.dataListForUpload = {};
      this.updateDataOnFormField(this.donotResetFieldLists);
      this.donotResetFieldLists = {};
    }else{
      this.dataListForUpload={};
      this.custmizedFormValue = {};
      this.modifyCustmizedFormValue = {};
    }  
    if(this.tableFields.length > 0){ 
      this.tableFields.forEach(element => {
        switch (element.type) {
          case 'checkbox':
            this.templateForm.controls[element.field_name].setValue(false)
            break; 
          case 'list_of_checkbox':
            const controls:any = this.templateForm.get(element.field_name)['controls'];
            if(controls && controls.length > 0){
              controls.forEach((child,i) => {
                controls.at(i).patchValue(false);
              });
            }
            break;     
          default:
            break;
        }
      });
    }
  }
  partialDataSave(feilds,tableField){       
    const payload = {
      data:{}
    };
    //for gsd call*************************
    if(feilds.action_name == 'GSD_CALL'){
      this.envService.setRequestType("PUBLIC");
      if(feilds.api != undefined && feilds.api != null && feilds.api != ''){
        payload['path'] = feilds.api;
      }
      let list = [];
      list.push(this.commonFunctionService.getPaylodWithCriteria(tableField.api_params,tableField.call_back_field,tableField.api_params_criteria,this.getFormValue(false)));
       payload['data'] = list;
      this.apiService.DynamicApiCall(payload);
      this.saveCallSubscribe();
    }
    //for deafult call (like save)*******************
    else{
      if(feilds.api != undefined && feilds.api != null && feilds.api != ''){
        payload['path'] = feilds.api+'/'+this.currentMenu.name;
      }    
      if(this.updateMode){
        const _id = this.selectedRow._id;    
        payload.data['_id'] = _id;
      }  
      if(Array.isArray(feilds.payloads_fields) && feilds.payloads_fields.length > 0){
        if(feilds.payloads_fields[0].toUpperCase() == 'FORM_OBJECT'){
          const saveFromData = this.getSavePayloadData();
          if(this.getSavePayload){
            payload.data = saveFromData.data;
            if(payload['path'] && payload['path'] != undefined && payload['path'] != null && payload['path'] != ''){
              this.apiService.DynamicApiCall(payload);
              this.saveCallSubscribe();
            } 
          }
        }else{
          feilds.payloads_fields.forEach(feild => {
            if(feild in this.custmizedFormValue){
              payload.data[feild] = this.custmizedFormValue[feild];
            }else if(feild in this.templateForm.value){
              payload.data[feild] = this.templateForm.value[feild]
            }
          });
          if(payload['path'] && payload['path'] != undefined && payload['path'] != null && payload['path'] != ''){
            this.apiService.DynamicApiCall(payload);
            this.saveCallSubscribe();
          }
        }
      } 
    }     
  }  
  modifyUploadFiles(files){
    const fileList = [];
    if(files && files.length > 0){
      files.forEach(element => {
        if(element._id){
          fileList.push(element)
        }else{
          fileList.push({uploadData:[element]})
        }
      });
    }                  
    return fileList;
  }
  modifyFileSetValue(files){
    let fileName = '';
    let fileLength = files.length;
    let file = files[0];
    if(fileLength == 1 && (file.fileName || file.rollName)){
      fileName = file.fileName || file.rollName;
    }else if(fileLength > 1){
      fileName = fileLength + " Files";
    }
    return fileName;
  }
  fileUploadList(parent,field){
    let fileList = [];
    let msg = "";
    if(parent != ''){
      const parentKey = this.commonFunctionService.custmizedKey(parent);
      if(this.dataListForUpload[parentKey] && this.dataListForUpload[parentKey][field.field_name]){
        fileList = this.dataListForUpload[parentKey][field.field_name];
        msg = this.getFileTooltipMsg(fileList);
      }
    }else{
      if(this.dataListForUpload[field.field_name]){        
        fileList = this.dataListForUpload[field.field_name];
        msg = this.getFileTooltipMsg(fileList);
      }
    }
    return msg;
  }
  getFileTooltipMsg(fileList){
    let msg = "";
    if(fileList.length > 0){
      fileList.forEach(element => {
        if(msg != ''){
          msg = msg + '\n' + element.fileName;
        }else{
          msg = element.fileName;
        }
      });
    }
    return msg;
  }
  uploadModal(parent,field,parentIndex,curIndex) {
    if (field.field_name && field.field_name != "") {
      field['parentIndex'] = parentIndex;
      field['curIndex'] = curIndex;
      this.curFileUploadField = field;
      this.curFileUploadFieldparentfield = parent;
      let selectedFileList = [];
      if(parent != ''){
        const parentKey = this.commonFunctionService.custmizedKey(parent);
        if(this.dataListForUpload[parentKey] && this.dataListForUpload[parentKey][field.field_name]){
          selectedFileList = this.dataListForUpload[parentKey][field.field_name];
        }
      }else{
        if(this.dataListForUpload[field.field_name]){
          selectedFileList = this.dataListForUpload[field.field_name];
        }        
      }
      this.commonFunctionService.openFileUpload(field, 'file-upload-modal', this.templateForm.value,selectedFileList)
    }
  }  
  fileUploadResponce(response) {
    let curFieldName = '';
    let parentIndex = -1;
    let curIndex = -1;
    if(this.curFileUploadField && this.curFileUploadField.field_name){
      curFieldName = this.curFileUploadField.field_name;
      parentIndex =  this.curFileUploadField['parentIndex'];
      curIndex =  this.curFileUploadField['curIndex'];
    }
    if(this.curFileUploadFieldparentfield != '' && curFieldName != ''){
      const custmizedKey = this.commonFunctionService.custmizedKey(this.curFileUploadFieldparentfield); 

      if (!this.dataListForUpload[custmizedKey]) this.dataListForUpload[custmizedKey] = {};
      if (!this.dataListForUpload[custmizedKey][curFieldName]) this.dataListForUpload[custmizedKey][curFieldName] = [];
      this.dataListForUpload[custmizedKey][curFieldName] = response;

      
      if(this.dataListForUpload[custmizedKey][curFieldName] && this.dataListForUpload[custmizedKey][curFieldName].length > 0){
        let fileList = this.dataListForUpload[custmizedKey][curFieldName];
        let fileName = this.modifyFileSetValue(fileList); 

        if(this.curFileUploadField.type == 'input_with_uploadfile'){
          let tooltipMsg = this.getFileTooltipMsg(fileList);        
          this.tableFields[parentIndex].list_of_fields[curIndex]['tooltipMsg'] = tooltipMsg;
        }

        this.templateForm.get(this.curFileUploadFieldparentfield.field_name).get(curFieldName).setValue(fileName);
      }else{
        this.templateForm.get(this.curFileUploadFieldparentfield.field_name).get(curFieldName).setValue('');
        if(this.curFileUploadField.type == 'input_with_uploadfile'){
          this.tableFields[parentIndex].list_of_fields[curIndex]['tooltipMsg'] = '';
        }
      }

    }else{
      if(curFieldName != ''){
        if (!this.dataListForUpload[curFieldName]) this.dataListForUpload[curFieldName] = [];
        this.dataListForUpload[curFieldName] = response;

        if(this.dataListForUpload[curFieldName] && this.dataListForUpload[curFieldName].length > 0){
          let fileList = this.dataListForUpload[curFieldName];
          let fileName = this.modifyFileSetValue(fileList);
          if(this.curFileUploadField.type == 'input_with_uploadfile'){
            let tooltipMsg = this.getFileTooltipMsg(fileList);
            this.tableFields[curIndex]['tooltipMsg'] = tooltipMsg;
          }
          this.templateForm.get(curFieldName).setValue(fileName);
        }else{
          this.templateForm.get(curFieldName).setValue('');
          if(this.curFileUploadField.type == 'input_with_uploadfile'){
            this.tableFields[curIndex]['tooltipMsg'] = '';
          }
        }
      }
    } 
  }
  removeAttachedDataFromList(parent,child,index){
    let fieldName = child.field_name;
    if(parent != ''){
      let custmisedKey = this.commonFunctionService.custmizedKey(parent);
      this.dataListForUpload[custmisedKey][fieldName].splice(index,1);

    }else{
      this.dataListForUpload[fieldName].splice(index,1)
    }    
  }
  toggle(index,event: MatCheckboxChange,field) {
    if (event.checked) {
      this.staticData[field.ddn_field][index].selected=true;
    } else {
      this.staticData[field.ddn_field][index].selected=false;
    }
    this.custmizedFormValue[field.field_name] = [];
    this.staticData[field.ddn_field].forEach(element => {      
      if(element.selected){
        this.custmizedFormValue[field.field_name].push(element);
      }
    });
  }
  isIndeterminate(ddn_field) {
    let check = 0;
    if(this.staticData[ddn_field].length > 0){
      this.staticData[ddn_field].forEach(row => {
        if(row.selected){
          check = check + 1;
        }
      });
    }
    return (check > 0 && !this.isChecked(ddn_field));
  };
  isChecked(ddn_field) {
    let check = 0;
    if(this.staticData[ddn_field].length > 0){
      this.staticData[ddn_field].forEach(row => {
        if(row.selected){
          check = check + 1;
        }
      });
    }
    return this.staticData[ddn_field].length === check;
  };
  toggleAll(event: MatCheckboxChange,field) {    
    if ( event.checked ) {
      if(this.staticData[field.ddn_field].length > 0){
        this.staticData[field.ddn_field].forEach(row => {
          row.selected=true;
        });
      }
    }else{
      if(this.staticData[field.ddn_field].length > 0){
        this.staticData[field.ddn_field].forEach(row => {
          row.selected=false;
        });
      }
    }
    this.custmizedFormValue[field.field_name] = [];
    this.staticData[field.ddn_field].forEach(element => {      
      if(element.selected){
        this.custmizedFormValue[field.field_name].push(element);
      }
    }); 
  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,event.container.data,event.previousIndex,event.currentIndex);
    }
  }
  typeaheadDragDrop(event: CdkDragDrop<string[]>,parent,chield) {
    if(parent != '' && parent != undefined && parent != null){
      const parentKey = this.commonFunctionService.custmizedKey(parent); 
      if(this.commonFunctionService.checkStorageValue(this.custmizedFormValue,parent,chield)){
        moveItemInArray(this.custmizedFormValue[parentKey][chield.field_name], event.previousIndex, event.currentIndex); 
        moveItemInArray(this.modifyCustmizedFormValue[parentKey][chield.field_name], event.previousIndex, event.currentIndex); 
      }       
    }else {
      if(this.commonFunctionService.checkStorageValue(this.custmizedFormValue,'',chield)){
        moveItemInArray(this.custmizedFormValue[chield.field_name], event.previousIndex, event.currentIndex);
        moveItemInArray(this.modifyCustmizedFormValue[chield.field_name], event.previousIndex, event.currentIndex);
      }      
    }    
  }
  get templateFormControl() {
    return this.templateForm.controls;
  } 
  reviewParameters(fields,data){
    this.clickFieldName=fields;
    let value={};
    value['data'] = JSON.parse(JSON.stringify(data));
    value['gridColumns']=fields.gridColumns;
    const editemode = true;    
    this.viewModal('form_basic-modal', value, fields,editemode); 
  }
  getFormLavel(){
    if(this.form && this.form.label){
      return this.form.label;
    }else{
      return 'Add Form';
    }
  }
  take_action_on_click(action_button){
    let api='';
    this.currentActionButton=action_button;
    if(this.currentActionButton.onclick && this.currentActionButton.onclick != null && this.currentActionButton.onclick.api && this.currentActionButton.onclick.api != null){
      if(this.currentActionButton.onclick.close_form_on_success){
        this.close_form_on_success = this.currentActionButton.onclick.close_form_on_success;
      } 
      api = this.currentActionButton.onclick.api        
      switch (api.toLowerCase()) {
        case "save":
        case "update":
          this.saveFormData();
          break; 
        case "preview":
          if(this.currentActionButton.onclick.action_name != ''){
            this.currentMenu.name = this.currentActionButton.onclick.action_name;
            this.selectedRow = this.saveResponceData;
          }
          this.commonFunctionService.previewModal(this.selectedRow,this.currentMenu,'form-preview-modal')
          break;  
        case "download_report":
          this.downloadReport();
          break;
        case "download_pdf":
          this.downloadPdfFileFromFormdata();
          break;
        case "public_download_report":
          this.publicDownloadReport();
          break;
        case "reset":
          this.createFormgroup = true;
          this.getTableField = true;
          this.pageLoading = true;
          this.dataSaveInProgress = true;
          this.ngOnInit();
          break;
        case "previous":        
          this.previous();
          break;
        case "updateandnext":
          this.saveFormData();
          this.close_form_on_success = false;
          this.nextIndex = true;
          break;
        case "cancel":
          this.closeModal();
          break;
        case "close":
          this.close();
          break;
        case "send_email":
          this.saveFormData();
          break;
        case "redirect_to_home_page":
          this.router.navigate(['home_page'])
          break;
        case "add":
          this.setListoffieldData();          
          break;
        case "delete_row":
          this.deleteGridData();
          break; 
        default:
          this.partialDataSave(action_button.onclick,null)
          break;
      } 
    }   
  }
  previewModalResponce(data){
    alert(data);
  }  
  downloadFile(file){
    this.downloadClick = file.rollName;
    this.commonFunctionService.downloadFile(file);
  }
  downloadFileWithBytes(filedata){
    let link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    const file = new Blob([filedata.fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(file);
    link.href = url;
    link.download = this.downloadClick;
    document.body.appendChild(link);
    link.click();
    link.remove();   
  }
  numberOnly(event){
    return this.commonFunctionService.numberOnly(event);
  }
  changePdfView(file){
    if(file.bytes && file.bytes != '' && file.bytes != null){
      const arrayBuffer = file.bytes;
      this.pdfViewLink = arrayBuffer;
    }
  }
  previous(){
    const previousIndex = this.selectedRowIndex - 1;
    if(previousIndex != -1){
      this.selectedRowIndex = previousIndex;
      this.editedRowData(this.elements[previousIndex]);
    }else{
      this.notificationService.notify('bg-danger','Previous Index are not available.')
    }
  }
  next(){
    const nextIndex = this.selectedRowIndex + 1;
    if(nextIndex < this.elements.length){
      this.selectedRowIndex = nextIndex;
      this.editedRowData(this.elements[nextIndex]);
    }else{
      this.notificationService.notify('bg-danger','Next Index are not available.')
    }
  }
  onchangeHtmlView(){
    if(this.staticData['onchangeHtmlView'] && this.staticData['onchangeHtmlView'] != null && this.staticData['onchangeHtmlView'] != ''){
      return true;
    }else{
      return false;
    }
  }
  funCallOnFormLoad(fields){
    fields.forEach(ele => {
      if(ele && ele.type == "group_of_fields"){
        ele.list_of_fields.forEach(element => {
          if(element.onchange_function && element.onchange_function_param != ''){
            switch (element.onchange_function_param) {
              case 'buggetForcastCalc':
                this.limsCalculationsService.buggetForcastCalc(this.templateForm);
                break;            
              default:
                break;
            }
          }
        });
      }     
    });
  }
  changeNewForm(formName:string,i){
    this.formName = formName;
    this.formIndex = i;
    this.changeForm();
  }  
  checkOnSuccessAction(){
    let actionValue = ''
    let index = -1;
    if(this.currentActionButton.onclick && this.currentActionButton.onclick != null && this.currentActionButton.onclick.action_name && this.currentActionButton.onclick.action_name != null){
      if(this.currentActionButton.onclick.action_name != ''){
        actionValue = this.currentActionButton.onclick.action_name;
        if(actionValue != ''){
          Object.keys(this.forms).forEach((key,i) => {
            if(key == actionValue){
              index = i;
            }
          });
          if(index != -1) {
            this.changeNewForm(actionValue,index)
          }    
        }
      }
    }
  };
  onClickLoadData(parent,field){
    if(field && field.onClickApiParams && field.onClickApiParams != ''){        
      let api_params = field.onClickApiParams;
      let callBackfield = field.onClickCallBackField;
      let criteria = field.onClickApiParamsCriteria
      const payload = this.commonFunctionService.getPaylodWithCriteria(api_params,callBackfield,criteria,this.getFormValue(false));
      let payloads = [];
      payloads.push(this.checkQtmpApi(api_params,field,payload));
      this.callStaticData(payloads);
    }
  }  
  updateDataOnFormField(formValue){
    const checkDataType = typeof formValue;
    if(checkDataType == 'object' && !Array.isArray(formValue) && this.tableFields && this.tableFields.length > 0){
      this.tableFields.forEach(element => {        
        if(element && element.field_name && element.field_name != ''){
          let fieldName = element.field_name;
          let object = formValue[fieldName];
          if(object != null && object != undefined){
            this.updateFormValue(element,formValue);
          }
        }
      });
      if(this.formFieldButtons.length > 0){
        this.formFieldButtons.forEach(element => {
          let fieldName = element.field_name;
          let object = this.selectedRow[fieldName];
          if(formValue[fieldName] != null && formValue[fieldName] != undefined){
            if(element.field_name && element.field_name != ''){              
              switch (element.type) {
                case "dropdown":
                  let dropdownValue = object == null ? null : object;
                  this.templateForm.controls[element.field_name].setValue(dropdownValue);
                  break;
                default:
                  break;
              }
            }
          }
        });
      }
      this.getFocusFieldAndFocus();
      this.checkFormFieldIfCondition();
    }
  }
  updateFormValue(element,formValue){  
      let type = element.type;
      let datatype = element.datatype;
      let tree_view_object = element.tree_view_object;
      let date_format = element.date_format;
      let fieldName = element.field_name;  
      let ddn_field = element.ddn_field;
      let parent = element.parent;
      let list_of_fields = element.list_of_fields;
      let object = formValue[fieldName];
      switch (type) { 
        case "grid_selection":
        case 'grid_selection_vertical':
        case "list_of_string":
        case "drag_drop":
          if(object != null && object != undefined){
            if(Array.isArray(object)){
              this.custmizedFormValue[fieldName] = JSON.parse(JSON.stringify(object));
              if(type.startsWith("grid_selection")){
                const modifyData = this.gridCommonFunctionService.gridDataModify(this.modifyCustmizedFormValue,this.custmizedFormValue,this.tableFields,fieldName,"grid_selection",formValue);
                this.modifyCustmizedFormValue = modifyData.modifyData;
                if(modifyData.field_index != -1){
                  const index = modifyData.field_index;
                  this.tableFields[index] = modifyData.fields[index];
                }                    
              }
            }
            this.templateForm.controls[fieldName].setValue('')
          }
          break;
        case "file":
        case "input_with_uploadfile":
          if(object != null && object != undefined){
            this.dataListForUpload[fieldName] = JSON.parse(JSON.stringify(object));
            const value = this.modifyFileSetValue(object);
            if(type == 'input_with_uploadfile'){
              let tooltipMsg = this.getFileTooltipMsg(object);
              element['tooltipMsg'] = tooltipMsg;
            }
            this.templateForm.controls[fieldName].setValue(value);
          }
          break;
        case "list_of_fields":
          if(object != null && object != undefined){
            if(Array.isArray(object)){
              this.custmizedFormValue[fieldName] = JSON.parse(JSON.stringify(object));
              let modifyObject = this.gridCommonFunctionService.modifyListofFieldsData(element,this.custmizedFormValue[fieldName],element.list_of_fields);
              this.modifyCustmizedFormValue[fieldName] = modifyObject['data'];
            }else if(typeof object == "object" && datatype == 'key_value'){
              this.custmizedFormValue[fieldName] = object;
            }else{
              if(list_of_fields && list_of_fields != null && list_of_fields.length > 0){
                list_of_fields.forEach((data,j) => {
                  switch (data.type) {
                    case "list_of_string":
                    case "grid_selection":
                    case 'grid_selection_vertical':
                    case "drag_drop":                    
                      if(object && object[data.field_name] != null && object[data.field_name] != undefined){
                        if(Array.isArray(object[data.field_name])){
                          if (!this.custmizedFormValue[fieldName]) this.custmizedFormValue[fieldName] = {};
                          this.custmizedFormValue[fieldName][data.field_name] = JSON.parse(JSON.stringify(object[data.field_name]));
                        }
                        this.templateForm.get(fieldName).get(data.field_name).setValue('')
                        //(<FormGroup>this.templateForm.controls[element.field_name]).controls[data.field_name].patchValue('');
                      }
                      break;
                    case "typeahead":
                      if(data.datatype == "list_of_object" || datatype == 'chips'){
                        if(object && object[data.field_name] != null && object[data.field_name] != undefined){
                          if(Array.isArray(object[data.field_name])){
                            if (!this.custmizedFormValue[fieldName]) this.custmizedFormValue[fieldName] = {};
                            this.custmizedFormValue[fieldName][data.field_name] = JSON.parse(JSON.stringify(object[data.field_name]));
                          }
                          this.templateForm.get(fieldName).get(data.field_name).setValue('')
                          //(<FormGroup>this.templateForm.controls[element.field_name]).controls[data.field_name].patchValue('');
                        }
                      }else{
                        if(object && object[data.field_name] != null && object[data.field_name] != undefined){
                          const value = object[data.field_name];
                          this.templateForm.get(fieldName).get(data.field_name).setValue(value)
                          //(<FormGroup>this.templateForm.controls[element.field_name]).controls[data.field_name].patchValue(value);
                        }
                      }
                      break;
                    case "input_with_uploadfile":
                      if(object != null && object != undefined && object[data.field_name] != null && object[data.field_name] != undefined){
                        let custmisedKey = this.commonFunctionService.custmizedKey(element);
                        this.dataListForUpload[custmisedKey][data.field_name] = JSON.parse(JSON.stringify(object[data.field_name]));
                        const value = this.modifyFileSetValue(object[data.field_name]);
                        let tooltipMsg = this.getFileTooltipMsg(object[data.field_name]);
                        element.list_of_fields[j]['tooltipMsg'] = tooltipMsg;
                        this.templateForm.get(fieldName).get(data.field_name).setValue(value);
                      }
                      break;
                    default:
                      if(object && object[data.field_name] != null && object[data.field_name] != undefined){
                        const value = object[data.field_name];
                        this.templateForm.get(fieldName).get(data.field_name).setValue(value)
                        //(<FormGroup>this.templateForm.controls[element.field_name]).controls[data.field_name].patchValue(value);
                      }
                      break;
                  }
                });
              }
            }
          }
          break; 
        case "typeahead":
          if(datatype == "list_of_object" || datatype == 'chips'){
            if(object != null && object != undefined){
              this.custmizedFormValue[fieldName] = JSON.parse(JSON.stringify(object));
              this.templateForm.controls[fieldName].setValue('')
            }
          }else{
            if(object != null && object != undefined){
              const value = object;
              this.templateForm.controls[fieldName].setValue(value)
            }
          }  
          break;
        case "group_of_fields":
          if(list_of_fields && list_of_fields.length > 0){
            list_of_fields.forEach((data,j) => {
              let ChildFieldData = object;
              let childFieldName = data.field_name;
              if(data && childFieldName && childFieldName != '' && ChildFieldData && ChildFieldData != null){
                switch (data.type) {
                  case "list_of_string":
                  case "grid_selection":
                  case 'grid_selection_vertical':
                  case "drag_drop": 
                    if(ChildFieldData && ChildFieldData[childFieldName] != null && ChildFieldData[childFieldName] != undefined && ChildFieldData[childFieldName] != ''){
                      if (!this.custmizedFormValue[fieldName]) this.custmizedFormValue[fieldName] = {};
                      const value = JSON.parse(JSON.stringify(ChildFieldData[childFieldName]));
                      this.custmizedFormValue[fieldName][childFieldName] = value;
                      this.templateForm.get(fieldName).get(childFieldName).setValue('')
                      //(<FormGroup>this.templateForm.controls[fieldName]).controls[childFieldName].patchValue('');
                    }
                    break;   
                  case "typeahead":
                    if(data.datatype == "list_of_object" || data.datatype == 'chips'){
                      if(ChildFieldData && ChildFieldData[childFieldName] != null && ChildFieldData[childFieldName] != undefined && ChildFieldData[childFieldName] != ''){
                        if (!this.custmizedFormValue[fieldName]) this.custmizedFormValue[fieldName] = {};
                        const value = JSON.parse(JSON.stringify(ChildFieldData[childFieldName]));
                        this.custmizedFormValue[fieldName][childFieldName] = value;
                        this.templateForm.get(fieldName).get(childFieldName).setValue(value);
                        //(<FormGroup>this.templateForm.controls[fieldName]).controls[childFieldName].patchValue('');
                      }
                    }else{
                      if(ChildFieldData && ChildFieldData[childFieldName] != null && ChildFieldData[childFieldName] != undefined && ChildFieldData[childFieldName] != ''){
                        const value = ChildFieldData[childFieldName];
                        this.templateForm.get(fieldName).get(childFieldName).setValue(value)
                        //(<FormGroup>this.templateForm.controls[fieldName]).controls[childFieldName].patchValue(value);
                      }
                    }  
                    break;               
                  case "number":
                    if(ChildFieldData && ChildFieldData[childFieldName] != null && ChildFieldData[childFieldName] != undefined && ChildFieldData[childFieldName] != ''){
                      let gvalue;
                      const value = ChildFieldData[childFieldName];
                      if(value != null && value != ''){
                        gvalue = value;
                      }else{
                        gvalue = 0;
                      }
                      this.templateForm.get(fieldName).get(childFieldName).setValue(gvalue)
                      //(<FormGroup>this.templateForm.controls[fieldName]).controls[childFieldName].patchValue(gvalue);
                    }else if(ChildFieldData && ChildFieldData.hasOwnProperty(childFieldName)){
                      let gvalue = 0;
                      this.templateForm.get(fieldName).get(childFieldName).setValue(gvalue)
                    }
                    break;
                  case "list_of_checkbox":
                    this.templateForm.get(fieldName).get(childFieldName).patchValue([])
                    if(parent){
                      this.selectedRow[parent] = {}
                      this.selectedRow[parent][fieldName] = ChildFieldData;
                    }else{
                      this.selectedRow[fieldName] = ChildFieldData;
                    }
                    //(<FormGroup>this.templateForm.controls[fieldName]).controls[childFieldName].patchValue([]);
                    break;
                  case "date":
                    if(ChildFieldData && ChildFieldData[childFieldName] != null && ChildFieldData[childFieldName] != undefined && ChildFieldData[childFieldName] != ''){
                      if(data.date_format && data.date_format !="" && typeof ChildFieldData[childFieldName] === 'string'){
                        const date = ChildFieldData[childFieldName];
                        const dateMonthYear = date.split('/');
                        const formatedDate = dateMonthYear[2]+"-"+dateMonthYear[1]+"-"+dateMonthYear[0];
                        const value = new Date(formatedDate);
                        this.templateForm.get(fieldName).get(childFieldName).setValue(value)
                      }else{                  
                        const value = formValue[fieldName][childFieldName] == null ? null : formValue[fieldName][childFieldName];
                        this.templateForm.get(fieldName).get(childFieldName).setValue(value);              
                      }
                    }
                    break;
                  case "input_with_uploadfile":
                    if(object != null && object != undefined && object[data.field_name] != null && object[data.field_name] != undefined){
                      let custmisedKey = this.commonFunctionService.custmizedKey(element);
                      this.dataListForUpload[custmisedKey][data.field_name] = JSON.parse(JSON.stringify(object[data.field_name]));
                      const value = this.modifyFileSetValue(object[data.field_name]);
                      let tooltipMsg = this.getFileTooltipMsg(object[data.field_name]);
                      element.list_of_fields[j]['tooltipMsg'] = tooltipMsg;
                      this.templateForm.get(fieldName).get(data.field_name).setValue(value);
                    }
                    break;
                  default:
                    if(ChildFieldData && ChildFieldData[childFieldName] != null && ChildFieldData[childFieldName] != undefined && ChildFieldData[childFieldName] != ''){
                      const value = ChildFieldData[childFieldName];
                      this.templateForm.get(fieldName).get(childFieldName).setValue(value)
                      //(<FormGroup>this.templateForm.controls[fieldName]).controls[childFieldName].patchValue(value);
                    }
                    break;
                }
              }
            });
          }
          break;
        case "tree_view_selection":
          if(formValue[fieldName] != null && formValue[fieldName] != undefined){
            this.treeViewData[fieldName] = [];            
            let treeDropdownValue = object == null ? null : object;
            if(treeDropdownValue != ""){
              this.treeViewData[fieldName].push(JSON.parse(JSON.stringify(treeDropdownValue)));
            }
            this.templateForm.controls[fieldName].setValue(treeDropdownValue)
          }
          break;
        case "stepper":
          if(list_of_fields && list_of_fields.length > 0){
            list_of_fields.forEach(step => {
              if(step.list_of_fields && step.list_of_fields.length > 0){
                step.list_of_fields.forEach(data => {
                  let childFieldName = data.field_name;
                  switch (data.type) {
                    case "list_of_string":
                    case "grid_selection":
                    case 'grid_selection_vertical':
                      if(formValue[childFieldName] != null && formValue[childFieldName] != undefined && formValue[childFieldName] != ''){                                             
                        this.custmizedFormValue[childFieldName] = formValue[childFieldName]                    
                      }
                      this.templateForm.get(step.field_name).get(childFieldName).setValue('');
                      break;
                    case "typeahead":
                      if(data.datatype == "list_of_object" || data.datatype == 'chips'){
                        if(formValue[childFieldName] != null && formValue[childFieldName] != undefined && formValue[childFieldName] != ''){                      
                          this.custmizedFormValue[childFieldName] = formValue[childFieldName]
                          this.templateForm.get(step.field_name).get(childFieldName).setValue('');
                        }
                      }else{
                        if(formValue[childFieldName] != null && formValue[childFieldName] != undefined && formValue[childFieldName] != ''){
                          const value = formValue[childFieldName];
                          this.templateForm.get(step.field_name).get(childFieldName).setValue(value);
                        }
                      }
                      break;
                    case "number":
                        let gvalue;
                        const value = formValue[childFieldName];
                        if(value != null && value != ''){
                          gvalue = value;
                        }else{
                          gvalue = 0;
                        }
                        this.templateForm.get(step.field_name).get(childFieldName).setValue(gvalue);
                      break;
                    case "list_of_checkbox":
                      this.templateForm.get(step.field_name).get(childFieldName).patchValue([]);
                      break;
                    default:
                      if(formValue[childFieldName] != null && formValue[childFieldName] != undefined && formValue[childFieldName] != ''){
                        const value = formValue[childFieldName];
                        this.templateForm.get(step.field_name).get(childFieldName).setValue(value);
                      }
                      break;
                  }
                  if(data.tree_view_object && data.tree_view_object.field_name != ""){
                    let editeTreeModifyData = JSON.parse(JSON.stringify(data.tree_view_object));
                    const treeObject = this.selectedRow[editeTreeModifyData.field_name];
                    this.templateForm.get(step.field_name).get(editeTreeModifyData.field_name).setValue(treeObject);
                  } 
                });
              }
            });
          }
          break;            
        case "number":
          if(object != null && object != undefined){
            let value;
            if(object != null && object != ''){
              value = object;
              this.templateForm.controls[fieldName].setValue(value)
            }else if(object == 0){
              value = object;
              this.templateForm.controls[fieldName].setValue(value)
            }
          }
        break;            
        case "gmap":        
        case "gmapview":
          if(object != null && object != undefined){
            if(formValue['longitude']){
              this.longitude = formValue['longitude'];
            }
            if(formValue['latitude']){
              this.latitude = formValue['latitude'];
            }
            if(formValue['zoom']){
              this.zoom = formValue['zoom'];
            }    
            if(this.longitude != 0 && this.latitude != 0){
              this.getAddress(this.latitude,this.longitude)
            } 
            this.templateForm.controls[fieldName].setValue(object)
          }
          break;
        case "daterange":
          if(object != null && object != undefined){
            let list_of_dates = [
              {field_name : 'start'},
              {field_name : 'end'}
            ]
            if (list_of_dates.length > 0) {
              list_of_dates.forEach((data) => { 
                let childFieldName = data.field_name;
                this.templateForm.get(fieldName).get(childFieldName).setValue(object[childFieldName]);
              });
            } 
          }                                  
          break;
        case "date":
          if(object != null && object != undefined){
            if(date_format && date_format != '' && typeof object === 'string'){
              const date = object[fieldName];
              const dateMonthYear = date.split('/');
              const formatedDate = dateMonthYear[2]+"-"+dateMonthYear[1]+"-"+dateMonthYear[0];
              const value = new Date(formatedDate);
              this.templateForm.controls[fieldName].setValue(value)
            }else{                  
              const value = formValue[fieldName] == null ? null : formValue[fieldName];
              this.templateForm.controls[fieldName].setValue(value);                  
            }
          }
          break;
        case "tabular_data_selector":   
          if(object != undefined && object != null){
            this.custmizedFormValue[fieldName] = JSON.parse(JSON.stringify(object));     
          } 
          if(Array.isArray(this.staticData[ddn_field]) && Array.isArray(this.custmizedFormValue[fieldName])){
            this.custmizedFormValue[fieldName].forEach(staData => {
              if(this.staticData[ddn_field][staData._id]){
                this.staticData[ddn_field][staData._id].selected = true;
              }
            });
          }          
          break;
        case "list_of_checkbox":
          this.templateForm.controls[fieldName].setValue([]);
          break;
        default:
          if(object != null && object != undefined){
            const value = object == null ? null : object;
            this.templateForm.controls[fieldName].setValue(value);
          }
          break;
      } 
     
    if(tree_view_object && tree_view_object.field_name != ""){
      let editeTreeModifyData = JSON.parse(JSON.stringify(tree_view_object));
      const object = this.selectedRow[editeTreeModifyData.field_name];
      this.templateForm.controls[editeTreeModifyData.field_name].setValue(object)
    }
  }
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }  
  async getAddress(latitude, longitude)  {
    await new Promise((resolve, reject) => { 
      this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            resolve (this.address = results[0].formatted_address);
          } else {
            console.log("Geocoder status error: ", status);
            reject()
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }  
      });
    })
  } 
  checkShowIfListOfFiedlds(parent,field){
    let formValue = this.getFormValue(true);
    let fieldValue = formValue[parent];    
    if(fieldValue && fieldValue.length > 0 && field && field.show_if && field.show_if != null && field.show_if != ''){
      let check = 0;      
      for (let index = 0; index < fieldValue.length; index++) {
        const value = fieldValue[index];
        formValue[parent] = value;
        if(this.commonFunctionService.showIf(field,formValue)){
          check = 1;
          break;
        }        
      }
      if(check == 1){
        return false;
      }else{
        return true;
      }
    }else{
      return false;
    }
  }
  refreshApiCall(field:any,check:any){
    const fields = [field];
    const payloads = this.commonFunctionService.commanApiPayload([],fields,[],this.getFormValue(true));
    this.callStaticData(payloads);
  }  
  storeFormDetails(parent_field:any,field:any,index?:number){
    let formValueWithCustomData = this.getFormValue(true);
    let formValue = this.getFormValue(false);
    let targetFieldName ={}
    targetFieldName['form'] = {}
    targetFieldName['custom'] = [];

    let updateMode =  this.updateMode;
    let formData = JSON.parse(JSON.stringify(formValueWithCustomData));
    if(field && field.form_field_name){
      const nextFormReference = {
        '_id':this.nextFormData._id,
        'name':this.nextFormData.name
      }
      formData[field.form_field_name] = nextFormReference;
      updateMode = true;
    }
    if(this.coreFunctionService.isNotBlank(field.add_new_target_field)){
      targetFieldName['form'][field.add_new_target_field] = this.lastTypeaheadTypeValue
    }else if(field){
      switch (field.type) {
        case "list_of_fields":
        case "grid_selection":
          let currentFieldData = formData[field.field_name];
          if(currentFieldData && Array.isArray(currentFieldData)){
              if(index != undefined && index >= 0){        
                targetFieldName['form'] = currentFieldData[index];
                targetFieldName['updataModeInPopupType'] = true;
              }else {
                targetFieldName['custom'] = currentFieldData;
              }
          }
          break;      
        default:
          break;
      }
      
     
    } 
    if(this.coreFunctionService.isNotBlank(field.moveFieldsToNewForm)){
      if(field.moveFieldsToNewForm && field.moveFieldsToNewForm.length > 0){
        field.moveFieldsToNewForm.forEach(keyValue => {
          const sourceTarget = keyValue.split("#");
          let key = sourceTarget[0];
          let valueField = sourceTarget[1];
          let multiCollection = JSON.parse(JSON.stringify(this.multipleFormCollection));
          let formValueWithMulticollection = this.commonFunctionService.getFormDataInMultiformCollection(multiCollection,formValue);
          let value = this.commonFunctionService.getObjectValue(valueField,formValueWithMulticollection);
          targetFieldName['form'][key] = value;
        });
      }
    }   
    let form = {
      "collection_name":this.currentMenu.name,
      "data":formData,
      "form":this.form,
      "parent_field":parent_field,
      "current_field":field,
      "next_form_data":targetFieldName,
      "updateMode" : updateMode,
      "form_value" : JSON.parse(JSON.stringify(formValue)),
      "index": -1,
      "listOfFieldUpdateMode":this.listOfFieldUpdateMode,
      "listOfFieldsUpdateIndex":this.listOfFieldsUpdateIndex
    }
    if(field){      
        const type = field.type;
        switch (type) {
          case "list_of_fields":
          case "grid_selection":
            if(index != undefined){
              form['index'] = index;
            }
            break;      
          default:
            break;
        }
           
    }
    this.multipleFormCollection.push(form);
    let id = '';
    if(field && field.type == "list_of_fields"){
      let buttonLabel = "";
      if(index != undefined && index >= 0){
        buttonLabel = 'Update';
      }else{
        buttonLabel = 'Add';
      }
      if(field.list_of_fields && field.list_of_fields.length > 0){
        let fieldList:any = JSON.parse(JSON.stringify(field.list_of_fields));
        if(fieldList && fieldList.length > 0 && index == undefined){
          let curField = JSON.parse(JSON.stringify(field));
          curField['add_list_field'] = 'add';
          fieldList.push(curField);
        }
        let form = {
          "details": {
              "class": "",
              "collection_name":"",
              "bulk_update":false
              },
          "tab_list_buttons": [
              {
                  "label": buttonLabel,
                  "onclick": {
                          "api": "add", 
                          "action_name": "", 
                          "close_form_on_succes": false
                      },
                  "type": "button",
                  "field_name": "save",
                  "api_params": "",
                  "show_if":"",
                  "disable_if":""
              },
              {
                "label": "Ok",
                "onclick": {
                        "api": "close", 
                        "action_name": "", 
                        "close_form_on_succes": false
                    },
                "type": "button",
                "field_name": "",
                "api_params": "",
                "show_if":"",
                "disable_if":""
            }
          ],
          "tableFields": fieldList,
          "api_params": null,
          "label": field.label
          }
        this.loadNextForm(form);
      }else{
        if(field.form && field.form._id){
          id = field.form._id;
        }
        this.getNextFormById(id);
      }
    }else{
      if(field.add_new_form && field.add_new_form._id){
        id = field.add_new_form._id;
      }
      this.getNextFormById(id);
      this.addNewRecord = false;
      if(!this.enableNextButton && field && field.find_child_form){
        const reqCriteria = ["collection.name;eq;" + this.currentMenu.name + ";STATIC"];
        const reqParams = 'scheduled_task_form';
        this.getDataForNextForm(reqParams,reqCriteria);
      }      
    }    
  }
  previousFormFocusField:any = {};
  focusFieldParent:any={};
  private getDataForNextForm(reqParams,reqCriteria) {    
    const request = this.commonFunctionService.getDataForGrid(1, {}, { 'name': reqParams }, [], {}, '');
    const crList = this.commonFunctionService.getCriteriaList(reqCriteria, {});
    request.data.crList = crList;
    this.apiService.getNextFormData(request);
  }
  private getNextFormById(id: string) {
    const params = "form";
    const criteria = ["_id;eq;" + id + ";STATIC"];
    const payload = this.commonFunctionService.getPaylodWithCriteria(params, '', criteria, {});
    this.apiService.GetNestedForm(payload);
  }
  loadPreviousForm(){
    let multiFormLength = this.multipleFormCollection.length;
    const lastIndex = multiFormLength - 1;
    const formCollecition = this.multipleFormCollection[lastIndex];
    let previousFormData = {};
    if(multiFormLength > 1){
      previousFormData = this.multipleFormCollection[multiFormLength - 2];
    }
    this.form = formCollecition['form'];
    this.resetFlagsForNewForm();
    const data = formCollecition['data'];

    this.updateMode = formCollecition['updateMode'];
    if(this.updateMode || this.complete_object_payload_mode){
      this.selectedRow = data;
    }
    this.setForm();
    this.updateDataOnFormField(data);
    this.getStaticDataWithDependentData();
    this.currentMenu['name'] = formCollecition['collection_name'];
    this.previousFormFocusField = formCollecition['current_field'];
    this.focusFieldParent = formCollecition['parent_field']; 
    if(this.previousFormFocusField && this.previousFormFocusField['add_next_form_button']){
      this.enableNextButton = true;
    }else{
      this.enableNextButton = false;
    }
    let nextFormData ={};
    if(formCollecition && formCollecition['next_form_data'] && formCollecition['next_form_data']['form']){
      nextFormData = formCollecition['next_form_data']['form']; 
    }
    if(previousFormData && previousFormData['index'] != undefined && previousFormData['index'] >= 0){
      this.nextFormUpdateMode = true;
    } 
    let previousFormFocusFieldValue = '';
    if(this.coreFunctionService.isNotBlank(this.previousFormFocusField.add_new_target_field)){
      previousFormFocusFieldValue = nextFormData[this.previousFormFocusField.add_new_target_field];
    }
    const parentfield = formCollecition['parent_field'];
    if(!this.previousFormFocusField.multi_select && this.previousFormFocusField.type != 'list_of_fields' && this.previousFormFocusField.type != 'hidden'){
      if(parentfield != ''){
        this.templateForm.get(parentfield.field_name).get(this.previousFormFocusField.field_name).setValue(previousFormFocusFieldValue);       
      }else{      
        this.templateForm.get(this.previousFormFocusField.field_name).setValue(previousFormFocusFieldValue);
      } 
    } 
    if(this.previousFormFocusField.type == 'list_of_fields'){
      // this.previousFormFocusField = {};
    }  
    switch (formCollecition['current_field'].type) {
      case "typeahead":
        this.callTypeaheadData(formCollecition['current_field'],this.getFormValue(false));
        break;
      default:
        break;
    }
    if(this.focusFieldParent && this.focusFieldParent.type == "list_of_fields" && this.focusFieldParent.datatype == "list_of_object"){
      const listOfFieldUpdateMode = formCollecition['listOfFieldUpdateMode'];
      if(listOfFieldUpdateMode){
        const listOfFieldsUpdateIndex = formCollecition['listOfFieldsUpdateIndex'];
        if(listOfFieldsUpdateIndex != -1){
          const fieldName = this.focusFieldParent.field_name;
          if(fieldName && fieldName != ""){
            const listData = data[fieldName];
            const editedData = listData[listOfFieldsUpdateIndex];
            this.editListOfFiedls(listOfFieldsUpdateIndex,this.focusFieldParent);
          }          
        }
      }
    }    
    this.multipleFormCollection.splice(lastIndex,1);    
  }
  loadNextForm(form: any){    
    this.form = form;
    this.resetFlagsForNewForm();
    this.setForm();    
    let nextFormData:any = {}
    if(this.multipleFormCollection.length > 0){
      nextFormData = this.multipleFormCollection[this.multipleFormCollection.length -1];
    }
    if(this.updateAddNew){
      this.getNextFormData(nextFormData);
    }
    let cdata = {};
    let fData = {};
    if(nextFormData && nextFormData['next_form_data'] && nextFormData['next_form_data']['custom']){
       cdata = nextFormData['next_form_data']['custom'];
    }
    if(nextFormData && nextFormData['next_form_data'] && nextFormData['next_form_data']['form']){
       fData = nextFormData['next_form_data']['form'];
    }  
    if(nextFormData['index'] != undefined && nextFormData['index'] >= 0){
      this.nextFormUpdateMode = true;
    } 
    
    if(nextFormData && nextFormData['current_field'] && nextFormData['current_field']['type'] && (nextFormData['index'] == undefined || nextFormData['index'] == -1)){
      switch (nextFormData['current_field']['type']) {
        case 'list_of_fields':
        case 'grid_selection':
          const fieldName = nextFormData['current_field']['field_name'];
          if(Array.isArray(cdata)){
            this.custmizedFormValue[fieldName] = cdata;
            this.modifyCustmizedValue(fieldName);
          }
          break;      
        default:
          break;
      }       
    }    
    if(nextFormData && nextFormData['next_form_data'] && nextFormData['next_form_data']['updataModeInPopupType']){
      this.editedRowData(fData);
    }else{      
      this.updateDataOnFormField(fData); 
      if(this.editedRowIndex >= 0 || Object.keys(fData).length > 0){
        this.getStaticDataWithDependentData();
      }   
    }
    let nextFormFocusedFieldname = '';
    for (let key in fData) {
      nextFormFocusedFieldname = key;
      break;
    }
    if (this.tableFields && this.tableFields.length > 0) {
      for (let i = 0; i < this.tableFields.length; i++) {
        const element = this.tableFields[i];
        if(nextFormFocusedFieldname == element.field_name){
          this.previousFormFocusField = element;
          break;
        }        
      }
    }
  }
  setPreviousFormTargetFieldData(){
    if(this.multipleFormCollection.length > 0){
      const previousFormIndex = this.multipleFormCollection.length - 1;
      const previousFormData = this.multipleFormCollection[previousFormIndex];
      const previousFormField = previousFormData.current_field;
      const formData = previousFormData.next_form_data;
      if(previousFormField && previousFormField.add_new_target_field){
        const targateFieldName = previousFormField.add_new_target_field;          
        const currentFormValue = this.getFormValue(true)
        const currentTargetFieldValue = currentFormValue[targateFieldName]
        formData[targateFieldName] = currentTargetFieldValue;
      }      
      this.multipleFormCollection[previousFormIndex]['next_form_data'] = formData;
    }
  }
  setListoffieldData(){
    const previousFormIndex = this.multipleFormCollection.length - 1;
    const previousFormCollection = this.multipleFormCollection[previousFormIndex];
    const previousFormField = previousFormCollection.current_field;
    let formValueWithCustomData = this.getFormValue(true)
    const currentFormValue = JSON.parse(JSON.stringify(this.commonFunctionService.sanitizeObject(this.tableFields,formValueWithCustomData,false)));
    this.updateMode = false;
    const fieldName = previousFormField.field_name;
    delete currentFormValue[fieldName];  
    const previousformData = previousFormCollection.data;
    if(previousFormField && previousFormField.type){
      switch (previousFormField.type) {
        case 'list_of_fields':
        case 'grid_selection':
          let fieldData = previousformData[fieldName];
          let index = previousFormCollection['index'];
          let checkDublicate = this.checkDublicateOnForm(this.tableFields,this.templateForm.getRawValue(),fieldData,index);
          if(!checkDublicate.status){            
            if(Array.isArray(fieldData)){
              if(index != undefined && index >= 0){
                fieldData[index] = currentFormValue;
              }else{
                currentFormValue['customEntry']=true; 
                fieldData.push(currentFormValue);
              }
            }else{
              fieldData = [];
              currentFormValue['customEntry']=true;
              fieldData.push(currentFormValue);
            }     
            
            if(index != undefined && index >= 0){
              this.custmizedFormValue = {};
              this.modifyCustmizedFormValue = {};
              this.custmizedFormValue[fieldName] = JSON.parse(JSON.stringify(fieldData));
              this.modifyCustmizedValue(fieldName);
              previousformData[fieldName] = this.custmizedFormValue[fieldName];
              this.multipleFormCollection[previousFormIndex]['data'] = previousformData; 
              this.close();
            }else{
              this.donotResetField();
              this.custmizedFormValue = {};
              this.modifyCustmizedFormValue = {};
              this.custmizedFormValue[fieldName] = JSON.parse(JSON.stringify(fieldData));
              this.modifyCustmizedValue(fieldName);
              previousformData[fieldName] = this.custmizedFormValue[fieldName];
              this.multipleFormCollection[previousFormIndex]['data'] = previousformData; 

              
              this.templateForm.reset()
              if(Object.keys(this.donotResetFieldLists).length > 0){
                this.updateDataOnFormField(this.donotResetFieldLists);
                this.donotResetFieldLists = {};
              }

            }
          }else{
            this.notificationService.notify('bg-danger',checkDublicate.msg);
          }
          break;      
        default:
          break;
      }      
    }else{
      previousformData[fieldName] = currentFormValue;
      if(!this.enableNextButton){
        this.enableNextButton = true;
      }
      this.multipleFormCollection[previousFormIndex]['data'] = previousformData; 
      this.close();
    } 
  }
  checkDublicateOnForm(fields,value,list,i,parent?){
    let checkDublic = {
      status : false,
      msg : ""
    }
    if(fields && fields.length > 0){
      let checkValue = 0;
      let field_control:any = "";
      let list_of_field_data = value;
      for (let index = 0; index < fields.length; index++) {
        const element = fields[index];
        let custmizedKey = '';
        let custmizedData = '';
        if(parent && parent != ''){
          custmizedKey = this.commonFunctionService.custmizedKey(parent);
          field_control = this.templateForm.get(parent.field_name);
        }
        if(custmizedKey && custmizedKey != '' && this.custmizedFormValue[custmizedKey] && this.custmizedFormValue[custmizedKey][element.field_name]){
          custmizedData = this.custmizedFormValue[custmizedKey][element.field_name]
        }else{
          if(this.custmizedFormValue[element.field_name] && this.custmizedFormValue[element.field_name].length > 0){
            custmizedData = this.custmizedFormValue[element.field_name]
          }          
        }
        let mendatory = false;
        if(element.is_mandatory){
          if(element && element.show_if && element.show_if != ''){
            if(this.checkFieldShowOrHide(element)){
              mendatory = true;
            }else{
              mendatory = false;
            }
          }else{
            mendatory = true;
          }            
        }                   
        switch (element.datatype) {
          case 'list_of_object':              
            if (list_of_field_data[element.field_name] == '' || list_of_field_data[element.field_name] == null) {
              if(mendatory && custmizedData == ''){
                if(custmizedData.length == 0){
                  checkValue = 1;
                  checkDublic.status = true
                  checkDublic.msg = "Please Enter " + element.label;
                  //this.notificationService.notify("bg-danger", "Please Enter " + element.label);
                  return checkDublic;
                }
              }
            }else{
              checkDublic.status = true
              checkDublic.msg = 'Entered value for '+element.label+' is not valid. !!!';
              //this.notificationService.notify('bg-danger','Entered value for '+element.label+' is not valid. !!!');
              return checkDublic;
            }
            break; 
          case 'object':
            if (list_of_field_data[element.field_name] == '' || list_of_field_data[element.field_name] == null) {
              if(mendatory){                  
                checkValue = 1;
                checkDublic.status = true
                checkDublic.msg = "Please Enter " + element.label;
                //this.notificationService.notify("bg-danger", "Please Enter " + element.label);
                return checkDublic;    
              }
            }else if(typeof list_of_field_data[element.field_name] != 'object'){
              checkDublic.status = true
              checkDublic.msg = 'Entered value for '+element.label+' is not valid. !!!';
              //this.notificationService.notify('bg-danger','Entered value for '+element.label+' is not valid. !!!');
              return checkDublic;
            }
            break;         
          default:
            break;
        }
        switch (element.type) {
          case 'list_of_string':
            if (list_of_field_data[element.field_name] == '' || list_of_field_data[element.field_name] == null) {
              if(mendatory && custmizedData == ''){
                if(custmizedData.length == 0){
                  checkValue = 1;
                  checkDublic.status = true
                  checkDublic.msg = "Please Enter " + element.label;
                  //this.notificationService.notify("bg-danger", "Please Enter " + element.label);
                  return checkDublic;
                }
              }
            }else{
              checkDublic.status = true
              checkDublic.msg = 'Entered value for '+element.label+' is not valid. !!!';
              //this.notificationService.notify('bg-danger','Entered value for '+element.label+' is not valid. !!!');
              return checkDublic;
            }
            break;  
          case 'typeahead':
            if(element.datatype == "text"){
              if (list_of_field_data[element.field_name] == '' || list_of_field_data[element.field_name] == null) {
                if(mendatory){
                  if(custmizedData.length == 0){
                    checkValue = 1;
                    checkDublic.status = true
                    checkDublic.msg = "Please Enter " + element.label;
                    //this.notificationService.notify("bg-danger", "Please Enter " + element.label);
                    return checkDublic;
                  }
                }
              }else if(field_control && field_control != "" ){
                if( field_control.get(element.field_name).errors?.required || field_control.get(element.field_name).errors?.validDataText){
                  checkDublic.status = true
                  checkDublic.msg = 'Entered value for '+element.label+' is invalidData. !!!';
                  //this.notificationService.notify('bg-danger','Entered value for '+element.label+' is invalidData. !!!');
                  return checkDublic;
                }
              }

            }
            break;        
          default:
            if (list_of_field_data[element.field_name] == '' || list_of_field_data[element.field_name] == null) {
              if(mendatory ){
                checkValue = 1;
                checkDublic.msg = "Please Enter " + element.label;
                //this.notificationService.notify("bg-danger", "Please Enter " + element.label);
              }
            }
            break;
        }
        if(element.primary_key_for_list){
          let primary_key_field_value = value[element.field_name];            
          let alreadyAdded = {
            status : false,
            msg : ""
          };
          if(list && list.length > 0){
            alreadyAdded = this.checkDataAlreadyAddedInListOrNot(element,primary_key_field_value,list,i);
          }
          if(alreadyAdded && alreadyAdded.status){
            checkDublic.status = true;
            if(alreadyAdded.msg && alreadyAdded.msg != ""){
              checkDublic.msg = alreadyAdded.msg;
            }else{
              checkDublic.msg = "Entered value for "+element.label+" is already added. !!!";
            }
            break;
          }
        }
      };
      if (checkValue == 1) {
        checkDublic.status = true;
      }
    }
    return checkDublic;
  }

  colorchange(tableField:any, colorval:string) {
    if(tableField.field_name  && colorval != "" && colorval.length == 7) {
      this.templateForm.get(tableField.field_name).setValue(colorval)
    }else {
      this.templateForm.get(tableField.field_name).setValue("")
    }
  }
  public dinamicApiField:any="";
  dinamicApiCall(tableField,value){
    this.dinamicApiField = tableField.api_call_name;
    let payload:any = '';
    let api = '';
    switch (tableField.api_call_name) {
      case 'gst_number':
        api = tableField.api;
        payload = this.commonFunctionService.getPaylodWithCriteria('test','',[],{}) ;
        payload['gstin'] =  value;        
        break;    
      default:
        break;
    }
    if(api != ''){
      this.apiService.fieldDinamicApi(api,payload);
    }
  }
  addListOfFields(field){
    this.storeFormDetails("",field);
  }
  updateListofFields(field,object,index){
    let searchValue = this.term[field.field_name];
    let correctIndex = index;
    let data = this.custmizedFormValue[field.field_name];    
    if(searchValue != '' || data && data.length > this.pageSize){
      if(searchValue == undefined || searchValue == ''){
        searchValue = this.pageNo;
      }
      correctIndex = this.gridCommonFunctionService.getCorrectIndex(object,index,field,data,searchValue);
    } 
    this.storeFormDetails("",field,correctIndex); 
  }
  
  nextForm(){
    if(this.nextFormData && this.nextFormData.formName){
      this.openNextForm(true);
      this.enableNextButton = false;
    }    
  }
  openNextForm(next) {
    const form = this.nextFormData.formName;
    const field_name = this.nextFormData.field_name;
    const form_field_name = this.nextFormData.form_field_name;
    const field = {
      'add_new_form': form,
      'add_next_form_button': next,
      'field_name': field_name,
      'type': 'hidden',
      'form_field_name': form_field_name,
      'form_value_index' : 0,
      'moveFieldsToNewForm' : ['employee_name#add_assignments.resource_name']
    };
    this.storeFormDetails('', field);
  }
  updateAddNewField(parent,child){
    if(child && child.onchange_get_next_form){
      let fieldValue:any = '';
      if(parent != ''){
        fieldValue = this.templateForm.get(parent.field_name).get(child.field_name).value;
      }else{
        fieldValue = this.templateForm.get(child.field_name).value;
      }
      if(fieldValue && fieldValue._id && fieldValue._id != ''){
        this.onchangeNextForm = true;
        const reqCriteria = ["_id;eq;" + fieldValue._id + ";STATIC"];
        const reqParams = child.api_params;
        this.getDataForNextForm(reqParams,reqCriteria);
        this.tempVal[child.field_name + "_add_button"] = false;
      }
    }else{
      this.storeFormDetails(parent,child);
      this.updateAddNew = true;
    }    
  }
  getNextFormData(formData){
    if(formData){
      let parent:any = '';
      let child:any = '';
      if(formData['parent_field']){
        parent = formData['parent_field'];
      }
      if(formData['current_field']){
        child = formData['current_field'];
      }
      let formValue = formData['data'];
      let fieldValue:any = '';
      if(parent != ''){
        if(parent.type == 'list_of_fields'){
          fieldValue = formValue[parent.field_name][this.listOfFieldsUpdateIndex][child.field_name];
        }else{
          fieldValue = formValue[parent.field_name][child.field_name];
        }
      }else{
        fieldValue = formValue[child.field_name];
      }    
      if(fieldValue && fieldValue._id && fieldValue._id != ''){
        //console.log(fieldValue._id);
        const params = child.api_params;
        if(params && params != ''){
          const criteria = ["_id;eq;"+fieldValue._id+";STATIC"]
          const crList = this.commonFunctionService.getCriteriaList(criteria,{});
          const payload = this.commonFunctionService.getDataForGrid(1,{},{'name':params},[],{},'');
          payload.data.crList = crList;
          this.apiService.getGridData(payload);
          this.updateAddNew = true;
        }else{
          this.updateAddNew = false;
        }     
      }else{
        this.updateAddNew = false;
      }
    }else{
      this.updateAddNew = false;
    }
  }
  showData(parent,field){
    if(parent != ''){

    }else{
      this.showGridData[field.field_name] = !this.showGridData[field.field_name];
    }

  }
  gridSelectionSearch(field){
    if(this.pageNo[field.field_name]  != 1) this.pageNo[field.field_name] = 1;
  }

  onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    
    const element = document.getElementById('form_resize');
    if(!element) return;
    const initialWidth = element.offsetWidth;
    const initialHeight = element.offsetHeight;
    const initialX = event.clientX;
    const initialY = event.clientY;
    
    const mouseMoveHandler = (e: MouseEvent) => {
      const width = initialWidth + (e.clientX - initialX);
      const height = initialHeight + (e.clientY - initialY);
      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
    };
    
    const mouseUpHandler = () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };
    
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }

}
