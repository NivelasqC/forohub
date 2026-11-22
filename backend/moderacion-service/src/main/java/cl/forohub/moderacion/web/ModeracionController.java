package cl.forohub.moderacion.web;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;
import cl.forohub.moderacion.data.*;
@RestController @RequestMapping("/api/moderacion") @CrossOrigin(origins="*")
public class ModeracionController {
 private final AccionRepository repo;private final RestClient foro;
 public ModeracionController(AccionRepository repo,@Value("${foro.api.url}") String url){this.repo=repo;this.foro=RestClient.create(url);}
 @GetMapping("/historial") public List<AccionModeracion> historial(@RequestHeader(value="X-Rol",defaultValue="") String rol){validar(rol);return repo.findAll();}
 @PostMapping("/temas/{id}/ocultar") public AccionModeracion ocultarTema(@PathVariable Long id,@RequestHeader(value="X-Rol",defaultValue="") String rol){return cambiar("temas",id,true,rol);}
 @PostMapping("/temas/{id}/restaurar") public AccionModeracion restaurarTema(@PathVariable Long id,@RequestHeader(value="X-Rol",defaultValue="") String rol){return cambiar("temas",id,false,rol);}
 @PostMapping("/comentarios/{id}/ocultar") public AccionModeracion ocultarComentario(@PathVariable Long id,@RequestHeader(value="X-Rol",defaultValue="") String rol){return cambiar("comentarios",id,true,rol);}
 @PostMapping("/comentarios/{id}/restaurar") public AccionModeracion restaurarComentario(@PathVariable Long id,@RequestHeader(value="X-Rol",defaultValue="") String rol){return cambiar("comentarios",id,false,rol);}
 private AccionModeracion cambiar(String tipo,Long id,boolean ocultar,String rol){
  validar(rol);
  foro.patch().uri("/api/{tipo}/{id}/visibilidad",tipo,id).body(Map.of("oculto",ocultar)).retrieve().toBodilessEntity();
  return repo.save(new AccionModeracion(tipo,id,ocultar?"OCULTAR":"RESTAURAR","Administrador demo"));
 }
 private void validar(String rol){if(!"ADMIN".equals(rol))throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Solo administrador (control de demostración)");}
}
