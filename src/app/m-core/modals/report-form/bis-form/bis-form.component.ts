import { Component, OnInit,Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl} from '@angular/forms'

@Component({
  selector: 'app-bis-form',
  templateUrl: './bis-form.component.html',
  styleUrls: ['./bis-form.component.css']
})
export class BisFormComponent implements OnInit {

  reportForm: UntypedFormGroup;
  listOfData:any;
  editable:boolean = false;
  update:boolean = true;
  @Input() id: string;

  constructor() { 
    
    // this.listOfData = {
    //   issued_to: 'Dabur India Limited (Unit-III) Lane-3, Phase-2, SIDCO Industrial Complex, Near HP Botteling Plant, Bari Brahmana, Distt. Samba, Jammu Jammu',
    //   reg_no:'F01-2008130168',
    //   reg_date:'13-08-2020',
    //   report_date:'14-08-2020',
    //   report_no:'ICF-2008140344',
    //   customer_ref_no:'Letter',
    //   letter_dated:'11-08-2020',
    //   nature_of_sample:'Mustard Oil RBD',
    //   grade:'',
    //   brand_name:'',
    //   declared_values:'',
    //   code_no:'',
    //   batch_no:'Tanker No GJ02ZZ-3500',
    //   dom:'11.8.2020',
    //   date_of_expiry:'',
    //   sample_quantity:'1 PACK',
    //   batch_size:'',
    //   mode_of_packing:'PACKED IN PLASTIC CONTAINER',
    //   date_of_receipt:'13-08-2020',
    //   date_of_start:'13-08-2020',
    //   date_of_completion:'14-08-2020',
    //   bis_seal:'Unsealed',
    //   signature:'Unsigned',
    //   other_info:'',
    //   req_submitted_by:'Dabur India Limited (Unit-III) - Jammu( Jammu and Kashmir )',
    //   manufactured_by:'',
    //   supplied_by:'Dhanlaxmi Edibles Pvt Ltd',
    //   reference:'',
    //   supporting_doc:'Graph',
    //   deviation:'',
    //   param_category:[
    //     {
    //       name: 'Chemical Parameters',
    //       parameter: [
    //         {name:'Determination of Allylisothiocyanate ',
    //         equipment:'Chemically',
    //         method:'IS: 548',
    //         requirment: '',
    //         result: 'Absent'
    //       }
    //       ]
    //     },
    //     {
    //       name: 'Fatty Acid Profile',
    //       parameter: [
    //         {name:'Palmitic Acid (C16:0) (%)',
    //         equipment:'GC-FID(Agilent) ',
    //         method:'STP/ITC/FC/056 ',
    //         requirment: 'NMT 5.0% ',
    //         result: '4.59'
    //       },
    //       {name:'Stearic Acid (C18:0) (%)',
    //         equipment:'GC-FID(Agilent) ',
    //         method:'STP/ITC/FC/056 ',
    //         requirment: 'NMT 1.5%',
    //         result: '1.82'
    //       },
    //       {name:'Oleic Acid (C18:1) (%)',
    //         equipment:'GC-FID(Agilent) ',
    //         method:'STP/ITC/FC/056 ',
    //         requirment: '8-16%',
    //         result: '15.39'
    //       },
    //       {name:'Linoleic Acid (C18:2) (%) ',
    //         equipment:'GC-FID(Agilent) ',
    //         method:'STP/ITC/FC/056 ',
    //         requirment: '10-20%',
    //         result: '18.49'
    //       },
    //       {name:'Linolenic Acid (C18:3) (%) ',
    //         equipment:'GC-FID(Agilent) ',
    //         method:'STP/ITC/FC/056 ',
    //         requirment: '4 -11%',
    //         result: '3.95'
    //       },
    //       {name:'Erucic (C22:1) (%)',
    //         equipment:'GC-FID(Agilent) ',
    //         method:'STP/ITC/FC/056 ',
    //         requirment: 'NLT 38.0% ',
    //         result: '41.17'
    //       },
    //       ]
    //     },
    //   ]

    // }

    //this.onInitialise()
  }

  ngOnInit(): void {
    this.listOfData=this.id;
    console.log(this.listOfData)
  }

  onInitialise(){
    this.reportForm = new UntypedFormGroup({
      'issued_to': new UntypedFormControl(this.listOfData.issued_to),
      'reg_no': new UntypedFormControl(this.listOfData.reg_no),
      'reg_date': new UntypedFormControl(this.listOfData.reg_date),
      'report_date': new UntypedFormControl(this.listOfData.report_date),
      'report_no': new UntypedFormControl(this.listOfData.report_no),
      'customer_ref_no': new UntypedFormControl(this.listOfData.customer_ref_no),
      'letter_dated': new UntypedFormControl(this.listOfData.letter_dated),
      'nature_of_sample': new UntypedFormControl(this.listOfData.nature_of_sample),
      'grade': new UntypedFormControl(this.listOfData.grade),
      'brand_name': new UntypedFormControl(this.listOfData.brand_name),
      'declared_values': new UntypedFormControl(this.listOfData.declared_values),
      'code_no': new UntypedFormControl(this.listOfData.code_no),
      'batch_no': new UntypedFormControl(this.listOfData.batch_no),
      'dom': new UntypedFormControl(this.listOfData.dom),
      'date_of_expiry': new UntypedFormControl(this.listOfData.date_of_expiry),
      'sample_quantity': new UntypedFormControl(this.listOfData.sample_quantity),
      'batch_size': new UntypedFormControl(this.listOfData.batch_size),
      'mode_of_packing': new UntypedFormControl(this.listOfData.mode_of_packing),
      'date_of_receipt': new UntypedFormControl(this.listOfData.date_of_receipt),
      'date_of_start': new UntypedFormControl(this.listOfData.date_of_start),
      'date_of_completion': new UntypedFormControl(this.listOfData.date_of_completion),
      'bis_seal': new UntypedFormControl(this.listOfData.bis_seal),
      'signature': new UntypedFormControl(this.listOfData.signature),
      'other_info': new UntypedFormControl(this.listOfData.other_info),
      'req_submitted_by': new UntypedFormControl(this.listOfData.req_submitted_by),
      'manufactured_by': new UntypedFormControl(this.listOfData.manufactured_by),
      'supplied_by': new UntypedFormControl(this.listOfData.supplied_by),
      'reference': new UntypedFormControl(this.listOfData.reference),
      'supporting_doc': new UntypedFormControl(this.listOfData.supporting_doc),
      'deviation': new UntypedFormControl(this.listOfData.deviation),
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
