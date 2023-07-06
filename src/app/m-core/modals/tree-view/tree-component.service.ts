import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { CommonFunctionService } from '@core/web-core';
import {TodoItemNode} from './interface';

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
  }
  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: {[key: string]: any}, level: number,keys:any): TodoItemNode[] {
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
          node.children = this.buildFileTree(next, level + 1,keys);
        } else {
          node.item = key;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  //this function for get selected node tree
  getSelectedNodeWithParent(allNodes,selectedNodes,keys:any){
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
  modifySelectedDataWithParentId(selectedData){
    let modifyList=selectedData.sort((a,b) => (a.parentId.toLowerCase() < b.parentId.toLowerCase())? -1 : (a.parentId.toLowerCase() > b.parentId.toLowerCase()) ? 1 : 0);
    return  modifyList;
  }
  //this function for get selected node tree

  //This function for convet list to tree map
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
        let modifyObj = {};
        modifyObj['reference'] = child.reference;
        if(child.allSelected){
          modifyObj['allSelected'] = child.allSelected
        }
        if(child.level == 0){
          result[child.item] = modifyObj;
        }else if(child.expandable){     
          if(!result[child.type]) result[child.type] = {}
          result[child.type][child.item] = modifyObj;
        }else{
          if(!result[child.type]) result[child.type] = {}
          result[child.type][child.item] = modifyObj;
        } 
        if(child.children && child.children.length > 0){      
          this.treeToObject(child.children, child.level == 0 ? result[child.item] : result[child.type][child.item]);
        }      
    });
    return result;
  };
  buildTreeObject(arr = []) {
    let relationShip = this.applyRelationships(arr);
    let list = this.listToTree(relationShip);
    let tree = this.treeToObject(list);
    return tree;
  }
  //This function for convet list to tree map

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
