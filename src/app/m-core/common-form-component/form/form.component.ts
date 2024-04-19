import { Component, OnInit, OnChanges, Input, Output, EventEmitter, OnDestroy, SimpleChanges, ViewChild, Inject, AfterViewInit, ElementRef,NgZone, HostListener } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common'; 
import { ModalDirective } from 'angular-bootstrap-md';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Subscription } from 'rxjs';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { JsonEditorOptions, JsonEditorComponent} from "@maaxgr/ang-jsoneditor";
import { StorageService, CommonFunctionService, ApiService, ModelService, DataShareService, NotificationService, EnvService, CoreFunctionService, CustomvalidationService, GridCommonFunctionService, LimsCalculationsService,TreeComponentService,Common, FileHandlerService,editorConfig,minieditorConfig,htmlViewConfig, FormCreationService, FormValueService, ApiCallService, FormControlService, CheckIfService, GridSelectionService, ApiCallResponceService, MultipleFormService, DownloadService } from '@core/web-core';

declare var tinymce: any;

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  
  editorOptions: JsonEditorOptions;
  //https://www.npmjs.com/package/@kolkov/angular-editor
  editorConfig:AngularEditorConfig = editorConfig as AngularEditorConfig;
  minieditorConfig:AngularEditorConfig = minieditorConfig as AngularEditorConfig;
  htmlViewConfig:AngularEditorConfig = htmlViewConfig as AngularEditorConfig;
  tinymceConfig = {} 
  tinymceapikey = Common.TINYMICAPIKEY;
  templateForm: UntypedFormGroup;
  showSearchLength = 6;
  //@Output() filledFormData = new EventEmitter();
  @Output() addAndUpdateResponce = new EventEmitter();
  @Output() formDetails = new EventEmitter();
  @Input() tabIndex: number;
  @Input() editedRowIndex: number;
  @Input() formName: string;
  @Input() id: string;
  @Input() selectContact: string;
  @Input() isBulkUpdate:boolean;
  @Input() bulkDataList:any;
  @ViewChild('formModal') public formModal: ModalDirective;
  //@ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @ViewChild('stepper') stepper;
  @ViewChild('search') public searchElementRef: ElementRef;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  @ViewChild(GoogleMap) public map!: GoogleMap;
  //@ViewChild('templateFormRef') templateFormRef: ElementRef;
  
  // Stepper Variables
  isLinear:boolean=true;
  isStepper:boolean = false;

  bulkupdates:boolean = false;

  objectKeys = Object.keys;
  updateAddNew:boolean = false;
  hide = true;
  showSidebar:boolean = false;  
  showNotify: boolean = false;
  currentMenu: any;
  //formSaveBtn: boolean = false;
  //formUpdateBtn: boolean = false;
  //formDeleteBtn: boolean = false;
  //formResetBtn: boolean = false;
  //list_of_fields: any = [];
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
  calculationFieldList:any=[];
  customValidationFiels:any=[];
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
  addOrUpdateIconShowHideList:any={}; // editListOfString() index variable
  listOfFieldUpdateMode:boolean=false;
  listOfFieldsUpdateIndex:any = -1;
  public deleteIndex:any = '';
  public deletefieldName = {};
  //public alertData = {};

  public curTreeViewField: any = {};
  curFormField:any={};
  curParentFormField:any={};
  treeViewData: any = {};
  dataSaveInProgress: boolean = true;
  //submitted:boolean=false;
  forms:any={};
  form:any={};
  //formIndex:number=0;
  pdfViewLink:any='';
  pdfViewListData:any=[];
  curFileUploadField:any={}
  curFileUploadFieldparentfield:any={};
  dataListForUpload:any = {};
  //uploadFilesList:any = []
  clickFieldName:any={};
  downloadClick='';
  grid_view_mode:any='';
  minDate: Date;
  maxDate: Date;
  dinamic_form:any={};
  checkForDownloadReport:boolean = false;
  currentActionButton:any={};
  saveResponceData:any={};
  

  //Google map variables
  latitude: number = 0;
  longitude: number = 0;
  zoom: number = 10;
  center: google.maps.LatLngLiteral = {lat: 0, lng: 0};
  address: string;
  private geoCoder;
  getLocation:boolean = false;
  //mapsAPILoaded: Observable<boolean>;

  checkFormFieldAutfocus:boolean=false;

  //mat chips variables
  separatorKeysCodes: number[] = [ENTER, COMMA];
  //visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true; 

  //multi form related variables
  public multipleFormCollection:any=[];
  public nextFormData:any ={};
  public onchangeNextForm:boolean = false;

  public donotResetFieldLists:any={};
  public fieldApiValidaton:string = '';
  public fieldApiValMsg:string='';

  
  previousFormFocusField:any = {};
  focusFieldParent:any={};  
  public dinamicApiField:any="";   
  currentTreeViewFieldParent:any='';    
  public addNewRecord:boolean = false;
  public lastTypeaheadTypeValue="";

  //public style:string  = 'width: 100px, height: 100px, backgroundColor: cornflowerblue';

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
  gridRealTimeDataSubscription:Subscription;

  isGridSelectionOpen: boolean = true;
  deleteGridRowData: boolean = false;
  //filterdata = '';
  term:any={};
  pageNo:any={};
  pageSize:any=100;
  showGridData:any={};
  serverReq:boolean = false;
  actionButtonNameList:any=["save","update","updateandnext","send_email"];
  
  headerFiledsData = [];
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  // nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();
  // treeControl:any={};
  // treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;
  // dataSource:any={};  

  // @HostListener('document:click') clickout() {
  //   this.term = {};
  // }

  constructor(
    private formBuilder: UntypedFormBuilder, 
    private storageService: StorageService,
    private commonFunctionService:CommonFunctionService, 
    private modalService: ModelService, 
    private router: Router,
    private routers: ActivatedRoute,
    @Inject(DOCUMENT) document,
    private apiService:ApiService,
    private dataShareService:DataShareService,
    private notificationService:NotificationService,
    private envService:EnvService,
    private coreFunctionService:CoreFunctionService,
    private customValidationService:CustomvalidationService,
    private gridCommonFunctionService:GridCommonFunctionService,
    private ngZone: NgZone,
    private limsCalculationsService:LimsCalculationsService,
    private treeComponentService: TreeComponentService,
    private fileHandlerService: FileHandlerService,
    private formCreationService:FormCreationService,
    private formValueService:FormValueService,
    private apiCallService:ApiCallService,
    private formControlService:FormControlService,
    private checkIfService:CheckIfService,
    private gridSelectionService:GridSelectionService,
    private apiCallResponceService:ApiCallResponceService,
    private multipleFormService:MultipleFormService,
    private downloadService:DownloadService
) {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mode = "text";
    let tinymicEditorKey = this.storageService.getApplicationSetting()?.tinyMicCapikey;
    if(tinymicEditorKey && tinymicEditorKey != '') this.tinymceapikey = tinymicEditorKey;
    // this.treeFlattener = new MatTreeFlattener(
    //   this.transformer,
    //   this.getLevel,
    //   this.isExpandable,
    //   this.getChildren,
    // );
    //this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    //this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.tinymceConfig = {
      height: 500,
      branding: false,
      menubar: 'file edit view insert format tc help',
      plugins: 'print preview powerpaste paste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks code visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker imagetools textpattern noneditable help formatpainter permanentpen pageembed charmap mentions quickbars linkchecker emoticons advtable export',
      toolbar:
      "undo redo | revisionhistory | aidialog aishortcuts | blocks fontsizeinput fontfamily bold italic underline forecolor backcolor align numlist bullist table image link media pageembed | lineheight outdent indent | strikethrough formatpainter removeformat | charmap emoticons checklist | code fullscreen preview | save print | pagebreak anchor codesample footnotes mergetags | addtemplate inserttemplate | addcomment showcomments | ltr rtl casechange | spellcheckdialog a11ycheck typography help",
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
      content_style: ' body > * {line-height:18px !important; text-transform:capitalize;} table:not([cellpadding]) td, table:not([cellpadding]) th {padding:0 0.4rem;}'
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
      this.tabFilterData = this.apiCallResponceService.setGridFilterData(data,this.tabFilterData);
    })
    this.typeaheadDataSubscription = this.dataShareService.typeAheadData.subscribe(data =>{
      this.typeAheadData = this.apiCallResponceService.setTypeaheadData(data,this.typeAheadData);
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
    this.gridRealTimeDataSubscription = this.dataShareService.gridRunningData.subscribe(data =>{
      this.updateRunningData(data.data);
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
        this.calculationFieldList=[];
        this.tableFields = [];
        this.showIfFieldList=[];
        this.buttonIfList=[];
        this.disableIfFieldList=[];
        this.mendetoryIfFieldList = [];
        this.gridSelectionMendetoryList=[];
        this.customValidationFiels = [];
        this.canUpdateIfFieldList=[];
        this.formFieldButtons=[];
        //this.list_of_fields = [];
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
    this.maxDate = new Date(currentYear + 25, 11, 31); 

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
  ngOnInit(): void {  
    // if (this.editedRowIndex >= 0) {
    //   this.selectedRowIndex = this.editedRowIndex;
    //   if(this.elements.length > 0){
    //     this.editedRowData(this.elements[this.editedRowIndex]);
    //   }
    //   //this.handleDisabeIf();     
    // }else{
    //   this.selectedRowIndex = -1;
    //   //this.handleDisabeIf();
    // }
      
    //this.formControlChanges();
    if(this.form && this.form.tableFields && this.form.tableFields.length > 0){
      this.funCallOnFormLoad(this.form.tableFields)
    }

    this.getGooglepMapCurrentPosition();

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
    //this.formIndex=0;   
    this.saveResponceData = {};
    if(this.currentMenu == undefined || (typeof this.currentMenu == "object" && Object.keys(this.currentMenu).length == 0)){
      this.currentMenu = this.storageService.GetActiveMenu();
    }    
    this.changeForm();    
  }
  ngAfterViewInit() {
    // this.mapsApiLoaded();
    this.gmapSearchPlaces();    
  }

  showModal(object){
    this.custmizedFormValue = {}    
    this.modifyCustmizedFormValue = {};
    this.formModal.show();
  }  
  
  //Subsribe Variable Responce Handlin Start ------------------
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
          this.templateForm = this.formControlService.setCheckboxFileListValue(this.checkBoxFieldListValue,this.templateForm, this.staticData,this.selectedRow,this.updateMode);
        }
      });
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
      let templateData = this.formCreationService.getTempData(tempData,this.tabIndex,this.currentMenu,this.formName,this.dinamic_form);
      this.tab = templateData['tab'];
      this.currentMenu = templateData['currentMenu'];
      this.grid_view_mode = templateData['grid_view_mode'];
      this.form = templateData['form'];
      this.forms = templateData['forms'];
      if(this.form && Object.keys(this.forms).length > 0 && this.formName != ''){
        this.setForm();
      }else{
        this.tableFields = [];
        this.formFieldButtons = [];
      }  
    }
  }
  checkFormFieldIfCondition(){
    if(this.buttonIfList.length > 0){
      this.buttonIfList.forEach(element => {
        let fieldIndex = element['fieldIndex'];
        this.tableFields[fieldIndex]['showButton'] = this.formCreationService.checkGridSelectionButtonCondition(element,'add',this.selectedRow,this.templateForm.getRawValue());
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
          this.tableFields[parentIndex].list_of_fields[fieldIndex]['notDisplay'] = this.checkIfService.checkShowIfListOfFiedlds(parentFieldName,element,this.getFormValue(true));
        }else{
          id = element._id;
        }
        let elementDetails = document.getElementById(id);
        if(!this.checkIfService.checkShowIf(element,this.selectedRow,this.templateForm.getRawValue())){          
          if(elementDetails && elementDetails != null){
            const classes = Array.from(elementDetails.classList)
            if(!classes.includes('d-none')){
              this.removeClass(elementDetails,' d-inline-block');
              elementDetails.className += " d-none";
              element['show'] = false;
              const objectValue = this.templateForm.getRawValue();
              if(element.type != "group_of_fields" && element.type != "list_of_fields" && objectValue[element.field_name] && objectValue[element.field_name] != ''){
                let controlarName = element.field_name;
                let count = 0;
                for (let index = 0; index < this.showIfFieldList.length; index++) {
                  let showIfItem = this.showIfFieldList[index];
                  if(controlarName == showIfItem.field_name){
                    count = count+1;
                  }
                  if(count == 2){
                    break;
                  }
                }
                if(count != 2){
                  this.templateForm.get(element.field_name).setValue('');
                }
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
  setGridRowDeleteResponce(responce){
    if(responce && responce['success']){
      this.notificationService.notify("bg-success", responce["success"]+" Data deleted successfull !!!");
      this.dataSaveInProgress = true;
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
  loadNextForm(form: any){    
    this.form = form;
    this.resetFlagsForNewForm();
    this.setForm();   
    let result = this.multipleFormService.updateNextFormData(this.multipleFormCollection,this.nextFormUpdateMode,this.form,this.custmizedFormValue,this.editedRowIndex,this.previousFormFocusField,this.tableFields);
    let nextFormData:any = result.nextFormData;
    if(this.updateAddNew){
      this.getNextFormData(nextFormData);
    }
    let fData = result.fData;
    this.nextFormUpdateMode = result.nextFormUpdateMode;
    this.custmizedFormValue = result.custmizedFormValue;
    if(result.fieldName && result.fieldName != '') this.modifyCustmizedValue(result.fieldName);
    if(result.editFunction) this.editedRowData(fData);
    if(result.updateFormFunction) this.updateDataOnFormField(fData);
    if(result.getStaticData) this.getStaticDataWithDependentData();
    this.previousFormFocusField = result.previousFormFocusField;
  }
  setFileData(getfileData){
    if (getfileData != '' && getfileData != null && this.checkForDownloadReport) {
      const file = new Blob([getfileData.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(file);
      this.downloadService.download(url,getfileData.filename);
      this.dataSaveInProgress = true;
      this.checkForDownloadReport = false;
      this.dataSaveInProgress = true;
      this.apiService.ResetFileData();
    }
  }
  setFileDownloadUrl(fileDownloadUrl){
    if (fileDownloadUrl != '' && fileDownloadUrl != null && this.downloadClick != '') {
      this.downloadService.download(fileDownloadUrl,this.downloadClick);
      this.downloadClick = '';
      this.dataSaveInProgress = true;
      this.apiService.ResetDownloadUrl();
    }
  }
  updateRunningData(data:any){
    if (this.editedRowIndex >= 0) {
      this.selectedRowIndex = this.editedRowIndex;
      if(this.elements.length > 0){
        if(data && data.data){
          if(this.elements[this.editedRowIndex]._id == data.data[0]._id){
            this.editedRowData(data.data[0]);
          }
        }else{
          this.editedRowData(this.elements[this.editedRowIndex]);
        }
      }
    }else{
      this.selectedRowIndex = -1;
      if(this.editedRowIndex == -1) {
        if(data && data._id == undefined) {
          setTimeout(() => {
            this.updateDataOnFormField(data);
          }, 100);
        }
      }
    }
  }
  openNextForm(next) {
    const field = this.multipleFormService.getNextFormObject(this.nextFormData,next);    
    this.storeFormDetails('', field);
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
  dinamicApiCall(tableField,value){
    this.dinamicApiField = tableField.api_call_name;
    let payload:any = '';
    let api = '';
    switch (tableField.api_call_name) {
      case 'gst_number':
        api = tableField.api;
        payload = this.apiCallService.getPaylodWithCriteria('test','',[],{}) ;
        payload['gstin'] =  value;        
        break;    
      default:
        break;
    }
    if(api != ''){
      this.apiService.fieldDinamicApi(api,payload);
    }
  }
  setSaveResponce(saveFromDataRsponce){
    if (saveFromDataRsponce) {
      let result = this.apiCallResponceService.saveFormResponceHandling(saveFromDataRsponce,this.showNotify,this.updateMode,this.currentActionButton,this.nextIndex,this.dataListForUpload,this.saveResponceData,this.custmizedFormValue,this.modifyCustmizedFormValue,this.dataSaveInProgress,this.isStepper,this.complete_object_payload_mode,this.form);      
      this.dataListForUpload =result.dataListForUpload;
      this.saveResponceData = result.saveResponceData;
      this.custmizedFormValue = result.custmizedFormValue;  
      this.modifyCustmizedFormValue = result.modifyCustmizedFormValue;
      this.updateMode = result.updateMode;
      this.complete_object_payload_mode=result.complete_object_payload_mode;
      this.showNotify = result.showNotify;
      this.dataSaveInProgress = result.dataSaveInProgress;
      if(result.isStepper) this.stepper.reset();
      if(result.resetForm) this.checkBeforeResetForm();
      if(result.next) this.next();
      if(result.public.check){
        if(result.public.getFormData && Object.keys(result.public.getFormData).length > 0){
          this.apiService.GetForm(result.public.getFormData);
        }
        this.router.navigate([result.public.url]);
      }
      
      if(result.resetResponce) this.apiService.ResetSaveResponce();
      if(result.successAction) this.checkOnSuccessAction();
      if(result.message && result.message.msg && result.message.msg != ''){
        this.notificationService.notify(result.message.class, result.message.msg);
      } 
      if(this.saveResponceSubscription){
        this.saveResponceSubscription.unsubscribe();
      }
    }   
  }
  //Subsribe Variable Responce Handling End -------------------

  //Click Evnet Function Handling start -----------------
  changeNewForm(formName:string,i){
    this.formName = formName;
    //this.formIndex = i;
    this.changeForm();
  } 
  changePdfView(file){
    if(file.bytes && file.bytes != '' && file.bytes != null){
      const arrayBuffer = file.bytes;
      this.pdfViewLink = arrayBuffer;
    }
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
      this.multipleFormCollection = this.multipleFormService.setPreviousFormTargetFieldData(this.multipleFormCollection,this.getFormValue(true));
    }
    this.updateMode=false;
    this.dataListForUpload = []
    this.filePreviewFields = [];
    this.close();
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
            const value = this.coreFunctionService.removeSpaceFromString(formValue[parentfield.field_name][field.field_name]);
            const checkDublic = this.checkIfService.checkDataAlreadyAddedInListOrNot(field,value, this.custmizedFormValue[custmizedKey]?.[field.field_name] ?? undefined);
            if(this.custmizedFormValue[custmizedKey] && this.custmizedFormValue[custmizedKey][field.field_name] && checkDublic.status){
              this.notificationService.notify('bg-danger','Entered value for '+field.label+' is already added. !!!');
            }else{
              if (!this.custmizedFormValue[custmizedKey]) this.custmizedFormValue[custmizedKey] = {};
              if (!this.custmizedFormValue[custmizedKey][field.field_name]) this.custmizedFormValue[custmizedKey][field.field_name] = [];
              const custmizedFormValueParant = Object.assign([],this.custmizedFormValue[custmizedKey][field.field_name])
              if(value && value != ''){
                let index = -1;
                if(this.addOrUpdateIconShowHideList && this.addOrUpdateIconShowHideList[parentfield.field_name+'_'+field.field_name+'_index']>=0){
                  index = this.addOrUpdateIconShowHideList[parentfield.field_name+'_'+field.field_name+'_index']
                }
                let updateCustomizedValueResponse = this.formControlService.updateCustomizedValue(custmizedFormValueParant, index, value);                
                this.custmizedFormValue[custmizedKey][field.field_name] = updateCustomizedValueResponse.custmizedFormValue;
                this.addOrUpdateIconShowHideList = {};
              }
              if(event){
                event.value = '';
              }
              this.templateForm.get(parentfield.field_name).get(field.field_name).setValue("");
              this.tempVal[parentfield.field_name + '_' + field.field_name + "_add_button"] = true;
            }
            
          }else{
            const value = this.coreFunctionService.removeSpaceFromString(formValue[field.field_name]);
            const checkDublic = this.checkIfService.checkDataAlreadyAddedInListOrNot(field,value,this.custmizedFormValue[field.field_name]);
            if(this.custmizedFormValue[field.field_name] && checkDublic.status){
              this.notificationService.notify('bg-danger','Entered value for '+field.label+' is already added. !!!');
            }else{
              if (!this.custmizedFormValue[field.field_name]) this.custmizedFormValue[field.field_name] = [];
              const custmizedFormValue = Object.assign([],this.custmizedFormValue[field.field_name]);
              if(value != '' && value != null){
                let index = -1;
                if(this.addOrUpdateIconShowHideList && this.addOrUpdateIconShowHideList[field.field_name+'_index']>=0){
                  index = this.addOrUpdateIconShowHideList[field.field_name+'_index']
                }
                let updateCustomizedValueResponse = this.formControlService.updateCustomizedValue(custmizedFormValue, index, value); 
                this.custmizedFormValue[field.field_name] = updateCustomizedValueResponse.custmizedFormValue;
                this.addOrUpdateIconShowHideList = {};
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
              this.addOrUpdateIconShowHideList = {};
            }            
          }else{
            if(formValue && formValue[field.field_name] && formValue[field.field_name].length > 0){
              this.tempVal[field.field_name + "_add_button"] = false;
            }else{
              this.tempVal[field.field_name + "_add_button"] = true;
              this.addOrUpdateIconShowHideList = {};
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
              const checkDublic = this.checkIfService.checkDataAlreadyAddedInListOrNot(field,value, this.custmizedFormValue[custmizedKey]?.[field.field_name] ?? undefined);
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
              const checkDublic = this.checkIfService.checkDataAlreadyAddedInListOrNot(field,value,this.custmizedFormValue[field.field_name]);
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
                this.multipleFormService.getDataForNextForm(reqParams,reqCriteria);
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
        let checkDublicate = this.checkIfService.checkDublicateOnForm(field.list_of_fields,formValue[field.field_name],list,this.listOfFieldsUpdateIndex,this.showIfFieldList,this.custmizedFormValue,this.dataListForUpload,this.templateForm,field);
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
                  updateCustmizedValue[this.listOfFieldsUpdateIndex][childkey] = this.fileHandlerService.modifyUploadFiles(this.dataListForUpload[keyName][childkey]);
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
                  listOfFieldData[childkey] = this.fileHandlerService.modifyUploadFiles(this.dataListForUpload[keyName][childkey]);
                });
                this.dataListForUpload[keyName] = {};
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
        let gridSelectedData = this.gridCommonFunctionService.getGridSelectedData(this.custmizedFormValue[field.field_name],field);
        let selectedData = gridSelectedData.gridSelectedData;
        this.customEntryData = gridSelectedData.customEntryData;
        const gridModalData = {
          "field": this.curTreeViewField,
          "selectedData":selectedData,
          "object": formValueWithCustomData,
          "currentForm":this.form
        }
        this.modalService.open('grid-selection-modal', gridModalData);
        break;
      case 'tree_view':
        this.curTreeViewField = JSON.parse(JSON.stringify(field));   
        const treeViewData = {
          "field": this.curTreeViewField,
          "selectedData":formValue[field.field_name] ? formValue[field.field_name]:{},
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
  editListOfString(parentfield,field,index){
    let response = this.formControlService.editListOfString(parentfield,field,index,this.custmizedFormValue,this.templateForm);    
    this.templateForm = response.templateForm;
    if(parentfield != ''){
      this.addOrUpdateIconShowHideList[parentfield.field_name+'_'+field.field_name+'_index'] = index;
      this.tempVal[parentfield.field_name + '_' + field.field_name + "_add_button"] = false;
    }else{
      this.addOrUpdateIconShowHideList[field.field_name+'_index'] = index;
      this.tempVal[field.field_name + "_add_button"] = false;
    }
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
        this.multipleFormService.getDataForNextForm(reqParams,reqCriteria);
        this.tempVal[child.field_name + "_add_button"] = false;
      }
    }else{
      this.storeFormDetails(parent,child);
      this.updateAddNew = true;
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
  onClickLoadData(parent,field){
    if(field && field.onClickApiParams && field.onClickApiParams != ''){  
      let payloads = this.apiCallService.getOnClickLoadDataPayloads(field,this.multipleFormCollection,this.getFormValue(false),this.getFormValue(true));  
      this.callStaticData(payloads);
    }
  }
  addListOfFields(field){
    this.storeFormDetails("",field);
  }
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
      staticModalGroup.push(this.apiCallService.getPaylodWithCriteria(fieldName.api_params, fieldName.call_back_field, fieldName.api_params_criteria, this.templateForm.getRawValue()));
    }
    this.callStaticData(staticModalGroup);   
    this.commonFunctionService.openTreeModal(fieldName.label, fieldName.ddn_field, 'tree-view-modal');   
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
  downloadFile(file){
    this.downloadClick = file.rollName;
    this.commonFunctionService.downloadFile(file);
  } 
  downloadFileWithBytes(filedata){
    const file = new Blob([filedata.fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(file);
    this.downloadService.download(url,this.downloadClick);
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
  updateListofFields(field,object,index){
    let searchValue = this.term[field.field_name];
    let correctIndex = index;
    let data = this.custmizedFormValue[field.field_name];    
    if(searchValue != '' || data && data.length > this.pageSize){
      if(searchValue == undefined || searchValue == ''){
        searchValue = this.pageNo;
      }
      correctIndex = this.commonFunctionService.getCorrectIndex(object,index,field,data,searchValue);
    } 
    this.storeFormDetails("",field,correctIndex); 
  }
  editListOfFiedls(index,field){
    let responce = this.formControlService.editeListFieldData(this.templateForm,this.custmizedFormValue,this.tableFields,field,index,this.listOfFieldsUpdateIndex,this.staticData,this.dataListForUpload);
    this.listOfFieldUpdateMode = responce['listOfFieldUpdateMode'];
    this.listOfFieldsUpdateIndex = responce['listOfFieldsUpdateIndex'];
    this.custmizedFormValue = responce['custmizedFormValue'];
    this.dataListForUpload = responce['dataListForUpload'];
    this.templateForm = responce['templateForm'];
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
          let fileData = {};
          fileData['data'] = this.fileHandlerService.modifyUploadFiles(value['data']);
          this.viewModal('fileview-grid-modal', fileData, item, editemode);
        };
        break;      
      default:
        break;
    } 
  }
  reviewParameters(fields,data){
    this.clickFieldName=fields;
    let value={};
    value['data'] = JSON.parse(JSON.stringify(data));
    value['gridColumns']=fields.gridColumns;
    const editemode = true;    
    this.viewModal('form_basic-modal', value, fields,editemode); 
  }
  showData(parent,field){
    if(parent != ''){

    }else{
      this.showGridData[field.field_name] = !this.showGridData[field.field_name];
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
      list.push(this.apiCallService.getPaylodWithCriteria(tableField.api_params,tableField.call_back_field,tableField.api_params_criteria,this.getFormValue(false)));
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
  refreshApiCall(field:any,check:any){
    const fields = [field];
    const payloads = this.apiCallService.commanApiPayload([],fields,[],this.getFormValue(true));
    this.callStaticData(payloads);
  } 
  removeAttachedDataFromList(parent,child,index){
    this.dataListForUpload = this.fileHandlerService.removeAttachedDataFromList(parent,child,index,this.dataListForUpload);
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
          this.apiCallService.previewModal(this.selectedRow,this.currentMenu,'form-preview-modal')
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
  nextForm(){
    if(this.nextFormData && this.nextFormData.formName){
      this.openNextForm(true);
      this.enableNextButton = false;
    }    
  }



  //Map Click
  async mapClick(event: google.maps.MapMouseEvent,field?:any) {
    this.zoom = 17;
    this.center = (event.latLng.toJSON());
    await this.getAddress(this.center.lat, this.center.lng);
    this.setAddressOnForm(field);
  }
  openInfoWindow(marker: MapMarker) {
    this.infoWindow.open(marker);
  }
  //Map Click
  //Click Evnet Function Handling end -------------------

  //change Event Functions Handling start ---------------
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
         case 'calculate_quote_amount_for_lims':          
          calFormValue = this.limsCalculationsService.calculate_quotation_for_lims(tamplateFormValue,"standard", field);
          this.updateDataOnFormField(calFormValue);
          break;
        case 'calculate_quotation_with_subsequent':          
          calFormValue = this.limsCalculationsService.calculate_quotation_with_subsequent(tamplateFormValue,"standard", field);
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
        case 'credit_note_invoice_calculation':          
          calFormValue = this.limsCalculationsService.credit_note_invoice_calculation(tamplateFormValue,"standard" ,field);
          this.updateDataOnFormField(calFormValue);
          break;     
        case 'calculate_lims_invoice':          
          calFormValue = this.limsCalculationsService.calculate_lims_invoice(tamplateFormValue,"automotive" ,field);
          this.updateDataOnFormField(calFormValue);
          break; 
        case 'calculate_lims_invoice_extra_amount':          
          calFormValue = this.limsCalculationsService.calculate_lims_invoice_extra_amount(tamplateFormValue,"automotive" ,field);
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
                  check = this.checkIfService.checkIfCondition(criteria,object);
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
  colorchange(tableField:any, colorval:string) {
    if(tableField.field_name  && colorval != "" && colorval.length == 7) {
      this.templateForm.get(tableField.field_name).setValue(colorval)
    }else {
      this.templateForm.get(tableField.field_name).setValue("")
    }
  }
  toggleAll(event: MatCheckboxChange,field) {   
    let responce = this.gridSelectionService.toggleAll(event.checked,field,this.staticData,this.custmizedFormValue);
    this.staticData = responce.staticData;
    this.custmizedFormValue = responce.custmizedFormValue; 
    // if ( event.checked ) {
    //   if(this.staticData[field.ddn_field].length > 0){
    //     this.staticData[field.ddn_field].forEach(row => {
    //       row.selected=true;
    //     });
    //   }
    // }else{
    //   if(this.staticData[field.ddn_field].length > 0){
    //     this.staticData[field.ddn_field].forEach(row => {
    //       row.selected=false;
    //     });
    //   }
    // }
    // this.custmizedFormValue[field.field_name] = [];
    // this.staticData[field.ddn_field].forEach(element => {      
    //   if(element.selected){
    //     this.custmizedFormValue[field.field_name].push(element);
    //   }
    // }); 
  }
  toggle(index,event: MatCheckboxChange,field) {
    let responce = this.gridSelectionService.toggle(index,event.checked,field,this.staticData,this.custmizedFormValue);
    this.staticData = responce.staticData;
    this.custmizedFormValue = responce.custmizedFormValue;
  }
  //change Event Functions Handling start ---------------

  //Key Up Evnet Functions Start---------------
  gridSelectionSearch(field){
    if(this.pageNo[field.field_name]  != 1) this.pageNo[field.field_name] = 1;
  }
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
  //Key Up Evnet Functions End-----------------

  //Mouse Event Start
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
  //Mouse Event End

  ///html page function start
  isIndeterminate(ddn_field) {
    return this.gridSelectionService.isIndeterminate(ddn_field,this.staticData);
    // let check = 0;
    // if(this.staticData[ddn_field].length > 0){
    //   this.staticData[ddn_field].forEach(row => {
    //     if(row.selected){
    //       check = check + 1;
    //     }
    //   });
    // }
    // return (check > 0 && !this.isChecked(ddn_field));
  };
  isChecked(ddn_field) {
    return this.gridSelectionService.isChecked(ddn_field,this.staticData);
    // let check = 0;
    // if(this.staticData[ddn_field].length > 0){
    //   this.staticData[ddn_field].forEach(row => {
    //     if(row.selected){
    //       check = check + 1;
    //     }
    //   });
    // }
    // return this.staticData[ddn_field].length === check;
  };  
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,event.container.data,event.previousIndex,event.currentIndex);
    }
  }
  typeaheadDragDrop(event: CdkDragDrop<string[]>,parent,chield) {
    if(chield.draggable){
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
  }
  compareObjects(o1: any, o2: any): boolean {
    if(o1 != null && o2 != null){
      return o1._id === o2._id;
    }else{
      return false;
    }    
  }
  getOptionText(option) {
    if (option && option.name) {
      return option.name;
    }else{
      return option;
    }
  }
  get templateFormControl() {
    return this.templateForm.controls;
  } 
  ///html page function end

  //Child Form Responce Handling Start ------------------
  alertResponce(responce) {
    if (responce) {
      if(this.deletefieldName['child'] && (this.deletefieldName['child'].type == 'file' || this.deletefieldName['child'].type == 'file')){
        this.dataListForUpload = this.fileHandlerService.removeAttachedDataFromList(this.deletefieldName['parent'],this.deletefieldName['child'],this.deleteIndex,this.dataListForUpload);
      }else{
        this.deleteitem()
      }      
    } else {
      this.cancel();
    }
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
  treeViewComponentResponce(responce){
    if(responce && Object.keys(responce).length > 0 && this.curTreeViewField && this.curTreeViewField.field_name){
      const fieldName = this.curTreeViewField.field_name;      
      this.templateForm.controls[fieldName].setValue(responce);
      let treeResponceData = JSON.parse(JSON.stringify(responce));
      let data = this.treeComponentService.updateTreeViewData(treeResponceData,this.curTreeViewField,this.treeViewData);
      this.treeViewData = data.treeViewData;
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
          const payload = this.limsCalculationsService[function_name](formValueWithCustomData, this.curTreeViewField);     
          this.apiService.getStatiData(payload);
          break;
        case "calculateQquoteAmount":
          this.custmizedFormValue[this.curTreeViewField.field_name].forEach(element => {
            element["qty"] = formValueWithCustomData["qty"];
            this.limsCalculationsService.calculateNetAmount(element, {field_name: "qty"},"legacyQuotationParameterCalculation");
          });
           this.updateDataOnFormField(this.limsCalculationsService[function_name](formValueWithCustomData, this.curTreeViewField));  
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
        case 'calculate_lims_invoice_extra_amount':
          let val2 = this.limsCalculationsService.calculate_lims_invoice_extra_amount(formValueWithCustomData,'','');
          this.updateDataOnFormField(val2);
          break;
        case 'calculate_quotation_with_subsequent':          
          let calFormValue = this.limsCalculationsService.calculate_quotation_with_subsequent(formValueWithCustomData,"standard", {field_name: "qty"});
          this.updateDataOnFormField(calFormValue);
          break;
        default:
           if(this.commonFunctionService[function_name]){      
            this.templateForm = this.commonFunctionService[function_name](this.templateForm, this.curTreeViewField);
            const calTemplateValue= this.templateForm.getRawValue()
            this.updateDataOnFormField(calTemplateValue);
          }else if(this.limsCalculationsService[function_name]){      
            this.templateForm = this.limsCalculationsService[function_name](this.templateForm, this.curTreeViewField);
            const calTemplateValue= this.templateForm.getRawValue()
            this.updateDataOnFormField(calTemplateValue);
          }
          break;
      }
    }
    
    if(this.curTreeViewField && this.curTreeViewField.onchange_function_param != '' && this.curTreeViewField.onchange_function_param != null){
      if(this.curTreeViewField.onchange_function_param.indexOf('QTMP') >= 0){
        const payloads = [];
        payloads.push(this.apiCallService.getPaylodWithCriteria(this.curTreeViewField.onchange_function_param,'',[],this.getFormValue(true)));
        this.callStaticData(payloads);
      }
    }    
    this.modifyCustmizedValue(fieldName);
    this.curTreeViewField = {};
    this.currentTreeViewFieldParent = {};
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
  fileUploadResponce(response:any) {
    let uploadFileResponce = this.fileHandlerService.updateFileUploadResponce(this.curFileUploadFieldparentfield,this.curFileUploadField,this.dataListForUpload,this.templateForm,this.tableFields,response);
    this.dataListForUpload = uploadFileResponce.dataListForUpload;
    this.templateForm = uploadFileResponce.templateForm;
    this.tableFields = this.tableFields; 
  }
  previewModalResponce(data){
    alert(data);
  }
  //Child Form Responce Handling End --------------------

  //Dipendency Functions Start----------------------
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
  saveCallSubscribe(){
    this.saveResponceSubscription = this.dataShareService.saveResponceData.subscribe(responce =>{
      this.setSaveResponce(responce);
    })
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
    this.calculationFieldList=[];
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
    //this.list_of_fields = [];
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
    this.addOrUpdateIconShowHideList = {};
  }
  //Map Related Functions
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
  setAddressOnForm(field:any){
    if(this.templateForm?.get(field?.field_name)){
      this.templateForm.get(field?.field_name).setValue(this.address);
    }else if(this.templateForm?.get('address')){
      this.templateForm.get('address').setValue(this.address);
    }
  }
  //Map Related Functions
  
  setForm(){
    if(this.form){
      this.formDetails.emit(this.form);
    }
    let getFields = this.formCreationService.checkFormDetails(this.form,this.tab,this.currentMenu);
    this.currentMenu = getFields['currentMenu'];
    this.bulkupdates = getFields['bulkupdates'];
    this.getLocation = getFields['getLocation'];
    this.headerFiledsData = getFields['headerFiledsData'];
    this.tableFields = getFields['tableFields'];
    this.getTableField = getFields['getTableField'];
    this.formFieldButtons = getFields['formFieldButtons'];
    
    if (this.tableFields.length > 0 && this.createFormgroup) {
      this.createFormgroup = false;
      let formControl = this.formCreationService.setNewForm(this.tableFields,this.formFieldButtons,this.form,this.elements,this.selectedRowIndex);
      let blankField = formControl['blankField'];
      if(blankField && (blankField.fieldName != '' || blankField.index != -1)){
        this.notifyFieldValueIsNull(blankField.fieldName,blankField.index);
      }
      this.calculationFieldList=formControl['calculationFieldList'];
      this.showIfFieldList=formControl['showIfFieldList'];
      this.buttonIfList=formControl['buttonIfList'];
      this.disableIfFieldList=formControl['disableIfFieldList'];
      this.mendetoryIfFieldList = formControl['mendetoryIfFieldList'];
      this.gridSelectionMendetoryList=formControl['gridSelectionMendetoryList'];
      this.customValidationFiels = formControl['customValidationFiels'];
      this.editorTypeFieldList = formControl['editorTypeFieldList'];      
      const forControl = formControl['forControl'];
      this.checkBoxFieldListValue = formControl['checkBoxFieldListValue'];
      let staticModal=formControl['staticModal'];
      this.filePreviewFields=formControl['filePreviewFields'];
      this.isStepper=formControl['isStepper'];
      this.showGridData = formControl['showGridData'];      
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
      staticModal = this.formCreationService.updateSelectContact(this.selectContact,this.tabFilterData,this.tableFields,this.templateForm,formValueWithCustomData,staticModal);
      if(this.tableFields.length > 0 && this.editedRowIndex == -1){
        this.getStaticData(staticModal,formValueWithCustomData,fromValue);               
      }
    }    
    if (this.tableFields.length > 0 && this.pageLoading) {
      this.pageLoading = false;
      let buttonsCondition = this.formCreationService.checkFieldButtonCondition(this.tableFields);
      this.tempVal = buttonsCondition['tempVal'];      
    }    
  }
  notifyFieldValueIsNull(formName,fieldNo){
    let msg = "Field No. "+ fieldNo + " value is null";
    this.notificationService.notify("bg-danger",msg);
    this.tableFields = [];
    this.closeModal();
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
  getFormValue(check){
    let formValue = this.templateForm.getRawValue();
    let routersParams = {};
    if(this.routers.snapshot.params["key1"]){
      routersParams = this.routers.snapshot.params;
    }
    return this.formValueService.getFormValue(check,formValue,this.selectedRow,this.updateMode,this.complete_object_payload_mode,this.tableFields,this.latitude,this.longitude,this.address,this.custmizedFormValue,this.checkBoxFieldListValue,this.staticData,this.dataListForUpload,this.selectContact,this.tabFilterData,routersParams,this.getLocation,this.center); 
  }
  getStaticData(staticModal,object,formDataObject){
    staticModal = this.apiCallService.getStaticDataPayload(staticModal,object,formDataObject,this.multipleFormCollection,this.tableFields,this.formFieldButtons,this.tab,this.form,this.saveResponceData,this.editedRowIndex);
    this.callStaticData(staticModal);
  }
  callStaticData(payloads){
    if(payloads.length > 0){
      this.apiService.getStatiData(payloads);        
    }else{ 
      setTimeout(() => {
        this.checkFormFieldIfCondition();
      }, 100);           
    }
  }
  editedRowData(object) {
    this.selectedRow = JSON.parse(JSON.stringify(object)); 
    this.updateMode = true;
    this.updateDataOnFormField(this.selectedRow);
    this.getStaticDataWithDependentData();      
    if (this.checkBoxFieldListValue.length > 0 && Object.keys(this.staticData).length > 0) {
      this.templateForm = this.formControlService.setCheckboxFileListValue(this.checkBoxFieldListValue,this.templateForm, this.staticData,this.selectedRow,this.updateMode);
    }
  }
  updateDataOnFormField(formValue){
    const checkDataType = typeof formValue;
    if(checkDataType == 'object' && !Array.isArray(formValue) && this.tableFields && this.tableFields.length > 0){
      let result = this.formControlService.updateDataOnForm(this.templateForm,this.tableFields,formValue,this.formFieldButtons,this.custmizedFormValue,this.modifyCustmizedFormValue,this.selectedRow,this.dataListForUpload,this.treeViewData,this.staticData,this.longitude,this.latitude,this.zoom);
      this.templateForm = result.templateForm;
      this.tableFields = result.tableFields;
      this.custmizedFormValue = result.custmizedFormValue;
      this.modifyCustmizedFormValue = result.modifyCustmizedFormValue;
      this.selectedRow = result.selectedRow;
      this.dataListForUpload = result.dataListForUpload;
      this.treeViewData = result.treeViewData;
      this.staticData = result.staticData;
      this.latitude = result.latitude;
      this.longitude = result.longitude;
      this.zoom = result.zoom;
      if(result.getAddress){
        this.getAddress(this.latitude,this.longitude);
      }
      this.getFocusFieldAndFocus();
      this.checkFormFieldIfCondition();
    }
  }
  getStaticDataWithDependentData(){
    let formValueWithCustomData = this.getFormValue(true)
    let formValue = this.getFormValue(false)
    const staticModal = this.apiCallService.getOnchangePayload(this.tableFields,formValue,formValueWithCustomData);
    this.getStaticData(staticModal,formValueWithCustomData,formValue);    
  }
  getFocusFieldAndFocus(){
    if(this.checkFormFieldAutfocus && this.tableFields.length > 0){
      let focusRelatedFields = this.formCreationService.getFocusField(this.previousFormFocusField,this.tableFields,this.templateForm,this.focusFieldParent,this.checkFormFieldAutfocus);
      this.checkFormFieldAutfocus = focusRelatedFields['checkFormFieldAutfocus'];
      this.previousFormFocusField = focusRelatedFields['previousFormFocusField'];
      this.focusFieldParent = focusRelatedFields['focusFieldParent'];
      let id = focusRelatedFields['id'];
      if(id != ''){
        const invalidControl = document.getElementById(id);
        if(invalidControl != null){
          invalidControl.focus();
          this.checkFormFieldAutfocus = false;
          if(this.previousFormFocusField && this.previousFormFocusField.type == 'list_of_fields' && this.previousFormFocusField.datatype == 'list_of_object_with_popup'){
            this.previousFormFocusField = {};
          }
        }
      }
    }
  }
  resetForm(){
    if(this.multipleFormCollection.length > 0){
      this.multipleFormCollection = this.multipleFormService.setPreviousFormTargetFieldData(this.multipleFormCollection,this.getFormValue(true));
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
  donotResetField(){
    if(this.tableFields.length > 0){
      let FormValue = this.getFormValue(true);
      this.donotResetFieldLists = this.formCreationService.getDonotResetFields(this.tableFields,this.donotResetFieldLists,FormValue);
    }
  }
  isDisable(parent,chield){
    const  formValue = this.getFormValue(true);  
    let responce = this.checkIfService.checkIsDisable(parent,chield,this.updateMode,formValue,this.templateForm);
    this.templateForm = responce.templateForm;
    return responce.tobedesabled;
  }  
  isMendetory(parent,chield){
    const  formValue = this.getFormValue(true);
    let responce = this.checkIfService.checkIsMendetory(parent,chield,formValue,this.templateForm);
    this.templateForm = responce.templateForm;
    return responce.tobedesabled;   
  }
  removeClass = (element, name) => {    
    element.className = element.className.replace(name, "");
  }
  getNextFormData(formData){
    let result = this.multipleFormService.getNextFormData(formData,this.listOfFieldsUpdateIndex);
    if(result.updateAddNew){
      this.apiService.getGridData(result.payload);
    }
  }  
  modifyCustmizedValue(fieldName){
    let modifyObject = this.gridCommonFunctionService.gridDataModify(this.modifyCustmizedFormValue,this.custmizedFormValue,this.tableFields,fieldName,'grid_selection',this.getFormValue(true));
    this.modifyCustmizedFormValue = modifyObject.modifyData;
    this.tableFields = modifyObject.fields;
  }  
  storeFormDetails(parent_field:any,field:any,index?:number){
    let result = this.multipleFormService.storeFormDetails(parent_field,field,this.getFormValue(false),this.getFormValue(true),this.updateMode,this.nextFormData,this.lastTypeaheadTypeValue,this.multipleFormCollection,this.currentMenu,this.form,this.listOfFieldUpdateMode,this.listOfFieldsUpdateIndex,this.addNewRecord,this.enableNextButton,index);
    this.multipleFormCollection = result.multipleFormCollection;
    if(result.form && Object.keys(result.form).length > 0) this.loadNextForm(result.form);
    if(result.id && result.id != '') this.multipleFormService.getNextFormById(result.id);
    this.addNewRecord = result.addNewRecord;
    if(result.params && result.params != '')  this.multipleFormService.getDataForNextForm(result.params,result.criteria);   
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
  close(){
    this.staticData = {};
    this.typeAheadData = [];
    this.selectedRow = {};
    this.showGridData={};
    this.latitude = 0;
    this.longitude = 0;
    this.address = "";
    this.treeViewData={};
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
    if(this.calculationFieldList && this.calculationFieldList.length > 0){
      this.callCalculation();
    }
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
  callCalculation(){
    if(this.calculationFieldList && this.calculationFieldList.length > 0){
      for (var i = 0;i<this.calculationFieldList.length ;++i){
        let element = this.calculationFieldList[i];
        switch (element.onchange_function_param) {        
            case 'autopopulateFields':
              this.limsCalculationsService.autopopulateFields(this.templateForm);
              break;
          default:
            this.inputOnChangeFunc('',element);
        }
      }
    }
  }
  callTypeaheadData(field,objectValue){
    this.clearTypeaheadData();   
    const payload = [];
    const params = field.api_params;
    const criteria = field.api_params_criteria;
    payload.push(this.apiCallService.getPaylodWithCriteria(params, '', criteria, objectValue,field.data_template));
    this.apiService.GetTypeaheadData(payload);    
  }  
  clearTypeaheadData() {
    this.apiService.clearTypeaheadData();
  }
  checkOnSuccessAction(){
    let responce = this.apiCallResponceService.checkOnSuccessAction(this.currentActionButton,this.forms);
    if(responce.index != -1) {
      this.changeNewForm(responce.actionValue,responce.index)
    }
  }; 
  //click Function Dependency
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
        payloads.push(this.apiCallService.checkQtmpApi(params,field,this.apiCallService.getPaylodWithCriteria(params, callback, criteria, completeObject,data_template),this.multipleFormCollection,this.getFormValue(false),this.getFormValue(true))); 
        this.callStaticData(payloads);
      }
   }
  } 
  viewModal(id, object, field,editemode) {
    this.commonFunctionService.viewModal(id, object, field, this.currentMenu,editemode)
  }
  getSavePayloadData(dataWithCustValue?) {
    let formValue = this.templateForm.getRawValue();
    let formValueWithCustomData = dataWithCustValue;
    if(dataWithCustValue == undefined){
      formValueWithCustomData = this.getFormValue(true);
    }    
    let formDataResponce = this.formValueService.getSavePayloadData(this.currentMenu,this.updateMode,this.deleteGridRowData,this.tableFields,formValue,formValueWithCustomData,this.gridSelectionMendetoryList,this.selectedRow,this.custmizedFormValue,this.dataSaveInProgress,this.showNotify,this.formName,this.templateForm.valid);   
    this.deleteGridRowData = formDataResponce.deleteGridRowData;     
    if(this.dataSaveInProgress){
      this.getSavePayload = formDataResponce.getSavePayload;
      this.showNotify = formDataResponce.showNotify;
      this.dataSaveInProgress = formDataResponce.dataSaveInProgress;
      return formDataResponce.data;
    }else{
      let message = formDataResponce.message;
      if(message && message.msg && message.msg != ""){
        this.notificationService.notify(message.class, message.msg)
      }
    }
  }
  saveFormData(){
    let dataWithCustValue = this.getFormValue(true);
    let checkValidatiaon = this.commonFunctionService.sanitizeObject(this.tableFields,this.getFormValue(false),true,dataWithCustValue);
    if(typeof checkValidatiaon != 'object'){
      const saveFromData = this.getSavePayloadData(dataWithCustValue);
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
      let fileName = this.apiCallService.downloadPdf(downloadPdfFileFromFormData.data,downloadPdfFileFromFormData.curTemp);
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
  previous(){
    const previousIndex = this.selectedRowIndex - 1;
    if(previousIndex != -1){
      this.selectedRowIndex = previousIndex;
      this.editedRowData(this.elements[previousIndex]);
    }else{
      this.notificationService.notify('bg-danger','Previous Index are not available.')
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
          let checkDublicate = this.checkIfService.checkDublicateOnForm(this.tableFields,this.templateForm.getRawValue(),fieldData,index,this.showIfFieldList,this.custmizedFormValue,this.dataListForUpload,this.templateForm);
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
  deleteGridData(){
    let dataWithCustValue = this.getFormValue(true);
    let checkValidatiaon = this.commonFunctionService.sanitizeObject(this.tableFields,this.getFormValue(false),true,dataWithCustValue);
    if(typeof checkValidatiaon != 'object'){
      this.deleteGridRowData = true;
      const saveFromData = this.getSavePayloadData(dataWithCustValue);
      if(this.getSavePayload){
          this.apiService.deleteGridRow(saveFromData);
      }
    }else{
      this.notificationService.notify('bg-danger',checkValidatiaon.msg);
    } 
  }  
  //click Function Dependency
  //Child Form Responce dependency
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
    this.cancel()
  }
  cancel() {    
    this.deleteIndex = "";
    this.deletefieldName = {};
    //this.alertData = {};
  }

//copy icon on grid cell
copyText(value:any){       
  this.commonFunctionService.copyGridCellText(value);
}

  //Child Form Responce dependency
  //Dipendency Functions End----------------------

  //Not Use in any event,subscriber or html
  // treeViewOptionData(parent,child):Array<any>{
  //   let treeViewData = [];
  //   if(parent != ""){
  //     if(this.treeViewData && this.treeViewData[parent.field_name]){
  //       let parentData = this.treeViewData[parent.field_name];
  //       if(parentData && parentData[child.field_name]){
  //         treeViewData = parentData[child.field_name];
  //       }
  //     }
  //   }else{
  //     if(this.treeViewData && this.treeViewData[child.field_name]){
  //       treeViewData = this.treeViewData[child.field_name];
  //     }
  //   }
  //   return treeViewData;
  // }  
  // candelForm() {    
  //   if(this.updateMode && this.custmizedFormValue && Object.keys(this.custmizedFormValue).length > 0){      
  //     Object.keys(this.custmizedFormValue).forEach(key => {
  //       if(this.custmizedFormValue[key] != null && this.custmizedFormValue[key].length > 0){
  //         this.custmizedFormValue[key].forEach(element => {
  //           if(element.status == 'I'){
  //             element.status = 'A';
  //           }
  //         });
  //       }
  //     });
  //   }else{
  //     this.custmizedFormValue = {};
  //     this.modifyCustmizedFormValue = {};
  //   }
  //   this.updateMode=false;
  //   this.addAndUpdateResponce.emit('close');    
  // }
  // formControlChanges(){
  //   if(this.templateForm && this.templateForm.valueChanges && this.templateForm.valueChanges != null){
  //     this.templateForm.valueChanges.subscribe(val => {
  //       this.handleDisabeIf();
  //     });
  //   }    
  // }
  // handleDisabeIf(){
  //   this.getFocusFieldAndFocus();
  //   this.checkFormFieldIfCondition(); 
  // }
}