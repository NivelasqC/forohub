package ${package};
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController public class HealthController {
 @GetMapping("/api/demo") public Map<String,String> demo(){return Map.of("estado","ok","plantilla","forohub");}
}
