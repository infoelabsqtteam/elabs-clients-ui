import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-grid-filter-menu',
  templateUrl: './grid-filter-menu.component.html',
  styleUrls: ['./grid-filter-menu.component.css'],
})
export class GridFilterMenuComponent {
  @Input() columns: any;

  constructor() {}
  showHide(){
  }
  updateColumnList() {
    if (this.columns) {
      this.columns.forEach((column) => (column.display = true));
    }
  }
  
}
