import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForoService } from '../services/foro.service';
import { AuthService } from '../services/auth.service';
@Component({standalone:true,imports:[RouterLink,ReactiveFormsModule,DatePipe],template:`
<div class="container-xl content-page"><a routerLink="/" class="back-link">← Volver a conversaciones</a>
@if(foro.tema(id);as tema){@if(!tema.oculto||auth.admin()){
 <article class="article-card"><div class="d-flex align-items-center gap-2 mb-3"><span class="pill-cat">{{foro.categoria(tema.categoria)?.emoji}} {{foro.categoria(tema.categoria)?.nombre}}</span>@if(tema.oculto){<span class="badge bg-danger">Oculto</span>}</div>
 <h1>{{tema.titulo}}</h1><div class="article-meta"><span class="avatar avatar-sm">{{tema.autor.charAt(0)}}</span><span><strong>{{tema.autor}}</strong> · {{tema.fecha|date:'dd MMM yyyy'}}</span><span class="ms-auto">👁 {{tema.vistas}} vistas</span></div><div class="article-content">{{tema.contenido}}</div>
 @if(auth.admin()||auth.actual()?.id===tema.autorId){<div class="d-flex gap-2 mt-4"><a [routerLink]="['/tema/editar',tema.id]" class="btn btn-outline-primary btn-sm">Editar tema</a><button type="button" class="btn btn-outline-danger btn-sm" (click)="borrar()">Eliminar tema</button></div>}
 </article><div class="comments-block"><div class="section-heading"><h2>Respuestas ({{foro.comentariosTema(id).length}})</h2></div>
 @for(c of foro.comentariosTema(id);track c.id){<div class="comment-card"><div class="d-flex align-items-start gap-3"><div class="avatar avatar-sm">{{c.autor.charAt(0)}}</div><div class="flex-grow-1"><div class="d-flex flex-wrap gap-2 align-items-center"><strong>{{c.autor}}</strong><small>{{c.fecha|date:'dd/MM/yyyy HH:mm'}}</small></div><p>{{c.contenido}}</p>@if(auth.admin()||auth.actual()?.id===c.autorId){<button class="btn btn-link btn-sm text-danger p-0" (click)="borrarComentario(c.id)">Eliminar comentario</button>}</div></div></div>}@empty{<div class="empty-state">Aún no hay respuestas. ¡Inicia la conversación!</div>}
 <div class="comment-form"><h3>Deja tu respuesta</h3>@if(auth.actual()){<form [formGroup]="form" (ngSubmit)="comentar()"><textarea class="form-control" formControlName="contenido" rows="4" placeholder="Escribe un comentario respetuoso..."></textarea>@if(intento&&form.invalid){<small class="text-danger">Escribe entre 2 y 1000 caracteres.</small>}<button class="btn btn-primary mt-3">Publicar respuesta</button></form>}@else{<p><a routerLink="/login">Inicia sesión</a> para participar.</p>}</div>
 </div>
 }@else{<div class="empty-state">Este tema fue ocultado por moderación.</div>}}
 @else{<div class="empty-state">El tema solicitado no existe. <a routerLink="/">Ir al inicio</a></div>}
</div>`})
export class TemaComponent implements OnInit {
 readonly foro=inject(ForoService);readonly auth=inject(AuthService);private readonly route=inject(ActivatedRoute);private readonly router=inject(Router);private readonly fb=inject(FormBuilder);id=0;intento=false;
 readonly form=this.fb.nonNullable.group({contenido:['',[Validators.required,Validators.minLength(2),Validators.maxLength(1000)]]});
 ngOnInit(){this.id=Number(this.route.snapshot.paramMap.get('id'));if(this.foro.tema(this.id))this.foro.visitar(this.id);}
 comentar(){this.intento=true;if(this.form.invalid)return;const u=this.auth.actual();if(!u)return;this.foro.comentar(this.id,this.form.getRawValue().contenido,u.id,u.nombre);this.form.reset();this.intento=false;}
 borrar(){if(confirm('¿Eliminar este tema y sus comentarios?')){this.foro.borrarTema(this.id);this.router.navigateByUrl('/');}}
 borrarComentario(id:number){if(confirm('¿Eliminar este comentario?'))this.foro.borrarComentario(id);}
}
@Component({standalone:true,imports:[ReactiveFormsModule,RouterLink],template:`
<div class="simple-page"><div class="form-card editor-card"><div class="kicker">COMPARTE TUS IDEAS</div><h1>{{edicion?'Editar tema':'Crear publicación'}}</h1><p>Publica en la categoría adecuada y mantén la conversación respetuosa.</p>
 <form [formGroup]="form" (ngSubmit)="guardar()" novalidate><label for="tituloTema" class="form-label">Título</label><input id="tituloTema" class="form-control" formControlName="titulo" placeholder="Escribe un título claro..."/>@if(intentado&&form.controls.titulo.invalid){<small class="text-danger">Entre 5 y 100 caracteres.</small>}
 <label class="form-label mt-3" for="categoriaTema">Categoría</label><select id="categoriaTema" class="form-select" formControlName="categoria"><option value="">Selecciona una categoría</option>@for(c of foro.categorias;track c.id){<option [value]="c.id">{{c.emoji}} {{c.nombre}}</option>}</select>@if(intentado&&form.controls.categoria.invalid){<small class="text-danger">Selecciona una categoría.</small>}
 <label class="form-label mt-3" for="contenidoTema">Contenido</label><textarea id="contenidoTema" class="form-control" rows="8" formControlName="contenido" placeholder="¿De qué te gustaría conversar?"></textarea>@if(intentado&&form.controls.contenido.invalid){<small class="text-danger">Entre 10 y 3000 caracteres.</small>}
 @if(error()){<div class="alert alert-danger mt-3">{{error()}}</div>}
 <div class="d-flex flex-wrap gap-2 mt-4"><button type="submit" class="btn btn-primary">{{edicion?'Guardar cambios':'Publicar tema'}} →</button><a routerLink="/" class="btn btn-outline-secondary">Cancelar</a></div></form>
 </div></div>`})
export class EditorTemaComponent implements OnInit {
 readonly foro=inject(ForoService);readonly auth=inject(AuthService);private readonly fb=inject(FormBuilder);private readonly route=inject(ActivatedRoute);private readonly router=inject(Router);readonly error=signal('');edicion=false;id=0;intentado=false;
 readonly form=this.fb.nonNullable.group({titulo:['',[Validators.required,Validators.minLength(5),Validators.maxLength(100)]],categoria:['',[Validators.required]],contenido:['',[Validators.required,Validators.minLength(10),Validators.maxLength(3000)]]});
 ngOnInit(){const raw=this.route.snapshot.paramMap.get('id');if(raw){this.edicion=true;this.id=Number(raw);const t=this.foro.tema(this.id);if(!t||(t.autorId!==this.auth.actual()?.id&&!this.auth.admin())){this.router.navigateByUrl('/');return;}this.form.patchValue({titulo:t.titulo,categoria:t.categoria,contenido:t.contenido});}}
 guardar(){this.intentado=true;if(this.form.invalid){this.form.markAllAsTouched();return;}const u=this.auth.actual();if(!u)return;const {titulo,categoria,contenido}=this.form.getRawValue();if(this.edicion){this.foro.editarTema(this.id,titulo,contenido,categoria);this.router.navigate(['/tema',this.id]);}else{this.router.navigate(['/tema',this.foro.crearTema(titulo,contenido,categoria,u.id,u.nombre)]);}}
}
