import { Component, OnInit, ElementRef, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl} from '@angular/forms';


@Component({
  selector: 'app-ayurvedic-form',
  templateUrl: './ayurvedic-form.component.html',
  styleUrls: ['./ayurvedic-form.component.css']
})
export class AyurvedicFormComponent implements OnInit {

  @ViewChild('ce') ces:ElementRef;
  reportForm: UntypedFormGroup;
  listOfData:any;
  editable:boolean = false;
  update:boolean = true;

  constructor(private elRef:ElementRef) { 
    this.listOfData = {
      sample_name:'Terminalia Chebula Fruit',
      supplied_by:'Ashwin Enterprise',
      report_date: '18-08-2020',
      manufactured_by:'Ashwin Enterprise',
      report_number:'ICA-2008180094',
      submitted_by:'Lamar Natural Products Pvt. Ltd, C/O Amar-deep Pharmas LLP',
      booking_code:'A01-2008130086',
      mfg:'13-08-2020',
      booking_date: 'AYU-973/L',
      party_ref_no: '6-08-2020',
      address: 'Lamar Natural Products Pvt. Ltd, C/O Amar-deep Pharmas LLP-Plot No. 29, Tuem Industrial Area, Tuem Pernem Goa',
      batch_no:'',
      batch_size: '20 KG',
      party_ref_date: '6-08-2020',
      dm:'',
      de:'',
      sample_qty: '10 GM',
      param_category:[
          {
            name: 'Chemical Parameters',
            parameter: [
              {name:'Identification by HPTLC',
              equipment:'HPTLC',
              method:'Party\'s method',
              requirment: 'HPTLC fingerprinting pattern of sample chromatogram is same as that of standard chromatogram',
              result: 'Complies'
            }
            ]
          },
          {
            name: 'Heavy metals',
            parameter: [
              {name:'Lead (as Pb) (ppm)',
              equipment:'ICPMS',
              method:'ITC/STP/F/INST/006',
              requirment: 'NMT 10',
              result: '0.10'
            },
            {name:'Arsenic (as As) (ppm)',
              equipment:'ICPMS',
              method:'ITC/STP/F/INST/006',
              requirment: 'NMT 3',
              result: 'BLQ(LOQ : 0.10)'
            },
            {name:'Cadmium (as Cd) (ppm)',
              equipment:'ICPMS',
              method:'ITC/STP/F/INST/006',
              requirment: 'NMT 0.3',
              result: 'BLQ(LOQ : 0.10)'
            },
            {name:'Mercury (as Hg) (ppm)',
              equipment:'ICPMS',
              method:'ITC/STP/F/INST/006',
              requirment: 'NMT 1',
              result: '0.18'
            }
            ]
          },
        ]
      
    }
    
    this.onInitialise()
  }

  ngOnInit() {
  }

  onInitialise(){
      this.reportForm = new UntypedFormGroup({
        'sample_name': new UntypedFormControl(this.listOfData.sample_name),
        'supplied_by': new UntypedFormControl(this.listOfData.supplied_by),
        'report_date': new UntypedFormControl(this.listOfData.report_date),
        'manufactured_by': new UntypedFormControl(this.listOfData.manufactured_by),
        'report_number': new UntypedFormControl(this.listOfData.report_number),
        'submitted_by': new UntypedFormControl(this.listOfData.submitted_by),
        'booking_code': new UntypedFormControl(this.listOfData.booking_code),
        'mfg': new UntypedFormControl(this.listOfData.mfg),
        'booking_date': new UntypedFormControl(this.listOfData.booking_date),
        'party_ref_no': new UntypedFormControl(this.listOfData.party_ref_no),
        'address': new UntypedFormControl(this.listOfData.address),
        'batch_no': new UntypedFormControl(this.listOfData.batch_no),
        'batch_size': new UntypedFormControl(this.listOfData.batch_size),
        'party_ref_date': new UntypedFormControl(this.listOfData.party_ref_date),
        'dm': new UntypedFormControl(this.listOfData.dm),
        'de': new UntypedFormControl(this.listOfData.de),
        'sample_qty': new UntypedFormControl(this.listOfData.sample_qty),
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

  convetToPDF(){
    var t = this.ces.nativeElement.innerHTML
    var x = document.getElementById('contentToConvert')
    console.log(t)
  }
  
}
