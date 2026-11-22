export type Role = 'ADMIN' | 'USUARIO';
export interface Usuario { id:number; nombre:string; email:string; password:string; rol:Role; bio:string; fecha:string; }
export interface Categoria { id:string; nombre:string; emoji:string; descripcion:string; clase:string; }
export interface Comentario { id:number; temaId:number; autorId:number; autor:string; contenido:string; fecha:string; oculto:boolean; }
export interface Tema { id:number; titulo:string; contenido:string; categoria:string; autorId:number; autor:string; fecha:string; oculto:boolean; destacado:boolean; vistas:number; }
export const CATEGORIAS: Categoria[] = [
  {id:'tecnologia', nombre:'Tecnología', emoji:'💻', descripcion:'Código, gadgets e innovación', clase:'violeta'},
  {id:'videojuegos', nombre:'Videojuegos', emoji:'🎮', descripcion:'Juegos, consolas y eSports', clase:'azul'},
  {id:'musica', nombre:'Música', emoji:'🎸', descripcion:'Artistas, discos y conciertos', clase:'rosa'},
  {id:'deportes', nombre:'Deportes', emoji:'⚽', descripcion:'Competencias y actualidad', clase:'verde'},
  {id:'cine', nombre:'Cine y series', emoji:'🎬', descripcion:'Películas, series y análisis', clase:'naranja'}
];
