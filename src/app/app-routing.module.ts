import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';



const appRoutes: Routes = [
    
    
    { path: 'm-core', loadChildren: () => import('./m-core/m-core.module').then(m => m.McoreModule) },
    { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)}
    


]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules, onSameUrlNavigation: "reload", useHash: false, relativeLinkResolution: 'legacy',scrollPositionRestoration: 'top' })],
    exports: [RouterModule]
})
export class AppRoutingModule {

}