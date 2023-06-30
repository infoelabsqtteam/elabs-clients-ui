import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { ModelService } from '@core/web-core';

@Component({
  selector: 'app-doc-folder-upload',
  templateUrl: './doc-folder-upload.component.html',
  styleUrls: ['./doc-folder-upload.component.css']
})
export class DocFolderUploadComponent implements OnInit {

  public fileDrop: boolean;
  private vdrprentfolder : any = {};
  public uploadFile: boolean = false;
  public files: any[] = [];



  @Input() id: string;
  @Output() uploadDocFolderResponce = new EventEmitter();
  @ViewChild('uploadDocFolderModal') public uploadDocFolderModal: ModalDirective; 

  constructor(
    private modelService:ModelService
  ) { }

  ngOnInit() {
    let modal = this;
      if (!this.id) {
          console.error('modal must have an id');
          return;
      }
      this.modelService.remove(this.id);
      this.modelService.add(this);
  }
  showModal(object){
    this.uploadDocFolderModal.show()   
    this.vdrprentfolder = object.parentFolder 
  }
  cancel(){
    this.close()
    this.uploadDocFolderResponce.emit(false);
    this.files = [];
  }
  close(){
    this.uploadDocFolderModal.hide();
  }

  /**
	 * on file drop handler
	 */
	onFileDropped($event) {
		this.prepareFilesList($event);
  }
  /**
	 * handle file from browsing
	 */
	fileBrowseHandler(files) {
		this.prepareFilesList(files);
	}

  /**
	 * Convert Files list to normal array list
	 * @param files (Files List)
	 */
	public xtr: any;
	public obj: any = {};
	public uploadData: any = []
	public uploadFilesData: any = [];
	prepareFilesList(files: Array<any>) {
		for (const item of files) {
			item.progress = 0;
			this.files.push(item);
		}
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			this.uploadFilesData.push(file);
			var reader = new FileReader();
			reader.onload = this.readNoticeFile
			reader.readAsDataURL(file);
		}

  }
  readNoticeFile = (e) => {
		var rxFile = this.uploadFilesData[0];
		this.uploadFilesData.splice(0, 1);
		this.uploadData.push({
			fileData: e.target.result.split(',')[1],
			fileName: rxFile.name,
			fileExtn: rxFile.name.split('.')[1],
			size: rxFile.size,
			innerBucketPath: this.vdrprentfolder.key + rxFile.name
		});
  }
  
  /**
	 * Delete file from files list
	 * @param index (File index)
	 */
	deleteFile(index: number) {
		this.files.splice(index, 1);
  }

  /**
	 * format bytes
	 * @param bytes (File size in bytes)
	 * @param decimals (Decimals point)
	 */
	formatBytes(bytes, decimals) {
		if (bytes === 0) {
			return '0 Bytes';
		}
		const k = 1024;
		const dm = decimals <= 0 ? 0 : decimals || 2;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}
  
  uploadFilesSimulator(){
    const object = {
      uploadData : this.uploadData
    }
    this.uploadDocFolderResponce.emit(object);
  }

}
