import { Component, HostListener, Input, OnInit ,OnDestroy} from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonFunctionService } from '../../services/common-utils/common-function.service';
import { StorageService} from '../../services/storage/storage.service';
import { ApiService } from '../../services/api/api.service';
import { DataShareService } from '../../services/data-share/data-share.service';
import { PublicApiService } from 'src/app/services/api/public-api/public-api.service';
import { ModelService } from 'src/app/services/model/model.service';


@Component({
  selector: 'app-career-with-us',
  templateUrl: './career-with-us.component.html',
  styleUrls: ['./career-with-us.component.css','../../../assets/css/app-landing.css']
})
export class CareerWithUsComponent implements OnInit,OnDestroy {

  formName:string='NEW';
  selectTabIndex: number = 0;
  selectedRowIndex:number = -1;
  pageNumber: number = 1;
  itemNumOfGrid: any = 50;
  elements:any=[];
  currentMenu:any={};
  carrerWithForm: FormGroup;
  @Input() public pageName;
  gridDataSubscription;

  constructor(
    private router: Router,
    private modalService: ModelService,
    private commonFunctionService:CommonFunctionService,
    private storageService: StorageService,
    private apiService:ApiService,
    private dataShareService:DataShareService,
    private publicApiService:PublicApiService
  ) { 
    this.gridDataSubscription = this.dataShareService.gridData.subscribe(data =>{
      this.setGridData(data);
    })
    const menu = {name:'career_with_us'}
    this.storageService.SetActiveMenu(menu);
    this.currentMenu = this.storageService.GetActiveMenu();
    this.initFOrm();
    this.commonFunctionService.getTemData(this.currentMenu.name);
    this.getPage(1);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.apiService.resetTempData();
    if(this.gridDataSubscription){
      this.gridDataSubscription.unsubscribe();
    }
  }
  setGridData(gridData){
    if (gridData) {
      if (gridData.data && gridData.data.length > 0) {
        this.elements = JSON.parse(JSON.stringify(gridData.data));
        console.log(this.elements);
      } else {
        this.elements = [
            {"designation": "Sr. Java Developer", "department": "Core Platform", "posts": 2, "job_description": "We are looking for highly skilled programmers with experience building web applications in Java.", "role_responsibility": "*Designing and implementing Java-based applications.Defining application objectives and functionality.Aligning application design with business goals.", "qualification": "B.Tech, MCA", "work_experience": "5+ Years"}, {"designation": "Jr. Java Developer", "department": "Core Platform", "posts": 4, "job_description": "Java Developers need to compile detailed technical documentation and user assistance material, requiring excellent written communication.", "role_responsibility": "*Should Have Min 1 Year experience in core Java development.Should have done individual/solo/personal/projects Successfully developing the back end for our software solutions.", "qualification": "B.Tech, BCA, MCA", "work_experience": "1+ Years"}, {"designation": "Sr. Software Quality Assurance Analysts", "department": "Core Platform", "posts": 3, "job_description": "We are looking for a QA Tester to assess software quality through manual testing in our Ecommerce product. You will be responsible for finding and reporting bugs and glitches.", "role_responsibility": "*Review and analyze mobile application of android and iOS, and website for desktop and mobile browser.Review admin panel (backend) and postman APIs for backend.Report bugs and errors to development teams. (Tools like Trello, Jira, Mantis etc.) - Help troubleshoot issues", "qualification": "B.Tech, BCA, MCA", "work_experience": "5+ Years"}, {"designation": "Jr. Software Quality Assurance Analysts", "department": "Core Platform", "posts": 6, "job_description": "We are looking for a QA Tester to assess software quality through manual testing in our Ecommerce product. You will be responsible for finding and reporting bugs and glitches.", "role_responsibility": "*STLC (Software Testing Life Cycle).Create logs to document testing phases and defects.Conduct post-release/ post-implementation testing.", "qualification": "", "work_experience": "2+ Years"}, {"designation": "Sr. Angular Developer", "department": "Core Platform", "posts": 2, "job_description": "*Writing well-designed, testable and efficient code.Working as a part of a dynamic team to deliver winning products.", "role_responsibility": "*Should have experience in Unit testing and Integration testing using Jasmine, Karma, Cypress and Zest.Experience with Agile methodologies in the development life cycle is highly preferred Angular experience with frontend (java script, HTML, JSS, Typescript) ", "qualification": "B.Tech, BCA, MCA", "work_experience": "5+ Years"}, {"designation": "Jr. Angular Developer", "department": "Core Platform", "posts": 4, "job_description": "*Writing well-designed, testable and efficient code.Working as a part of a dynamic team to deliver winning products.","role_responsibility": "*Angular experience with frontend (java script, HTML, JSS, Typescript).Reactive Programming.Strong in Basics.Problem solving skill", "qualification": "B.Tech, BCA, MCA", "work_experience": "1+ Years"}, {"designation": "Content Author", "department": "Marketing", "posts": 3, "job_description": "Consult with product managers and other team members to develop and execute online and print media content for feature products", "role_responsibility": "*Responsible for translation, export and import process.Research technical terminology and concepts.Edit outdated or inaccurate articles.Adhere to the company's style guide", "qualification": "B.Tech, BCA, MCA", "work_experience": "1+ Years"}, {"designation": "Machine Learning Developer", "department": "Core Platform", "posts": 2, "job_description": "*We are looking for Computer Science graduate with special skills on Artificial Intelligence and Machine Learning as we are adding many new features to products to make it much smarter with new features, capabilities.", "role_responsibility": "*To be successful in this role, you should have experience using server-side logic and work well in a team.The candidate should be Computer Science graduate from a reputed university and has prior experience of working on global software products enabling Artificial Intelligence and Machine Learning features.Candidate should be very focused tech geek and eat, sleep and breath only technology and more specifically AI and ML", "qualification": "B.Tech, BCA, MCA", "work_experience": "1+ Years"}, {"designation": "Business Development manager", "department": "Sales", "posts": 2, "job_description": "*To follow up with all the customers/clients I have brought onboard and help them get their solutions in coordination with our Team", "role_responsibility": "*Understanding customer requirements & make proposals Going on the field, meeting customers & giving presentations Ensure closures of deals Networking, generating leads & getting new business", "qualification": "B.Tech, BCA, MCA", "work_experience": "2 Years"}, {"designation": "Inside Sales Executives", "department": "Sales", "posts": 4, "job_description": "*Contact potential or existing customers to inform them about a products or services Answer questions about products or the company", "role_responsibility": "*Cold Calling, Business Development and Lead Generation via Phone, Email and Web.Communicating with customers, making outbound calls to potential customers and following up on leads.Understanding customers' needs and identifying sales opportunities", "qualification": "Graduate", "work_experience": "1+ Year"}, {"designation": "Pharmaceutical Regulatory Consultant", "department": "Product Management", "posts": 2, "job_description": "*Knowledge of ISO certification, EUMDR, CAPA Prepare documentation for countries registration", "role_responsibility": "*Responsible for Audit, KAIZEN activity, MED DEV 2.701, VMP, Product registration Knowledge of relevant India and international medical device regulation", "qualification": "B.SC, M.SC", "work_experience": "20+ Years"}] 
       
      }
    }
  }

  initFOrm(){
    this.carrerWithForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'email': new FormControl('', Validators.required),
      'mobile': new FormControl('',Validators.required),
      'location': new FormControl('',Validators.required),
      'qualification': new FormControl('', Validators.required),
      'experience': new FormControl('', Validators.required),
      'remarks': new FormControl('', Validators.required)
    })
  }

  onSubmit(){
    var x = this.carrerWithForm.value;

    // var utf8 = unescape(encodeURIComponent(this.noticeDocument[0].fileData));
    // var arr = [];
    // for (var i = 0; i < utf8.length; i++) {
    //     arr.push(utf8.charCodeAt(i));
    // }
    // var arr = new Uint8Array(this.noticeDocument[0].fileData)
if(this.noticeDocument.length > 0){
  x['attachement']=this.noticeDocument[0].fileData;

}
    this.publicApiService.SaveCareerWithUs(x);
  }

  public noticeFiles:any=[];
  public noticeDocument:any=[];
  public responceFiles:any=[];
  public responceDocument:any=[];
  setNoticeFiles(e){
    let files =  e.target.files;
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      this.noticeFiles.push(file);
      var reader = new FileReader();
      reader.onload = this.readNoticeFile
      reader.readAsDataURL(file);
    }
  }  
  readNoticeFile = (e) => { 
    var rxFile = this.noticeFiles[0];
    this.noticeFiles.splice(0, 1);  
    this.noticeDocument.push({
      fileData : e.target.result.split(',')[1],
      fileName : rxFile.name,
      fileExtn : rxFile.name.split('.')[1],
      size : rxFile.size
    });   
  }

  getSelectedFilenameForNotice(){
    if(this.noticeDocument.length == 1){
      return this.noticeDocument[0].fileName;        
    }else if(this.noticeDocument.length > 1){
      return this.noticeDocument.length + " Files"; 
    }else{
      return "Choose File";
    }
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.dataShareService.sendCurrentPage('HOME');        
    this.router.navigate(['home_page'])
  }
  applyForJob(formname){
    this.formName = formname;
    let formData = {}
    this.modalService.open('form-modal',formData)
  }
  addAndUpdateResponce(element) {
    console.log(element)
  }
  getDataForGrid(){ 
    const grid_api_params_criteria = ['status;eq;Active;STATIC'] 
    const data = this.commonFunctionService.getPaylodWithCriteria('job_vacancies','',grid_api_params_criteria,'');
    data['pageNo'] = this.pageNumber - 1;
    data['pageSize'] = this.itemNumOfGrid;    
    const getFilterData = {
      data: data,
      path: null
    }
    this.apiService.getGridData(getFilterData);
  }
  getPage(page: number) {
    this.pageNumber = page;
    this.getDataForGrid();
  }

}
