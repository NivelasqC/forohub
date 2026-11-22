import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CATEGORIAS } from './models';
@Component({selector:'app-root',standalone:true,imports:[RouterOutlet,RouterLink,RouterLinkActive],template:`
<div class="site-shell">
 <header class="topbar">
  <div class="container-xl d-flex justify-content-between align-items-center flex-wrap gap-2 py-3">
   <a routerLink="/" class="brand" aria-label="ForoHub inicio"><span class="brand-mark">✦</span> foro<span>hub</span><small>COMUNIDAD</small></a>
   <nav aria-label="Navegación principal" class="d-flex flex-wrap align-items-center gap-2 gap-sm-3">
    <a routerLink="/" [routerLinkActiveOptions]="{exact:true}" routerLinkActive="active" class="nav-link-custom">Explorar</a>
    @if(auth.admin()){<a routerLink="/admin" routerLinkActive="active" class="nav-link-custom">Moderación</a>}
    @if(auth.actual();as user){
      <a routerLink="/perfil" class="user-chip"><span class="avatar avatar-sm">{{user.nombre.charAt(0)}}</span><span class="d-none d-md-inline">{{user.nombre}}</span></a>
      <button type="button" class="btn btn-outline-light btn-sm" (click)="salir()">Salir</button>
    } @else {
      <a routerLink="/login" class="nav-link-custom">Ingresar</a><a routerLink="/registro" class="btn btn-primary btn-sm px-3">Crear cuenta</a>
    }
   </nav>
  </div>
 </header>
 <main class="main-content"><router-outlet/></main>
 <footer class="site-footer"><div class="container-xl d-flex flex-wrap justify-content-between gap-2 py-4"><span><strong>✦ ForoHub</strong> · Un espacio para compartir ideas.</span><span>Proyecto académico DSY2205 · {{year}}</span></div></footer>
</div>`})
export class AppComponent {readonly auth=inject(AuthService);private readonly router=inject(Router);readonly year=new Date().getFullYear();salir(){this.auth.cerrar();this.router.navigateByUrl('/');}}
