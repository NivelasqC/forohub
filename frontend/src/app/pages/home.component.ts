import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ForoService } from '../services/foro.service';
import { AuthService } from '../services/auth.service';
@Component({standalone:true,imports:[RouterLink,FormsModule,DatePipe,DecimalPipe],template:`
<section class="hero"><div class="container-xl"><div class="row align-items-center g-4 py-5">
 <div class="col-lg-8"><div class="eyebrow">✳ TU ESPACIO PARA CONECTAR</div><h1>Las mejores conversaciones <em>comienzan aquí.</em></h1><p>Descubre comunidades, comparte tus ideas y conecta con personas que disfrutan lo mismo que tú.</p>
 <div class="d-flex flex-wrap gap-2 mt-4"><a routerLink="/tema/nuevo" class="btn btn-accent btn-lg">✎ Crear publicación</a><a href="#categorias" class="btn btn-hero-outline btn-lg">Explorar categorías ↓</a></div></div>
 <div class="col-lg-4 d-none d-lg-block"><div class="hero-card"><img src="/comunidad.svg" alt="Personas compartiendo ideas en línea" class="hero-illustration"/><div>Comparte ideas.<br><strong>Aprende en comunidad.</strong></div><div class="hero-ornament">✳ ✳ ✳</div></div></div>
</div></div></section>
<div class="container-xl pb-5"><div class="stats-strip row g-3"><div class="col-4"><b>{{foro.totalTemas()}}</b><span>Conversaciones</span></div><div class="col-4"><b>{{foro.totalComentarios()}}</b><span>Respuestas</span></div><div class="col-4"><b>5</b><span>Comunidades</span></div></div>
<section id="categorias" class="section-block"><div class="section-heading"><div><div class="kicker">COMUNIDADES</div><h2>Encuentra tu lugar</h2><p>Hay un espacio para cada interés.</p></div></div>
 <div class="row g-3">@for(c of foro.categorias;track c.id){<div class="col-6 col-lg"><button type="button" (click)="seleccionar(c.id)" [class.selected]="categoria()===c.id" class="category-card cat-{{c.clase}}"><span class="cat-emoji">{{c.emoji}}</span><strong>{{c.nombre}}</strong><small>{{c.descripcion}}</small></button></div>}</div>
</section>
<div id="temas" class="row g-4"><div class="col-lg-8"><div class="section-heading d-flex justify-content-between align-items-end flex-wrap gap-3"><div><div class="kicker">ÚLTIMAS PUBLICACIONES</div><h2>Conversaciones recientes</h2></div><a routerLink="/tema/nuevo" class="btn btn-primary">+ Nuevo tema</a></div>
 <div class="toolbar"><div class="search-box"><label for="buscador" class="visually-hidden">Buscar temas</label><span>⌕</span><input id="buscador" [(ngModel)]="busqueda" placeholder="Buscar por título, contenido o autor..."/></div><select class="form-select category-select" aria-label="Filtrar por categoría" [ngModel]="categoria()" (ngModelChange)="seleccionar($event)"><option value="">Todas las categorías</option>@for(c of foro.categorias;track c.id){<option [value]="c.id">{{c.nombre}}</option>}</select></div>
 <div class="topic-list">@for(t of foro.listado(busqueda,categoria());track t.id){<a class="topic-item" [routerLink]="['/tema',t.id]"><div class="topic-icon">{{foro.categoria(t.categoria)?.emoji}}</div><div class="topic-body"><div class="d-flex flex-wrap align-items-center gap-2"><span class="tiny-label">{{foro.categoria(t.categoria)?.nombre}}</span>@if(t.destacado){<span class="featured-label">✦ Destacado</span>}</div><h3>{{t.titulo}}</h3><p>{{t.contenido}}</p><div class="topic-meta">Por <strong>{{t.autor}}</strong><span>·</span><time>{{t.fecha|date:'dd/MM/yyyy'}}</time><span>·</span><span>👁 {{t.vistas}}</span><span>·</span><span>💬 {{foro.comentariosTema(t.id).length}}</span></div></div><span class="topic-arrow">↗</span></a>} @empty {<div class="empty-state"><div>🔎</div><h3>Sin resultados</h3><p>Prueba con otra búsqueda o categoría.</p><button class="btn btn-primary" (click)="reiniciar()">Ver todos</button></div>}</div>
 </div><aside class="col-lg-4"><div class="aside-card"><div class="aside-icon">✨</div><h3>Tu voz importa</h3><p>Inicia una conversación, resuelve dudas y conoce nuevas perspectivas.</p><a routerLink="/tema/nuevo" class="btn btn-primary w-100">Publicar un tema</a></div><div class="aside-card rules"><h3>📌 Normas de la comunidad</h3><ul><li>Respeta a los demás miembros.</li><li>Publica en la categoría correcta.</li><li>Evita el spam y las ofensas.</li><li>Comparte contenido relevante.</li></ul></div><div class="aside-card small-card"><span>🔐</span><p>Proyecto de demostración con datos guardados en el navegador.</p></div></aside>
</div></div>
`})
export class HomeComponent {
 readonly foro=inject(ForoService);readonly auth=inject(AuthService);readonly categoria=signal('');busqueda='';
 seleccionar(id:string):void{this.categoria.set(id);document.getElementById('temas')?.scrollIntoView({behavior:'smooth',block:'start'});}
 reiniciar():void{this.busqueda='';this.categoria.set('');}
}
