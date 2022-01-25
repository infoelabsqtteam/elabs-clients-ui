import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { DataShareService } from '../services/data-share/data-share.service';


@Injectable()
export class AuthGuard implements CanActivate{
    
    constructor(
      private dataShareService:DataShareService
      ){

    }
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
      return this.dataShareService.getAuthentication().pipe(
        map((data:boolean) =>{
          return data;
        })
      );
    }
}