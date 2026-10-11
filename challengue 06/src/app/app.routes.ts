import { Routes } from '@angular/router';
import { PilaLibrosComponent } from './pages/pila-libros/pila-libros.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: PilaLibrosComponent },
  { path: '**', redirectTo: '' },
];
