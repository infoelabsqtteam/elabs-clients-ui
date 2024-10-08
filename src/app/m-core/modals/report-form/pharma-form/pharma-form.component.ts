import { Component, OnInit   } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl} from '@angular/forms'

@Component({
  selector: 'app-pharma-form',
  templateUrl: './pharma-form.component.html',
  styleUrls: ['./pharma-form.component.css']
})
export class PharmaFormComponent implements OnInit {

  
  reportForm: UntypedFormGroup;
  listOfData:any;
  editable:boolean = false;
  update:boolean = true;
  amount:number=15000050;

  constructor() {
    this.listOfData = {
      sample_name:'PKIPA',
      supplied_by:'N.S',
      report_no:'ICP-2008190073',
      manufactured_by:'N.S',
      booking_code:'P01-2008190020',
      submitted_by:'Centrient Pharmaceuticals India Private Limited (formerly known as DSM Sinochem Pharmaceuticals India Private Limited)-Nawashahr ( Punjab )',
      party_ref_date:'18-08-2020',
      mfg_lic_no:'N.S',
      batch_no:'572000422 (SES NO.1000169152)',
      booking_date:'19-08-2020',
      dm:'N/S',
      de:'N/S',
      batch_size:'',
      sample_qty:'1.0 gm',
      date_of_complete:'19-08-2020',
      ref_protocol:'STP No. LL/STP/AAS/001',
      description:'White Powder.',
      parameter:[
        {
          name:'.Nickel Content',
          result:'2.14 ppm',
          limit:'NMT-20 ppm'
        }
      ]

    }

    this.onInitialise()
   }

  ngOnInit(): void {
  }

  onInitialise(){
    this.reportForm = new UntypedFormGroup({
      'sample_name': new UntypedFormControl(this.listOfData.sample_name),
      'supplied_by': new UntypedFormControl(this.listOfData.supplied_by),
      'report_no': new UntypedFormControl(this.listOfData.report_no),
      'manufactured_by': new UntypedFormControl(this.listOfData.manufactured_by),
      'booking_code': new UntypedFormControl(this.listOfData.booking_code),
      'submitted_by': new UntypedFormControl(this.listOfData.submitted_by),
      'party_ref_date': new UntypedFormControl(this.listOfData.party_ref_date),
      'mfg_lic_no': new UntypedFormControl(this.listOfData.mfg_lic_no),
      'batch_no': new UntypedFormControl(this.listOfData.batch_no),
      'booking_date': new UntypedFormControl(this.listOfData.booking_date),
      'dm': new UntypedFormControl(this.listOfData.dm),
      'de': new UntypedFormControl(this.listOfData.de),
      'batch_size': new UntypedFormControl(this.listOfData.batch_size),
      'sample_qty': new UntypedFormControl(this.listOfData.sample_qty),
      'date_of_complete': new UntypedFormControl(this.listOfData.date_of_complete),
      'ref_protocol': new UntypedFormControl(this.listOfData.ref_protocol),
      'description': new UntypedFormControl(this.listOfData.description),
      })

}

updates(){
  this.editable = true;
}

save(){
  this.editable = false;
}


}
