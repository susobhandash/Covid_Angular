import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CountryDataComponent } from '../components/country-data/country-data.component';
import { StateDataComponent } from '../components/state-data/state-data.component';

const routes: Routes = [
  { path: 'home', component: CountryDataComponent },
  { path: 'states', component: StateDataComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: CountryDataComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
