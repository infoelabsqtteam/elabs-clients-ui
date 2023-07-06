import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import { DataShareService, ModelService } from '@core/web-core';
import { ModalDirective } from 'angular-bootstrap-md';
import {Component,OnInit,Input, Output,ViewChild,EventEmitter,AfterViewInit} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { TreeComponentService } from './tree-component.service';
import {TodoItemNode , TodoItemFlatNode} from './interface';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css']
})
export class TreeViewComponent implements OnInit, AfterViewInit {
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  //selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  //newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;
  keys:any=[];

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  @Input() id: string;
  @Output() treeViewResponce = new EventEmitter();
  @ViewChild('treeView') public treeView: ModalDirective; 

  fieldName:any='';
  ddnfieldName:any;
  staticData:any={};
  staticDataSubscriber;
  

  constructor(
    private treeComponentService: TreeComponentService,
    private modalService:ModelService,
    private dataShareService:DataShareService
    ) { 
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.staticDataSubscriber = this.dataShareService.staticData.subscribe(data =>{
      this.setStaticData(data);
    })
    
    
  }

  ngOnInit() {
    let modal = this;
    if (!this.id) {
        console.error('modal must have an id');
        return;
    }
    this.modalService.remove(this.id);
    this.modalService.add(this);
  }
  ngAfterViewInit() {
    // for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
    //   if (this.treeControl.dataNodes[i].item == 'Other Masters') {
    //     this.todoItemSelectionToggle(this.treeControl.dataNodes[i]);
    //     this.treeControl.expand(this.treeControl.dataNodes[i])
    //   }
      // if (this.treeControl.dataNodes[i].item == 'Groceries') {
      //   this.treeControl.expand(this.treeControl.dataNodes[i])
      // }
    // }
  }
  setStaticData(staticDatas){
    if(staticDatas && Object.keys(staticDatas).length > 0 && staticDatas[this.ddnfieldName]) {
      Object.keys(staticDatas).forEach(key => {  
        let staticData = {};
        staticData[key] = staticDatas[key]; 
        if(key && key != 'null' && key != 'FORM_GROUP' && key != 'CHILD_OBJECT' && key != 'COMPLETE_OBJECT' && key != 'FORM_GROUP_FIELDS'){
          if(staticData[key]) { 
            this.staticData[key] = JSON.parse(JSON.stringify(staticData[key]));
          }          
        } 
      })
      if(this.staticData && Object.keys(this.staticData).length > 0){
        this.renderTreeData();
      }
    }
  }
  renderTreeData(){
    if(this.ddnfieldName && this.ddnfieldName != ''){
      if(this.staticData[this.ddnfieldName]){
        let treeData = this.staticData[this.ddnfieldName];
        let treeKeys = this.staticData['keys'];
        if(treeKeys && treeKeys.length > 0){
          this.keys = treeKeys;
        }
        let buildTreeData = this.treeComponentService.buildFileTree(treeData,0,this.keys);
        this.dataSource.data = buildTreeData;      
      }          
    } 
  }
  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node.item ? existingNode : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    flatNode.reference = node.reference;
    flatNode._id = node._id;
    flatNode.parentId = node.parentId;
    if(level != 0 && this.keys[level-1]){      
      flatNode.type = this.keys[level-1];
      if(!flatNode.expandable){
        let keyLength = this.keys.length;
        flatNode.type = this.keys[keyLength-1];
      }
    }
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /** Select the category so we can insert the new item. */
  // addNewItem(node: TodoItemFlatNode) {
  //   const parentNode = this.flatNodeMap.get(node);
  //   this.treeComponentService.insertItem(parentNode!, '');
  //   this.treeControl.expand(node);
  // }

  /** Save the node to database */
  // saveNode(node: TodoItemFlatNode, itemValue: string) {
  //   const nestedNode = this.flatNodeMap.get(node);
  //   this.treeComponentService.updateItem(nestedNode!, itemValue);
  // }

  showModal(alert){    
    //this.data=this.staticData[alert.data];
    let field = alert.field
    this.fieldName = field.label;
    this.ddnfieldName = field.ddn_field;    
    this.treeView.show();
    if(this.treeControl){
      this.treeControl.collapseAll();
      this.checklistSelection.clear();
    }
    
  } 

  closeModal(){
    this.fieldName='';
    this.ddnfieldName = '';
    this.treeView.hide();
  }

  selectGridData(){
    //let treeControlData = this.treeControl.expansionModel.selected;
    //let data = this.dataSource.data;
    let selectedData = this.treeComponentService.modifySelectedDataWithParentId(this.checklistSelection.selected);
    let allNodes = this.treeControl.dataNodes;
    let rearrangedSelectedNode = this.treeComponentService.getSelectedNodeWithParent(allNodes,selectedData,this.keys);
    let mapObjecThroughList = this.treeComponentService.buildTreeObject(rearrangedSelectedNode);
    console.log(rearrangedSelectedNode);
    console.log(mapObjecThroughList);
  }
}
