import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl} from '@angular/forms'

@Component({
  selector: 'app-eic-format',
  templateUrl: './eic-format.component.html',
  styleUrls: ['./eic-format.component.css']
})
export class EicFormatComponent implements OnInit {

  reportForm: UntypedFormGroup;
  listOfData:any;
  editable:boolean = false;
  update:boolean = true;

  constructor() {
    this.listOfData = {
      issued_to: 'Jones Lang Lasalle Building Operations Pvt. Ltd. DLF Commercial, Plot No.2, Rajiv Gandhi Tech Park, Kishangarh, Chandigarh',
      reg_no:'F01-2008130168',
      name_of_processor:'ST. PETER & PAUL SEA FOOD EXPORTS P.LTD., No.90, Kanigaipair Village, Periyapalayam Main Road Thiruvalloor Dist.TamiInadu-601 102.1ndia',
      name_of_exporter:'ST. PETER & PAUL SEA FOOD EXPORTS P. LTD., No.90, Kanigaipair Village, periyapalayam Main Road Thiruvalloor Dist. Tamilnadu-601 102. India',
      approval_no:'840',
      customer_ref:'Letter Date 19-12-2019',
      invoice_no:'STPPU199/2019-20 DT:16.12.2019',
      smapling_date:'',
      date_of_sample_receipt:'19-12-2019',
      condition:'Sealed & Good',
      nature:'FROZEN INDIAN MACKEREL',
      species_name:'RASTRELUGER KANAGURTA',
      packing:'1X1O KG',
      quantity:'12,000 KGS',
      type:'Composite',
      quantity_sample_drawn:'',
      no_of_mc:'1200 BAGS',
      code:'9M09',
      grade:'5/8',
      place:'',
      traceability_code:'',
      reg_of_pond:'',
      no_of_selected_case:'',
      sampled_case_seal_no:'',
      seal_no_for_test_sample:'',
      seal_no_for_ref_sample:'',
      consignment_intended:'MH. SEAFOOD INC.,',
      consignee:'4600 BIRCHWOOD AVENUE SEAL BEACH CA 90740, USA',
      sample_by:'Mr. A. KUMAR QC-Executive',
      analysis_start_date:'20-12-2019',
      analysis_completion_date:'21-12-2019',
      discipline:'Chemical Testing',
      group:'Residues in Food products',
      param_category:[
        {
          name: 'Chemical Parameters',
          parameter: [
            {name:'Histamine (sample 1)',
            unit:'mg/kg',
            result:'ND',
            measurment: '89.46+5.89',
            level:'90.72',
            limit:'10',
            lod:'1.58',
            mrl:'****100-200',
            analytical:'HPLC',
            specs:'ITC',
            protocol:'EC'
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
      'reg_no': new UntypedFormControl(this.listOfData.reg_no),
      'name_of_processor': new UntypedFormControl(this.listOfData.name_of_processor),
      'name_of_exporter': new UntypedFormControl(this.listOfData.name_of_exporter),
      'approval_no': new UntypedFormControl(this.listOfData.approval_no),
      'customer_ref': new UntypedFormControl(this.listOfData.customer_ref),
      'invoice_no': new UntypedFormControl(this.listOfData.invoice_no),
      'smapling_date': new UntypedFormControl(this.listOfData.smapling_date),
      'date_of_sample_receipt': new UntypedFormControl(this.listOfData.date_of_sample_receipt),
      'condition': new UntypedFormControl(this.listOfData.condition),
      'nature': new UntypedFormControl(this.listOfData.nature),
      'species_name': new UntypedFormControl(this.listOfData.species_name),
      'packing': new UntypedFormControl(this.listOfData.packing),
      'quantity': new UntypedFormControl(this.listOfData.quantity),
      'type': new UntypedFormControl(this.listOfData.type),
      'quantity_sample_drawn': new UntypedFormControl(this.listOfData.quantity_sample_drawn),
      'no_of_mc': new UntypedFormControl(this.listOfData.no_of_mc),
      'code': new UntypedFormControl(this.listOfData.code),
      'grade': new UntypedFormControl(this.listOfData.grade),
      'place': new UntypedFormControl(this.listOfData.place),
      'traceability_code': new UntypedFormControl(this.listOfData.traceability_code),
      'reg_of_pond': new UntypedFormControl(this.listOfData.reg_of_pond),
      'no_of_selected_case': new UntypedFormControl(this.listOfData.no_of_selected_case),
      'sampled_case_seal_no': new UntypedFormControl(this.listOfData.sampled_case_seal_no),
      'seal_no_for_test_sample': new UntypedFormControl(this.listOfData.seal_no_for_test_sample),
      'seal_no_for_ref_sample': new UntypedFormControl(this.listOfData.seal_no_for_ref_sample),
      'consignment_intended': new UntypedFormControl(this.listOfData.consignment_intended),
      'consignee': new UntypedFormControl(this.listOfData.consignee),
      'sample_by': new UntypedFormControl(this.listOfData.sample_by),
      'analysis_start_date': new UntypedFormControl(this.listOfData.analysis_start_date),
      'analysis_completion_date': new UntypedFormControl(this.listOfData.analysis_completion_date),
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
