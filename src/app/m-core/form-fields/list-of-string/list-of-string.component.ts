import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-list-of-string',
  templateUrl: './list-of-string.component.html',
  styleUrls: ['./list-of-string.component.css']
})
export class ListOfStringComponent implements OnInit {

  @Input() tableField:any;
  @Input() fieldControl:FormControl;
  @Input() custmizedFormValue:any;
  @Input() selectable:boolean;
  @Input() removable:boolean;
  @Input() addOnBlur:boolean;
  @Input() separatorKeysCodes:any;
  @Input() tempVal:any;
  @Input() addOrUpdateIconShowHideList:any;
  @Input() templateFormControl:any;
  
  @Input() openModal: (id, index, parent,child, data, alertType) => void;
  @Input() setValue: (parentfield,field, add,event?) => void;
  @Input() typeaheadDragDrop: (event: CdkDragDrop<string[]>,parent,chield) => void;
  @Input() editListOfString: (parentfield,field,index) => void;

  constructor() { }

  ngOnInit() {
  }

}
