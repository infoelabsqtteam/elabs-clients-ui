/**
 * Node for to-do item
 */
 export class TodoItemNode {
    children: TodoItemNode[];
    item: string;
    reference:any;
    parentId:string;
    _id:string;
    allSelected:boolean;
    action:any;
  }
  
  /** Flat to-do item node with expandable and level information */
  export class TodoItemFlatNode {  
    item: string;
    level: number;
    expandable: boolean;
    reference:any;
    type:string;
    parentId:string;
    _id:string;
    allSelected:boolean;
    action:any;
  }
  