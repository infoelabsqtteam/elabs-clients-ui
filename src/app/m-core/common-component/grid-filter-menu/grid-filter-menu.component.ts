import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: 'app-grid-filter-menu',
  templateUrl: './grid-filter-menu.component.html',
  styleUrls: ['./grid-filter-menu.component.css'],
})
export class GridFilterMenuComponent implements OnInit {
  @Input() columns: any;

  constructor() {}

  ngOnInit(): void {
    // console.log('Columns in ngOnInit:', this.columns);
    if (this.columns) {
      this.columns.forEach((data) => {
        if (!data.hasOwnProperty("display")) {
          data.display = true;
        }
      });
    }
    // console.log('Columns after initialization:', this.columns);
  }
  showHide(){
  }
  updateColumnList() {
    if (this.columns) {
      this.columns.forEach((column) => (column.display = true));
    }
  }
  
}
