import { Injectable, computed, signal } from '@angular/core';
import { Tema, Comentario, CATEGORIAS } from '../models';
const TKEY='fh_temas_v1'; const CKEY='fh_comentarios_v1';
const hoy='2026-11-20T15:00:00Z';
const semilla:Tema[]=[
 {id:1,titulo:'¿Qué lenguaje recomiendan para empezar a programar?',contenido:'Estoy aprendiendo desarrollo de software y quiero escuchar experiencias. ¿Python, Java o TypeScript? Compartan sus recomendaciones.',categoria:'tecnologia',autorId:3,autor:'Diego Rojas',fecha:hoy,oculto:false,destacado:true,vistas:182},
 {id:2,titulo:'Los mejores juegos de mundo abierto',contenido:'¿Cuáles consideran los mejores juegos de mundo abierto de todos los tiempos? También valen joyitas poco conocidas.',categoria:'videojuegos',autorId:2,autor:'Camila Torres',fecha:hoy,oculto:false,destacado:true,vistas:124},
 {id:3,titulo:'¿Qué conciertos esperan con más ganas?',contenido:'Hablemos de música en vivo, recitales memorables y bandas que nos gustaría ver en Chile.',categoria:'musica',autorId:2,autor:'Camila Torres',fecha:hoy,oculto:false,destacado:false,vistas:98},
 {id:4,titulo:'El partido más emocionante que recuerdan',contenido:'Fútbol, tenis, básquetbol o cualquier deporte: ¿qué encuentro no olvidarán nunca?',categoria:'deportes',autorId:3,autor:'Diego Rojas',fecha:hoy,oculto:false,destacado:false,vistas:73},
 {id:5,titulo:'Recomendaciones de películas para el fin de semana',contenido:'Busco thrillers o películas de ciencia ficción con buenas historias. ¿Qué recomiendan?',categoria:'cine',autorId:2,autor:'Camila Torres',fecha:hoy,oculto:false,destacado:false,vistas:211},
 {id:6,titulo:'Arma tu PC sin gastar de más',contenido:'Consejos para encontrar componentes con buena relación precio-calidad y evitar compras innecesarias.',categoria:'tecnologia',autorId:3,autor:'Diego Rojas',fecha:hoy,oculto:false,destacado:false,vistas:87},
 {id:7,titulo:'Una buena banda para descubrir hoy',contenido:'Compartamos nuestros descubrimientos musicales, de cualquier género y época.',categoria:'musica',autorId:2,autor:'Camila Torres',fecha:hoy,oculto:false,destacado:false,vistas:61}
];
const comentariosIniciales:Comentario[]=[
 {id:1,temaId:1,autorId:2,autor:'Camila Torres',contenido:'¡Python es una gran puerta de entrada! Luego te recomendaría TypeScript.',fecha:hoy,oculto:false},
 {id:2,temaId:2,autorId:3,autor:'Diego Rojas',contenido:'Para mí, explorar libremente es lo mejor de este género.',fecha:hoy,oculto:false},
 {id:3,temaId:5,autorId:3,autor:'Diego Rojas',contenido:'Arrival es una excelente opción de ciencia ficción.',fecha:hoy,oculto:false}
];
function getSaved<T>(key:string, initial:T):T {try{const val=localStorage.getItem(key);return val?JSON.parse(val) as T:initial;}catch{return initial;}}
@Injectable({providedIn:'root'})
export class ForoService {
 private readonly _temas=signal<Tema[]>(getSaved(TKEY,semilla));
 private readonly _comentarios=signal<Comentario[]>(getSaved(CKEY,comentariosIniciales));
 readonly temas=this._temas.asReadonly();readonly comentarios=this._comentarios.asReadonly();readonly categorias=CATEGORIAS;
 readonly totalTemas=computed(()=>this._temas().filter(t=>!t.oculto).length);
 readonly totalComentarios=computed(()=>this._comentarios().filter(c=>!c.oculto).length);
 constructor(){this.persistir();}
 private persistir():void {localStorage.setItem(TKEY,JSON.stringify(this._temas()));localStorage.setItem(CKEY,JSON.stringify(this._comentarios()));}
 categoria(id:string){return CATEGORIAS.find(c=>c.id===id);}
 listado(q:string='',cat:string='') { const t=q.toLocaleLowerCase().trim();return this._temas().filter(x=>!x.oculto&&(!cat||x.categoria===cat)&&(!t||`${x.titulo} ${x.contenido} ${x.autor}`.toLowerCase().includes(t))).sort((a,b)=>b.id-a.id); }
 tema(id:number){return this._temas().find(t=>t.id===id);}
 comentariosTema(id:number, inclOcultos=false){return this._comentarios().filter(c=>c.temaId===id&&(inclOcultos||!c.oculto)).sort((a,b)=>a.id-b.id);}
 crearTema(titulo:string,contenido:string,categoria:string,autorId:number,autor:string):number {
   const id=Math.max(0,...this._temas().map(t=>t.id))+1;
   this._temas.update(ts=>[{id,titulo:titulo.trim(),contenido:contenido.trim(),categoria,autorId,autor,fecha:new Date().toISOString(),oculto:false,destacado:false,vistas:0},...ts]);this.persistir();return id;
 }
 editarTema(id:number,titulo:string,contenido:string,categoria:string):void {this._temas.update(ts=>ts.map(t=>t.id===id?{...t,titulo:titulo.trim(),contenido:contenido.trim(),categoria}:t));this.persistir();}
 borrarTema(id:number):void {this._temas.update(ts=>ts.filter(t=>t.id!==id));this._comentarios.update(cs=>cs.filter(c=>c.temaId!==id));this.persistir();}
 visitar(id:number):void {this._temas.update(ts=>ts.map(t=>t.id===id?{...t,vistas:t.vistas+1}:t));this.persistir();}
 comentar(temaId:number,contenido:string,autorId:number,autor:string):void {
   const id=Math.max(0,...this._comentarios().map(c=>c.id))+1;
   this._comentarios.update(cs=>[...cs,{id,temaId,contenido:contenido.trim(),autorId,autor,fecha:new Date().toISOString(),oculto:false}]);this.persistir();
 }
 borrarComentario(id:number):void {this._comentarios.update(cs=>cs.filter(c=>c.id!==id));this.persistir();}
 moderarTema(id:number,oculto:boolean):void {this._temas.update(ts=>ts.map(t=>t.id===id?{...t,oculto}:t));this.persistir();}
 moderarComentario(id:number,oculto:boolean):void {this._comentarios.update(cs=>cs.map(c=>c.id===id?{...c,oculto}:c));this.persistir();}
}
