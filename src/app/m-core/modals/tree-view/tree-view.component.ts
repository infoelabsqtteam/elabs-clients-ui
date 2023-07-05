import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import { CommonFunctionService, ModelService } from '@core/web-core';
import { ModalDirective } from 'angular-bootstrap-md';
import {Component,OnInit,Input, Output,ViewChild,EventEmitter,AfterViewInit} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { TreeComponentService } from './tree-component.service';
import {TodoItemNode , TodoItemFlatNode, useCases,keys} from './interface';

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

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  @Input() id: string;
  @Output() treeViewResponce = new EventEmitter();
  @ViewChild('treeView') public treeView: ModalDirective; 

  fieldName:any='';
  data;
  ddnfieldName:any;
  staticData:any={};
  staticDataSubscriber;
  

  constructor(
    private _database: TreeComponentService,
    private modalService:ModelService,
    private commonfunctionService:CommonFunctionService
    ) { 
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    _database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
    
    
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
    if(level != 0 && keys[level-1]){      
      flatNode.type = keys[level-1];
      if(!flatNode.expandable){
        let keyLength = keys.length;
        flatNode.type = keys[keyLength-1];
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
  //   this._database.insertItem(parentNode!, '');
  //   this.treeControl.expand(node);
  // }

  /** Save the node to database */
  // saveNode(node: TodoItemFlatNode, itemValue: string) {
  //   const nestedNode = this.flatNodeMap.get(node);
  //   this._database.updateItem(nestedNode!, itemValue);
  // }

  showModal(alert){    
    this.data=this.staticData[alert.data];
    this.fieldName = alert.fieldName;
    this.ddnfieldName = alert.ddnFieldName;
    if(this.ddnfieldName && this.ddnfieldName != ''){
      if(this.staticData[this.ddnfieldName]){
        
      }          
    }
    this.treeView.show();
    //console.log(alert.data);
    if(this.treeControl){
      this.treeControl.collapseAll();
      this.checklistSelection.clear();
    }
    this.main();
    
  } 

  closeModal(){
    this.fieldName='';
    this.ddnfieldName = '';
    this.treeView.hide();
  }

  selectGridData(){
    let treeControlData = this.treeControl.expansionModel.selected;
    //console.log(treeControlData);
    let data = this.dataSource.data;
    //console.log(data);
    let selectedData = this.modifySelectedDataWithParentId(this.checklistSelection.selected);
    let allNodes = this.treeControl.dataNodes;
    console.log(selectedData)
    console.log(allNodes);
    console.log(this._database.getSelectedNodeWithParent(allNodes,selectedData));
  }
  modifySelectedDataWithParentId(selectedData){
    let modifyList=selectedData.sort((a,b) => (a.parentId.toLowerCase() < b.parentId.toLowerCase())? -1 : (a.parentId.toLowerCase() > b.parentId.toLowerCase()) ? 1 : 0);
    return  modifyList;
  }
  
  convertJsonArryToMapObject(){
    let result = {};    
  }
  applyRelationships = (data) => {
    let levelStack = [], lastNode = null;
    return data.map((curr, index) => {
      const node = { ...curr, id: index + 1 };
      if (levelStack.length === 0) {
        levelStack.push({ level: node.level, parent: 0 });
      } else {
        const last = levelStack[levelStack.length - 1];
        if (node.level > last.level) {
          levelStack.push({ level: node.level, parent: lastNode.id });
        } else if (node.level < last.level) {
          const
            levelDiff = last.level - node.level - 1,
            lastIndex = levelStack.length - 1;
          levelStack.splice(lastIndex - levelDiff, lastIndex);
        }
      }
      node.parentId = levelStack[levelStack.length - 1].parent;
      lastNode = node;
      return node;
    });
  };
  
  listToTree = (arr = []) => {
     let indexMap = new Map();
     arr.forEach((node, index) => {
        indexMap.set(node.id, index)
        node.children = [];
     });
     return arr.reduce((res, node, index, all) => {
        if (node.parentId === 0) return [...res, node];
        all[indexMap.get(node.parentId)].children.push(node);
        return res;
     }, []);
  };
  
  treeToObject = (tree = [], result:any = {}) => {
    tree.forEach(child => {
      if (!child.expandable) {
        result.push(child.item);
      } else {
        const childrenAllEmpty = child.children
          .every(({ children }) => children.length === 0);
        result[child.item] = childrenAllEmpty ? [] : {};
        this.treeToObject(child.children, result[child.item]);
      }
    });
    return result;
  };
  buildTreeObject(arr = []) {
    let relationShip = this.applyRelationships(arr);
    let list = this.listToTree(relationShip);
    let tree = this.treeToObject(list);
    return tree;
    //this.treeToObject(this.listToTree(this.applyRelationships(arr)));
  }
  main = () => {
    useCases.forEach(({ data, expected }) => {
      const actual = this.buildTreeObject(data);
      console.log(JSON.stringify(actual) === JSON.stringify(expected));
      console.log(actual);
    });
  };

  //https://stackblitz.com/edit/nested-multi-select-tree-demo-nymntq?file=app%2Ftree-nested-overview-example.html,app%2Ftree-nested-overview-example.ts    this url for get selected data form tree

}
