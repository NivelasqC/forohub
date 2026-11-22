import { Injectable, computed, signal } from '@angular/core';
import { Usuario, Role } from '../models';
const USERS_KEY = 'fh_users_v1'; const SESSION_KEY = 'fh_session_v1';
const iniciales: Usuario[] = [
 {id:1,nombre:'Administrador',email:'admin@forohub.cl',password:'Admin123!',rol:'ADMIN',bio:'Moderador de ForoHub',fecha:'2026-11-01'},
 {id:2,nombre:'Camila Torres',email:'camila@forohub.cl',password:'Usuario123!',rol:'USUARIO',bio:'Me encantan los juegos y la música.',fecha:'2026-11-02'},
 {id:3,nombre:'Diego Rojas',email:'diego@forohub.cl',password:'Usuario123!',rol:'USUARIO',bio:'Fanático de la tecnología.',fecha:'2026-11-03'}
];
function readJson<T>(key:string, fallback:T):T { try { const v=localStorage.getItem(key); return v ? JSON.parse(v) as T : fallback; } catch { return fallback; } }
@Injectable({providedIn:'root'})
export class AuthService {
 private readonly _users = signal<Usuario[]>(readJson(USERS_KEY, iniciales));
 private readonly _session = signal<number | null>(readJson(SESSION_KEY, null));
 readonly users = this._users.asReadonly();
 readonly actual = computed(() => this._users().find(u => u.id === this._session()) ?? null);
 readonly admin = computed(() => this.actual()?.rol === 'ADMIN');
 constructor() { this.guardarUsuarios(); }
 private guardarUsuarios():void { localStorage.setItem(USERS_KEY, JSON.stringify(this._users())); }
 login(email:string,password:string):string | null {
   const user=this._users().find(u=>u.email.toLowerCase()===email.trim().toLowerCase() && u.password===password);
   if(!user) return 'Correo o contraseña incorrectos.';
   this._session.set(user.id);localStorage.setItem(SESSION_KEY,JSON.stringify(user.id));return null;
 }
 registro(nombre:string,email:string,password:string):string | null {
   if(this._users().some(u=>u.email.toLowerCase()===email.trim().toLowerCase())) return 'Ese correo ya está registrado.';
   const user:Usuario={id:Math.max(0,...this._users().map(u=>u.id))+1,nombre:nombre.trim(),email:email.trim().toLowerCase(),password,rol:'USUARIO',bio:'',fecha:new Date().toISOString()};
   this._users.update(xs=>[...xs,user]);this.guardarUsuarios();this._session.set(user.id);localStorage.setItem(SESSION_KEY,JSON.stringify(user.id));return null;
 }
 recuperar(email:string):boolean { return this._users().some(u=>u.email.toLowerCase()===email.trim().toLowerCase()); }
 actualizar(nombre:string,bio:string):void {
   const id=this.actual()?.id;if(!id)return;
   this._users.update(xs=>xs.map(u=>u.id===id?{...u,nombre:nombre.trim(),bio:bio.trim()}:u));this.guardarUsuarios();
 }
 cerrar():void { this._session.set(null);localStorage.removeItem(SESSION_KEY); }
 // Solo simulación académica: el almacenamiento local NO es autenticación segura para producción.
}
export const CLAVE_SEGURA= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,24}$/;
