import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl} from '@angular/forms'

@Component({
  selector: 'app-environment-form',
  templateUrl: './environment-form.component.html',
  styleUrls: ['./environment-form.component.css']
})
export class EnvironmentFormComponent implements OnInit {

  reportForm: UntypedFormGroup;
  listOfData:any;
  editable:boolean = false;
  update:boolean = true;

  constructor() {
    this.listOfData = {
      issued_to: 'Jones Lang Lasalle Building Operations Pvt. Ltd. DLF Commercial, Plot No.2, Rajiv Gandhi Tech Park, Kishangarh, Chandigarh',
      reg_no:'F01-2008130168',
      reg_date:'13-08-2020',
      report_date:'14-08-2020',
      report_no:'ICF-2008140344',
      nabl_ulr_no:'TC592620000005359F',
      customer_ref_no:'Letter',
      letter_dated:'11-08-2020',

      test_report_per:'EPA Act 1986/PCLS/2010,G.S.R 281(E),Dated- 07.03.2016',
      emission_source:'Stack Emission of DG Set',
      capacity:'1000 kVA',
      sampling_capacity:'86%',
      fuel_type:'HSD & 120-150 ltr/hr',
      operating_schedule:'During power failure',
      stack_identification:'Stack attached to DG Set-I (1000 kVA)',
      type_of_stack:'Metal',
      ground_level:'24',
      diameter:'35',
      duration:'66',
      purpose:'To assess the pollution load',
      pollution_measure:'Not applicable',
      status:'',
      recovery:'',
      fugitive_emission:'Nil',

      gas_temp:'266',
      gas_velocity:'14.12',
      flow_rate:'2639.46',
      air_temp:'37',

      param_category:[
        {
          name: 'General Parameters',
          parameter: [
            {name:'Particulate Matter,g/kw-hr',
            equipment:'Gravimetric',
            method:'IS:11255(P-1)',
            requirment: 'Max. 0.2',
            result: '0.10'
          }
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
      'reg_no': new UntypedFormControl(this.listOfData.reg_no),
      'reg_date': new UntypedFormControl(this.listOfData.reg_date),
      'report_date': new UntypedFormControl(this.listOfData.report_date),
      'report_no': new UntypedFormControl(this.listOfData.report_no),
      'nabl_ulr_no': new UntypedFormControl(this.listOfData.nabl_ulr_no),
      'customer_ref_no': new UntypedFormControl(this.listOfData.customer_ref_no),
      'letter_dated': new UntypedFormControl(this.listOfData.letter_dated),
      'test_report_per': new UntypedFormControl(this.listOfData.test_report_per),
      'emission_source': new UntypedFormControl(this.listOfData.emission_source),
      'capacity': new UntypedFormControl(this.listOfData.capacity),
      'sampling_capacity': new UntypedFormControl(this.listOfData.sampling_capacity),
      'fuel_type': new UntypedFormControl(this.listOfData.fuel_type),
      'operating_schedule': new UntypedFormControl(this.listOfData.operating_schedule),
      'stack_identification': new UntypedFormControl(this.listOfData.stack_identification),
      'type_of_stack': new UntypedFormControl(this.listOfData.type_of_stack),
      'ground_level': new UntypedFormControl(this.listOfData.ground_level),
      'diameter': new UntypedFormControl(this.listOfData.diameter),
      'duration': new UntypedFormControl(this.listOfData.duration),
      'purpose': new UntypedFormControl(this.listOfData.purpose),
      'pollution_measure': new UntypedFormControl(this.listOfData.pollution_measure),
      'status': new UntypedFormControl(this.listOfData.status),
      'recovery': new UntypedFormControl(this.listOfData.recovery),
      'fugitive_emission': new UntypedFormControl(this.listOfData.fugitive_emission),
      'gas_temp': new UntypedFormControl(this.listOfData.gas_temp),
      'gas_velocity': new UntypedFormControl(this.listOfData.gas_velocity),
      'flow_rate': new UntypedFormControl(this.listOfData.flow_rate),
      'air_temp': new UntypedFormControl(this.listOfData.air_temp),
      

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
