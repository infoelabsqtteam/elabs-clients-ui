import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl} from '@angular/forms'

@Component({
  selector: 'app-apeda-format',
  templateUrl: './apeda-format.component.html',
  styleUrls: ['./apeda-format.component.css']
})
export class ApedaFormatComponent implements OnInit {

  reportForm: UntypedFormGroup;
  listOfData:any;
  editable:boolean = false;
  update:boolean = true;

  constructor() { 
    this.listOfData = {
      issued_to: 'Jones Lang Lasalle Building Operations Pvt. Ltd. DLF Commercial, Plot No.2, Rajiv Gandhi Tech Park, Kishangarh, Chandigarh',
      received_on:'09-12-2019',
      commenced_on:'09-12-2019',
      complete_date:'10-12-2019',
      report_date:'11-12-2019',
      reg_no:'F01-2008130168',
      description:'Wheat',
      appearance:'Brown colour Whole wheat grains',
      quantity:'350g X 1 No',
      condition:'Good',
      block:'Bhanpura',
      village:'Kotditek',
      name_of_group:'Jai Ma Krishak Jaivik Samuh',
      district:'Mandasaur',
      farmer_name:'Bhawani Shankar',
      father_name:'Kanwarlaji',
      aadhar:'336291018798',
      contact_no:'',
      khasara_no:'107/2',
      customer_ref:'Customer letter dated: 06.09.19',
      discipline:'Chemical Testing',
      group:'Food and Agricultural Products',
      param_category:[
        {
          name: '',
          parameter: [
            {name:'Testing For Rotting',
            code:'LCM1',
            method:'Visual Examination',
            result: 'Absent',
            unit:'mg/kg',
            loq:'0.01'
            
          },
          {name:'Testing For Rodent Contamination',
            code:'LCM1',
            method:'FSSAI Lab Manua18:2016',
            result: 'Absent',
            unit:'mg/kg',
            loq:'0.01'
          },
          {name:'Test for Mold',
            code:'LCM1',
            method:'Visual Examination',
            result: 'Absent',
            unit:'mg/kg',
            loq:'0.01'
          },
         
          ]
        },
        
      ]
    }
    this.onInitialise()
  }

  ngOnInit(): void {
  }

  onInitialise(){
    this.reportForm = new UntypedFormGroup({
      'issued_to': new UntypedFormControl(this.listOfData.issued_to),
      'received_on': new UntypedFormControl(this.listOfData.received_on),
      'commenced_on': new UntypedFormControl(this.listOfData.commenced_on),
      'complete_date': new UntypedFormControl(this.listOfData.complete_date),
      'report_date': new UntypedFormControl(this.listOfData.report_date),
      'reg_no': new UntypedFormControl(this.listOfData.reg_no),
      'description': new UntypedFormControl(this.listOfData.description),
      'appearance': new UntypedFormControl(this.listOfData.appearance),
      'quantity': new UntypedFormControl(this.listOfData.quantity),
      'condition': new UntypedFormControl(this.listOfData.condition),
      'block': new UntypedFormControl(this.listOfData.block),
      'village': new UntypedFormControl(this.listOfData.village),
      'name_of_group': new UntypedFormControl(this.listOfData.name_of_group),
      'district': new UntypedFormControl(this.listOfData.district),
      'farmer_name': new UntypedFormControl(this.listOfData.farmer_name),
      'father_name': new UntypedFormControl(this.listOfData.father_name),
      'aadhar': new UntypedFormControl(this.listOfData.aadhar),
      'contact_no': new UntypedFormControl(this.listOfData.contact_no),
      'khasara_no': new UntypedFormControl(this.listOfData.khasara_no),
      'customer_ref': new UntypedFormControl(this.listOfData.customer_ref),
      'discipline': new UntypedFormControl(this.listOfData.discipline),
      'group': new UntypedFormControl(this.listOfData.group),
      
      
      

    })

}

updates(){
  this.editable = true;
}

save(){
  this.editable = false;
}

letterFromNumber(i){
  return String.fromCharCode(97 + i);
}



}
