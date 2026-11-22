package cl.forohub.foro;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import cl.forohub.foro.data.*;
@SpringBootApplication
public class ForoApplication {
 public static void main(String[] args){SpringApplication.run(ForoApplication.class,args);}
 @Bean CommandLineRunner datosInicio(TemaRepository temas,ComentarioRepository comentarios){return args->{
  if(temas.count()==0){
   Tema a=temas.save(new Tema("¿Qué lenguaje recomiendan para empezar?","Conversemos sobre Python, Java y TypeScript.","tecnologia",3L,"Diego Rojas"));
   Tema b=temas.save(new Tema("Mejores videojuegos de mundo abierto","Comparte tus videojuegos favoritos y explica por qué.","videojuegos",2L,"Camila Torres"));
   temas.save(new Tema("Conciertos que esperas","¿Qué bandas quieres ver en vivo?","musica",2L,"Camila Torres"));
   temas.save(new Tema("El partido más emocionante","Cuéntanos tu evento deportivo favorito.","deportes",3L,"Diego Rojas"));
   temas.save(new Tema("Películas para el fin de semana","Comparte tus películas y series favoritas.","cine",2L,"Camila Torres"));
   comentarios.save(new Comentario(a.id,2L,"Camila Torres","Me gusta Python para empezar."));
   comentarios.save(new Comentario(b.id,3L,"Diego Rojas","La exploración es fundamental."));
  }
 };}
}
