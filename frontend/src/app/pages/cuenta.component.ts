import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, CLAVE_SEGURA } from '../services/auth.service';
const email=Validators.email; const required=Validators.required;
@Component({standalone:true,imports:[ReactiveFormsModule,RouterLink],template:`
<div class="auth-layout"><div class="auth-aside"><span class="badge-round">✦</span><h2>Ideas que conectan personas.</h2><p>Forma parte de una comunidad que comparte tus intereses.</p><div class="auth-decor">✺</div></div><div class="auth-main"><div class="form-card"><div class="kicker">BIENVENIDO DE VUELTA</div><h1>Iniciar sesión</h1><p>Ingresa a tu cuenta para participar en ForoHub.</p>
 <form [formGroup]="form" (ngSubmit)="ingresar()" novalidate><label class="form-label" for="email">Correo electrónico</label><input id="email" type="email" class="form-control" formControlName="email" placeholder="correo@ejemplo.cl" autocomplete="email"/><small class="invalid-message">{{mensajeCampo('email')}}</small>
 <label class="form-label mt-3" for="password">Contraseña</label><input id="password" type="password" class="form-control" formControlName="password" autocomplete="current-password" placeholder="Tu contraseña"/><small class="invalid-message">{{mensajeCampo('password')}}</small>
 @if(error()){<div role="alert" class="alert alert-danger mt-3">{{error()}}</div>}
 <div class="text-end mt-2"><a routerLink="/recuperar" class="text-link">¿Olvidaste tu contraseña?</a></div><button class="btn btn-primary w-100 mt-4" type="submit">Ingresar →</button></form>
 <p class="form-bottom">¿No tienes cuenta? <a routerLink="/registro">Regístrate gratis</a></p><div class="demo-info"><strong>Accesos de demostración</strong><p><b>Usuario:</b> camila@forohub.cl / Usuario123!</p><p><b>Admin:</b> admin@forohub.cl / Admin123!</p></div>
 </div></div></div>`})
export class LoginComponent {
 private readonly fb=inject(FormBuilder);private readonly auth=inject(AuthService);private readonly router=inject(Router);readonly error=signal('');submitted=false;
 readonly form=this.fb.nonNullable.group({email:['',[required,email]],password:['',[required]]});
 mensajeCampo(name:'email'|'password'):string {const c=this.form.controls[name];return c.invalid&&(c.touched||this.submitted)?'Completa este campo con un valor válido.':'';}
 ingresar():void{this.submitted=true;if(this.form.invalid){this.form.markAllAsTouched();return;}const {email,password}=this.form.getRawValue();const e=this.auth.login(email,password);if(e)this.error.set(e);else this.router.navigateByUrl('/');}
}
@Component({standalone:true,imports:[ReactiveFormsModule,RouterLink],template:`
<div class="simple-page"><div class="form-card centered-card"><div class="kicker">ÚNETE A LA CONVERSACIÓN</div><h1>Crear cuenta</h1><p>Regístrate para publicar y comentar temas.</p><form [formGroup]="form" (ngSubmit)="registrar()" novalidate>
 <label class="form-label" for="nombre">Nombre</label><input class="form-control" id="nombre" formControlName="nombre" autocomplete="name" placeholder="Tu nombre completo"/><small class="invalid-message">{{err('nombre')}}</small>
 <label class="form-label mt-3" for="emailReg">Correo electrónico</label><input type="email" class="form-control" id="emailReg" formControlName="email" autocomplete="email" placeholder="correo@ejemplo.cl"/><small class="invalid-message">{{err('email')}}</small>
 <label class="form-label mt-3" for="claveReg">Contraseña</label><input type="password" class="form-control" id="claveReg" formControlName="password" autocomplete="new-password" placeholder="Crea una contraseña segura"/><small class="invalid-message">{{err('password')}}</small>
 <div class="password-hint">Debe tener entre 8 y 24 caracteres, una mayúscula, una minúscula, un número y un símbolo.</div>
 <label class="form-label mt-3" for="confirmar">Confirmar contraseña</label><input type="password" class="form-control" id="confirmar" formControlName="confirmar" autocomplete="new-password"/><small class="invalid-message">{{err('confirmar')}}</small>
 @if(error()){<div class="alert alert-danger mt-3" role="alert">{{error()}}</div>}
 <button class="btn btn-primary w-100 mt-4" type="submit">Crear mi cuenta →</button></form><p class="form-bottom">¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión</a></p></div></div>`})
export class RegistroComponent {
 private readonly fb=inject(FormBuilder);private readonly auth=inject(AuthService);private readonly router=inject(Router);readonly error=signal('');submitted=false;
 readonly form=this.fb.nonNullable.group({nombre:['',[required,Validators.minLength(3),Validators.maxLength(60)]],email:['',[required,email]],password:['',[required,Validators.pattern(CLAVE_SEGURA)]],confirmar:['',[required]]});
 err(name:'nombre'|'email'|'password'|'confirmar'){const c=this.form.controls[name];return(c.invalid&&(c.touched||this.submitted))?'Campo obligatorio o formato incorrecto.':'';}
 registrar(){this.submitted=true;if(this.form.invalid){this.form.markAllAsTouched();return;}const {nombre,email,password,confirmar}=this.form.getRawValue();if(password!==confirmar){this.error.set('Las contraseñas deben coincidir.');return;}const e=this.auth.registro(nombre,email,password);if(e)this.error.set(e);else this.router.navigateByUrl('/');}
}
@Component({standalone:true,imports:[ReactiveFormsModule,RouterLink],template:`
<div class="simple-page"><div class="form-card centered-card"><div class="kicker">RECUPERACIÓN DE ACCESO</div><h1>¿Olvidaste tu contraseña?</h1><p>Simulación académica de recuperación de cuenta.</p>
 <form [formGroup]="form" (ngSubmit)="enviar()"><label class="form-label" for="correoRec">Correo electrónico</label><input id="correoRec" type="email" class="form-control" formControlName="email" autocomplete="email" placeholder="correo@ejemplo.cl"/>
 @if(mensaje()){<div class="alert alert-info mt-3" role="status">{{mensaje()}}</div>}<button type="submit" class="btn btn-primary mt-3 w-100">Solicitar recuperación</button></form><p class="form-bottom"><a routerLink="/login">← Volver al inicio de sesión</a></p></div></div>`})
export class RecuperarComponent {private readonly fb=inject(FormBuilder);readonly form=this.fb.nonNullable.group({email:['',[required,email]]});readonly mensaje=signal('');enviar(){if(this.form.invalid){this.form.markAllAsTouched();this.mensaje.set('Ingresa un correo válido.');return;}this.mensaje.set('Solicitud registrada (modo demostración). No se envían correos reales ni se cambia la contraseña.');}}
@Component({standalone:true,imports:[ReactiveFormsModule,RouterLink],template:`
<div class="simple-page"><div class="form-card centered-card"><div class="kicker">TU CUENTA</div><h1>Mi perfil</h1><div class="profile-header"><div class="avatar avatar-large">{{auth.actual()?.nombre?.charAt(0)}}</div><div><strong>{{auth.actual()?.nombre}}</strong><div class="text-muted">{{auth.actual()?.email}}</div><span class="tiny-label">{{auth.actual()?.rol==='ADMIN'?'Administrador':'Miembro'}}</span></div></div>
 <form [formGroup]="form" (ngSubmit)="guardar()"><label class="form-label" for="nombreP">Nombre para mostrar</label><input id="nombreP" class="form-control" formControlName="nombre"/><label for="bio" class="form-label mt-3">Biografía</label><textarea id="bio" class="form-control" rows="4" formControlName="bio" placeholder="Cuéntanos algo sobre ti..."></textarea>
 @if(guardado()){<div class="alert alert-success mt-3" role="status">Perfil actualizado correctamente.</div>}<button type="submit" class="btn btn-primary mt-4">Guardar cambios</button> <a routerLink="/" class="btn btn-outline-secondary mt-4">Volver</a></form></div></div>`})
export class PerfilComponent {readonly auth=inject(AuthService);private readonly fb=inject(FormBuilder);readonly guardado=signal(false);readonly form=this.fb.nonNullable.group({nombre:[this.auth.actual()?.nombre??'',[required,Validators.minLength(3),Validators.maxLength(60)]],bio:[this.auth.actual()?.bio??'',[Validators.maxLength(250)]]});guardar(){if(this.form.invalid){this.form.markAllAsTouched();return;}const {nombre,bio}=this.form.getRawValue();this.auth.actualizar(nombre,bio);this.guardado.set(true);}}
