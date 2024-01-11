import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.css']
})
export class TextFieldComponent implements OnInit {

  @Input() tableField:any;
  @Input() fieldControl:FormControl
  constructor() { }

  ngOnInit() {
  }

}
