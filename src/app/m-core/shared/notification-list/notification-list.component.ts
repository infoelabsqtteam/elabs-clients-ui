import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styles: [
  ]
})
export class NotificationListComponent implements OnInit {

  AllModuleList:any=[];

  constructor(
    private storageService:StorageService,
  )
  { 
    this.AllModuleList = this.storageService.GetModules();
  }

  ngOnInit(): void {
  }



}
