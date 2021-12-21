import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { Router } from '@angular/router';
import { ModelService } from 'src/app/services/model/model.service';


@Component({
  selector: 'app-landing-functions-modal',
  templateUrl: './landing-functions-modal.component.html',
  styleUrls: ['./landing-functions-modal.component.css']
})
export class LandingFunctionsModalComponent implements OnInit {

  @Input() public pageName;
  @Input() id: string;
  @ViewChild('landingFunctionModal') public landingFunctionModal: ModalDirective;
  data:any;
  index:number;

  dataList = [
    {
      heading: 'Platform',
      description: 'Built on state of art Cloud Neutral deployment technology with Java J2EE, Angular as front end and MongoDB as a backend',
      pointList: ['Power of Java Enterprise Edition',
                  'State of art Angular 11',
                  'NoSQL database for functional simplicity',
                  'Cloud Native architecture with flexibility of on-prem',
          ],
      iconClasses: [
        {class:'icon-Cloud-Native', desc:'Cloud Native'},
        {class:'icon-On-prem-Deployment-Available', desc:'On-Prem /Cloud'},
        {class:'icon-Data-Security', desc:'Data Security'},
        {class:'icon-In-built-WorkFlow-Engine', desc:'Workflow Engine'},
        {desc:'Angular', iconImagePath: 'assets/img/angular.png'},
        {desc:'Java EE', iconImagePath: 'assets/img/java.png'}
      ]
    },
    {
      heading: 'Security',
      description: 'e-Labs conforms to the  highest standards of security with layers like transport, data at-rest security and WAF and DDOS protection for abuse prevention.',
      pointList: ['Transport Layer Security with TLS',
                  'Data security and AES encryption at rest',
                  'Web Application Firewall for the client side security',
                  'Distributed denial of Service attack protection',
          ],
      iconClasses: [
        {class:'icon-TLS-SSL', desc:'Transport Security'},
        {class:'icon-AES256-Encryption', desc:'AES-256 Encryption'},
        {class:'icon-Identity-and-Access-Management', desc:'Identity & Access'},
        {class:'icon-Session-Management', desc:'Session Management'},
        {class:'icon-Two-Factor-Authentication', desc:'2-Factor Authentication'},
      ]
    },
    {
      heading: 'Customer Portal',
      description: 'Customer portal provides complete tracking of samples from order booking to dispatching  of test report. This 24 hours x 7 days running portal will be accessed by customer globally. The data in this web portal will be uploaded real-time.',
      pointList: ['Case management tool for 60% reduction in manual queries',
                  'Quotation, invoices, test reports centrally available',
                  'Digitation from RFQ--Quotation--Test request',
                  'Regular status updates on orders',
                  "Provision for 'Voice of Customer'"
          ],
          iconClasses: [
            {class:'icon-Quotation', desc:'Quotation'},
            {class:'icon-quotation_approval', desc:'Quotation Approval'},
            {class:'icon-Test_report', desc:'Test Reports'},
            {class:'icon-voice_of_customer', desc:'Voice Of Customer'},
            {class:'icon-Order_status', desc:'Order Status'},
            {class:'icon-Invoice', desc:'Invoices'},
            {class:'icon-case_management', desc:'Case Management'},
            {class:'icon-OnlineSupport', desc:'Online Support'},
          ]
    },
    {
      heading: 'Sales Management',
      description: 'CRM and Sales force automation module clubbed with power of quick quotation generation to help you achieve 75% sales efficiency with high customer satisfaction',
      pointList: [
                  'Support to operation',
                  'Call Tracking',
                  'Account Management with sales tracking',
                  'Case Management',
                  'Instant Quotation with discount approval workflow',
          ],
          iconClasses: [
            {class:'icon-Quotation', desc:'Quotation Generation'},
            {class:'icon-dicount_approval', desc:'Discount Approval'},
            {class:'icon-Account_lead_management', desc:'Account Management'},
            {class:'icon-support_case_management', desc:'Support Management'},
            {class:'icon-customer_focus', desc:'Customer Focus'},
            {class:'icon-crm', desc:'CRM'},
          ]
    },
    {
      heading: 'Machine Interface',
      description: 'Direct integration of Empower and Agillient software with LIMS ensures no manual interfacing while report generation. Test Data Sheet integration with the application allows seamless automated report generated with complete audit and tracking.',
      pointList: ['E-Labs AI interfaces with Chromatography Software',
                  'No manual intervention of Test Data Sheet',
                  'Audit history and tracking of test results with 21CFR part 11 compliant interface',
                  'Generate test reports 10X faster with much higher accuracy',
          ],
          iconClasses: [
            {class:'icon-Machine-Interface', desc:''}
          ]
    },
    {
      heading: 'Operations Management',
      description: 'Automated workflow for Quotation, eTRF, Sample receiving, order booking, test scheduling, report preparation, report authorization and report dispatch allowing significant efficiency gain while improving quality measures',
      pointList: ['Quotation to e-TRF to Order booking automation',
                  'Error free sample receiving',
                  'Intelligent auto scheduling',
                  'Audit/tracking of report generation',
                  'Report preparation, Review with audit tracking'
          ],
          iconClasses: [
            {class:'icon-Quotation', desc:'Quotation Generation'},
            {class:'icon-DigitalTRF', desc:'Digital TRF'},
            {class:'icon-SampleReceiving', desc:'Sample Receiving'},
            {class:'icon-SamplePrepration', desc:'Sample Preparation'},
            {class:'icon-OrderBooking', desc:'Order Booking'},
            {class:'icon-TestScheduling', desc:'Test Scheduling'},
            {class:'icon-Report-Workflow', desc:'Report Workflow'},
            {class:'icon-EquimentUtilization', desc:'Equipment Utilization'},
          ]
    },
    {
      heading: 'Testing Process Automation',
      description: 'Real-time alert  during scheduling regarding BoM required for testing, Provision of Batch testing to reduce the cost of testing & increase machine utilization. Alert of Priority of sample while scheduling to deliver report on time. Live running status of batches running on machines.',
      pointList: ['Real-time alert on BoM for testing',
                  'Batch testing for effective cost utilization',
                  'Sample prioritization',
                  'Live running status of batches',
          ],
          iconClasses: [
            {class:'icon-BOM-Alert', desc:'BOM Alerts'},
            {class:'icon-batchprocessing', desc:'Batch Processing'},
            {class:'icon-runningstatus', desc:'Running Status'},
            {class:'icon-priorityscheduling', desc:'Priority Scheduling'},
          ]
    },
    {
      heading: 'Quality Management',
      description: 'Integrated workflow for Incidents, Deviations, Audit Management, CAPA, Case Management, Customer Compliant Management, Whistleblower, OOS/OOT and Change Control with fine grained permissions and audit history',
      pointList: ['Validation and Approval',
                  'Equipment Calibration',
                  'Internal / Customer Audit',
                  'Employee Internal & External Trainings',
                  'GLP & GDP Compliant',
                  'Information and Audit management',
                  'Periodic alerts and reports for revision of processes',
                  'Track of revision history and change control',
          ],
          iconClasses: [
            {class:'icon-CAPA', desc:'CAPA'},
            {class:'icon-ChangeControl', desc:'Change Control'},
            {class:'icon-deviation', desc:'Deviation'},
            {class:'icon-OOS_OOT', desc:'OOS/ OOT'},
            {class:'icon-vendorqualification', desc:'Vendor Qualification'},
            {class:'icon-audit_management', desc:'Audit Management'},
            {class:'icon-market_complaint', desc:'Market Complaints'},
          ]
    },
    {
      heading: 'Data Library',
      description: 'State of art virtual data room for management of Regulatory Information, Standard Operating Procedures, Test Standard and Methods with stringent change control workflow, audit trail and extremely fine-grained permissions',
      pointList: ['Document library with fast searching and indexing',
                  '4-Eye Check on each change',
                  'Strict change control on each document/artefact',
                  'Version Control with audit trail for document access, view, download',
                  'Paperless & Virtual Audit'
          ],
          iconClasses: [
            {class:'icon-digitization', desc:'Digitization'},
            {class:'icon-ChangeControl', desc:'Change Control'},
            {class:'icon-version_control', desc:'Version Control'},
            {class:'icon-audit_management', desc:'Audit Management'},
            {class:'icon-datasecurity', desc:'Data Security'},
          ]
    },
    {
      heading: 'Contracts',
      description: 'Manage contracts with all your vendors and customers with regular updates and revision management. Centrally managed contracts for easy tracking and updates.',
      pointList: ['Central Contract Repository with in-built Contract Lifecycle Management',
                  'Contract Preparation and  approval workflow',
                  'Self service import-export of contracts',
                  'Analytics, Audit and logging of access',
          ],
          iconClasses: [
            {class:'icon-contract_drafting', desc:'Contract Drafting'},
            {class:'icon-dicount_approval', desc:'Approval'},
            {class:'icon-life_cycle', desc:'Lifecycle'},
            {class:'icon-import_export', desc:'Import-Export'},
          ]
    },
    {
      heading: 'Payroll Management',
      description: 'Seamlessly manage employee Payroll with paid time off data of employees. Employees to get a ESS option to update, view and manage their details. Periodic performance appraisal of your workforce with seamless objective setting, assessment and feedback loop mechanism allows you to manage and enhance your workforce effectiveness',
      pointList: ['Seamless integration with attendance system',
                  'Leave approval and tracking workflow',
                  'Employee advance management',
                  'Employee salary slip generation and seamless tax calculation',
          ],
          iconClasses: [
            {class:'icon-payroll', desc:'Payroll Management'},
            {class:'icon-salary_advance', desc:'Salary Advance'},
            {class:'icon-tax_processing', desc:'Taxation Management'},
          ]
    },
    {
      heading: 'HR Management',
      description: 'Seamlessly manage employee performance and training. Employees to get a ESS option to update, view and manage their details. Periodic performance appraisal of your workforce with seamless objective setting, assessment and feedback loop mechanism allows you to manage and enhance your workforce effectiveness',
      pointList: ['Seamless integration with attendance system',
                  'Leave approval and tracking workflow',
                  'Employee advance management',
                  'Employee salary slip generation and seamless tax calculation',
                  'Periodic appraisal and objective setting'
          ],
          iconClasses: [
            {class:'icon-learning-development', desc:'Learning & Development'},
            {class:'icon-appraisal', desc:'Employee Appraisal'},
            {class:'icon-SelfService', desc:'Employee Self Service'},
          ]
    },
    {
      heading: 'Procurement',
      description: 'Procurement starts with Automatic flow of enquiry to different suppliers to submit their quotations either through our Supplier portal as same as customer portal or have Enquiry updates on our official website',
      pointList: ['Streamline order management with complete control & flexibility',
                  'Excess stock reduction using Inventory management integration',
                  'Spend Compliance basis the contract',
                  'Accelerated & Controlled Approval',
                  'Control expenses basis the budget allocation'
          ],
          iconClasses: [
            {class:'icon-SupplierQuotation', desc:'Supplier Quotation'},
            {class:'icon-QuotationApproval', desc:'Quotation Approval'},
            {class:'icon-OrderApproval', desc:'Order Approval'},
            {class:'icon-OrderStatusUpdates', desc:'Order Status'},
            {class:'icon-SpendControl', desc:'Spend Control'},
            {class:'icon-SupplierVetting', desc:'Supplier Vetting'},
          ]
    },
    {
      heading: 'Inventory',
      description: 'Inventory module links seamlessly with procurement and order management for real-time tracking of critical inventory required for seamless order management while reducing excessive inventory',
      pointList: ['BOM and Inventory Integration',
                  'Excess stock reduction',
                  'Spend Compliance basis the contract',
                  'Accelerated & Controlled Approval',
                  'Control expenses basis the budget allocation'
          ],
          iconClasses: [
            {class:'icon-InventoryControl', desc:'Inventory Control'},
            {class:'icon-BOMIntegration', desc:'BOM Integration'},
            {class:'icon-OrderApproval', desc:'Order Approval'},
            {class:'icon-Alerts_and_Notification', desc:'Notification'},
            {class:'icon-SpendControl', desc:'Spend Control'},
          ]
    },
    {
      heading: 'Remnant Sample',
      description: 'Manage the whole workflow and standard operating procedure for remnant sample.',
      pointList: ['Manage retention warehouse',
                  'Receive remnant samples from lab',
                  'Periodic alert for destruction of samples',
                  'Standard Operating Procedure Management',
          ],
          iconClasses: [
            {class:'icon-SampleReceiving', desc:'Sample Receiving'},
            {class:'icon-sample_destruction', desc:'Sample Destruction Alert'},
            {class:'icon-BOMIntegration', desc:'Audit & Trail'},
            {class:'icon-In-built-WorkFlow-Engine', desc:'SoP Workflow'},
          ]
    },
    {
      heading: 'Incident Management',
      description: 'Enterprise wide Incident reporting and management with tracking till closure. Periodic incident alert and hierarchy management with classification and categorization of incidents.',
      pointList: ['Incident Alerts and Notification',
                  'Enterprise-wide communication',
                  'Incident Workflow',
                  'Integration with CAPA',
                  'Action reminders and resolution management'
          ],
          iconClasses: [
            {class:'icon-Enterprise-Communication', desc:'Enterprise Communication'},
            {class:'icon-CAPA', desc:'CAPA'},
            {class:'icon-OrderApproval', desc:'Closure & Resolution'},
            {class:'icon-Alerts_and_Notification', desc:'Notification'},
            {class:'icon-In-built-WorkFlow-Engine', desc:'Incident Workflow'},
          ]
    },

    
  ]

  constructor(private modalService: ModelService,  private router: Router) { }

  ngOnInit(): void {
    let modal = this;
    if (!this.id) {
        console.error('modal must have an id');
        return;
    }
    this.modalService.remove(this.id);
    this.modalService.add(this);
  }

  showModal(dataIndex){
    this.index = dataIndex.index;
    this.data = this.dataList[this.index]
    this.landingFunctionModal.show();
  }

  hideModal(){
    this.landingFunctionModal.hide();
  }

  onModalRightClick(){
    this.index++;
    this.data = this.dataList[this.index]
  }

  onModalLeftClick(){
    this.index--;
    this.data = this.dataList[this.index]
  }

}
