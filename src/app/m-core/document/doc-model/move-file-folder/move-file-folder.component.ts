import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { ModelService, DocDataShareService} from '@core/web-core';

@Component({
  selector: 'app-move-file-folder',
  templateUrl: './move-file-folder.component.html',
  styleUrls: ['./move-file-folder.component.css']
})
export class MoveFileFolderComponent implements OnInit {

  public selectedRows: any = -1;
  public documentViewList: boolean = true;
  public moveFolderChildren: any = [];
  moveFolderDataSubscription;

  @Input() id: string;
  @Output() moveFileFolderResponce = new EventEmitter();
  @ViewChild('moveFileFolderModal') public moveFileFolderModal: ModalDirective; 

  constructor(
    private modelService:ModelService,
    private docDataShareService:DocDataShareService
  ) { 
    this.moveFolderDataSubscription = this.docDataShareService.moveFolderData.subscribe(moveData =>{
        this.setMoveFolderData(moveData);
    })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.moveFolderDataSubscription){
      this.moveFolderDataSubscription.unsubscribe();
    }
  }
  ngOnInit() {
    let modal = this;
      if (!this.id) {
          console.error('modal must have an id');
          return;
      }
      this.modelService.remove(this.id);
      this.modelService.add(this);
  }
  setMoveFolderData(moveFolderData){
    if (moveFolderData && moveFolderData.length > 0) {
        this.moveFolderChildren = [];
        moveFolderData.forEach(element => {
            if (element.folder) {
                this.moveFolderChildren.push(element);
            }
        });
    }
  }
  showModal(object){
    this.moveFileFolderModal.show()  
    this.documentViewList = object.documentViewList;
  }  
  close(){
    this.moveFileFolderModal.hide();
  }

  openMoveModalFolder(selectedFolder: any) {
    this.selectedRows = -1;
    const object = {
      "action" : "double_Click",
      "object" : selectedFolder
    }
    this.moveFileFolderResponce.emit(object);
		
  }
  setClickedMoveModalRow(index, Details) {
    this.selectedRows = index;
    const object = {
      "action" : "click",
      "object" : Details,
      "index" : index
    }
    this.moveFileFolderResponce.emit(object);
  }
  moveModalClose() {
		const object = {
      "action" : "close"
    }
    this.moveFileFolderResponce.emit(object);
  }
  
  moveDocument() {
		const object = {
      "action" : "move"
    }
    this.moveFileFolderResponce.emit(object);
  }
  
  back() {
    const object = {
      "action" : "back"
    }
    this.moveFileFolderResponce.emit(object);
	}
  

}
