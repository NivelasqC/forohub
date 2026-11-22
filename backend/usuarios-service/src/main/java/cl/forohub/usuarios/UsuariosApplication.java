package cl.forohub.usuarios;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import cl.forohub.usuarios.data.Usuario;
import cl.forohub.usuarios.data.UsuarioRepository;
@SpringBootApplication
public class UsuariosApplication {
 public static void main(String[] args){SpringApplication.run(UsuariosApplication.class,args);}
 @Bean BCryptPasswordEncoder encoder(){return new BCryptPasswordEncoder();}
 @Bean CommandLineRunner usuariosIniciales(UsuarioRepository repo, BCryptPasswordEncoder encoder){return args->{
  if(repo.count()==0){
   repo.save(new Usuario("Administrador","admin@forohub.cl",encoder.encode("Admin123!"),"ADMIN","Moderador principal"));
   repo.save(new Usuario("Camila Torres","camila@forohub.cl",encoder.encode("Usuario123!"),"USUARIO","Juegos y música"));
   repo.save(new Usuario("Diego Rojas","diego@forohub.cl",encoder.encode("Usuario123!"),"USUARIO","Tecnología"));
  }
 };}
}
