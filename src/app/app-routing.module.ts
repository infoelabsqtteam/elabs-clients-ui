import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { VerifyFailedComponent } from './core/error/verify-failed.component';



const appRoutes: Routes = [
   // { path: "signin", redirectTo: '/dashboard', pathMatch: 'full'},
    { path: 'm-core', loadChildren: () => import('./m-core/m-core.module').then(m => m.McoreModule) },
    { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
    { path: 'verify-failed', pathMatch: 'full', component: VerifyFailedComponent},

]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules, onSameUrlNavigation: "reload", useHash: false, relativeLinkResolution: 'legacy',scrollPositionRestoration: 'top' })],
    exports: [RouterModule]
})
export class AppRoutingModule {

}