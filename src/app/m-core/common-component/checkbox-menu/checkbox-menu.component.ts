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
    if (this.columns) {
      this.columns.forEach((data) => {
        if (!data.hasOwnProperty("display")) {
          data.display = true;
        }
      });
    }
  }

  updateColumnList(columns?) {
    if (columns) columns.forEach((column) => (column.display = true));
  }
}
