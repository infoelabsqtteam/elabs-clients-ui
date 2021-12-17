import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentComponent } from './document.component';
import { DriveHomeComponent } from './drive-home/drive-home.component';


const routes: Routes = [
	{
		path: '', component: DocumentComponent, children: [

			{ path: '', component: DriveHomeComponent },
			{ path: 'vdr', component: DriveHomeComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class DocumentRoutingModule { }
