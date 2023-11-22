import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { IngresadoGuard } from './ingresado.guard';
import { NoIngresadoGuard } from './no-ingresado.guard';
import { AjustesComponent } from './ajustes/ajustes.component';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  
  {
    path: 'qralumno',
    loadChildren: () => import('./pages/qralumno/qralumno.module').then( m => m.QralumnoPageModule),
    canActivate: [IngresadoGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canActivate: [IngresadoGuard]
  },
  {
    path: 'nosotros',
    loadChildren: () => import('./pages/nosotros/nosotros.module').then( m => m.NosotrosPageModule),
    canActivate: [IngresadoGuard]
  },
  {
    path: 'api',
    loadChildren: () => import('./pages/api/api.module').then( m => m.APIPageModule),
    canActivate: [IngresadoGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canActivate: [NoIngresadoGuard]
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule),
    canActivate: [NoIngresadoGuard]
  },
  {
    path: 'ajustes', component: AjustesComponent},
  {
    path: 'scan',
    loadChildren: () => import('./pages/scan/scan.module').then( m => m.ScanPageModule),
    canActivate: [IngresadoGuard]
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule),
    canActivate: [IngresadoGuard]
  },
  {
    path: 'login-docente',
    loadChildren: () => import('./pages/login-docente/login-docente.module').then( m => m.LoginDocentePageModule),
    canActivate: [NoIngresadoGuard]
  },
  {
    path: 'registro-docente',
    loadChildren: () => import('./pages/registro-docente/registro-docente.module').then( m => m.RegistroDocentePageModule),
    canActivate: [NoIngresadoGuard]
  },
  {
    path: 'generar-qr',
    loadChildren: () => import('./pages/generar-qr/generar-qr.module').then( m => m.GenerarQrPageModule),
    canActivate: [IngresadoGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }