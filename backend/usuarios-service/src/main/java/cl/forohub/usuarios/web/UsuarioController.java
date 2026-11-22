package cl.forohub.usuarios.web;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import cl.forohub.usuarios.data.*;
@RestController @RequestMapping("/api/usuarios") @CrossOrigin(origins="*")
public class UsuarioController {
 private final UsuarioRepository repo;private final BCryptPasswordEncoder encoder;
 public UsuarioController(UsuarioRepository repo, BCryptPasswordEncoder encoder){this.repo=repo;this.encoder=encoder;}
 public record CrearUsuario(@NotBlank @Size(min=3,max=60) String nombre,@NotBlank @Email String email,
  @NotBlank @Pattern(regexp="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,24}$") String password){}
 public record EditarUsuario(@NotBlank @Size(min=3,max=60) String nombre,@Size(max=250) String bio){}
 public record Credenciales(@Email @NotBlank String email,@NotBlank String password){}
 public record Recuperar(@Email @NotBlank String email){}
 @GetMapping public List<Usuario> todos(){return repo.findAll();}
 @GetMapping("/{id}") public Usuario uno(@PathVariable Long id){return encontrar(id);}
 @PostMapping public ResponseEntity<Usuario> crear(@Valid @RequestBody CrearUsuario dto){
  if(repo.findByEmailIgnoreCase(dto.email().trim()).isPresent())throw new ResponseStatusException(HttpStatus.CONFLICT,"Correo ya registrado");
  Usuario u=new Usuario(dto.nombre().trim(),dto.email().trim().toLowerCase(),encoder.encode(dto.password()),"USUARIO","");
  return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(u));
 }
 @PutMapping("/{id}") public Usuario actualizar(@PathVariable Long id,@Valid @RequestBody EditarUsuario dto){
  Usuario u=encontrar(id);u.nombre=dto.nombre().trim();u.bio=dto.bio()==null?"":dto.bio().trim();return repo.save(u);
 }
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void borrar(@PathVariable Long id){encontrar(id);repo.deleteById(id);}
 @PostMapping("/login") public Map<String,Object> login(@Valid @RequestBody Credenciales dto){
  Usuario u=repo.findByEmailIgnoreCase(dto.email()).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Credenciales incorrectas"));
  if(!encoder.matches(dto.password(),u.passwordHash))throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Credenciales incorrectas");
  return Map.of("id",u.id,"nombre",u.nombre,"email",u.email,"rol",u.rol,"mensaje","Ingreso válido (demo, sin token JWT)");
 }
 @PostMapping("/recuperar") public Map<String,String> recuperar(@Valid @RequestBody Recuperar dto){return Map.of("mensaje","Solicitud simulada; no se envía correo ni se modifica contraseña");}
 private Usuario encontrar(Long id){return repo.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Usuario no encontrado"));}
}
