# Guía rápida de entrega y video — ForoHub

## Antes de grabar (no saltar)

1. Ejecutar `docker compose up --build -d`. Confirmar cuatro contenedores con `docker compose ps`.
2. Abrir `http://localhost:8080`, navegar por las cinco categorías, buscar un tema.
3. Ingresar como **Camila**: `camila@forohub.cl` / `Usuario123!`. Crear tema y comentar; editar perfil.
4. Salir e ingresar como **Administrador**: `admin@forohub.cl` / `Admin123!`. Abrir panel de moderación, ocultar/restaurar un comentario.
5. Importar Postman y probar al menos crear usuario, login, listar/crear temas, comentar, ocultar y restaurar un tema mediante el servicio de moderación. **Comprobar que el backend funciona**.
6. Mostrar vista en **3 tamaños** mediante herramientas de desarrollador (ejemplo 375px móvil, 768px tablet, 1440px PC).
7. Abrir el código `frontend/src/app/services`, `frontend/src/app/pages`, `backend/.../web` y `arquetipo/`, mencionar patrones.
8. Mostrar `git log --oneline --all --graph` y enlace a repositorio remoto (si lo publicaste).
9. Si **no** conectaste Oracle Cloud ni tienes una URL pública, no afirmes lo contrario. Mostrar Docker local como evidencia parcial, sin confundirlo con nube pública.

## Guion de grabación Kaltura (7–10 minutos)

| Minuto aproximado | Acción |
|---|---|
| 0:00–0:45 | Presentar ForoHub, objetivo y cinco categorías |
| 0:45–2:15 | Mostrar responsive, búsqueda, filtros y las páginas |
| 2:15–3:45 | Registro/login, cuatro reglas de clave, perfil, publicar y comentar |
| 3:45–4:45 | Entrar como administrador, ocultar y restaurar contenido |
| 4:45–6:45 | Postman: los tres servicios, JSON, CRUD y comunicación entre moderación y foro |
| 6:45–7:45 | Estructura Spring, arquetipo, patrón FrontEnd, Git y Docker |
| 7:45–8:30 | Cierre, limitaciones reales y próximas mejoras |

**Importante:** la pauta pide demostrar despliegue **en Cloud**, URL pública y **Oracle Cloud**. Si no implementas esas piezas, el video no puede demostrar esos criterios y se perderá puntaje en las secciones correspondientes. Nunca presentar `localhost` como si fuera Cloud público.

## Checklist de la rúbrica (100 puntos posibles)

| Criterio | Puntos | Incluido en el ZIP | Pendiente fuera del ZIP |
|---|---:|---|---|
| Git, patrón Angular y arquetipo | 5 | Componentes, servicios, arquetipo, Git local | Subir repositorio remoto y verificar branches |
| Responsive 3 pantallas | 5 | CSS y GRID Bootstrap | Verificar en móvil/tablet/PC |
| Pantallas y formularios Angular | 10 | Inicio, registro, recuperación simulada, perfil, foro y CRUD | Probar manualmente |
| Diseño CSS | 5 | CSS completo y branding ForoHub | Verificar en navegador |
| Lógica frontend y dos roles | 20 | Roles, arreglos/colecciones y gestión local | Probar flujos de usuario y admin |
| 3 Spring Boot | 20 | Usuarios, foro y moderación, JSON/CRUD/Postman | Compilar, ejecutar, validar Postman |
| 2 MS conectados a Oracle Cloud | 12 | Perfil opcional + script DDL | **NO IMPLEMENTADO**; usar H2 no da estos puntos |
| Full Stack en Docker Cloud | 16 | Dockerfiles + Compose local + pipeline GHCR | **Despliegue Cloud/URL pública NO IMPLEMENTADOS** |
| Video Kaltura | 7 | Guion | **Grabar, subir y compartir enlace** |

**Aclaración:** El checklist no es una nota garantizada. El profesor asigna los puntos conforme al funcionamiento y la pauta.
