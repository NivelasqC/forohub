# ForoHub — DSY2205 · Experiencia 2 / Semana 5

Proyecto académico individual: Sistema de Foros en Línea. **Incluye código fuente real**, no imágenes de muestra ni maquetas. Creado desde cero para la **rúbrica actual**.

## Inicio rápido (recomendado: Docker Desktop)

Requisitos: Windows 10/11 con **Docker Desktop** iniciado (modo contenedores Linux), conexión a internet para descargar imágenes y dependencias.

1. Descomprimir el ZIP, abrir PowerShell en esta carpeta `Exp2_S5_ForoHub`.
2. Ejecutar `docker compose up --build -d`.
3. Esperar que los servicios terminen de iniciar; comprobar `docker compose ps` y `docker compose logs --tail=50`.
4. Entrar a **http://localhost:8080** (Angular). APIs: **http://localhost:8081/api/usuarios**, **http://localhost:8082/api/temas**, **http://localhost:8083/api/moderacion/historial** (la última requiere cabecera `X-Rol: ADMIN`).
5. Importar en Postman `postman/ForoHub.postman_collection.json` y ejecutar las solicitudes incluidas.
6. Para detener: `docker compose down` (**no usar `-v`** si quieres conservar datos).

> **Nota:** No se ha ejecutado automáticamente Docker ni se han desplegado los servicios a un proveedor cloud. `localhost` funciona solo en tu PC; no constituye una URL pública. Ejecutar y comprobar en tu equipo es indispensable antes de entregar.

### Credenciales de demostración del FrontEnd

- Administrador: `admin@forohub.cl` / `Admin123!` (acceso a moderación).
- Usuario: `camila@forohub.cl` / `Usuario123!`.
- Usuario: `diego@forohub.cl` / `Usuario123!`.

**Importante:** Angular usa datos de demostración guardados en `localStorage`. Su autenticación es simulada y **no es segura para producción**. El login REST del servicio de usuarios es independiente y usa BCrypt, pero no emite JWT. No hay conexión Angular → Spring Boot porque las instrucciones de esta actividad indican que no es necesaria.

## Funciones y rutas Angular

| Pantalla | Ruta | Funciones |
|---|---|---|
| Inicio/foro | `/` | 5 categorías, búsqueda, filtros, publicaciones y contadores |
| Login | `/login` | Inicio de sesión, mensajes de error, roles |
| Registro | `/registro` | Alta, correo único, validaciones de contraseña |
| Recuperación | `/recuperar` | Flujo simulado; **no envía correos** |
| Perfil | `/perfil` | Cambiar nombre y biografía |
| Nuevo tema | `/tema/nuevo` | Crear tema validado (necesita sesión) |
| Tema | `/tema/:id` | Leer, comentar, editar o eliminar (según permisos) |
| Editar tema | `/tema/editar/:id` | Editar tema propio o siendo administrador |
| Administración | `/admin` | Ocultar/restaurar temas y comentarios (solo administrador) |

Contraseña segura en registro: **mínimo 8, máximo 24, una minúscula, una mayúscula, un número y un carácter especial** (5 reglas). Formularios con validación Angular Reactive Forms. Diseño Bootstrap 5 + CSS, basado en **GRID de 12 columnas**, adaptable a teléfono/tablet/PC.

### Patrones implementados

- **FrontEnd:** patrón **Service/Facade + componentes de presentación**. `AuthService` centraliza identidad/rol y `ForoService` centraliza la lógica de temas/comentarios. Componentes manejan UI y formularios, rutas con guards funcionales. Señales (`signal`, `computed`) proporcionan estado reactivo.
- **BackEnd:** patrón **Controller → Repository (Spring Data JPA)**, separación en capas (`web`, `data`), DTOs con `record` y Bean Validation. Los servicios siguen una base homogénea; se incluye **arquetipo Maven editable** para reutilizar esa estructura en futuros servicios.
- **Branching:** se incluye repositorio Git local con ramas y commits organizados; hay que publicar en un remoto propio (GitHub/GitLab) para poder compartir el enlace con el profesor.

## API y microservicios

| Servicio | Puerto | Funciones |
|---|---|---|
| usuarios-service | 8081 | `GET/POST /api/usuarios`, `GET/PUT/DELETE /api/usuarios/{id}`, `POST /api/usuarios/login`, `POST /api/usuarios/recuperar` |
| foro-service | 8082 | `GET /api/categorias`, `GET/POST /api/temas`, `GET/PUT/DELETE /api/temas/{id}`, `GET/POST /api/comentarios`, `GET/PUT/DELETE /api/comentarios/{id}`, PATCH visibilidad |
| moderacion-service | 8083 | `GET /api/moderacion/historial`, `POST /api/moderacion/temas/{id}/ocultar` y `/restaurar`, equivalentes para comentarios |

Cada servicio usa **Spring Boot 3.5.8 / Java 21 / Spring Data JPA**. Con Docker crea una **base H2 persistente independiente por servicio** (volúmenes Docker). En ejecución directa con Maven usa H2 en memoria para simplificar el inicio. Incluye datos iniciales, controles de validación y endpoints de salud `/actuator/health`.

**Moderación vía Postman:** agrega cabecera `X-Rol: ADMIN`, luego envía `POST http://localhost:8083/api/moderacion/temas/1/ocultar`; confirma con `GET http://localhost:8082/api/temas` (ya no aparece); restaura con la ruta `/restaurar`. La moderación llama por HTTP al servicio de foro. **La cabecera de rol es una simulación, no un sistema de autorización verificable**, solo apta para demostración local.

## Opción: ejecutar sin Docker

Requisitos: Java **21**, Maven **3.6.3+** y Node.js **22.12+**. Debes tener conexión a internet la primera vez para descargar paquetes.

Abrir **cuatro ventanas de PowerShell**, desde la carpeta raíz:

```powershell
cd backend/usuarios-service
mvn spring-boot:run
```

```powershell
cd backend/foro-service
mvn spring-boot:run
```

```powershell
cd backend/moderacion-service
mvn spring-boot:run
```

```powershell
cd frontend
npm install
npm start
```

Frontend local: **http://localhost:4200**. El servicio de moderación requiere que `foro-service` esté iniciado primero para ejecutar acciones (aunque puede arrancar sin él).

> Si PowerShell dice `mvn: no se reconoce`, instala Maven o utiliza Docker. Puedes ejecutar Maven desde su ruta completa con `& "D:\Desktop\apache-maven-3.10.0\bin\mvn.cmd" spring-boot:run` si ese archivo existe en tu equipo.

## Oracle Cloud (OPCIONAL; no configurado ni evaluado aquí)

**La pauta da 12 puntos por conectar 2 microservicios a Oracle Cloud.** La ejecución base usa H2, por lo que **no cumple esos 12 puntos de integración**. En cada backend existe `application-oracle.properties` que permite optar por Oracle Cloud cuando se dispone de una base y credenciales. `database/forohub_oracle.sql` contiene DDL de referencia para Oracle. Este SQL **no demuestra una conexión real**.

Con una instancia y parámetros válidos:

```powershell
$env:SPRING_PROFILES_ACTIVE='oracle'
$env:ORACLE_JDBC_URL='jdbc:oracle:thin:@<alias>?TNS_ADMIN=<carpeta-wallet>'
$env:ORACLE_USERNAME='<usuario>'
$env:ORACLE_PASSWORD='<clave>'
mvn spring-boot:run
```

Ejecutar en cada servicio deseado; el wallet de ADB, certificados, red y versiones de base requieren configuración propia. **No se incluyen claves ni wallet**. El perfil no ha sido probado con una instancia Oracle real.

## Docker Hub / Container Registry (OPCIONAL)

Ejecutar Docker local **no equivale a alojar una aplicación en Cloud ni aporta una URL pública**. Hay dos alternativas de registro:

1. Automatización **GitHub Container Registry** mediante `.github/workflows/publicar-imagenes.yml` al publicar `main` (requiere permisos para paquetes en GitHub Actions y visibilidad adecuada del paquete).
2. Docker Hub manual, por ejemplo:

```powershell
docker login
docker compose build
docker tag forohub-web:latest TU_USUARIO/forohub-web:1.0
docker push TU_USUARIO/forohub-web:1.0
```

Para desplegar con URL pública, necesitas adicionalmente un servidor/servicio de contenedores con acceso público. El registro de imágenes **no publica un sitio web por sí mismo**.

## Git / enlace de entrega

Este directorio puede contener historial local de Git. Si ves la carpeta oculta `.git`, abre PowerShell en la raíz y publica:

```powershell
git status
git branch -a
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
git push origin develop
```

Crea antes un **repositorio vacío** en GitHub. Reemplaza el enlace con el tuyo. Si Git indica que `origin` ya existe, usa `git remote set-url origin URL`. El ZIP **no crea ni publica el repositorio remoto**, ese paso es tuyo. No subas contraseñas reales ni archivos `.env`.

## Qué subir en el AVA

- Un **ZIP** con `frontend`, `backend` (3 servicios), `arquetipo`, `database`, `postman`, `docker-compose.yml`, documentación y Git.
- **Enlace del repositorio Git** real.
- **Enlace de video de Kaltura** de **7 a 10 minutos**. Usa `GUIA_VIDEO_Y_RUBRICA.md`.

El nombre requerido para el archivo final: `Exp2_S5_Nombre_Apellido.zip` (renómbralo con tus datos antes de entregar). **No incluir `node_modules` ni `target` en el ZIP.**

## Alcance y límites (para evitar sorpresas en la evaluación)

✅ Código de frontend, roles simulados, formularios, cinco categorías, CRUD local, moderación local, tres servicios REST, semillas H2, Postman, Dockerfiles/Compose, arquetipo, SQL y documentación.

⚠️ Se debe **probar la compilación y ejecución en el equipo del alumno**; no se incluyen evidencias ni capturas inventadas. **No hay conexión a Oracle Cloud**, publicación cloud con URL pública, ni un video o repositorio remoto creados. Estas omisiones pueden restar puntos, y el profesor puede exigirlas aun con código funcional.
