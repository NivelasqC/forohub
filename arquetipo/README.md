# Arquetipo Maven de microservicio (fuente incluida)

Este arquetipo proporciona la estructura de partida reutilizable que siguen los servicios del proyecto: Spring Boot 3.5, Java 21, controladores REST, JPA, validación y H2. Se entrega su código fuente, no un binario generado.

En una terminal con Maven configurado:

```powershell
cd arquetipo/forohub-spring-archetype
mvn clean install
cd ../..
mvn archetype:generate "-DarchetypeGroupId=cl.forohub" "-DarchetypeArtifactId=forohub-spring-archetype" "-DarchetypeVersion=1.0.0" "-DgroupId=cl.forohub.prueba" "-DartifactId=servicio-prueba" "-Dpackage=cl.forohub.prueba" "-Dversion=1.0.0" "-DinteractiveMode=false"
```

Luego: `cd servicio-prueba` y `mvn spring-boot:run` (API ejemplo: http://localhost:8090/api/demo).

**Nota**: los servicios entregados usan la misma estructura base, pero no se presenta una historia de generación con el arquetipo que no se haya ejecutado.
