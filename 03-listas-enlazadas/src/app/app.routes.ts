import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ReproductorCancionesComponent } from './pages/reproductor-canciones/reproductor-canciones.component';
import { HistorialNavegadorComponent } from './pages/historial-navegador/historial-navegador.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: InicioComponent },
  { path: 'reproductor', component: ReproductorCancionesComponent },
  { path: 'historial', component: HistorialNavegadorComponent },
  { path: '**', redirectTo: '' },
];
