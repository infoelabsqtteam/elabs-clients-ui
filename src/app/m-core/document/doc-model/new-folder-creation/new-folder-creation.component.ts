import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { ModelService } from '@core/web-core';

@Component({
  selector: 'app-new-folder-creation',
  templateUrl: './new-folder-creation.component.html',
  styleUrls: ['./new-folder-creation.component.css']
})
export class NewFolderCreationComponent implements OnInit {

  public renameInput: boolean = true;
	public renameFileExt: any = '';
  public renameText: any = '';
  public folderName: any = "";

  @Input() id: string;
  @Output() createFolderResponce = new EventEmitter();
  @ViewChild('createFolderModal') public createFolderModal: ModalDirective; 

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
    this.createFolderModal.show()     
    this.renameInput = object.renameInput
    if(object.renameText){
      this.renameFileExt = object.renameFileExt
      this.renameText = object.renameText
    }
  }
  cancel(){
    this.close()
    this.createFolderResponce.emit(false);
  }
  close(){
    this.renameFileExt = '';
    this.renameText = '';
    this.folderName = "";
    this.createFolderModal.hide();
  }
  createNewFolder(){
    const object = {
      newfolderText : this.folderName
    }
    this.createFolderResponce.emit(object);
    this.close();
  }
  renameFileAndFolder(){
    const object = {
      renameText : this.renameText,
      renameFileExt: this.renameFileExt
    }
    this.createFolderResponce.emit(object);
    this.close();
  }
  

}
