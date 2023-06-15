import { Component, OnInit,OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { DataShareService, ModelService } from '@core/service-lib';


interface FoodNode {
  code:string;
  name: string;
  _id:string;
  add_on_click:boolean;
  children?: FoodNode[];
}

// const TREE_DATA: FoodNode[] = [
//   {
//     name: 'Fruit',
//     children: [
//       {name: 'Apple'},
//       {name: 'Banana'},
//       {name: 'Fruit loops'},
//     ]
//   }, {
//     name: 'Vegetables',
//     children: [
//       {
//         name: 'Green',
//         children: [
//           {name: 'Broccoli'},
//           {name: 'Brussels sprouts'},
//         ]
//       }, {
//         name: 'Orange',
//         children: [
//           {name: 'Pumpkins'},
//           {name: 'Carrots'},
//         ]
//       },
//     ]
//   },
// ];

@Component({
  selector: 'app-tree-view-modal',
  templateUrl: './tree-view-modal.component.html',
  styleUrls: ['./tree-view-modal.component.css']
})
export class TreeViewModalComponent implements OnInit,OnDestroy {

  fieldName:any='';
  data;
  ddnfieldName:any;
  TREE_DATA: FoodNode[];
  staticData:any={};
  staticDataSubscriber;

  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  treeViewData = new MatTreeNestedDataSource<FoodNode>();

  @Input() id: string;
  @Output() treeViewResponce = new EventEmitter();
  @ViewChild('treeViewModal') public treeViewModal: ModalDirective; 

  constructor(
    private modalService: ModelService, 
    private el: ElementRef,
    private dataShareService:DataShareService
  ) {
    this.staticDataSubscriber = this.dataShareService.staticData.subscribe(data =>{
      this.setStaticData(data);
    })
     //this.treeViewData.data = TREE_DATA;
   }

  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
  ngOnDestroy(): void {
      
      if(this.staticDataSubscriber){
        this.staticDataSubscriber.unsubscribe();
      }
  }
  ngOnInit(): void {
    let modal = this;
    if (!this.id) {
        console.error('modal must have an id');
        return;
    }
    this.modalService.remove(this.id);
    this.modalService.add(this);
    // this.store.select('staticData').subscribe((state => {
    //   if (state.staticData) {
    //     this.staticData = state.staticData;
    //     if(this.ddnfieldName && this.ddnfieldName != ''){
    //       if(this.staticData[this.ddnfieldName]){
    //         this.treeViewData.data = this.staticData[this.ddnfieldName]
    //       }          
    //     } 
              
    //   }
    // }))
  }

  setStaticData(staticData){
    if (staticData) {
      this.staticData = staticData;
      if(this.ddnfieldName && this.ddnfieldName != ''){
        if(this.staticData[this.ddnfieldName]){
          this.treeViewData.data = this.staticData[this.ddnfieldName]
        }          
      } 
            
    }
  }

  showModal(alert){    
    this.data=this.staticData[alert.data];
    this.fieldName = alert.fieldName;
    this.ddnfieldName = alert.ddnFieldName;
    if(this.ddnfieldName && this.ddnfieldName != ''){
      if(this.staticData[this.ddnfieldName]){
        this.treeViewData.data = this.staticData[this.ddnfieldName]
      }          
    }
    this.treeViewModal.show();
    //console.log(alert.data);
  } 

  setFieldData(data){
    this.fieldName='';
    this.ddnfieldName = '';
    this.treeViewResponce.emit(data);
    this.treeViewModal.hide();
  }

  closeModal(){
    this.fieldName='';
    this.ddnfieldName = '';
    this.treeViewModal.hide();
  }

}
