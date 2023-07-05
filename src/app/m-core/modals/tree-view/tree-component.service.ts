import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { CommonFunctionService } from '@core/web-core';
import {TodoItemNode, newTreeData,keys} from './interface';

@Injectable({
  providedIn: 'root'
})
export class TreeComponentService {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  get data(): TodoItemNode[] {
    return this.dataChange.value;
  }

  constructor(
    private commonfunctionService:CommonFunctionService
  ) {
    this.initialize();
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    const data = this.buildFileTree(newTreeData, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: {[key: string]: any}, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const pId:any = value['reference']['_id'];
      const node = new TodoItemNode();
      node.item = key;
      node.reference = value['reference'];
      node._id = pId;
      if(value['parentId']){
        node.parentId = value['parentId'];
      }
      

      if (value != null) {
        let nextKey = keys[level];
        let next = value[nextKey];
        if(next == null){
          nextKey = keys[level + 1];
          next = value[nextKey];
        }        
        if (next && typeof next === 'object') {
          Object.keys(next).forEach(childKey => {
            next[childKey].parentId = pId;
          });
          node.children = this.buildFileTree(next, level + 1);
        } else {
          node.item = key;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  //this function for get selected node tree
  getSelectedNodeWithParent(allNodes,selectedNodes){
    let selectedNodesWithParent = [];    
    if(allNodes && allNodes.length > 0 && selectedNodes && selectedNodes.length > 0){
      selectedNodes.forEach(selectNode => {
        if(keys.includes(selectNode.type) && selectNode.expandable){
          selectNode.allSelected = true;
        }else{
          selectNode.allSelected = false;
        }
        let groupList = [];
        let check = this.commonfunctionService.checkDataAlreadyAddedInListOrNot('_id',selectNode._id,groupList);
        if(!check){
          groupList.push(selectNode);
        } 
        this.findChildToParentNode(allNodes,selectNode,groupList,selectedNodesWithParent);        
      });
    }
    return selectedNodesWithParent;
  }

  findChildToParentNode(allNodes,selectNode,groupList,selectedNodesWithParent){
    if(selectNode && selectNode.parentId){
      let parentIndex = this.commonfunctionService.getIndexInArrayById(allNodes,selectNode.parentId,'reference._id');
      if(parentIndex != -1){
        let parentNode = allNodes[parentIndex];
        let check = this.commonfunctionService.checkDataAlreadyAddedInListOrNot('_id',parentNode._id,groupList);
        if(!check){
          groupList.push(parentNode);
        }        
        this.findChildToParentNode(allNodes,parentNode,groupList,selectedNodesWithParent);
      }          
    }else{
      let check = this.commonfunctionService.checkDataAlreadyAddedInListOrNot('_id',selectNode._id,groupList);
      if(!check){
        groupList.push(selectNode);
      } 
    }
    return this.modifyParentChild(selectedNodesWithParent,groupList);
  }
  modifyParentChild(selectedNodesWithParent,groupList){
    let sortedData = groupList.sort((a,b) =>  a.level - b.level);
    if(sortedData && sortedData.length > 0){
      sortedData.forEach(data => {
        let check = this.commonfunctionService.checkDataAlreadyAddedInListOrNot('_id',data._id,selectedNodesWithParent);
        if(!check){
          selectedNodesWithParent.push(data);
        } 
      });
    }
    return selectedNodesWithParent;
  }
  //this function for get selected node tree

  /** Add an item to to-do list */
  insertItem(parent: TodoItemNode, name: string) {
    if (parent.children) {
      parent.children.push({item: name} as TodoItemNode);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: TodoItemNode, name: string) {
    node.item = name;
    this.dataChange.next(this.data);
  }

}
