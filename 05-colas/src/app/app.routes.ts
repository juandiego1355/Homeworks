import { Routes } from '@angular/router';
import { ColaPersonasComponent } from './pages/cola-personas/cola-personas.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: ColaPersonasComponent },
  { path: '**', redirectTo: '' },
];
