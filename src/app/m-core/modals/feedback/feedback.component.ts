import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators,FormGroupDirective,FormControlDirective,FormControlName } from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';
import { ApiService, CommonFunctionService, DataShareService, ModelService, StorageService } from '@core/web-core';



@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styles: [
  ]
})
export class FeedbackComponent implements OnInit {
  @Input() id: string;
  @ViewChild('feedback') public feedback: ModalDirective;  
  uploadFilesList:any = [];
  feedbackForm: FormGroup;
  uploadedData;
  dataListForUpload:any = {};
  downloadClick='';
  fileDownloadUrlSubscription;
  dataSaveInProgress: boolean = true;



  customerdata = [
    {'name':'Gautam'},
    {'name':'Rahul'},
    {'name':'Pankaj'},
  ]


  constructor(
    private modelService: ModelService,
    private formBuilder: FormBuilder,
    private dataShareService: DataShareService,
    private commonFunctionService:CommonFunctionService,
    private apiService:ApiService,
    ) {
     
      this.dataShareService.saveResponceData.subscribe( data =>{
      })

      // this.fileDownloadUrlSubscription = this.dataShareService.fileDownloadUrl.subscribe(data =>{
      //   this.setFileDownloadUrl(data);
      // })
    }

  ngOnInit(): void {
    this.initForm();
    let modal = this;
    if (!this.id) {
        console.error('modal must have an id');
        return;
    }
    this.modelService.remove(this.id);
    this.modelService.add(this);
  }


  initForm(){
    const forControlName = {};
    this.feedbackForm = this.formBuilder.group({
      "customerName" : new FormControl(forControlName,Validators.required),
      "summary" : new FormControl('',Validators.required),
      "description" : new FormControl('',Validators.required),
    })
  }




  save() {
    const saveFormValue = this.feedbackForm.getRawValue();
    const saveFromData = {
      curTemp: 'voice_of_customer',
      data: saveFormValue
    }
    this.apiService.SaveFormData(saveFromData);
    this.close();
  }

  
  fileUploadModal() {
		this.modelService.open('file-upload-modal',{})
	}

  fileUploadResponce(responce){
    if(responce) {
      this.uploadedData = responce;
    }
	}
  // removeAttachedDataFromList(index,data){
  //   data.splice(index,1)
  // }
  // downloadFile(file){
  //   this.downloadClick = file.rollName;
  //   this.commonFunctionService.downloadFile(file);
  // }
  // setFileDownloadUrl(fileDownloadUrl){
  //   if (fileDownloadUrl != '' && fileDownloadUrl != null && this.downloadClick != '') {
  //     let link = document.createElement('a');
  //     link.setAttribute('type', 'hidden');
  //     link.href = fileDownloadUrl;
  //     link.download = this.downloadClick;
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //     this.downloadClick = '';
  //     this.dataSaveInProgress = true;
  //     this.apiService.ResetDownloadUrl();
  //   }
  // }









  checkValidator(){    
    return !this.feedbackForm.valid;     
  }


  showModal(){
    this.feedback.show();   
  }

  close(){
    this.feedback.hide();
    this.feedbackForm.reset();
  }

}
