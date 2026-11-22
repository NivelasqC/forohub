import { Routes, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { HomeComponent } from './pages/home.component';
import { LoginComponent, RegistroComponent, RecuperarComponent, PerfilComponent } from './pages/cuenta.component';
import { TemaComponent, EditorTemaComponent } from './pages/tema.component';
import { AdminComponent } from './pages/admin.component';
const authGuard:CanActivateFn=()=>inject(AuthService).actual()?true:inject(Router).createUrlTree(['/login']);
const adminGuard:CanActivateFn=()=>inject(AuthService).admin()?true:inject(Router).createUrlTree(['/']);
export const routes:Routes=[
 {path:'',component:HomeComponent,title:'Inicio · ForoHub'},
 {path:'login',component:LoginComponent,title:'Ingresar · ForoHub'},
 {path:'registro',component:RegistroComponent,title:'Crear cuenta · ForoHub'},
 {path:'recuperar',component:RecuperarComponent,title:'Recuperar contraseña · ForoHub'},
 {path:'perfil',component:PerfilComponent,canActivate:[authGuard],title:'Mi perfil · ForoHub'},
 {path:'tema/nuevo',component:EditorTemaComponent,canActivate:[authGuard],title:'Publicar tema · ForoHub'},
 {path:'tema/editar/:id',component:EditorTemaComponent,canActivate:[authGuard],title:'Editar tema · ForoHub'},
 {path:'tema/:id',component:TemaComponent,title:'Tema · ForoHub'},
 {path:'admin',component:AdminComponent,canActivate:[adminGuard],title:'Moderación · ForoHub'},
 {path:'**',redirectTo:''}
];
