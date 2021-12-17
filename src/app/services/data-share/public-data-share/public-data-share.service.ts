import { Injectable,EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PublicDataShareService {

  saveContactUsData:EventEmitter<any> = new EventEmitter();
  saveCarrerWithUsData: EventEmitter<any> = new EventEmitter();
  staticData: EventEmitter<any> = new EventEmitter<any>(null);

  constructor() { }

  setContactUsData(responce){
    this.saveContactUsData.emit(responce);
  }
  setCarrerwithUs(responce){
    this.saveCarrerWithUsData.emit(responce);
  }



}
