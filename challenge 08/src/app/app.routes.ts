import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { PrivateLayoutComponent } from './pages/private-layout/private-layout.component';
import { SidebarExerciseComponent } from './pages/sidebar-exercise/sidebar-exercise.component';
import { TreeExerciseComponent } from './pages/tree-exercise/tree-exercise.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'private',
    component: PrivateLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'tree' },
      { path: 'tree', component: TreeExerciseComponent },
      { path: 'sidebar', component: SidebarExerciseComponent },
    ],
  },
  { path: '', pathMatch: 'full', redirectTo: 'private' },
  { path: '**', redirectTo: 'private' },
];
