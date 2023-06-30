import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, switchMap, take, finalize } from 'rxjs/operators';
import { StorageService, LoaderService, EnvService, AuthService } from '@core/web-core';
import { StorageTokenStatus } from './enums/storage-token-status.enum';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private storageService: StorageService, 
        private router: Router,
        private loaderService:LoaderService,
        private envService:EnvService,
        private authService:AuthService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { // before sending the request
        //console.log('Intercepted : - ',req);
        // this.loaderService.isLoading.next(true);

        const idToken: string = this.storageService.GetIdToken();
        /* req = req.clone({ headers: req.headers.set('Access-Control-Allow-Origin', '*') }); */
        if (this.storageService.GetIdTokenStatus() == StorageTokenStatus.ID_TOKEN_ACTIVE) {
            req = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + idToken) });
        } else if (this.storageService.GetIdTokenStatus() == StorageTokenStatus.ID_TOKEN_EXPIRED) {

            const url = req.url; 
            if (!url.startsWith(this.envService.baseUrl('AUTH_SIGNOUT'))) {
                const payload = {
                    appName: this.envService.getAppName(),
                    data: {
                        accessToken: this.storageService.GetAccessToken()
                    }
                }
                this.authService.SessionExpired(payload);
                return;
            }
        } else if (this.storageService.GetIdTokenStatus() == StorageTokenStatus.ID_TOKEN_NOT_CREATED) {
            const url = req.url;
            if (url.indexOf("/rest/public") != -1) {
                return next.handle(req).pipe(
                    finalize(
                        () => {
                            // this.loaderService.isLoading.next(false);
                        }
                    )
                );
            } else {
                const authUrl = this.envService.getBaseUrl() + "login";
                if (!url.startsWith(authUrl))
                    return;
            }
        }

        return next.handle(req).pipe(
            finalize(
                () => {
                    // this.loaderService.isLoading.next(false);
                }
            )
        );
        //to handle request header
        /* .pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    var contentDisposition = event.headers.get('Content-Disposition');
                    console.log('event--->>>', event);
                }
                return event;
            })) */

    }
}