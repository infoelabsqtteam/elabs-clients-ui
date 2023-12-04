import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-checkbox-menu",
  templateUrl: "./checkbox-menu.component.html",
  styleUrls: ["./checkbox-menu.component.css"],
})
export class CheckboxMenuComponent implements OnInit {
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
