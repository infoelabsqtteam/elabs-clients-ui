import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree'
import { NotificationService, CommonApiService, DataShareService } from '@core/service-lib';



interface FoodNode {
  _id?: string;
  name: string;
  children?: FoodNode[];
}



export interface PeriodicElement1 {
  name: string;
}

const ELEMENT_DATA1: PeriodicElement1[] = [
  { name: 'Hydrogen' },
  { name: 'Hydrogen2' },
  { name: 'Hydrogen3' },
  { name: 'Hydrogen4' },
  { name: 'Hydrogen5' },

];




export interface PeriodicElement {
  name: string;
  position: number;
  weight: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Medical Devices', weight: 'Biocompatibility', symbol: 'Cytotoxicity' },
  { position: 2, name: 'Pharmaceutical', weight: 'Biocompatibility ', symbol: 'Genotoxicity' },
  { position: 3, name: 'Tissue', weight: 'Sterility Assurance', symbol: 'Microbial Identifications' },
  { position: 4, name: 'Medical Devices', weight: 'Packaging Solutions', symbol: 'Accelerated & Real Time Aging' },
  { position: 5, name: 'Pharmaceutical', weight: 'Sterility Assurance', symbol: 'Bacterial Endotoxin Test' },
  { position: 6, name: 'Pharmaceutical', weight: 'Facility & Process Validation', symbol: 'Disinfection Efficacy Studies' },
  { position: 7, name: 'Medical Devices', weight: 'Extractables & Leachables', symbol: 'Material Characterization Screens for Raw Materials' },
  { position: 8, name: 'Tissue', weight: 'Packaging Solutions', symbol: 'Integrity & Strength Tests' },
  { position: 9, name: 'Tissue', weight: 'Other Services', symbol: 'General Analytical Tests' },
  { position: 10, name: 'Pharmaceutical', weight: 'Other Services', symbol: 'General Analytical Tests' },
];

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css']
})
export class QuoteComponent implements OnInit {
  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource11 = new MatTreeNestedDataSource<FoodNode>();
  @Input() public pageName;
  selectedProduct: any = {};
  selectedDepartment: any = {};
  selectedTestMethod: any = {};
  displayedColumns1: string[] = ['name', 'Action'];
  displayedColumnsTest: string[] = ['name', 'All Parameters', 'Partial'];
  displayedColumnsTestParam: string[] = ['name', 'selected'];
  dataSource2: any[] = [];

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'Action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public isInfoFeild: boolean = true;
  public isOtpFeilds: boolean = false;
  public enterNoForOtp: boolean = false;
  public isGrid: boolean = false
  quoteForm: FormGroup;
  categoryDataList: any = [];
  departmentsList: any = [];
  testParameters: any = [];
  categoryDataSubscription;
  productDataSubscription;
  quoteDataSubscription;
  testParameterSubscription;
  departmentDataSubscription;

  constructor(
    private router: Router, 
    private notificationService: NotificationService,
    private commonApiService: CommonApiService,
    private dataShareService:DataShareService
  ) {    
    this.initForm();
    this.commonApiService.GetDepartments({value: 'departments'});
    this.commonApiService.GetCategory({value: 'category'});
    this.categoryDataSubscription = this.dataShareService.categoryData.subscribe(data =>{
      this.setCategoryData(data);
    })
    this.productDataSubscription = this.dataShareService.productData.subscribe( data =>{
      this.setProductData(data);
    })
    this.quoteDataSubscription = this.dataShareService.quoteData.subscribe(data =>{
      this.setQuoteData(data);
    })
    this.testParameterSubscription = this.dataShareService.testParameters.subscribe(data =>{
      this.setTestParameter(data);
    })
    this.departmentDataSubscription  = this.dataShareService.departmentData.subscribe(data =>{
      this.setDepartmentData(data);
    })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.categoryDataSubscription){
      this.categoryDataSubscription.unsubscribe();
    }
    if(this.productDataSubscription){
      this.productDataSubscription.unsubscribe();
    }
    if(this.quoteDataSubscription){
      this.quoteDataSubscription.unsubscribe();
    }
    if(this.quoteDataSubscription){
      this.quoteDataSubscription.unsubscribe();
    }
    if(this.departmentDataSubscription){
      this.departmentDataSubscription.unsubscribe();
    }
  }
  ngOnInit() {
  }

  setCategoryData(data:any){
    if (data.getCategoryData.length > 0) {
      var list = [];
      var obj = {};
      /* data.getCategoryData.forEach(element => {
        var _id = element._id;
        var name = element.name;
        var chld = element.subCategory;
        var chldobj = {};
        var chldList = [];
        chld.forEach(elem => {
          chldobj = {
            name: elem
          }
          chldList.push(chldobj);
        });
        obj = {
          _id: _id,
          name: name,
          children: chldList
        }

        list.push(obj);
      }); 
      this.dataSource11.data = [...list];*/

      this.categoryDataList = data.getCategoryData;
    }
  }
  setProductData(data:any){
    if (data.productData && data.productData.length > 0) {
      this.dataSource2 = data.productData;
    }
  }
  setQuoteData(data){
    if (data.getQuoteData && data.getQuoteData.hasOwnProperty("success")) {
      if (data.getQuoteData['success'] == "success") {
        this.notificationService.notify("bg-success", " Data Save successfull !!!");
        this.commonApiService.ResetSave();
        this.router.navigate(['/home_page']);
      }
      //this.dataSource2 = data.productData;
    }
  }
  setTestParameter(data){
    if (data.testParameters && data.testParameters.length > 0) {
      this.testParameters = data.testParameters;
      this.testParameters.forEach(element => {
        if (this.paramType == "ALL") {
          element.selected = true;
        } else {
          element.selected = false;
        }
      });
    }
  }
  setDepartmentData(data){
    if (data.getDepartmentData.length > 0) {
      this.departmentsList = data.getDepartmentData
    }
  }

  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;


  initForm() {
    this.quoteForm = new FormGroup({
      'first_name': new FormControl('', Validators.required),
      'last_name': new FormControl('', Validators.required),
      'email': new FormControl('', Validators.required),
      'company': new FormControl('', Validators.required),
      'phone': new FormControl('', Validators.required),
      'address': new FormControl('', Validators.required),
      'address2': new FormControl(''),
      'city': new FormControl('', Validators.required),
      'state': new FormControl('', Validators.required),
      'zip': new FormControl('', Validators.required),
      'country': new FormControl('', Validators.required),

    })
  }

  public isUpdate: boolean = false;
  updateInfo() {
    this.isInfoFeild = true;
    this.conformDetails = false;
    this.isUpdate = true;
    this.quoteForm = new FormGroup({
      'first_name': new FormControl(this.quoteForm.get('first_name').value, Validators.required),
      'last_name': new FormControl(this.quoteForm.get('last_name').value, Validators.required),
      'email': new FormControl(this.quoteForm.get('email').value, Validators.required),
      'company': new FormControl(this.quoteForm.get('company').value, Validators.required),
      'phone': new FormControl(this.quoteForm.get('phone').value, Validators.required),
      'address': new FormControl(this.quoteForm.get('address').value, Validators.required),
      'address2': new FormControl(this.quoteForm.get('address2').value),
      'city': new FormControl(this.quoteForm.get('city').value, Validators.required),
      'state': new FormControl(this.quoteForm.get('state').value, Validators.required),
      'zip': new FormControl(this.quoteForm.get('zip').value, Validators.required),
      'country': new FormControl(this.quoteForm.get('country').value, Validators.required),

    })
  }

  saveAllInfo() {
    const value = this.quoteForm.value;
    const payload: any = {};
    payload.first_name = value.first_name
    payload.last_name = value.last_name
    payload.email = value.email
    payload.company_name = value.company
    payload.mobile = value.phone;
    payload.address = {
      address: value.address ? value.address : '',
      address2: value.address2 ? value.address2 : '',
      city: value.city ? value.city : '',
      state: value.state ? value.state : '',
      country: value.country ? value.country : '',
      pinCode: value.zip ? value.zip : ''
    }
    payload.products = { code: this.selectedProduct.code ? this.selectedProduct.code : '', _id: this.selectedProduct._id, name: this.selectedProduct.name };
    payload.department = { code: this.selectedDepartment.code ? this.selectedDepartment.code : '', _id: this.selectedDepartment._id, name: this.selectedDepartment.name };
    payload.regulation = this.selectedTestMethod;
    payload.testList = this.selectedTestParams;
    this.commonApiService.SaveInformation(payload)

  }

  //otp verification feild
  otpField() {
    if (this.isUpdate) {
      this.isInfoFeild = false;
      this.conformDetails = true;
    }
    else {
      this.isInfoFeild = false;
      this.isOtpFeilds = true;
      this.enterNoForOtp = true;
    }

  }

  sendOtp() {
    this.enterNoForOtp = false;
  }

  //static data show in grid
  gotoGridData() {
    this.isGrid = true;
    this.isOtpFeilds = false;
  }

  public selectedDataList: any = [];
  selectedButton = {}
  enableDisableRule(e) {
    var id = e.position
    this.selectedButton[id] = !this.selectedButton[id];
    const foundInSaved = this.selectedDataList.some(el => el.position === e.position);
    if (foundInSaved) {
      const savedindex = this.selectedDataList.findIndex(el => el.position === e.position);
      this.selectedDataList.splice(savedindex, 1);
    }
    else {
      this.selectedDataList.push(e)
    }
    //console.log(this.selectedDataList)

  }

  public conformDetails: boolean;
  review() {
    this.isGrid = false;
    this.conformDetails = true;
  }

  removeFromList(item) {
    const savedindex = this.selectedDataList.findIndex(el => el.position === item.position);
    this.selectedDataList.splice(savedindex, 1);
  }



  onDepartmentChange(e) {
    this.selectedDepartment = e.value;
    const category = e.value.category;
    var list = [];
    var categoryData: any = {};
    if (category && category.length > 0) {
      category.forEach(param => {
        var categoryObj = this.categoryDataList.find(obj => obj._id === param._id);
        var chldobj = {};
        var chldList = [];
        if (categoryObj && categoryObj.subCategory) {
          var chld = categoryObj.subCategory;

          chld.forEach(elem => {
            chldobj = {
              name: elem
            }
            chldList.push(chldobj);
          });
        }

        var obj = {
          _id: param._id,
          name: param.name,
          children: chldList
        }
        list.push(obj);
      })
      this.dataSource11.data = [...list];

    }

  }
  logNode(node) {
    const payload = {
      value: 'el_products',
      crList: [{ fName: 'category.name', fValue: node.name, operator: 'eq' }]
    }
    this.commonApiService.GetProductsByCategory(payload);
  }
  selectProduct(product) {
    this.selectedProduct = product;
  }
  paramType: any;
  selecTestMethod(type1, param) {
    //console.log(param)
    this.paramType = type1;
    this.selectedTestMethod = param;
    const payload = {
      value: 'el_test_param_master',
      crList: [{
        fName: 'product._id', fValue: this.selectedProduct._id, operator: 'eq'
      },
      { fName: 'regulation._id', fValue: this.selectedTestMethod._id, operator: 'eq' },]
    }
    this.commonApiService.GetTestParameter(payload)


  }

  onTestChange(event, index) {
    this.testParameters[index].selected = event.checked;
  }
  selectedTestParams: any[] = [];
  setSelectedTestParam() {
    if (this.testParameters && this.testParameters.length > 0) {
      this.selectedTestParams = [];
      this.testParameters.forEach(element => {
        if (element.selected) {
          delete element.selected;
          this.selectedTestParams.push(element);
        }
      });
    }
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    
    this.router.navigate(['home_page'])
  }

}
