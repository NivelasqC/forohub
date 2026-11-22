package cl.forohub.foro.web;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.http.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import cl.forohub.foro.data.*;
@RestController @CrossOrigin(origins="*")
public class ForoController {
 private final TemaRepository temas;private final ComentarioRepository comentarios;
 private static final Set<String> CATEGORIAS=Set.of("tecnologia","videojuegos","musica","deportes","cine");
 public ForoController(TemaRepository temas,ComentarioRepository comentarios){this.temas=temas;this.comentarios=comentarios;}
 public record TemaInput(@NotBlank @Size(min=5,max=100) String titulo,@NotBlank @Size(min=10,max=3000) String contenido,
 @NotBlank String categoria,@NotNull Long autorId,@NotBlank String autor){}
 public record ComentarioInput(@NotNull Long temaId,@NotNull Long autorId,@NotBlank String autor,
 @NotBlank @Size(min=2,max=1000) String contenido){}
 @GetMapping("/api/categorias") public List<Map<String,String>> categorias(){return List.of(
 Map.of("id","tecnologia","nombre","Tecnología"),Map.of("id","videojuegos","nombre","Videojuegos"),
 Map.of("id","musica","nombre","Música"),Map.of("id","deportes","nombre","Deportes"),Map.of("id","cine","nombre","Cine y series"));}
 @GetMapping("/api/temas") public List<Tema> listar(@RequestParam(defaultValue="") String q,@RequestParam(defaultValue="") String categoria,@RequestParam(defaultValue="false") boolean incluirOcultos){
  String filtro=q.trim().toLowerCase(Locale.ROOT);
  return temas.findAll().stream().filter(t->incluirOcultos||!t.oculto).filter(t->categoria.isBlank()||t.categoria.equals(categoria))
   .filter(t->filtro.isBlank()||t.titulo.toLowerCase(Locale.ROOT).contains(filtro)||t.contenido.toLowerCase(Locale.ROOT).contains(filtro))
   .sorted(Comparator.comparing((Tema t)->t.id).reversed()).collect(Collectors.toList());
 }
 @GetMapping("/api/temas/{id}") public Tema obtenerTema(@PathVariable Long id){return tema(id);}
 @PostMapping("/api/temas") public ResponseEntity<Tema> crearTema(@Valid @RequestBody TemaInput dto){validarCategoria(dto.categoria());
  Tema t=new Tema(dto.titulo().trim(),dto.contenido().trim(),dto.categoria(),dto.autorId(),dto.autor().trim());
  return ResponseEntity.status(HttpStatus.CREATED).body(temas.save(t));}
 @PutMapping("/api/temas/{id}") public Tema editarTema(@PathVariable Long id,@Valid @RequestBody TemaInput dto){validarCategoria(dto.categoria());Tema t=tema(id);
  t.titulo=dto.titulo().trim();t.contenido=dto.contenido().trim();t.categoria=dto.categoria();return temas.save(t);}
 @DeleteMapping("/api/temas/{id}") @Transactional @ResponseStatus(HttpStatus.NO_CONTENT) public void borrarTema(@PathVariable Long id){tema(id);comentarios.deleteByTemaId(id);temas.deleteById(id);}
 @PatchMapping("/api/temas/{id}/visibilidad") public Tema visibilidadTema(@PathVariable Long id,@RequestBody Map<String,Boolean> body){Tema t=tema(id);t.oculto=valorOculto(body);return temas.save(t);}
 @GetMapping("/api/comentarios") public List<Comentario> listarComentarios(@RequestParam(required=false) Long temaId,@RequestParam(defaultValue="false") boolean incluirOcultos){
  List<Comentario> cs=temaId==null?comentarios.findAll():comentarios.findByTemaId(temaId);
  return cs.stream().filter(c->incluirOcultos||!c.oculto).toList();}
 @GetMapping("/api/comentarios/{id}") public Comentario obtenerComentario(@PathVariable Long id){return comentario(id);}
 @PostMapping("/api/comentarios") public ResponseEntity<Comentario> crearComentario(@Valid @RequestBody ComentarioInput dto){tema(dto.temaId());
  Comentario c=new Comentario(dto.temaId(),dto.autorId(),dto.autor().trim(),dto.contenido().trim());
  return ResponseEntity.status(HttpStatus.CREATED).body(comentarios.save(c));}
 @PutMapping("/api/comentarios/{id}") public Comentario editarComentario(@PathVariable Long id,@Valid @RequestBody ComentarioInput dto){Comentario c=comentario(id);
  c.contenido=dto.contenido().trim();return comentarios.save(c);}
 @DeleteMapping("/api/comentarios/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void borrarComentario(@PathVariable Long id){comentario(id);comentarios.deleteById(id);}
 @PatchMapping("/api/comentarios/{id}/visibilidad") public Comentario visibilidadComentario(@PathVariable Long id,@RequestBody Map<String,Boolean> body){Comentario c=comentario(id);c.oculto=valorOculto(body);return comentarios.save(c);}
 private Tema tema(Long id){return temas.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Tema no encontrado"));}
 private Comentario comentario(Long id){return comentarios.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Comentario no encontrado"));}
 private void validarCategoria(String id){if(!CATEGORIAS.contains(id))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Categoria no valida");}
 private boolean valorOculto(Map<String,Boolean> body){if(body.get("oculto")==null)throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Se requiere el booleano oculto");return body.get("oculto");}
}
