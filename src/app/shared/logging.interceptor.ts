import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor{

    intercept(req: HttpRequest<any>, next : HttpHandler) : Observable<HttpEvent<any>>{ // After sending the request
        return next.handle(req).pipe( tap((
            event =>{
                //console.log('Logging Interceptor ', event);
            }
            )));
    }
}