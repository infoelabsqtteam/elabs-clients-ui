import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() { }

  encryptRequest(obj) {
    return btoa(JSON.stringify(obj));
  }

}
